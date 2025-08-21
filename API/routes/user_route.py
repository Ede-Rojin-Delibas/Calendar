#API endpointleri
from flask import Blueprint,request,jsonify, current_app
import os
from werkzeug.utils import secure_filename
from services.user_service import * 
from services.auth_service import register_user as secure_register_user
from models.user_model import user_dict
from flasgger import swag_from
from schemas.user_schema import UserRegisterSchema, UserUpdateSchema
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError

user_bp=Blueprint("user_bp",__name__)

@user_bp.route("/users",methods=["POST"])
@swag_from({
    'tags': ['Users'], #Endpoint'i gruplandırır
    'summary': 'Yeni kullanıcı oluştur', 
    'description': 'Sistemde yeni bir kullanıcı kaydı oluşturur',
    'parameters': [ #Giriş parametrelerini tanımlar
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': { #JSON şeması
                'type': 'object',
                'properties': {
                    'username': {
                        'type': 'string',
                        'description': 'Kullanıcı adı'
                    },
                    'email': {
                        'type': 'string',
                        'description': 'E-posta adresi'
                    },
                    'password': {
                        'type': 'string',
                        'description': 'Şifre'
                    }
                },
                'required': ['username', 'email', 'password']
            }
        }
    ],
    'responses': { #olası yanıtları tanımlar
        201: {
            'description': 'Kullanıcı başarıyla oluşturuldu',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'},
                    'user_id': {'type': 'string'}
                }
            }
        },
        400: {
            'description': 'Geçersiz veri'
        }
    }
})
def create():
    try:
        data=request.get_json()
        # Marshmallow ile veri doğrulama
        validated_data = UserRegisterSchema().load(data)
        # Güvenli kayıt servisini çağır
        user = secure_register_user(validated_data["username"], validated_data["email"], validated_data["password"])
        if user:
            return jsonify({"message":"User created", "user_id": user["_id"]}), 201
        else:
            return jsonify({"error": "User with this email already exists"}), 409
    except ValidationError as e:
        return jsonify({"error": "Validation error", "messages": e.messages}), 400
    except Exception as e:
        return jsonify({"error": str(e)}),500

@user_bp.route("/users",methods=["GET"])
@swag_from({
    'tags': ['Users'],
    'summary': 'Tüm kullanıcıları getir',
    'description': 'Sistemdeki tüm kullanıcıları listeler',
    'responses': {
        200: {
            'description': 'Kullanıcı listesi başarıyla getirildi',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        '_id': {'type': 'string'},
                        'username': {'type': 'string'},
                        'email': {'type': 'string'},
                        'created_at': {'type': 'string'},
                        'updated_at': {'type': 'string'}
                    }
                }
            }
        }
    }
})
def get_all():
    try:
        users=get_all_users() #Servis fonksiyonu
        return jsonify([user_dict(u) for u in users]),200
    except Exception as e:
        return jsonify({"error":str(e)}),500

@user_bp.route("/users/<user_id>",methods=["GET"])
@swag_from({
    'tags': ['Users'],
    'summary': 'ID ile kullanıcı getir',
    'description': 'Belirtilen ID\'ye sahip kullanıcıyı getirir',
    'parameters': [
        {
            'name': 'user_id',
            'in': 'path',
            'type': 'string',
            'required': True,
            'description': 'Kullanıcı ID\'si'
        }
    ],
    'responses': {
        200: {
            'description': 'Kullanıcı başarıyla getirildi',
            'schema': {
                'type': 'object',
                'properties': {
                    '_id': {'type': 'string'},
                    'username': {'type': 'string'},
                    'email': {'type': 'string'},
                    'created_at': {'type': 'string'},
                    'updated_at': {'type': 'string'}
                }
            }
        },
        404: {
            'description': 'Kullanıcı bulunamadı'
        }
    }
})
def get_by_id(user_id):
    try:
        user=get_user_by_id(user_id)
        if user:
            return jsonify(user_dict(user)),200
        else:
            return jsonify({"error":"User not found"}),404
    except Exception as e:
        return jsonify({"error":str(e)}),500


@user_bp.route('/users/<user_id>',methods=["PUT"])
@swag_from({
    'tags': ['Users'],
    'summary': 'Kullanıcıyı güncelle',
    'description': 'Belirtilen ID\'ye sahip kullanıcıyı günceller',
    'parameters': [
        {
            'name': 'user_id',
            'in': 'path',
            'type': 'string',
            'required': True,
            'description': 'Kullanıcı ID\'si'
        },
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'username': {'type': 'string'},
                    'email': {'type': 'string'},
                    'password': {'type': 'string'}
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Kullanıcı başarıyla güncellendi'
        },
        400: {
            'description': 'Geçersiz veri'
        },
        404: {
            'description': 'Kullanıcı bulunamadı'
        }
    }
})
@jwt_required()
def update_user_by_id(user_id):
    try:
        data=request.get_json()
        # Marshmallow ile gelen veriyi doğrula
        validated_data = UserUpdateSchema().load(data)
        if not validated_data:
            return jsonify({"error": "No update data provided"}), 400
        
        # GÜVENLİK: İsteği yapan kullanıcının, güncellenen kullanıcıyla aynı olup olmadığını kontrol et.
        current_user_id = get_jwt_identity()
        if current_user_id != user_id:
            return jsonify({"error": "Forbidden: You can only update your own profile."}), 403

        # GÜVENLİK: Genel güncelleme endpoint'i üzerinden şifrenin yanlışlıkla
        # değiştirilmesini veya ezilmesini önle.
        validated_data.pop('password', None)
            
        result=update_user(user_id, validated_data)
        if result.matched_count == 0:
            return jsonify({"error": "User not found"}), 404
        return jsonify({"message":"User updated successfully"}), 200
    except ValidationError as e:
        return jsonify({"error": "Validation error", "messages": e.messages}), 400
    except Exception as e:
        return jsonify({"error":str(e)}),500
    
@user_bp.route('/users/<user_id>',methods=["DELETE"])
@swag_from({
    'tags': ['Users'],
    'summary': 'Kullanıcıyı sil',
    'description': 'Belirtilen ID\'ye sahip kullanıcıyı siler',
    'parameters': [
        {
            'name': 'user_id',
            'in': 'path',
            'type': 'string',
            'required': True,
            'description': 'Kullanıcı ID\'si'
        }
    ],
    'responses': {
        204: {
            'description': 'Kullanıcı başarıyla silindi'
        },
        404: {
            'description': 'Kullanıcı bulunamadı'
        }
    }
})
@jwt_required()
def delete_user_by_id(user_id):
    try:
        # GÜVENLİK: İsteği yapan kullanıcının, silinen kullanıcıyla aynı olup olmadığını kontrol et.
        current_user_id = get_jwt_identity()
        if current_user_id != user_id:
            return jsonify({"error": "Forbidden: You can only delete your own account."}), 403

        result=delete_user(user_id)
        if result.deleted_count == 0:
            return jsonify({"error": "User not found"}), 404
        # HTTP 204 standardı gereği yanıt gövdesi boş olmalıdır.
        return ('', 204)
    except Exception as e:
        return jsonify({"error":str(e)}),500


# --- Avatar Upload ---
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@user_bp.route('/users/<user_id>/avatar', methods=['POST'])
@jwt_required()
def upload_avatar(user_id):
    try:
        current_user_id = get_jwt_identity()
        if current_user_id != user_id:
            return jsonify({"error": "Forbidden: You can only update your own avatar."}), 403

        if 'avatar' not in request.files:
            return jsonify({"error": "No file part 'avatar' in the request"}), 400

        file = request.files['avatar']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            ext = filename.rsplit('.', 1)[1].lower()
            # Ensure upload folder exists
            upload_root = os.path.join(os.getcwd(), 'uploads', 'avatars')
            os.makedirs(upload_root, exist_ok=True)
            # Unique filename per user
            unique_name = f"{user_id}_{int(__import__('time').time())}.{ext}"
            file_path = os.path.join(upload_root, unique_name)
            file.save(file_path)

            # Public URL path served by app.py /uploads/<path>
            avatar_url = f"/uploads/avatars/{unique_name}"

            result = update_user(user_id, {"avatar_url": avatar_url})
            if result.matched_count == 0:
                return jsonify({"error": "User not found"}), 404

            return jsonify({"message": "Avatar updated", "avatar_url": avatar_url}), 200

        return jsonify({"error": "File type not allowed"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
