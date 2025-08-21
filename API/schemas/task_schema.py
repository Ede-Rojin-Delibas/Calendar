from marshmallow import Schema, fields

class TaskCreateSchema(Schema):
    title = fields.Str(required=True)
    user_id = fields.Str(required=True)
    description = fields.Str(required=True)
    priority = fields.Str(required=True)
    project_id = fields.Str(allow_none=True)
    start_time = fields.Str(allow_none=True)  # Optional datetime field
    end_time = fields.Str(allow_none=True)    # Optional datetime field

class TaskUpdateSchema(Schema):
    title = fields.Str()
    description = fields.Str()
    priority = fields.Str()
    status = fields.Str()
    start_time = fields.Str()  # Optional datetime field
    end_time = fields.Str()    # Optional datetime field

