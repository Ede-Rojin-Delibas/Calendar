from datetime import datetime

def user_stats_dict(stats):
    return {
        "_id": str(stats.get("_id")),
        "user_id": str(stats.get("user_id")),
        "completed_task_count": stats.get("completed_task_count", 0),
        "activity_level": stats.get("activity_level", 0),  # 0-100 arası bir skor olabilir
        "last_active": stats.get("last_active").isoformat() if stats.get("last_active") else None
    }