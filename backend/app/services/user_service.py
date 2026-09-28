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
    "email": "[EMAIL_ADDRESS]",
    "hashed_password": _ADMIN_HASH,
    "role": "admin",
    "created_at": datetime.now(timezone.utc).isoformat()
}


class UserService:
    """Handles user persistence in MongoDB with in-memory fallback."""

    async def get_user_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        await db_manager.ensure_connected()
        if db_manager.is_connected and db_manager.db is not None:
            doc = await db_manager.db.users.find_one({"username": username})
            if doc:
                doc["id"] = str(doc.pop("_id"))
                return doc
        return _MEMORY_USERS.get(username)

    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        await db_manager.ensure_connected()
        if db_manager.is_connected and db_manager.db is not None:
            doc = await db_manager.db.users.find_one({"email": email})
            if doc:
                doc["id"] = str(doc.pop("_id"))
                return doc
        for u in _MEMORY_USERS.values():
            if u["email"] == email:
                return u
        return None

    async def create_user(
        self,
        username: str,
        email: str,
        password: str,
        name: Optional[str] = None,
        role: str = "user"
    ) -> Dict[str, Any]:
        await db_manager.ensure_connected()
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



    async def update_user_profile(
        self,
        current_identifier: str,
        new_username: Optional[str] = None,
        name: Optional[str] = None,
        email: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Update user profile in MongoDB and in-memory cache.
        Checks for username and email uniqueness collisions.
        """
        await db_manager.ensure_connected()
        user = await self.get_user_by_username(current_identifier)
        if not user:
            user = await self.get_user_by_email(current_identifier)
        if not user:
            raise ValueError(f"User '{current_identifier}' not found.")

        old_username = user.get("username", current_identifier)
        user_id = user.get("id")

        updated_username = (new_username or "").strip() or old_username
        updated_email = (email or "").strip() or user.get("email", "")
        updated_name = (name or "").strip() or user.get("name", updated_username)

        # Check username collision
        if updated_username != old_username:
            conflict = await self.get_user_by_username(updated_username)
            if conflict and conflict.get("id") != user_id:
                raise ValueError(f"Username '{updated_username}' is already taken.")

        # Check email collision
        if updated_email != user.get("email"):
            conflict_email = await self.get_user_by_email(updated_email)
            if conflict_email and conflict_email.get("id") != user_id:
                raise ValueError(f"Email '{updated_email}' is already in use by another account.")

        now = datetime.now(timezone.utc)
        update_fields = {
            "username": updated_username,
            "name": updated_name,
            "email": updated_email,
            "updated_at": now
        }

        # 1. Update in MongoDB
        if db_manager.is_connected and db_manager.db is not None:
            await db_manager.db.users.update_one(
                {"username": old_username},
                {"$set": update_fields}
            )
            # If username changed, update scan logs user_id as well
            if updated_username != old_username:
                await db_manager.db.scan_logs.update_many(
                    {"user_id": old_username},
                    {"$set": {"user_id": updated_username}}
                )

        # 2. Update in-memory fallback
        if old_username in _MEMORY_USERS:
            mem_user = _MEMORY_USERS.pop(old_username)
            mem_user.update(update_fields)
            _MEMORY_USERS[updated_username] = mem_user

        user.update(update_fields)
        return user

    async def update_user_password(
        self,
        username_or_email: str,
        current_password: str,
        new_password: str
    ) -> bool:
        """
        Verify current password and update hashed password in MongoDB and memory.
        """
        await db_manager.ensure_connected()
        user = await self.get_user_by_username(username_or_email)
        if not user:
            user = await self.get_user_by_email(username_or_email)
        if not user:
            raise ValueError("User not found.")

        # Verify current password
        stored_hash = user.get("hashed_password")
        if not stored_hash or not verify_password(current_password, stored_hash):
            raise ValueError("Current password is incorrect.")

        new_hash = get_password_hash(new_password)
        now = datetime.now(timezone.utc)

        # 1. Update MongoDB
        if db_manager.is_connected and db_manager.db is not None:
            await db_manager.db.users.update_one(
                {"username": user["username"]},
                {"$set": {"hashed_password": new_hash, "updated_at": now}}
            )

        # 2. Update memory store
        username = user["username"]
        if username in _MEMORY_USERS:
            _MEMORY_USERS[username]["hashed_password"] = new_hash
            _MEMORY_USERS[username]["updated_at"] = now

        user["hashed_password"] = new_hash
        return True

    async def delete_user(self, username_or_email: str) -> bool:
        """
        Permanently delete a user account and all associated data
        (scans, audit logs, memory records) from MongoDB and memory.
        """
        await db_manager.ensure_connected()
        user = await self.get_user_by_username(username_or_email)
        if not user:
            user = await self.get_user_by_email(username_or_email)

        username = user.get("username", username_or_email) if user else username_or_email
        email = user.get("email") if user else None
        user_id = user.get("id") if user else None

        # 1. Delete from MongoDB users and scan_logs
        if db_manager.is_connected and db_manager.db is not None:
            user_filters = [{"username": username}]
            if email:
                user_filters.append({"email": email})
            if user_id:
                try:
                    from bson import ObjectId
                    user_filters.append({"_id": ObjectId(user_id)})
                except Exception:
                    pass
                user_filters.append({"id": user_id})

            await db_manager.db.users.delete_many({"$or": user_filters})

            # Delete all scan logs associated with this user
            scan_filters = [{"user_id": username}]
            if user_id:
                scan_filters.append({"user_id": str(user_id)})
            if email:
                scan_filters.append({"user_id": email})

            await db_manager.db.scan_logs.delete_many({"$or": scan_filters})
            logger.info(f"Permanently deleted user '{username}' and associated scan logs from MongoDB.")

        # 2. Delete from in-memory stores
        keys_to_remove = [k for k, v in _MEMORY_USERS.items() if k == username or v.get("email") == email or v.get("id") == user_id]
        for k in keys_to_remove:
            _MEMORY_USERS.pop(k, None)

        db_manager.memory_scans = [
            s for s in db_manager.memory_scans
            if s.get("user_id") not in (username, email, user_id)
        ]
        logger.info(f"Permanently cleared user '{username}' from memory stores.")
        return True


user_service = UserService()
