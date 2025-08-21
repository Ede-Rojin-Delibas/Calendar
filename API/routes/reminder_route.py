from flask import Blueprint, jsonify,request
from services.reminder_service import *
from flasgger import swag_from
from schemas.reminder_schema import *
from marshmallow import ValidationError

reminder_bp = Blueprint('reminder', __name__)

@reminder_bp.route('/reminder', methods=['POST'])
@swag_from({
    'tags': ['Reminder'],
    'summary': 'Yeni bir hatırlatıcı oluştur',
    'description': 'Kullanıcı için yeni bir hatırlatıcı oluşturur.',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'user_id': {'type': 'string', 'description': 'Kullanıcı ID'},
                    'message': {'type': 'string', 'description': 'Hatırlatma mesajı'},
                    'remind_at': {'type': 'string', 'format': 'date-time', 'description': 'Hatırlatma zamanı'},
                    'related_type': {'type': 'string', 'description': 'İlgili tip (task, plan, event)'},
                    'related_id': {'type': 'string', 'description': 'İlgili nesnenin ID\'si'}
                },
                'required': ['user_id', 'message', 'remind_at']
            }
        }
    ],
    'responses': {
        201: {
            'description': 'Hatırlatıcı başarıyla oluşturuldu',
            'schema': {
                'type': 'object',
                'properties': {
                    '_id': {'type': 'string'},
                    'user_id': {'type': 'string'},
                    'message': {'type': 'string'},
                    'remind_at': {'type': 'string', 'format': 'date-time'},
                    'related_type': {'type': 'string'},
                    'related_id': {'type': 'string'},
                    'created_at': {'type': 'string', 'format': 'date-time'}
                }
            }
        },
        400: {'description': 'Geçersiz veri'},
        500: {'description': 'Sunucu hatası'}
    }
})
def create_reminder_route():
    try:
        data = request.json
        validated = ReminderSchema().load(data)
        reminder = create_reminder(validated)
        return jsonify(reminder_dict(reminder)), 201
    except ValidationError as e:
        return jsonify({"error": "Validation error", "messages": e.messages}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@reminder_bp.route('/reminder', methods=['GET'])
@swag_from({
    'tags': ['Reminder'],
    'summary': 'Tüm hatırlatıcıları getir',
    'description': 'Sistemdeki tüm hatırlatıcıları listeler.',
    'responses': {
        200: {
            'description': 'Başarılı',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        '_id': {'type': 'string'},
                        'user_id': {'type': 'string'},
                        'message': {'type': 'string'},
                        'remind_at': {'type': 'string', 'format': 'date-time'},
                        'related_type': {'type': 'string'},
                        'related_id': {'type': 'string'},
                        'created_at': {'type': 'string', 'format': 'date-time'}
                    }
                }
            }
        },
        500: {'description': 'Sunucu hatası'}
    }
})
def get_all_reminders_route():
    try:
        reminders = get_all_reminders()
        return jsonify(reminders), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@reminder_bp.route('/reminder/user/<string:user_id>', methods=['GET'])
@swag_from({
    'tags': ['Reminder'],
    'summary': 'Kullanıcıya ait hatırlatıcıları getir',
    'description': 'Belirtilen kullanıcıya ait hatırlatıcıları listeler.',
    'parameters': [
        {
            'name': 'user_id',
            'in': 'path',
            'required': True,
            'type': 'string',
            'description': 'Kullanıcı ID'
        }
    ],
    'responses': {
        200: {
            'description': 'Başarılı',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        '_id': {'type': 'string'},
                        'user_id': {'type': 'string'},
                        'message': {'type': 'string'},
                        'remind_at': {'type': 'string', 'format': 'date-time'},
                        'related_type': {'type': 'string'},
                        'related_id': {'type': 'string'},
                        'created_at': {'type': 'string', 'format': 'date-time'}
                    }
                }
            }
        },
        500: {'description': 'Sunucu hatası'}
    }
})
def get_user_reminders_route(user_id):
    try:
        reminders = get_reminders_by_user(user_id)
        return jsonify(reminders), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reminder_bp.route('/reminder/<string:reminder_id>', methods=['DELETE'])
@swag_from({
    'tags': ['Reminder'],
    'summary': 'Hatırlatıcı sil',
    'description': 'Belirtilen ID\'ye sahip hatırlatıcıyı siler.',
    'parameters': [
        {
            'name': 'reminder_id',
            'in': 'path',
            'required': True,
            'type': 'string',
            'description': 'Hatırlatıcı ID'
        }
    ],
    'responses': {
        200: {
            'description': 'Başarılı',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'}
                }
            }
        },
        404: {'description': 'Hatırlatıcı bulunamadı'},
        500: {'description': 'Sunucu hatası'}
    }
})
def delete_reminder_route(reminder_id):
    try:
        result = delete_reminder(reminder_id)
        if result.deleted_count > 0:
            return ('', 204)
        else:
            return jsonify({"error": "Reminder not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500