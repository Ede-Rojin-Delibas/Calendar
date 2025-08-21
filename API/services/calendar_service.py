#ay, yıl parameresiyle etkinlik ve planları filtreleyen servis
from config.db import db
from models.event_model import event_dict
from models.plan_model import plan_dict
from models.task_model import task_dict
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime

event_collection = db["events"]
plan_collection = db["plans"]
task_collection = db["tasks"]
def get_calendar_items(user_id, year,month):
    try:
        # Gelen user_id'yi ObjectId'ye çevir
        obj_user_id = ObjectId(user_id)

        # Ayın ilk ve son günü
        start_of_month = datetime(year, month, 1)
        if month == 12:
            end_of_month = datetime(year + 1, 1, 1)
        else:
            end_of_month = datetime(year, month + 1, 1)

        # Etkinlikleri filtrele
        events_query = {"participants": obj_user_id, "start_time": {"$gte": start_of_month, "$lt": end_of_month}}
        events = list(event_collection.find(events_query))

        # Planları filtrele (Doğru alan adı 'start_date' kullanıldı)
        plans_query = {"user_id": obj_user_id, "start_date": {"$gte": start_of_month, "$lt": end_of_month}}
        plans = list(plan_collection.find(plans_query))

        # Görevleri filtrele (start_time alanı varsa)
        tasks_query = {"user_id": obj_user_id, "start_time": {"$gte": start_of_month, "$lt": end_of_month}}
        tasks = list(task_collection.find(tasks_query))
        
        # Eğer start_time yoksa, created_at alanını kullan
        if not tasks:
            tasks_query = {"user_id": obj_user_id, "created_at": {"$gte": start_of_month, "$lt": end_of_month}}
            tasks = list(task_collection.find(tasks_query))

        return {
            "events": [event_dict(event) for event in events],
            "plans": [plan_dict(plan) for plan in plans],
            "tasks": [task_dict(task) for task in tasks]
        }
    except InvalidId:
        return {"events": [], "plans": [], "tasks": []} # Geçersiz ID formatında boş veri dön
    except Exception:
        raise # Diğer hataları yukarıya fırlat