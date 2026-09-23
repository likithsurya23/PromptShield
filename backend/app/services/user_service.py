from datetime import datetime, timezone
import logging
from typing import Any, Dict, Optional
from app.db.database import db_manager
from app.security.auth import get_password_hash, verify_password

logger = logging.getLogger(__name__)

# Fallback in-memory store for local testing/dev if MongoDB is not connected
_MEMORY_USERS: Dict[str, Dict[str, Any]] = {}

# Pre-seed default admin
_ADMIN_HASH = get_password_hash("promptshield123")
_MEMORY_USERS["admin"] = {
    "username": "admin",
    "email": "admin@promptshield.io",
    "hashed_password": _ADMIN_HASH,
    "role": "admin",
    "created_at": datetime.now(timezone.utc).isoformat()
}


class UserService:
    """Handles user persistence in MongoDB with in-memory fallback."""

    async def get_user_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        if db_manager.is_connected and db_manager.db is not None:
            doc = await db_manager.db.users.find_one({"username": username})
            if doc:
                doc["id"] = str(doc.pop("_id"))
                return doc
        return _MEMORY_USERS.get(username)

    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        if db_manager.is_connected and db_manager.db is not None:
            doc = await db_manager.db.users.find_one({"email": email})
            if doc:
                doc["id"] = str(doc.pop("_id"))
                return doc
        for u in _MEMORY_USERS.values():
            if u["email"] == email:
                return u
        return None

    async def create_user(self, username: str, email: str, password: str, role: str = "user") -> Dict[str, Any]:
        hashed_password = get_password_hash(password)
        now = datetime.now(timezone.utc)
        user_doc = {
            "username": username,
            "email": email,
            "hashed_password": hashed_password,
            "role": role,
            "created_at": now
        }

        if db_manager.is_connected and db_manager.db is not None:
            result = await db_manager.db.users.insert_one(user_doc)
            user_doc["id"] = str(result.inserted_id)
            return user_doc
        else:
            user_doc["id"] = username
            _MEMORY_USERS[username] = user_doc
            return user_doc

    async def authenticate_user(self, username: str, password: str) -> Optional[Dict[str, Any]]:
        user = await self.get_user_by_username(username)
        if not user:
            # Check by email as well
            user = await self.get_user_by_email(username)
        if not user:
            return None
        if not verify_password(password, user["hashed_password"]):
            return None
        return user


user_service = UserService()
