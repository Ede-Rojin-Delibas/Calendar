from flask import Blueprint, jsonify
from services.userStats_service import calculate_user_stats, get_user_stats
from flasgger import swag_from
from schemas.userStats_schema import *
from marshmallow import ValidationError

user_stats_bp = Blueprint('user_stats', __name__)

@user_stats_bp.route('/users/<string:user_id>/stats/calculate', methods=['POST'])
@swag_from({
    'tags': ['UserStats'],
    'summary': 'Kullanıcı istatistiklerini hesapla ve güncelle',
    'description': 'Belirtilen kullanıcı için görev istatistiklerini hesaplar ve günceller.',
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
            'description': 'İstatistikler başarıyla hesaplandı',
            'schema': {
                'type': 'object',
                'properties': {
                    '_id': {'type': 'string'},
                    'user_id': {'type': 'string'},
                    'completed_task_count': {'type': 'integer'},
                    'activity_level': {'type': 'integer'},
                    'last_active': {'type': 'string', 'format': 'date-time'}
                }
            }
        },
        500: {'description': 'Sunucu hatası'}
    }
})
def calculate_stats_route(user_id):
    try:
        stats = calculate_user_stats(user_id)
        validated = UserStatsSchema().load(stats)
        return jsonify(validated), 200
    except ValidationError as e:
        return jsonify({"error": "Validation error", "messages": e.messages}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_stats_bp.route('/users/<string:user_id>/stats', methods=['GET'])
@swag_from({
    'tags': ['UserStats'],
    'summary': 'Kullanıcı istatistiklerini getir',
    'description': 'Belirtilen kullanıcıya ait istatistikleri getirir.',
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
            'description': 'İstatistikler başarıyla getirildi',
            'schema': {
                'type': 'object',
                'properties': {
                    '_id': {'type': 'string'},
                    'user_id': {'type': 'string'},
                    'completed_task_count': {'type': 'integer'},
                    'activity_level': {'type': 'integer'},
                    'last_active': {'type': 'string', 'format': 'date-time'}
                }
            }
        },
        404: {'description': 'İstatistik bulunamadı'},
        500: {'description': 'Sunucu hatası'}
    }
})
def get_stats_route(user_id):
    stats = get_user_stats(user_id)
    if stats:
        return jsonify(stats), 200
    else:
        return jsonify({"error": "Stats not found"}), 404