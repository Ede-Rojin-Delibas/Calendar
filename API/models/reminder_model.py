from datetime import datetime

class Reminder:
    def __init__(self, user_id, message, remind_at, related_type=None, related_id=None):
        self.user_id= user_id
        self.message = message
        self.remind_at = remind_at
        self.related_type = related_type #task, plan,event
        self.related_id = related_id
        self.created_at=datetime.now()
    

def reminder_dict(reminder):
    return {
        "_id": str(reminder.get("_id")),
        "user_id": str(reminder.get("user_id")),
        "message": reminder.get("message"),
        "remind_at": reminder.get("remind_at").isoformat() if isinstance(reminder.get("remind_at"), datetime) else reminder.get("remind_at"),
        "related_type": reminder.get("related_type"),
        "related_id": str(reminder.get("related_id")) if reminder.get("related_id") else None,
        "created_at": reminder.get("created_at").isoformat() if isinstance(reminder.get("created_at"), datetime) else reminder.get("created_at")
    }