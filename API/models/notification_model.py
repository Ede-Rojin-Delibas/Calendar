from datetime import datetime

def notification_dict(notification):
    return {
        "_id": str(notification.get("_id")),
        "user_id": str(notification.get("user_id")),
        "message": notification.get("message"),
        "type": notification.get("type"), #info, warning, error,success
        "created_at": notification.get("created_at").isoformat() if isinstance(notification.get("created_at"), datetime) else notification.get("created_at"),
        "read": notification.get("read", False),
        "related_type": notification.get("related_type"), #task, plan, event
        "related_id": str(notification.get("related_id")) if notification.get("related_id") else None
    }