import uuid
from datetime import datetime, timezone
import logging
from typing import Any, Dict, List, Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings

logger = logging.getLogger(__name__)


class DatabaseManager:
    """
    Asynchronous MongoDB manager for PromptShield using Motor.
    Handles scan audit logging, analytics aggregation, and user management,
    with an in-memory buffer fallback when MongoDB is not connected.
    """

    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db: Optional[AsyncIOMotorDatabase] = None
        self.is_connected: bool = False
        self.memory_scans: List[Dict[str, Any]] = []

    async def ensure_connected(self) -> bool:
        if self.is_connected and self.db is not None:
            return True
        if settings.MONGODB_URI:
            await self.connect()
            return self.is_connected
        return False

    async def connect(self) -> None:
        if not settings.MONGODB_URI:
            logger.info("MONGODB_URI is not set. Running in memory-only mode without database persistence.")
            self.is_connected = False
            return

        try:
            logger.info(f"Connecting to MongoDB at {settings.MONGODB_URI}...")
            self.client = AsyncIOMotorClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=3000
            )
            # Test connection with ping
            await self.client.admin.command("ping")
            self.db = self.client[settings.MONGODB_DB_NAME]
            self.is_connected = True
            logger.info(f"Successfully connected to MongoDB database '{settings.MONGODB_DB_NAME}'.")

            # Create indexes for scan_logs
            await self.db.scan_logs.create_index("created_at")
            await self.db.scan_logs.create_index("action")
            await self.db.scan_logs.create_index("prediction")
            await self.db.users.create_index("username", unique=True)
            await self.db.users.create_index("email", unique=True)

        except Exception as e:
            logger.warning(f"Could not connect to MongoDB: {e}. Running without persistent DB logging.")
            self.is_connected = False
            self.client = None
            self.db = None

    async def close(self) -> None:
        if self.client:
            logger.info("Closing MongoDB connection...")
            self.client.close()
            self.is_connected = False
            logger.info("MongoDB connection closed.")

    async def clear_scans(self) -> int:
        """
        Clear all scan logs from memory and database.
        """
        await self.ensure_connected()
        count = 0
        if not self.is_connected or self.db is None:
            count = len(self.memory_scans)
            self.memory_scans.clear()
            return count

        try:
            res = await self.db.scan_logs.delete_many({})
            self.memory_scans.clear()
            return res.deleted_count
        except Exception as e:
            logger.error(f"Failed to clear scan logs: {e}")
            self.memory_scans.clear()
            return 0

    async def log_scan(self, scan_record: Dict[str, Any], user_id: Optional[str] = None) -> Optional[str]:
        await self.ensure_connected()
        now = datetime.now(timezone.utc)
        if not self.is_connected or self.db is None:
            scan_id = f"scan_{uuid.uuid4().hex[:12]}"
            doc = {
                **scan_record,
                "id": scan_id,
                "user_id": user_id,
                "created_at": now.isoformat()
            }
            # Prepend newest scan at top of memory logs
            self.memory_scans.insert(0, doc)
            if len(self.memory_scans) > 500:
                self.memory_scans.pop()
            return scan_id

        try:
            doc = {
                **scan_record,
                "user_id": user_id,
                "created_at": now
            }
            result = await self.db.scan_logs.insert_one(doc)
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Failed to log scan to MongoDB: {e}")
            return None

    async def get_recent_scans(
        self,
        limit: int = 50,
        skip: int = 0,
        action: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Retrieve recent scan logs with optional action filtering.
        """
        await self.ensure_connected()
        if not self.is_connected or self.db is None:
            filtered = self.memory_scans
            if action:
                act = action.upper()
                filtered = [s for s in filtered if s.get("action") == act]
            return filtered[skip:skip + limit]

        try:
            query = {}
            if action:
                query["action"] = action.upper()

            cursor = (
                self.db.scan_logs.find(query)
                .sort("created_at", -1)
                .skip(skip)
                .limit(min(limit, 200))
            )
            logs = []
            async for doc in cursor:
                doc["id"] = str(doc.pop("_id"))
                if isinstance(doc.get("created_at"), datetime):
                    doc["created_at"] = doc["created_at"].isoformat()
                logs.append(doc)
            return logs
        except Exception as e:
            logger.error(f"Failed to retrieve scan logs: {e}")
            return []

    async def get_analytics_summary(self) -> Dict[str, Any]:
        """
        Aggregate scan metrics: total scans, action breakdown, attack category counts.
        """
        await self.ensure_connected()
        if not self.is_connected or self.db is None:
            total = len(self.memory_scans)
            allowed = sum(1 for s in self.memory_scans if s.get("action") == "ALLOW")
            warned = sum(1 for s in self.memory_scans if s.get("action") == "WARN")
            blocked = sum(1 for s in self.memory_scans if s.get("action") == "BLOCK")
            category_counts: Dict[str, int] = {}
            for s in self.memory_scans:
                for cat in s.get("attack_categories", []):
                    category_counts[cat] = category_counts.get(cat, 0) + 1

            return {
                "total_scans": total,
                "allowed": allowed,
                "warned": warned,
                "blocked": blocked,
                "top_attack_categories": category_counts,
                "database_connected": False
            }

        try:
            total = await self.db.scan_logs.count_documents({})
            allowed = await self.db.scan_logs.count_documents({"action": "ALLOW"})
            warned = await self.db.scan_logs.count_documents({"action": "WARN"})
            blocked = await self.db.scan_logs.count_documents({"action": "BLOCK"})

            # Aggregate attack categories
            pipeline = [
                {"$unwind": "$attack_categories"},
                {"$group": {"_id": "$attack_categories", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 10}
            ]
            category_counts = {}
            async for doc in self.db.scan_logs.aggregate(pipeline):
                category_counts[doc["_id"]] = doc["count"]

            return {
                "total_scans": total,
                "allowed": allowed,
                "warned": warned,
                "blocked": blocked,
                "top_attack_categories": category_counts,
                "database_connected": True
            }
        except Exception as e:
            logger.error(f"Failed to calculate analytics summary: {e}")
            return {
                "total_scans": 0,
                "database_connected": False,
                "error": str(e)
            }


db_manager = DatabaseManager()
