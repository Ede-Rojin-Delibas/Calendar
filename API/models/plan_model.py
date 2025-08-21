#planlar için veri tabanı modeli
from bson import ObjectId
from datetime import datetime
from models.enum import Status, Priority

def plan_dict(plan):
    return {
        "_id":str(plan["_id"]),
        "start_date":plan["start_date"].isoformat() if isinstance(plan["start_date"],datetime) else plan["start_date"],
        "end_date":plan["end_date"].isoformat() if isinstance(plan["end_date"],datetime) else plan["end_date"],
        "user_id":str(plan["user_id"]),
        "title":plan["title"],
        "description":plan["description"],
        "created_at":plan.get("created_at").isoformat() if isinstance(plan.get("created_at"),datetime) else plan.get("created_at"),
        "status":plan["status"],
        "duration":int(plan["duration"])
    }