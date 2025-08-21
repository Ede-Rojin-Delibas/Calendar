from marshmallow import Schema, fields, validate

class UserRegisterSchema(Schema):
    username = fields.Str(required=True, validate=validate.Length(min=3))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))

class UserLoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)

class UserUpdateSchema(Schema):
    username = fields.Str(validate=validate.Length(min=3))
    email = fields.Email()
    # Not: Şifre güncelleme işlemleri genellikle ayrı ve daha güvenli bir endpoint üzerinden yapılır.
