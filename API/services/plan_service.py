#Plan Veri Tabanı İşlemleri (CRUD)
from config.db import db
from bson import ObjectId
from datetime import datetime
from models.enum import Priority, Status
from flask import jsonify

def parse_datetime(date_string):
    """Parse datetime string with multiple format support"""
    try:
        # Try dateutil.parser if available
        from dateutil.parser import parse
        return parse(date_string)
    except ImportError:
        # Fallback to manual parsing
        # Remove timezone suffix if exists
        if date_string.endswith('Z'):
            date_string = date_string[:-1]
        elif '+' in date_string and date_string.count('+') == 1:
            date_string = date_string.split('+')[0]
        
        # Try different formats
        formats = [
            '%Y-%m-%dT%H:%M:%S.%f',
            '%Y-%m-%dT%H:%M:%S', 
            '%Y-%m-%d'
        ]
        
        for fmt in formats:
            try:
                return datetime.strptime(date_string, fmt)
            except ValueError:
                continue
        
        # If all fails, try fromisoformat
        return datetime.fromisoformat(date_string)

plan_collection=db["plans"]

def create_plan(data):
    #gerekli alanların kontrolü
    required_fields=["title","user_id","description","duration","start_date","end_date"]
    for field in required_fields:
        if field not in data:
            raise ValueError(f"{field} must filled")
    plan = {
        "title":data["title"],
        "user_id":ObjectId(data["user_id"]),
        "status":Status.NOT_STARTED.value, 
        "description":data["description"],
        "duration":int(data["duration"]),
        "start_date":parse_datetime(data["start_date"]),
        "end_date":parse_datetime(data["end_date"]),
        "created_at":datetime.now()
    }

    result=plan_collection.insert_one(plan)
    return str(result.inserted_id)

def get_all_plans():
    return list(plan_collection.find())

def get_plan_by_id(plan_id):
    return plan_collection.find_one({"_id":ObjectId(plan_id)})

def get_plans_by_user(user_id):
    return list(plan_collection.find({"user_id":ObjectId(user_id)}))

def delete_plan(plan_id):
    return plan_collection.delete_one({"_id":ObjectId(plan_id)})

def update_plan(plan_id,data):
    #Burada alan doğrulama eklenebilir
    return plan_collection.update_one({"_id":ObjectId(plan_id)},{"$set":data})

def get_plans_by_date(start,end):
    #Belirli bir tarih aralığındaki planları getirir.
    return list(plan_collection.find({
        "start_date": {"$gte": start},
        "end_date": {"$lte": end}
    }))

def mark_plan_completed(plan_id):
    #planı tamamlandı olarak işaretler
    return plan_collection.update_one(
        {"_id":ObjectId(plan_id)},
        {"$set": {"status":Status.COMPLETED.value}}
        )

def get_plans_by_status(status):
    #planlarının tamamlanıp tamamlanmama durumuna göre getirme
    return list(plan_collection.find({"status":status}))

    #kullanırken :
    #plans=get_plans_by_status(PlanStatus.IN_PROGRESS.value)

def mark_plan_status(plan_id,new_status):
    """Plan durumunu günceller"""
    try:
        if new_status not in [s.value for s in Status]:
            raise ValueError("Geçersiz Status")
        result=plan_collection.update_one(
            {"_id":ObjectId(plan_id)},
            {"$set":{"status":new_status}}
        )
        return result
    except Exception as e:
        raise e
#ENUM ile gelen veriyi doğrulama
def is_valid_status(status_value):
    #Status değerinin geçerli olup olmadığını kontrol eder
    return status_value in [s.value for s in Status]





