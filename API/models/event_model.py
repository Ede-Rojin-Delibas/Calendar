#etkinlikler için veri tabanı modeli
from bson import ObjectId
from datetime import datetime

def event_dict(event):
    return{
        "_id": str(event.get("_id")),
        "name": event.get("name"),
        "category": event.get("category"),
        "start_time": event.get("start_time").isoformat() if isinstance(event.get("start_time"), datetime) else event.get("start_time"),
        "end_time": event.get("end_time").isoformat() if isinstance(event.get("end_time"), datetime) else event.get("end_time"),
        "location": event.get("location"),
        "participants": [str(participant) for participant in event.get("participants", [])],
        "moderator_id": str(event.get("moderator_id")),
        "topic": event.get("topic")
    }




