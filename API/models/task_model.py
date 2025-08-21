#task veri tabanı modeli
from datetime import datetime
from bson import ObjectId
from models.enum import Status, Priority

def task_dict(task):
    return {
        "_id": str(task.get("_id")),
        "user_id": str(task.get("user_id")),
        "title": task.get("title"),
        "description": task.get("description"),
        "status": task.get("status"),
        "created_at": task.get("created_at").isoformat() if isinstance(task.get("created_at"), datetime) else task.get("created_at"),
        "priority": task.get("priority"),
        "category": task.get("category"),
        "start_time": task.get("start_time").isoformat() if isinstance(task.get("start_time"), datetime) else task.get("start_time"),
        "end_time": task.get("end_time").isoformat() if isinstance(task.get("end_time"), datetime) else task.get("end_time"),
        "project_id": str(task.get("project_id")) if task.get("project_id") else None,
    }