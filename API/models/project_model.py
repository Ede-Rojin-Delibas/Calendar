#projeler için veri tabanı modeli
from datetime import datetime
from bson import ObjectId

def project_dict(project):
    return {
        "_id": str(project.get("_id")),
        "user_id": str(project.get("user_id")),
        "name": project.get("name"),
        "category": project.get("category"),
        "stakeholders": project.get("stakeholders"),
        "team_members": project.get("team_members"),
        "start_time": project.get("start_time").isoformat() if isinstance(project.get("start_time"), datetime) else project.get("start_time"),
        "deadline": project.get("deadline").isoformat() if isinstance(project.get("deadline"), datetime) else project.get("deadline"),
        "progress": project.get("progress"),
        "priority": project.get("priority"),
        "Note": project.get("Note"),
        "description": project.get("description"),
        "status": project.get("status"),
        "income": project.get("income")

    }