from flask import jsonify
from config.db import db
from bson import ObjectId
from datetime import datetime
from models.task_model import task_dict
from models.enum import Status,Priority
from bson.errors import InvalidId
from services.event_service import parse_datetime

task_collection=db["tasks"]

def create_task(data):
    required_fields=["title","user_id","description","priority"]
    for field in required_fields:
        if field not in data:
            raise ValueError(f"{field} must filled")

    # Priority mapping from Turkish to English
    priority_map = {
        "düşük": "LOW",
        "orta": "MEDIUM", 
        "yüksek": "HIGH",
        "low": "LOW",
        "medium": "MEDIUM",
        "high": "HIGH"
    }
    
    priority_key = data["priority"].lower()
    if priority_key not in priority_map:
        raise ValueError(f"Geçersiz öncelik değeri: {data['priority']}. Geçerli değerler: Düşük, Orta, Yüksek")
    
    task={
        "title":data["title"],
        "user_id":ObjectId(data["user_id"]),
        "status":Status.NOT_STARTED.value,
        "description":data["description"],
        "priority":Priority[priority_map[priority_key]].value,
        "created_at":datetime.now()
    }
    if "project_id" in data and data["project_id"]:
        task["project_id"] = ObjectId(data["project_id"])
    
    # Handle optional datetime fields
    if "start_time" in data and data["start_time"]:
        task["start_time"] = parse_datetime(data["start_time"])
    if "end_time" in data and data["end_time"]:
        task["end_time"] = parse_datetime(data["end_time"])
    
    result=task_collection.insert_one(task)
    return str(result.inserted_id)
#tüm görevlerini getir
def get_tasks():
    return list(task_collection.find())

#bağımsız görevleri getir
def get_independent_tasks():
    return list(task_collection.find({"$or": [{"project_id": {"$exists":False}}, {"project_id": None}]}))

#projeye ait görevleri getir
def get_tasks_by_project_id(project_id):
    return list(task_collection.find({"project_id": ObjectId(project_id)}))

def get_task_by_id(task_id):
    try:
        return task_collection.find_one({"_id":ObjectId(task_id)})
        
    except InvalidId:
        return None 
def update_task(task_id,data):
    return task_collection.update_one({"_id":ObjectId(task_id)},{"$set":data})

def delete_task(task_id):
    return task_collection.delete_one({"_id":ObjectId(task_id)})

def get_task_by_user(user_id):
    return list(task_collection.find({"user_id":ObjectId(user_id)}))

def get_task_by_status(status):
    return list(task_collection.find({"status":status})) 

def get_task_by_date(start,end):
    return list(task_collection.find({
        "start_time":{"$gte":start},
        "end_time":{"$lte":end}
    }))

def mark_task_completed(task_id):
    return task_collection.update_one(
        {"_id":ObjectId(task_id)},
        {"$set": {"status":Status.COMPLETED.value}}
    )
