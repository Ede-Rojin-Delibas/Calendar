#Veri tabanı işlemleri(CRUD)
import logging
from datetime import datetime
from bson import ObjectId
from config.db import db
from bson.errors import InvalidId

#logger yapılandırması
logger=logging.getLogger(__name__) #bu satır ile her servis kendi modülüne ait logları üretir
logger.setLevel(logging.INFO)
file_handler=logging.FileHandler("logs/user_service.log")
formatter=logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

user_collection=db["users"]


def get_all_users():
    try:
        users=list(user_collection.find())
        logger.info("Tüm kullanıcılar listelendi")
        return users
    except Exception as e:
        logger.error(f"Kullanıcılar listelenirken hata oluştu: {str(e)}")
        raise

def get_user_by_id(user_id):
    try:
        user=user_collection.find_one({"_id":ObjectId(user_id)})
        if user:
            logger.info(f"Kullanıcı bulundu: {user_id}")
        else:
            logger.warning(f"Kullanıcı bulunamadı: {user_id}")
        return user
    except InvalidId:
        logger.error(f"Geçersiz ObjectId: {user_id}")
        return None
    except Exception as e:
        logger.error(f"Kullanıcı bulunurken hata oluştu: {str(e)}")
        raise

def get_user_by_email(email):
    try:
        user = user_collection.find_one({"email": email})
        if user:
            logger.info(f"E-posta ile kullanıcı bulundu: {email}")
        else:
            logger.warning(f"E-posta ile kullanıcı bulunamadı: {email}")
        return user
    except Exception as e:
        logger.error(f"E-posta ile kullanıcı bulunurken hata oluştu: {str(e)}")
        raise

def delete_user(user_id):
    try:
        result=user_collection.delete_one({"_id":ObjectId(user_id)})
        if result.deleted_count:
            logger.info(f"Kullanıcı silindi: {user_id}")
        else:
            logger.warning(f"Silinecek kullanıcı bulunamadı: {user_id}")
        return result
    except Exception as e:
        logger.error(f"Kullanıcı silinirken hata oluştu: {str(e)}")
        raise

def update_user(user_id,data):
    try:
        data["updated_at"]=datetime.now()
        result=user_collection.update_one({"_id":ObjectId(user_id)},
        {"$set":data})
        if result.modified_count:
            logger.info(f"Kullanıcı güncellendi: {user_id}")
        else:
            logger.warning(f"Kullanıcı güncellenemedi veya veri aynı: {user_id}")
        return result
    except Exception as e:
        logger.error(f"Kullanıcı güncellenirken hata oluştu: {str(e)}")
        raise