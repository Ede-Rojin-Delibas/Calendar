#takvim verisini dönen endpoint

from flask import Blueprint, jsonify, request
from services.calendar_service import get_calendar_items
from flasgger import swag_from

calendar_bp = Blueprint('calendar', __name__)   

@calendar_bp.route('/<string:user_id>/<int:year>/<int:month>',methods=['GET'])
@swag_from({
    'tags': ['Calendar'],
    'summary': 'Ay bazlı takvim verisi getir',
    'description': 'Belirtilen kullanıcı, yıl ve ay için etkinlik ve planları döner.',
    'parameters': [
        {'name': 'user_id', 'in': 'path', 'type': 'string', 'required': True, 'description': 'Kullanıcı ID'},
        {'name': 'year', 'in': 'path', 'type': 'integer', 'required': True, 'description': 'Yıl'},
        {'name': 'month', 'in': 'path', 'type': 'integer', 'required': True, 'description': 'Ay (1-12)'}
    ],
    'responses': {
        200: {
            'description': 'Başarılı',
            'schema': {
                'type': 'object',
                'properties': {
                    'events': {'type': 'array', 'items': {'type': 'object'}},
                    'plans': {'type': 'array', 'items': {'type': 'object'}}
                }
            }
        },
        500: {'description': 'Sunucu hatası'}
    }

})
def get_calendar_view(user_id, year, month):
    try:
        data = get_calendar_items(user_id, year, month)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
