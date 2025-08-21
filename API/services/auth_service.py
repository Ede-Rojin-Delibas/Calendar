import logging
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from services.user_service import user_collection
from models.user_model import user_dict

logger = logging.getLogger(__name__)

def register_user(username, email, password):
    """
    Yeni bir kullanıcıyı, e-posta var mı diye kontrol ederek ve şifreyi hashleyerek kaydeder.
    """
    try:
        if user_collection.find_one({"email": email}):
            logger.warning(f"Registration attempt for existing email: {email}")
            return None

        hashed_password = generate_password_hash(password)

        user_data = {
            "username": username,
            "email": email,
            "password": hashed_password, # Güvenli, hashlenmiş şifreyi sakla
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        result = user_collection.insert_one(user_data)
        logger.info(f"New user registered: {result.inserted_id}")
        
        created_user = user_collection.find_one({"_id": result.inserted_id})
        return user_dict(created_user)
    except Exception as e:
        logger.error(f"Error during user registration: {str(e)}")
        raise

def authenticate_user(email, password):
    """
    Bir kullanıcının kimliğini e-posta ve şifre ile doğrular.
    """
    try:
        user = user_collection.find_one({"email": email})
        if user and check_password_hash(user.get("password"), password):
            logger.info(f"User authenticated successfully: {email}")
            return user_dict(user)
        logger.warning(f"Failed authentication attempt for email: {email}")
        return None
    except Exception as e:
        logger.error(f"Error during user authentication: {str(e)}")
        raise