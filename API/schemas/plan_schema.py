from marshmallow import Schema, fields

class CreatePlanSchema(Schema):
    title = fields.Str(required=True)
    user_id = fields.Str(required=True)
    description = fields.Str(required=True)
    duration = fields.Int(required=True)
    start_date = fields.Str(required=True)  # String olarak al, service'de parse et
    end_date = fields.Str(required=True)    # String olarak al, service'de parse et

class UpdatePlanSchema(Schema):
    title = fields.Str()
    description = fields.Str()
    duration = fields.Int()
    start_date = fields.Str()  # String olarak al, service'de parse et
    end_date = fields.Str()    # String olarak al, service'de parse et
    status = fields.Str()
