from config.db import db
from models.userStats import user_stats_dict
from bson import ObjectId
from datetime import datetime, timedelta

task_collection = db["tasks"]
user_stats_collection = db["userStats"]

def calculate_user_stats(user_id):
    # Tamamlanan görev sayısı
    completed_count = task_collection.count_documents({
        "user_id": ObjectId(user_id),
        "status": "completed"
    })
    # Aktiflik düzeyi örneği: son 7 günde tamamlanan görev sayısı:Son hafta tamamlanan görev sayısını
    # 10 ile çarpar, maksimum 100 olur. (Örnek bir skor algoritması.)
    last_week = datetime.now() - timedelta(days=7)
    recent_completed = task_collection.count_documents({
        "user_id": ObjectId(user_id),
        "status": "completed",
        "completed_at": {"$gte": last_week}
    })
    # Basit bir aktiflik skoru: son hafta tamamlanan görev sayısı * 10 (örnek)
    activity_level = min(recent_completed * 10, 100)
    # Son aktiflik zamanı (son tamamlanan görev)
    last_task = task_collection.find_one(
        {"user_id": ObjectId(user_id), "status": "completed"},
        sort=[("completed_at", -1)]
    )
    last_active = last_task["completed_at"] if last_task and "completed_at" in last_task else None

    # İstatistikleri oluşturur
    stats = {
        "user_id": ObjectId(user_id),
        "completed_task_count": completed_count,
        "activity_level": activity_level,
        "last_active": last_active
    }
    # Güncelle veya ekle:Eğer kullanıcıya ait istatistik varsa günceller, yoksa ekler
    user_stats_collection.update_one(
        {"user_id": ObjectId(user_id)},
        {"$set": stats},
        upsert=True
    )
    #id alanı ekler
    stats["_id"] = user_stats_collection.find_one({"user_id": ObjectId(user_id)})["_id"]
    return user_stats_dict(stats)
#bu fonksiyon, bir kullanıcının istatistiklerini getirir. Veri tabanında kullanıcıya ait istatistik kaydını
#arar. Eğer bulursa, dict ile JSON a uygun hale getiri, bulamazsa None döner
def get_user_stats(user_id):
    stats = user_stats_collection.find_one({"user_id": ObjectId(user_id)})
    if stats:
        return user_stats_dict(stats)
    else:
        return None