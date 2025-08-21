from config.db import db
from datetime import datetime
from models.notification_model import notification_dict
from bson import ObjectId

notification_collection=db["notifications"]

def create_notification(data):
    notification = {
        "user_id": str(data.get("user_id")),
        "message": data.get("message"),
        "type": data.get("type", "info"),
        "related_type": data.get("related_type"),
        "related_id": str(data.get("related_id")) if data.get("related_id") else None,
        "created_at": datetime.now(),
        "read": False
    }
    result = notification_collection.insert_one(notification)
    notification["_id"] = str(result.inserted_id)
    return notification

def get_notifications_by_user(user_id):
    notifications = list(notification_collection.find({"user_id": str(user_id)}))
    return [notification_dict(n) for n in notifications]

def mark_notification_as_read(notification_id):
    result = notification_collection.update_one(
        {"_id": ObjectId(notification_id)},
        {"$set": {"read": True}}
    )
    return result.modified_count == 1

def delete_notification(notification_id):
    result = notification_collection.delete_one({"_id": ObjectId(notification_id)})
    return result.deleted_count == 1

