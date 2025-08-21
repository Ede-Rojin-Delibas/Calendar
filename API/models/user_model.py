#kullanıcı veri tabanı modeli
from datetime import datetime
from passlib.hash import bcrypt

def user_dict(user):
    return {
        "_id":str(user["_id"]),
        "username":user["username"],
        "email":user["email"],
        "password":user["password"],
        "avatar_url": user.get("avatar_url"),
        "created_at":user["created_at"],
        "updated_at":user["updated_at"],
    }
