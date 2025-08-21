#MongoDB bağlantıları

from pymongo import MongoClient

client=MongoClient("mongodb://localhost:27017/")
db=client["REMOTE_WORK_DB"]

