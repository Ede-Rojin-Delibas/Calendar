from flask import jsonify, request, Blueprint
from flasgger import swag_from
from services.event_service import *
from models.event_model import event_dict
from bson.errors import InvalidId
from bson import ObjectId
from marshmallow import ValidationError
from schemas.event_schema import *

event_bp=Blueprint('event_bp',__name__)

@event_bp.route('/events', methods=['POST'])
@swag_from({
    'tags':['events'],
    'summary':'Yeni bir etkinlik oluştur',
    'description':'Sistemde kullanıcı için yeni bir etkinlik oluşturur',
    'parameters':[
        {
            'name': 'body',
            'in' : 'body',
            'required': True,
            'schema':{
                'type': 'object',
                'properties':{
                    'name' : {
                        'type':'string',
                        'description': 'Etkinlik adı'
                    },
                    'category':{
                        'type':'string',
                        'description':'Etkinlik kategorisi'
                    },
                    'start_time':{
                        'type':'string',
                        'format':'date-time',
                        'description':'Başlangıç tarihi'
                    },
                    'end_time':{
                        'type':'string',
                        'format':'date-time',
                        'description':'Bitiş tarihi'
                    },
                    'location':{
                        'type':'string',
                        'description':'Etkinlik konumu'
                    },
                    'participants':{
                        'type':'array',
                        'description':'Etkinlik katılımcıları',
                        'items':{
                            'type':'ObjectId',
                            'description':"Kullanıcı ID'si"
                        }
                    },
                    'moderator_id':{
                        'type':'string',
                        'description':'Etkinlik moderatörü ID\'si'
                    },
                    'topic':{
                        'type':'string',
                        'description':'Etkinlik konusu'
                    }

                },
                    'required':['name', 'moderator_id', 'start_time', 'end_time']
            }
        }
        ],
    'responses':{
        201:{
            'description':'Etkinlik başarıyla oluşturuldu',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'},
                    'event_id': {'type': 'string'}
                }
            }
        },
        400:{
            'description':'Geçersiz veri'
        }
    }
})
def create_event():
    try:
        event_data = request.get_json()
        validated = CreateEventSchema().load(event_data)
        event_id = create(validated)
        return jsonify({"message": "Event created successfully", "event_id": str(event_id)}), 201
    except InvalidId:
        return jsonify({'error': 'Invalid ID format'}), 400
    except ValidationError as e:
        return jsonify({'error': 'Validation error', 'messages': e.messages}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@event_bp.route('/events', methods=['GET'])
@swag_from({
    'tags':['events'],
    'summary':'Tüm etkinlikleri listele',
    'description':'Sistemdeki tüm etkinlikleri listeler',
    'responses':{
        200:{
            'description':'Başarılı',
            'schema':{
                'type':'array',
                'items':{
                    'type':'object',
                    'properties':{
                        '_id':{'type':'string'},
                        'name':{'type':'string'},
                        'category':{'type':'string'},
                        'start_time':{'type':'string', 'format':'date-time'},
                        'end_time':{'type':'string', 'format':'date-time'},
                        'location':{'type':'string'},
                        'participants':{
                            'type':'array',
                            'items':{'type':'string'}
                        },
                        'moderator_id':{'type':'string'},
                        'topic':{'type':'string'}
                    }
                }
            }
        }
    }
})
def get_events_route():
    try:
        events = get_events()
        return jsonify([event_dict(event) for event in events]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@event_bp.route('/events/upcoming', methods=['GET'])
@swag_from({
    'tags':['events'],
    'summary':'Yaklaşan etkinlikleri listele',
    'description':'Sistemdeki yaklaşan etkinlikleri listeler',
    'responses':{
        200:{
            'description':'Başarılı',
            'schema':{
                'type':'array',
                'items':{
                    'type':'object',
                    'properties':{
                        '_id':{'type':'string'},
                        'name':{'type':'string'},
                        'category':{'type':'string'},
                        'start_time':{'type':'string', 'format':'date-time'},
                        'end_time':{'type':'string', 'format':'date-time'},
                        'location':{'type':'string'},
                        'participants':{
                            'type':'array',
                            'items':{'type':'string'}
                        },
                        'moderator_id':{'type':'string'},
                        'topic':{'type':'string'}
                    }
                }
            }
        }
    }
})
def get_upcoming_events_route():
    try:
        upcoming_events = get_upcoming_events()
        return jsonify([event_dict(event) for event in upcoming_events]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500  

@event_bp.route('/events/<event_id>', methods=['PUT'])
@swag_from({
    'tags':['events'],
    'summary':'Etkinliği güncelle',
    'description':'Belirtilen etkinliği günceller',
    'parameters':[{
        'name':'event_id',
        'in':'path',
        'required':True,
        'type':'string'
    }],
    'responses':{
        200:{
            'description':'Başarılı',
            'schema':{
                'type':'object',
                'properties':{
                    'message':{'type':'string'}
                }
            }
        },
        400:{
            'description':'Geçersiz veri'
        },
        404:{
            'description':'Etkinlik bulunamadı'
        }
    }
})
def update_event_route(event_id):
    try:
        event_data = request.get_json()
        validated = UpdateEventSchema().load(event_data)
        result = update_event(event_id, validated) # Assuming this returns a PyMongo UpdateResult
        if result.matched_count == 0:
            return jsonify({"error": "Event not found"}), 404
        if result.modified_count > 0:
            return jsonify({"message": "Event updated successfully"}), 200
        return jsonify({"message": "No changes were made"}), 200
    except ValidationError as e:
        return jsonify({'error': 'Validation error', 'messages': e.messages}), 400
    except InvalidId:
        return jsonify({'error': 'Invalid ID format'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@event_bp.route('/events/<event_id>', methods=['DELETE'])
@swag_from({
    'tags':['events'],
    'summary':'Etkinliği sil',
    'description':'Belirtilen etkinliği siler',
    'parameters':[{
        'name':'event_id',
        'in':'path',
        'required':True,
        'type':'string'
    }],
    'responses':{
        200:{
            'description':'Başarılı',
            'schema':{
                'type':'object',
                'properties':{
                    'message':{'type':'string'}
                }
            }
        },
        404:{
            'description':'Etkinlik bulunamadı'
        },
        400:{
            'description':'Geçersiz ID formatı'
        }
    }
})
def delete_event_route(event_id):
    try:
        result = delete_event(event_id)
        if result.deleted_count == 0:
            return jsonify({"error": "Event not found"}), 404
        return ('', 204)
    except InvalidId:
        return jsonify({'error': 'Invalid ID format'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@event_bp.route('/events/past', methods=['GET'])
@swag_from({
    'tags':['events'],
    'summary':'Geçmiş etkinlikleri listele',
    'description':'Sistemdeki geçmiş etkinlikleri listeler',
    'responses':{
        200:{
            'description':'Başarılı',
            'schema':{
                'type':'array',
                'items':{
                    'type':'object',
                    'properties':{
                        '_id':{'type':'string'},
                        'name':{'type':'string'},
                        'category':{'type':'string'},
                        'start_time':{'type':'string', 'format':'date-time'},
                        'end_time':{'type':'string', 'format':'date-time'},
                        'location':{'type':'string'},
                        'participants':{
                            'type':'array',
                            'items':{'type':'string'}
                        },
                        'moderator_id':{'type':'string'},
                        'topic':{'type':'string'}
                    }
                }
            }
        }
    }
})
def get_past_events_route():
    try:
        past_events = get_past_events()
        return jsonify([event_dict(event) for event in past_events]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@event_bp.route('/events/<event_id>/complete', methods=['PUT'])
@swag_from({
    'tags':['events'],
    'summary':'Etkinliği tamamla',
    'description':'Belirtilen etkinliği tamamlar',
    'parameters':[{
        'name':'event_id',
        'in':'path',
        'required':True,
        'type':'string'
    }],
    'responses':{
        200:{
            'description':'Başarılı',
            'schema':{
                'type':'object',
                'properties':{
                    'message':{'type':'string'}
                }
            }
        },
        404:{
            'description':'Etkinlik bulunamadı'
        },
        400:{
            'description':'Geçersiz ID formatı'
        }
    }
})
def complete_event_route(event_id):
    try:
        result = mark_event_as_completed(event_id) # Servisin bir PyMongo result nesnesi döndürdüğünü varsayıyoruz
        if result.matched_count == 0:
            return jsonify({"error": "Event not found"}), 404
        if result.modified_count > 0:
            return jsonify({"message": "Event marked as completed"}), 200
        return jsonify({"message": "Event was already completed"}), 200
    except InvalidId:
        return jsonify({'error': 'Invalid ID format'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
