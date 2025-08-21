#şifre hash ve kontrol fonksiyonları
from passlib.hash import bcrypt

def hash_password(password):
    return bcrypt.hash(password)

def verify_password(plain_password, hashed_password):
    return bcrypt.verify(plain_password, hashed_password)
