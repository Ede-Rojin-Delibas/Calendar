from config.db import db
from bson import ObjectId
from datetime import datetime
from bson.errors import InvalidId


def parse_datetime(date_string):
    """Parse datetime string with multiple format support"""
    if not date_string:
        raise ValueError("Date string cannot be empty")
    
    print(f"Parsing datetime: {date_string} (type: {type(date_string)})")
    
    try:
        # Try dateutil.parser if available
        from dateutil.parser import parse
        result = parse(date_string)
        print(f"Parsed successfully with dateutil: {result}")
        return result
    except ImportError:
        print("dateutil not available, using fallback parsing")
        pass
    except Exception as e:
        print(f"dateutil parsing failed: {e}")
        pass
    
    # Fallback to manual parsing
    try:
        # Remove timezone suffix if exists
        if date_string.endswith('Z'):
            date_string = date_string[:-1]
        elif '+' in date_string and date_string.count('+') == 1:
            date_string = date_string.split('+')[0]
        
        # Try different formats
        formats = [
            '%Y-%m-%dT%H:%M:%S.%f',  # ISO with microseconds
            '%Y-%m-%dT%H:%M:%S',      # ISO format
            '%Y-%m-%d %H:%M:%S',      # SQL datetime format
            '%Y-%m-%d'                # Date only
        ]
        
        for fmt in formats:
            try:
                result = datetime.strptime(date_string, fmt)
                print(f"Parsed successfully with format {fmt}: {result}")
                return result
            except ValueError:
                continue
        
        # If all fails, try fromisoformat
        result = datetime.fromisoformat(date_string)
        print(f"Parsed successfully with fromisoformat: {result}")
        return result
        
    except Exception as e:
        print(f"All parsing methods failed for '{date_string}': {e}")
        raise ValueError(f"Unable to parse datetime string: '{date_string}'. Expected ISO format like '2025-01-15T18:00:00.000Z'")
 

event_collection= db["events"]

def create(data):
    print(f"Creating event with data: {data}")
    
    required_fields=["name","moderator_id", "start_time", "end_time"]
    for field in required_fields:
        if field not in data:
            raise ValueError(f"{field} is required")
        if not data[field]:
            raise ValueError(f"{field} cannot be empty")

    try:
        # Parse dates first to catch any datetime errors early
        start_time = parse_datetime(data["start_time"])
        end_time = parse_datetime(data["end_time"])
        
        # Validate that end_time is after start_time
        if end_time <= start_time:
            raise ValueError("End time must be after start time")
        
        # Parse participants
        participants = []
        if data.get("participants"):
            for participant in data["participants"]:
                try:
                    participants.append(ObjectId(participant))
                except Exception as e:
                    raise ValueError(f"Invalid participant ID '{participant}': {e}")
        
        # Parse moderator_id
        try:
            moderator_id = ObjectId(data["moderator_id"])
        except Exception as e:
            raise ValueError(f"Invalid moderator_id '{data['moderator_id']}': {e}")
        
        event = {
            "name": data["name"],
            "category": data.get("category"),
            "start_time": start_time,
            "end_time": end_time,
            "location": data.get("location"),
            "participants": participants,
            "moderator_id": moderator_id,
            "topic": data.get("topic")
        }
        
        print(f"Event object created successfully: {event}")
        
        result = event_collection.insert_one(event)
        print(f"Event inserted with ID: {result.inserted_id}")
        return result.inserted_id
        
    except Exception as e:
        print(f"Error creating event: {e}")
        raise

#etkinlikleri listele/getir 
def get_events():
    events = list(event_collection.find())
    for event in events:
        event["_id"] = str(event["_id"])
        event["start_time"] = event["start_time"].isoformat() if isinstance(event["start_time"], datetime) else event["start_time"]
        event["end_time"] = event["end_time"].isoformat() if isinstance(event["end_time"], datetime) else event["end_time"]
    return events

#yaklaşan etkinlikleri getir/göster
def get_upcoming_events():
    now = datetime.now()
    upcoming_events = list(event_collection.find({"start_time": {"$gte": now}}))
    for event in upcoming_events:
        event["_id"] = str(event["_id"])
        event["start_time"] = event["start_time"].isoformat() if isinstance(event["start_time"], datetime) else event["start_time"]
        event["end_time"] = event["end_time"].isoformat() if isinstance(event["end_time"], datetime) else event["end_time"]
    return upcoming_events

#etkinlik güncelle/düzenle
def update_event(event_id, data):
    try:
        update_data = {}
        if "name" in data:
            update_data["name"] = data["name"]
        if "category" in data:
            update_data["category"] = data["category"]
        if "start_time" in data:
            update_data["start_time"] = datetime.fromisoformat(data["start_time"])
        if "end_time" in data:
            update_data["end_time"] = datetime.fromisoformat(data["end_time"])
        if "location" in data:
            update_data["location"] = data["location"]
        if "participants" in data:
            update_data["participants"] = [ObjectId(participant) for participant in data["participants"]]
        if "moderator_id" in data:
            update_data["moderator_id"] = ObjectId(data["moderator_id"])
        if "topic" in data:
            update_data["topic"] = data["topic"]

        return event_collection.update_one({"_id": ObjectId(event_id)}, {"$set": update_data})
    except InvalidId:
        return None
#etkinlik sil
def delete_event(event_id):
    try:
        return event_collection.delete_one({"_id": ObjectId(event_id)})
    except InvalidId:
        return None

#geçmiş etkinlikleri getir
def get_past_events():
    now = datetime.now()
    past_events = list(event_collection.find({"end_time": {"$lt": now}}))
    for event in past_events:
        event["_id"] = str(event["_id"])
        event["start_time"] = event["start_time"].isoformat() if isinstance(event["start_time"], datetime) else event["start_time"]
        event["end_time"] = event["end_time"].isoformat() if isinstance(event["end_time"], datetime) else event["end_time"]
    return past_events

#etkinlikleri tamamlandı olarak işaretle
def mark_event_as_completed(event_id):
    try:
        return event_collection.update_one({"_id": ObjectId(event_id)}, {"$set": {"status": "completed"}})
    except InvalidId:
        return None
