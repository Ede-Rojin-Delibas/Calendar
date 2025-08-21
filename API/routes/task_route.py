from flask import request,jsonify,Blueprint
from flasgger import swag_from
from services.task_service import *
from models.task_model import task_dict
from models.enum import Status, Priority
from services.user_service import *
from schemas.task_schema import *
from marshmallow import ValidationError
from datetime import datetime

task_bp=Blueprint("task_bp",__name__)

@task_bp.route('/tasks',methods=["POST"])
@swag_from({
    'tags':['Tasks'],
    'summary':'Yeni bir görev oluştur',
    'description':'Sistemde kullanıcı için yeni bir görev oluşturur',
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
                        'description': 'Görev başlığı'
                    },
                    'user_id':{
                        'type':'ObjectId',
                        'description':"Kullanıcı ID'si"
                    },
                    'description':{
                        'type':'string',
                        'description':'Görev Açıklaması'
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
                    'priority':{
                        'type':'string',
                        'description':'Görevin öncelik sırası'
                    },
                    'project_id':{
                        'type':'ObjectId',
                        'description':"Proje ID'si"
                    }
                },
                    'required':['title', 'user_id','description','priority']
            }
                
        }
        ],
    'responses':{
        201:{
            'description':'Görev başarıyla oluşturuldu',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'},
                    'task_id': {'type': 'string'}
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
        validated=TaskCreateSchema().load(data)
        task_id=create_task(validated)
        return jsonify({"message":"Task created", "task_id":task_id}),201
    except ValidationError as ve:
        return jsonify({"error": ve.messages}), 400
    except Exception as e:
        return jsonify({"error":str(e)}),500 


@task_bp.route('/tasks/<task_id>',methods=["GET"])
@swag_from({
    'tags': ['Tasks'],
    'summary': 'ID ile görevleri getir',
    'description': 'Belirtilen ID\'ye sahip görevleri getirir',
    'parameters': [
        {
            'name': 'task_id',
            'in': 'path',
            'type': 'string',
            'required': True,
            'description': 'Görev ID\'si'
        }
    ],
    'responses': {
        200: {
            'description': 'Görev başarıyla getirildi',
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
            'description': 'Görev bulunamadı'
        }
    }

})
def get_task(task_id):
    try:
        task=get_task_by_id(task_id)
        if task:
            return jsonify(task_dict(task)),200
        else:
            return jsonify({"error":"Task is not found"}),404
    except Exception as e:
        return jsonify({"error":str(e)}),500
    
#kullanıcıya göre görevleri getirme(GET/users/<user_id>/tasks)
@task_bp.route('/users/<user_id>/tasks',methods=["GET"])
@swag_from({
    'tags': ['Tasks'],
    'summary': 'ID ile görev getir',
    'description': 'Belirtilen ID\'ye sahip görevleri getirir',
    'parameters': [
        {
            'name': 'user_id',
            'in': 'path',
            'type': 'string',
            'required': True,
            'description': 'User ID\'si'
        }
    ],
    'responses': {
        200: {
            'description': 'Task başarıyla getirildi',
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
            'description': 'Görev bulunamadı'
        }
    }

})
def get_user_tasks(user_id):
    try:
        tasks=get_task_by_user(user_id)
        return jsonify([task_dict(t) for t in tasks]),200
    except Exception as e:
        return jsonify({"error":str(e)}),500
    
#Görev Güncelleme(PUT/tasks/<task_id>)
@task_bp.route('/tasks/<task_id>',methods=["PUT"])
@swag_from({
    'tags': ['Tasks'],
    'summary': 'ID ile görev güncelle',
    'description': 'Belirtilen ID\'ye sahip görevleri günceller',
    'parameters': [
        {
            'name': 'task_id',
            'in': 'path',
            'type': 'string',
            'required': True,
            'description': 'Task ID\'si'
        },
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'title': {'type': 'string', 'description': 'Görev başlığı'},
                    'priority': {'type': 'string', 'description': 'Görevin öncelik sırası'},
                    'description': {'type': 'string', 'description': 'Görev açıklaması'},
                    'status':{'type':'string', 'description': 'Görev durumu'}
                }
            }
        }
    ],

    'responses': {
        200: {
            'description': 'Task başarıyla güncellendi',
            'schema': {
                'type': 'object',
                'properties': {
                    '_id': {'type': 'string'},
                    'user_id': {'type': 'string'},
                    'status': {'type': 'string'}
                }
            }
        },
        400: {
            'description': 'Geçersiz veri'
        },
        404: {
            'description': 'Görev bulunamadı'
        }
    }

})
def update_task_by_id(task_id):
    try:
        data=request.get_json()
        validated=TaskUpdateSchema().load(data)
        result=update_task(task_id, validated)
        if result.matched_count == 0:
            return jsonify({"error": "Task not found"}), 404
        if result.modified_count > 0:
            return jsonify({"message": "Task updated successfully"}), 200
        return jsonify({"message": "No changes were made"}), 200
    except ValidationError as ve:
        return jsonify({"error": ve.messages}), 400
    except Exception as e:
        return jsonify({"error": str(e)}),500

#Görev silme(DELETE/tasks/<task_id>)
@task_bp.route('/tasks/<task_id>',methods=["DELETE"])
@swag_from({
    'tags': ['Tasks'],
    'summary': 'ID ile görev sil',
    'description': 'Belirtilen ID\'ye sahip görevleri siler',
    'parameters': [
        {
            'name': 'task_id',
            'in': 'path',
            'type': 'string',
            'required': True,
            'description': 'Task ID\'si'
        }
    ],
    'responses': {
        200: {
            'description': 'Task başarıyla silindi',
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
            'description': 'Görev bulunamadı'
        }
    }

})
def delete_task_by_id(task_id):
    try:
        result=delete_task(task_id)
        if result.deleted_count == 0:
            return jsonify({"error": "Task not found"}), 404
        # HTTP 204 standardı gereği yanıt gövdesi boş olmalıdır.
        return ('', 204)
    except Exception as e:
        return jsonify({"error": str(e)}),500
    
#Görev tamamlandı yapma (POST/tasks/<task_id>/complete)
@task_bp.route('/tasks/<task_id>/completed',methods=["POST"])
@swag_from({
    'tags': ['Tasks'],
    'summary': 'Görevi tamamlandı olarak işaretle',
    'parameters': [
        {
            'name': 'task_id',
            'in': 'path',
            'type': 'string',
            'required': True,
            'description': 'Görev ID\'si'
        }
    ],
    'responses': {
        200: {'description': 'Görev tamamlandı olarak işaretlendi'},
        404: {'description': 'Görev bulunamadı'}
    }
})
def change_task_status(task_id):
    try:
        result=mark_task_completed(task_id)
        if result.matched_count == 0:
            return jsonify({"error":"Görev bulunamadı"}),404
        if result.modified_count > 0:
            return jsonify({"message":"Görev tamamlandı"}),200
        return jsonify({"message":"Görev zaten tamamlanmıştı"}),200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Duruma veya tarihe göre görevleri getirme (GET /tasks?status=done veya GET /tasks?date=2023-10-26)
@task_bp.route('/tasks', methods=["GET"])
@swag_from({
    'tags': ['Tasks'],
    'summary': 'Görevleri getir (filtreleme ile)',
    'description': 'Durum veya tarihe göre filtrelenmiş görevleri veya tüm görevleri listeler.',
    'parameters': [
        {
            'name': 'status',
            'in': 'query',
            'type': 'string',
            'required': False,
            'description': 'Filtrelenecek görev durumu (todo, in_progress, done)'
        },
        {
            'name': 'date',
            'in': 'query',
            'type': 'string',
            'required': False,
            'description': 'Filtrelenecek tarih (YYYY-MM-DD)'
        }
    ],
    'responses': {
        200: {'description': 'Görevler başarıyla getirildi'}
    }
})
def get_tasks_route():
    try:
        status = request.args.get('status')
        date_str = request.args.get('date')

        if status:
            tasks = get_task_by_status(status)
        elif date_str:
            start_date = datetime.strptime(date_str, '%Y-%m-%d')
            end_date = start_date.replace(hour=23, minute=59, second=59)
            tasks = get_task_by_date(start_date, end_date)
        else:
            tasks = get_tasks()  # Filtre yoksa tüm görevleri getir
        return jsonify([task_dict(t) for t in tasks]),200
    except Exception as e:
        return jsonify({"error": str(e)}), 500