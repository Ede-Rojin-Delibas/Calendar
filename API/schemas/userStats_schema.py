from marshmallow import Schema, fields

class UserStatsSchema(Schema):
    _id = fields.Str(dump_only=True)
    user_id = fields.Str(required=True)
    completed_task_count = fields.Int()
    activity_level = fields.Int()
    last_active = fields.DateTime(allow_none=True)
