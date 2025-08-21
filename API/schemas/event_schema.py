from marshmallow import Schema, fields

class CreateEventSchema(Schema):
    name = fields.Str(required=True)
    moderator_id = fields.Str(required=True)
    start_time = fields.Str(required=True)  # String olarak al, service'de parse et
    end_time = fields.Str(required=True)    # String olarak al, service'de parse et
    category = fields.Str()
    location = fields.Str()
    participants = fields.List(fields.Str())
    topic = fields.Str()
    user_id = fields.Str()  # Optional field for frontend compatibility

class UpdateEventSchema(Schema):
    name = fields.Str()
    moderator_id = fields.Str()
    start_time = fields.Str()  # String olarak al, service'de parse et
    end_time = fields.Str()    # String olarak al, service'de parse et
    category = fields.Str()
    location = fields.Str()
    participants = fields.List(fields.Str())
    topic = fields.Str()
    user_id = fields.Str()  # Optional field for frontend compatibility

