from flask import Blueprint, request, jsonify
from services.notification_service import *
from flasgger import swag_from
from schemas.notification_schema import NotificationSchema
from marshmallow import ValidationError

notification_bp= Blueprint('notifications', __name__)

@notification_bp.route('/notifications', methods=['POST'])
@swag_from({
    'tags': ['Notifications'],
    'summary': 'Yeni bildirim oluştur',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'user_id': {'type': 'string'},
                    'message': {'type': 'string'},
                    'type': {'type': 'string'},
                    'related_type': {'type': 'string'},
                    'related_id': {'type': 'string'}
                },
                'required': ['user_id', 'message']
            }
        }
    ],
    'responses': {
        201: {'description': 'Bildirim oluşturuldu'},
        400: {'description': 'Geçersiz veri'},
        500: {'description': 'Sunucu hatası'}
    }
})
def create_notification_route():
    try:
        data = request.get_json()
        validated = NotificationSchema().load(data)
        notification = create_notification(validated)
        return jsonify(notification), 201
    except ValidationError as e:
        return jsonify({"error": "Validation error", "messages": e.messages}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@notification_bp.route('/notifications/user/<string:user_id>', methods=['GET'])
@swag_from({
    'tags': ['Notifications'],
    'summary': 'Kullanıcıya ait bildirimleri getir',
    'description': 'Belirtilen kullanıcıya ait tüm bildirimleri listeler.',
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
                        'type': {'type': 'string'},
                        'related_type': {'type': 'string'},
                        'related_id': {'type': 'string'},
                        'created_at': {'type': 'string', 'format': 'date-time'},
                        'read': {'type': 'boolean'}
                    }
                }
            }
        },
        500: {'description': 'Sunucu hatası'}
    }
})
def get_notifications_by_user_route(user_id):
    try:
        notifications = get_notifications_by_user(user_id)
        return jsonify(notifications), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@notification_bp.route('/notifications/<string:notification_id>/read', methods=['PUT'])
@swag_from({
    'tags': ['Notifications'],
    'summary': 'Bildirim okundu olarak işaretle',
    'description': 'Belirtilen bildirimi okundu olarak işaretler.',
    'parameters': [
        {
            'name': 'notification_id',
            'in': 'path',
            'required': True,
            'type': 'string',
            'description': 'Bildirim ID'
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
        404: {'description': 'Bildirim bulunamadı'},
        500: {'description': 'Sunucu hatası'}
    }
})
def mark_notification_as_read_route(notification_id):
    try:
        success = mark_notification_as_read(notification_id)
        if success:
            return jsonify({"message": "Notification marked as read"}), 200
        else:
            return jsonify({"error": "Notification not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@notification_bp.route('/notifications/<string:notification_id>', methods=['DELETE'])
@swag_from({
    'tags': ['Notifications'],
    'summary': 'Bildirim sil',
    'description': 'Belirtilen bildirimi siler.',
    'parameters': [
        {
            'name': 'notification_id',
            'in': 'path',
            'required': True,
            'type': 'string',
            'description': 'Bildirim ID'
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
        404: {'description': 'Bildirim bulunamadı'},
        500: {'description': 'Sunucu hatası'}
    }
})
def delete_notification_route(notification_id):
    try:
        result = delete_notification(notification_id)
        if result.deleted_count > 0:
            return ('', 204)
        else:
            return jsonify({"error": "Notification not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500