from marshmallow import Schema, fields

class ReminderSchema(Schema):
    user_id = fields.Str(required=True, metadata={"description": "ID of the user associated with the reminder"})
    message = fields.Str(required=True, metadata={"description": "The reminder message"})
    remind_at = fields.DateTime(required=True, metadata={"description": "The time to send the reminder"})
    related_type = fields.Str(allow_none=True, metadata={"description": "The type of the related item (e.g., 'task', 'plan')"})
    related_id = fields.Str(allow_none=True, metadata={"description": "The ID of the related item"})

