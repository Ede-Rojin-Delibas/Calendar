from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from services.auth_service import register_user,authenticate_user
from flasgger import swag_from
from marshmallow import ValidationError
from schemas.user_schema import *

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
@swag_from({
    'tags': ['Auth'],
    'summary': 'Kullanıcı kaydı oluştur',
    'description': 'Yeni bir kullanıcı kaydı oluşturur.',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'username': {'type': 'string', 'description': 'Kullanıcı adı'},
                    'email': {'type': 'string', 'description': 'E-posta adresi'},
                    'password': {'type': 'string', 'description': 'Şifre'}
                },
                'required': ['username', 'email', 'password']
            }
        }
    ],
    'responses': {
        201: {
            'description': 'Kullanıcı başarıyla oluşturuldu',
            'schema': {
                'type': 'object',
                'properties': {
                    '_id': {'type': 'string'},
                    'username': {'type': 'string'},
                    'email': {'type': 'string'},
                    'created_at': {'type': 'string', 'format': 'date-time'}
                }
            }
        },
        400: {'description': 'Kullanıcı zaten var'},
        500: {'description': 'Sunucu hatası'}
    }
})
def register():
    data = request.get_json()
    try:
        validated=UserRegisterSchema().load(data)
    except ValidationError as err:
        return jsonify({"error":err.messages}), 400
    
    user = register_user(validated["username"], validated["email"], validated["password"])
    if user:
        return jsonify({"message": "User created successfully", "user": user}), 201
    return jsonify({"msg": "User with this email already exists"}), 409

@auth_bp.route("/login", methods=["POST"])
@swag_from({
    'tags': ['Auth'],
    'summary': 'Kullanıcı girişi',
    'description': 'Kullanıcı giriş yapar ve JWT token alır.',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'email': {'type': 'string', 'description': 'E-posta adresi'},
                    'password': {'type': 'string', 'description': 'Şifre'}
                },
                'required': ['email', 'password']
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Başarılı giriş',
            'schema': {
                'type': 'object',
                'properties': {
                    'access_token': {'type': 'string'},
                    'user': {
                        'type': 'object',
                        'properties': {
                            '_id': {'type': 'string'},
                            'username': {'type': 'string'},
                            'email': {'type': 'string'},
                            'created_at': {'type': 'string', 'format': 'date-time'}
                        }
                    }
                }
            }
        },
        401: {'description': 'Geçersiz kimlik bilgisi'},
        500: {'description': 'Sunucu hatası'}
    }
})
def login():
    try:
        data = request.get_json()
        validated = UserLoginSchema().load(data)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400

    user = authenticate_user(validated["email"], validated["password"])

    if not user:
        return jsonify({"msg": "Bad email or password"}), 401
        
    access_token = create_access_token(identity=user["_id"])
    return jsonify(access_token=access_token, user=user), 200

#örnek korumalı endpoint
@auth_bp.route("/protected", methods=["GET"])
@swag_from({
    'tags': ['Auth'],
    'summary': 'JWT ile korunan örnek endpoint',
    'description': 'Sadece giriş yapmış kullanıcılar erişebilir.',
    'security': [{'Bearer': []}],
    'responses': {
        200: {
            'description': 'Başarılı',
            'schema': {
                'type': 'object',
                'properties': {
                    'logged_in_as': {'type': 'string'}
                }
            }
        },
        401: {'description': 'Yetkisiz'},
        500: {'description': 'Sunucu hatası'}
    }
})
@jwt_required()
def protected():
    user_id = get_jwt_identity()
    return jsonify(logged_in_as=user_id), 200

@auth_bp.route("/forgot-password", methods=["POST"])
@swag_from({
    'tags': ['Auth'],
    'summary': 'Şifre sıfırlama talebi',
    'description': 'Kullanıcının e-posta adresine şifre sıfırlama linki gönderir.',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'email': {
                        'type': 'string',
                        'format': 'email',
                        'description': 'E-posta adresi'
                    }
                },
                'required': ['email']
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Şifre sıfırlama linki gönderildi',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'}
                }
            }
        },
        404: {'description': 'Kullanıcı bulunamadı'},
        500: {'description': 'Sunucu hatası'}
    }
})
def forgot_password():
    try:
        data = request.get_json()
        email = data.get('email', '').strip()
        
        if not email:
            return jsonify({"error": "E-posta adresi gereklidir"}), 400
            
        # Check if user exists
        from services.user_service import get_user_by_email
        user = get_user_by_email(email)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        # TODO: Generate reset token and send email
        # For now, just return success message
        print(f"DEBUG - Şifre sıfırlama talebi: {email}")
        
        return jsonify({
            "message": "Şifre sıfırlama linki e-posta adresinize gönderildi."
        }), 200
        
    except Exception as e:
        print(f"DEBUG - Forgot password error: {str(e)}")
        return jsonify({"error": str(e)}), 500
