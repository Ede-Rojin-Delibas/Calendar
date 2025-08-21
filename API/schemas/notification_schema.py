from marshmallow import Schema, fields

class NotificationSchema(Schema):
    user_id = fields.Str(required=True)
    message = fields.Str(required=True)
    type = fields.Str()
    related_type = fields.Str()
    related_id = fields.Str()

