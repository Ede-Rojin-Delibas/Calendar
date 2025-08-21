from flask import request,jsonify,Blueprint
from flasgger import swag_from
from services.plan_service import *
from models.plan_model import *
from services.user_service import *
from bson.errors import InvalidId
from models.enum import Status, Priority
from marshmallow import ValidationError
from schemas.plan_schema import CreatePlanSchema, UpdatePlanSchema

plan_bp=Blueprint("plan_bp",__name__)

@plan_bp.route('/plans',methods=["POST"])
@swag_from({
    'tags':['Plans'],
    'summary':'Yeni bir plan oluştur',
    'description':'Sistemde kullanıcı için yeni bir plan oluşturur',
    'parameters':[
        {
            'name': 'body',
            'in' : 'body',
            'required': True,
            'schema':{
                'type': 'object',
                'properties':{
                        'title' : {
                            'type':'string',
                            'description': 'Plan başlığı'
                        },
                        'user_id':{
                            'type':'ObjectId',
                            'description':"Kullanıcı ID'si"
                        },
                        'description':{
                            'type':'string',
                            'description':'Plan Açıklaması'
                        },
                        'duration':{
                            'type':'integer',
                            'description':'Plana ayrılan toplam süre(dakika)'
                        },
                        'start_date':{
                            'type':'string',
                            'format':'date-time',
                            'description':'Başlangıç tarihi'
                        },
                        'end_date':{
                            'type':'string',
                            'format':'date-time',
                            'description':'Bitiş tarihi'
                        }

                    },
                    'required':['title', 'user_id','description','duration','start_date','end_date']
                }
                
        }
    ],
    'responses':{
        201:{
            'description':'Plan başarıyla oluşturuldu',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'},
                    'plan_id': {'type': 'string'}
                }
            }
        },
        400:{
            'description':'Geçersiz veri'
        }
    }
})
def create():
    try:
        data=request.get_json()
        # Marshmallow ile veri doğrulama
        validated_data = CreatePlanSchema().load(data)
        plan_id=create_plan(validated_data)
        return jsonify({"message": "Plan created", "plan_id": plan_id}),201
    except ValidationError as e:
        return jsonify({"error": "Validation error", "messages": e.messages}), 400
    except Exception as e:
        return jsonify({"error": str(e)}),500

@plan_bp.route('/plans',methods=["GET"])
@swag_from({
    'tags': ['Plans'],
    'summary': 'Tüm planları getir',
    'description': 'Sistemdeki kayıtlı planları listeler',
    'responses': {
        200: {
            'description': 'Planlar başarıyla getirildi',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        '_id': {'type': 'string'},
                        'user_id': {'type': 'ObjectId'},
                        'status': {'type': 'string'}
                    }
                }
            }
        }
    }
})
def get_plans():
    try:
        plans=get_all_plans()
        return jsonify([plan_dict(p) for p in plans]),200
    except Exception as e:
        return jsonify({"error": str(e)}),500
    

@plan_bp.route('/plans/<plan_id>',methods=["GET"])
@swag_from({
    'tags': ['Plans'],
    'summary': 'ID ile planı getir',
    'description': 'Belirtilen ID\'ye sahip planları getirir',
    'parameters': [
        {
            'name': 'plan_id',
            'in': 'path',
            'type': 'string',
            'required': True,
            'description': 'Plan ID\'si'
        }
    ],
    'responses': {
        200: {
            'description': 'Plan başarıyla getirildi',
            'schema': {
                'type': 'object',
                'properties': {
                    '_id': {'type': 'string'},
                    'user_id': {'type': 'string'},
                    'status': {'type': 'string'}
                }
            }
        },
        404: {
            'description': 'Plan bulunamadı'
        }
    }

})
def get_plan(plan_id):
    try:
        plan=get_plan_by_id(plan_id)
        if plan:
            return jsonify(plan_dict(plan)),200
        else:
            return jsonify({"error":"Plan is not found"}),404
    except InvalidId:
        return jsonify({"error":"Geçersiz plan ID formatı"}),400
    except Exception as e:
        return jsonify({"error": str(e)}),500

@plan_bp.route('/users/<user_id>/plans',methods=["GET"])
@swag_from({
    'tags': ['Plans'],
    'summary': 'Kullanıcının planlarını getir',
    'parameters':[
        {
            'name':'user_id',
            'in':'path',
            'type':'string',
            'required':True,
            'description':'Kullanıcı ID\'si'
        }
    ],
    'responses': {
        200: {
            'description': 'Planlar başarıyla getirildi',
        }
    }

})
def get_user_plan(user_id):
    try:
        plans=get_plans_by_user(user_id)
        return jsonify([plan_dict(p) for p in plans]),200
    except InvalidId:
        return jsonify({"error":"Geçersiz kullanıcı ID formatı"}),400
    except Exception as e:
        return jsonify({"error":str(e)}),500

@plan_bp.route('/plans/<plan_id>',methods=["PUT"])
@swag_from({
    'tags': ['Plans'],
    'summary': 'ID ile planı güncelle',
    'description': 'Belirtilen ID\'ye sahip planı günceller',
    'parameters': [
        {
            'name': 'plan_id',
            'in': 'path',
            'type': 'string',
            'required': True,
            'description': 'Plan ID\'si'
        }
    ]
})
def update_plan_by_id(plan_id):
    try:
        data=request.get_json()
        validated=UpdatePlanSchema().load(data)
        result=update_plan(plan_id, validated)
        if result.matched_count == 0:
            return jsonify({"error": "Plan not found"}), 404
        if result.modified_count > 0:
            return jsonify({"message": "Plan updated successfully"}), 200
        return jsonify({"message": "No changes were made"}), 200
    except ValidationError as ve:
        return jsonify({"error": ve.messages}), 400
    except Exception as e:
        return jsonify({"error": str(e)}),500

@plan_bp.route('/plans/<plan_id>',methods=["DELETE"])
@swag_from({
    'tags': ['Plans'],
    'summary': 'ID ile planı sil',
    'description': 'Belirtilen ID\'ye sahip planları sil',
    'parameters': [
        {
            'name': 'plan_id',
            'in': 'path',
            'type': 'string',
            'required': True,
            'description': 'Plan ID\'si'
        }
    ],
    'responses': {
        200: {
            'description': 'Plan başarıyla silindi',
            'schema': {
                'type': 'object',
                'properties': {
                    '_id': {'type': 'string'},
                    'user_id': {'type': 'string'},
                    'status': {'type': 'string'}
                }
            }
        },
        404: {
            'description': 'Plan bulunamadı'
        }
    }
})
def delete_plan_by_id(plan_id):
    try:
        result=delete_plan(plan_id)
        if result.deleted_count == 0:
            return jsonify({"error": "Plan not found"}), 404
        return ('', 204)
    except Exception as e:
        return jsonify({"error": str(e)}),500




@plan_bp.route('/plans/<plan_id>/completed',methods=["POST"])
@swag_from({
    'tags':['Plans'],
    'summary':'Plan durumunu tamamlandı yapar',
    'description':'Belirtilen planı tamamlandı olarak işaretler',
    'parameters':[
        {
            'name': 'plan_id',
            'in': 'path',
            'type': 'string',
            'required': True,
            'description': 'Tamamlanacak planın ID\'si'
        }
    ],
    'responses':{
        200:{
            'description':'Plan başarıyla tamamlandı olarak işaretlendi',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'}
                }
            }
        },
        404:{
            'description':'Plan bulunamadı'
        },
        500:{
            'description':'Sunucu hatası'
        }
    }
})
def mark_plan_completed_route(plan_id):
    try:
        result=mark_plan_completed(plan_id)
        if result.matched_count == 0:
            return jsonify({"error":"Plan bulunamadı"}),404
        if result.modified_count > 0:
            return jsonify({"message":"Plan tamamlandı olarak işaretlendi"}),200
        return jsonify({"message":"Plan zaten tamamlanmıştı"}),200
    except Exception as e:
        return jsonify({"error": str(e)}), 500