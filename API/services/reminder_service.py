from config.db import db
from bson import ObjectId
from datetime import datetime
from models.reminder_model import reminder_dict

reminder_collection=db["reminder"]

def create_reminder(data):
    reminder={
        "user_id": str(data.get("user_id")),
        "message": data.get("message"),
        "remind_at": data.get("remind_at") if isinstance(data.get("remind_at"), datetime) else datetime.fromisoformat(data.get("remind_at")),
        "related_type": data.get("related_type"),
        "related_id": str(data.get("related_id")) if data.get("related_id") else None,
        "created_at": datetime.now()
    }
    result=reminder_collection.insert_one(reminder)
    reminder["_id"] = str(result.inserted_id)
    return reminder

def get_all_reminders():
    reminders=list(reminder_collection.find())
    return [reminder_dict(reminder) for reminder in reminders]

def get_reminders_by_user(user_id):
    reminders=list(reminder_collection.find({"user_id": str(user_id)}))
    return [reminder_dict(reminder) for reminder in reminders]

def delete_reminder(reminder_id):
    result = reminder_collection.delete_one({"_id": ObjectId(reminder_id)})
    return result.deleted_count==1
        