#Zamanlayıcı ve tetikleyici için
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
from config.db import db
from services.email_service import send_email
from services.notification_service import create_notification

reminder_collection=db["reminder"]
user_collection=db["users"]

def check_and_send_reminders():
    now= datetime.now()
    #son 1 dakika içinde zamanı gelen ve henüz tetiklenmemiş reminder'ları bul
    reminders=list(reminder_collection.find({
        "remind_at":{"$lte":now, "$gte": now-timedelta(minutes=1)},
        "notified": {"$ne":True}
    }))
    for reminder in reminders:
        user=user_collection.find_one({"_id":reminder["user_id"]})
        if not user:
            continue
        #E-posta gönder
        if user.get("email"):
            send_email(
                to=user["email"],
                subject="Hatırlatıcı: " + reminder["message"],
                body=f"Merhaba, {reminder['message']} zamanı geldi!"
            )
        #Sistem içi bildirim oluştur
        create_notification({
            "user_id":str(reminder["user_id"]),
            "message": reminder["message"],
            "type": "reminder",
            "related_type":reminder.get("related_type"),
            "related_id": reminder.get("related_id"),
        })
        #Reminder'ı notified olarak işaretle
        reminder_collection.update_one(
            {"_id":reminder["_id"]},
            {"$set":{"notified":True}}
        )

def start_reminder_scheduler():
    scheduler=BackgroundScheduler()
    scheduler.add_job(check_and_send_reminders, "interval", minutes=1)
    scheduler.start()
