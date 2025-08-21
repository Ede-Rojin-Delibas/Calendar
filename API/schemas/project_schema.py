from marshmallow import Schema, fields

class ProjectCreateSchema(Schema):
    name = fields.Str(required=True)
    user_id = fields.Str(required=True)
    category = fields.Str(required=True)
    stakeholders = fields.List(fields.Str(), required=True)
    team_members = fields.List(fields.Str(), required=True)
    start_time = fields.DateTime(required=False, allow_none=True)
    deadline = fields.DateTime(required=False, allow_none=True)
    progress = fields.Int(required=True)
    priority = fields.Str(required=True)
    description = fields.Str(required=True)
    Note = fields.Str(allow_none=True)
    income = fields.Float(allow_none=True)

class ProjectUpdateSchema(Schema):
    name = fields.Str()
    category = fields.Str()
    stakeholders = fields.List(fields.Str())
    team_members = fields.List(fields.Str())
    start_time = fields.DateTime()
    deadline = fields.DateTime()
    progress = fields.Int()
    priority = fields.Str()
    description = fields.Str()
    Note = fields.Str(allow_none=True)
    status = fields.Str()
    income = fields.Float(allow_none=True)

class StatusUpdateSchema(Schema):
    status = fields.Str(required=True)

class TeamMemberSchema(Schema):
    team_members = fields.List(fields.Str(), required=True)

class StakeholderSchema(Schema):
    stakeholders = fields.List(fields.Str(), required=True)

