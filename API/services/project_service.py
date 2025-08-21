from config.db import db
from bson import ObjectId
from datetime import datetime
from models.project_model import project_dict
from models.enum import Status, Priority
from bson.errors import InvalidId
from models.task_model import task_dict
from services.task_service import *

project_collection = db["projects"]

def create(data):
    required_fields = ["name", "user_id", "category", "stakeholders", "team_members", "progress", "priority", "description"]
    for field in required_fields:
        if field not in data:
            raise ValueError(f"{field} must be filled")

    project = {
        "name": data["name"],
        "user_id": ObjectId(data["user_id"]),
        "category": data["category"],
        "stakeholders": data["stakeholders"],
        "team_members": data["team_members"],
        "tasks": [],
        "progress": data["progress"],
        "priority": Priority[data["priority"].upper()].value,
        "Note": data.get("Note"),
        "description": data["description"],
        "status": Status.NOT_STARTED.value,
        "income": data.get("income")
    }
    
    # Handle optional datetime fields
    if "start_time" in data and data["start_time"]:
        if isinstance(data["start_time"], str):
            project["start_time"] = datetime.fromisoformat(data["start_time"].replace('Z', '+00:00'))
        else:
            project["start_time"] = data["start_time"]
    
    if "deadline" in data and data["deadline"]:
        if isinstance(data["deadline"], str):
            project["deadline"] = datetime.fromisoformat(data["deadline"].replace('Z', '+00:00'))
        else:
            project["deadline"] = data["deadline"]
    
    result = project_collection.insert_one(project)
    return str(result.inserted_id)


def get_projects():
    return list(project_collection.find())

def get_project(project_id):
    try:
        return project_collection.find_one({"_id": ObjectId(project_id)})
    except InvalidId:
        return None

def update_project(project_id, data):
    try:
        project = project_collection.find_one({"_id": ObjectId(project_id)})
        if not project:
            return None
        update_data = {}
        if "name" in data:          
            update_data["name"] = data["name"]
        if "category" in data:
            update_data["category"] = data["category"]
        if "stakeholders" in data:
            update_data["stakeholders"] = data["stakeholders"]  
        if "team_members" in data:
            update_data["team_members"] = data["team_members"]
        if "start_time" in data:
            update_data["start_time"] = datetime.fromisoformat(data["start_time"])
        if "deadline" in data:
            update_data["deadline"] = datetime.fromisoformat(data["deadline"])
        if "progress" in data:
            update_data["progress"] = data["progress"]
        if "priority" in data:
            update_data["priority"] = Priority[data["priority"].upper()].value
        if "Note" in data:
            update_data["Note"] = data["Note"]      
        if "description" in data:
            update_data["description"] = data["description"]
        if "status" in data:
            update_data["status"] = Status[data["status"].upper()].value
        if "income" in data:
            update_data["income"] = data["income"]
        if not update_data:
            return None
        result = project_collection.update_one({"_id": ObjectId(project_id)}, {"$set": update_data})
        return result
    except InvalidId:
        return None
def delete_project(project_id):     
    try:
        return project_collection.delete_one({"_id": ObjectId(project_id)})
    except InvalidId:
        return None 
def get_projects_by_user(user_id):
    try:
        return list(project_collection.find({"user_id": ObjectId(user_id)}))
    except InvalidId:
        return []
def get_projects_by_status(status):
    try:
        return list(project_collection.find({"status": Status[status.upper()].value}))
    except KeyError:
        return []   
def get_projects_by_date(start, end):
    try:
        return list(project_collection.find({
            "start_time": {"$gte": datetime.fromisoformat(start)},
            "deadline": {"$lte": datetime.fromisoformat(end)}
        }))
    except ValueError:
        return []
def mark_project_completed(project_id):
    try:
        return project_collection.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": {"status": Status.COMPLETED.value}}
        )
    except InvalidId:
        return None
    

def add_task_to_project(project_id, task_id):
    try:
        return project_collection.update_one(
            {"_id": ObjectId(project_id)},
            {"$addToSet": {"tasks": ObjectId(task_id)}}
        )
    except InvalidId:
        return None
    
def remove_task_from_project(project_id, task_id):
    try:
        return project_collection.update_one(
            {"_id": ObjectId(project_id)},
            {"$pull": {"tasks": ObjectId(task_id)}}
        )
    except InvalidId:
        return None

def get_tasks_by_project(project_id):
    try:
        project = project_collection.find_one({"_id": ObjectId(project_id)})
        if not project:
            return []
        return project.get("tasks", [])
    except InvalidId:
        return []

def get_projects_by_priority(priority):
    try:
        return list(project_collection.find({"priority": Priority[priority.upper()].value}))
    except KeyError:
        return []

def get_projects_by_income(income):
    try:
        return list(project_collection.find({"income": {"$gte": income}}))
    except ValueError:
        return []

#sonrasında bu kısım kullanıcıya görsel bir şekilde gösterilecek
def get_project_progress(project_id):
    try:
        project = project_collection.find_one({"_id": ObjectId(project_id)})
        if not project:
            return None
        return project.get("progress", 0)
    except InvalidId:
        return None



def add_team_member_to_project(project_id, team_members):
    team_members=[ObjectId(m) for m in team_members]
    try:
        project_collection.update_one(
            {"_id": ObjectId(project_id)},
            {"$push": {"team_members": {"$each": team_members}}}
        )
        return get_project(project_id)
    except InvalidId:
        return None 

def remove_team_member_from_project(project_id, user_id):
    try:
        # user_id'nin bir liste olabileceği varsayımıyla $pullAll kullanmak daha güvenli
        user_ids_to_remove = [ObjectId(uid) for uid in user_id]
        return project_collection.update_one(
            {"_id": ObjectId(project_id)},
            {"$pullAll": {"team_members": user_ids_to_remove}}
        )
    except InvalidId:
        return None


def add_stakeholder_to_project(project_id, stakeholders):
    stakeholders = [ObjectId(s) for s in stakeholders]
    try:
        project_collection.update_one(
            {"_id": ObjectId(project_id)},
            {"$push": {"stakeholders": {"$each": stakeholders}}}
        )
        return get_project(project_id)
    except InvalidId:
        return None


def remove_stakeholder_from_project(project_id, stakeholders):
    stakeholders = [ObjectId(s) for s in stakeholders]
    try:
        return project_collection.update_one(
            {"_id": ObjectId(project_id)},
            {"$pull": {"stakeholders": {"$in": stakeholders}}}
        )
    except InvalidId:
        return None


def get_tasks_by_user_in_project(project_id, user_id):
    try:
        project = list(project_collection.find({"_id": ObjectId(project_id)}))
        if not project:
            return []
        tasks = project[0].get("tasks", [])
        return [task for task in tasks if task.get("assigned_to") == ObjectId(user_id)]
    except InvalidId:
        return []   

def get_project_by_name(name):
    try:
        return list(project_collection.find({"name": {"$regex": name, "$options": "i"}}))
    except Exception as e:
        print(f"Error retrieving project by name: {e}")
        return None
    
def get_projects_by_category(category):
    try:
        return list(project_collection.find({"category": category}))
    except Exception as e:
        print(f"Error retrieving projects by category: {e}")
        return []