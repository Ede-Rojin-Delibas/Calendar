from flask import request, jsonify, Blueprint
from flasgger import swag_from
from models.enum import Status, Priority
from services.project_service import *
from models.task_model import task_dict
from models.project_model import project_dict
from bson import ObjectId
from services.task_service import *
from schemas.project_schema import *
from marshmallow import ValidationError

project_bp= Blueprint('project', __name__)

@project_bp.route('/projects', methods=['POST'])
@swag_from({
    'tags':['Projects'],
    'summary':'Yeni bir proje oluştur',
    'description':'Sistemde kullanıcı için yeni bir proje oluşturur',
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
                        'description': 'Proje adı'
                    },
                    'category':{
                        'type':'string',
                        'description':'Proje kategorisi'
                    },
                    'stakeholders':{
                        'type':'array',
                        'description':'Proje paydaşları',
                        'items':{
                            'type':'ObjectId',
                            'description':"Kullanıcı ID'si"
                        }
                    },  
                    'team_members':{
                        'type':'array',
                        'description':'Proje ekip üyeleri',
                        'items':{
                            'type':'ObjectId',
                            'description':"Kullanıcı ID'si"
                        }
                    },
                    'user_id':{
                        'type':'ObjectId',
                        'description':"Kullanıcı ID'si"
                    },
                    'start_time':{
                        'type':'string',
                        'format':'date-time',
                        'description':'Başlangıç tarihi'
                    },
                    'deadline':{
                        'type':'string',
                        'format':'date-time',
                        'description':'Bitiş tarihi'
                    },
                    'progress':{
                        'type':'number',
                        'description':'Proje ilerleme yüzdesi'
                    },
                    'priority':{
                        'type':'string',
                        'description':'Proje öncelik sırası'
                    },
                    'description':{
                        'type':'string',
                        'description':'Proje açıklaması'
                    }

                },
                    'required':['name', 'user_id','description','priority', 'category', 'stakeholders', 'team_members', 'start_time', 'deadline', 'progress']
            }
                
        }
        ],
    'responses':{
        201:{
            'description':'Proje başarıyla oluşturuldu',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'},
                    'project_id': {'type': 'string'}
                }
            }
        },
        400:{
            'description':'Geçersiz veri'
        }
    }
})
def create_project():
    try:
        data = request.get_json()
        validated = ProjectCreateSchema().load(data)
        project_id = create(validated)
        return jsonify({"message":"Project created", "project_id":project_id}),201
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    except Exception as e:
        return jsonify({"error":str(e)}),500 


@project_bp.route('/projects', methods=['GET'])
@swag_from({
    'tags':['Projects'],
    'summary':'Tüm projeleri getir',
    'description':'Sistemdeki tüm projeleri listeler',
    'responses':{
        200:{
            'description':'Projeler başarıyla listelendi',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        '_id': {'type': 'string'},
                        'name': {'type': 'string'},
                        'category': {'type': 'string'},
                        'stakeholders': {'type': 'array', 'items': {'type': 'string'}},
                        'team_members': {'type': 'array', 'items': {'type': 'string'}},
                        'user_id': {'type': 'string'},
                        'start_time': {'type': 'string', 'format': 'date-time'},
                        'deadline': {'type': 'string', 'format': 'date-time'},
                        'progress': {'type': 'number'},
                        'priority': {'type': 'string'},
                        'description': {'type': 'string'},
                        'status': {'type': 'string'}
                    }
                }
            }
        },
        500:{
            'description':'Sunucu hatası'
        }
    }
})  
def get_projects_route():
    try:
        projects = get_projects()
        return jsonify([project_dict(project) for project in projects]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@project_bp.route('/projects/<project_id>', methods=['GET'])
@swag_from({
    'tags':['Projects'],
    'summary':'Proje ID ile proje getir',
    'description':'Belirtilen proje ID\'sine sahip projeyi getirir',
    'parameters':[
        {
            'name': 'project_id',
            'in': 'path',
            'required': True,
            'type': 'string',
            'description': 'Proje ID'
        }
    ],
    'responses':{
        200:{
            'description':'Proje başarıyla getirildi',
            'schema': {
                'type': 'object',
                'properties': {
                    '_id': {'type': 'string'},
                    'name': {'type': 'string'},
                    'category': {'type': 'string'},
                    'stakeholders': {'type': 'array', 'items': {'type': 'string'}},
                    'team_members': {'type': 'array', 'items': {'type': 'string'}},
                    'user_id': {'type': 'string'},
                    'start_time': {'type': 'string', 'format': 'date-time'},
                    'deadline': {'type': 'string', 'format': 'date-time'},
                    'progress': {'type': 'number'},
                    'priority': {'type': 'string'},
                    'description': {'type': 'string'},
                    'status': {'type': 'string'}
                }
            }
        },
        404:{
            'description':'Proje bulunamadı'
        },
        500:{
            'description':'Sunucu hatası'
        }
    }
})
def get_project_by_id(project_id):
    try:
        project = get_project(project_id)
        if not project:
            return jsonify({"error": "Project not found"}), 404
        return jsonify(project_dict(project)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500  


@project_bp.route('/projects/<project_id>', methods=['PUT'])
@swag_from({
    'tags':['Projects'],
    'summary':'Proje güncelle',
    'description':'Belirtilen proje ID\'sine sahip projeyi günceller',
    'parameters':[
        {
            'name': 'project_id',
            'in': 'path',
            'required': True,
            'type': 'string',
            'description': 'Proje ID'
        },
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'name': {'type': 'string', 'description': 'Proje Adı'},
                    'category': {'type': 'string', 'description': 'Proje Kategorisi'},
                    'stakeholders': {
                        'type': 'array',
                        'items': {
                            'type': 'string',
                            'description': 'Paydaş ID\'si'
                        }
                    },
                    'team_members': {
                        'type': 'array',
                        'items': {
                            'type': 'string',
                            'description': 'Ekip Üyesi ID\'si'
                        }
                    },
                    'user_id': {'type': 'string', 'description': 'Kullanıcı ID'},
                    'start_time': {'type': 'string', 'format': 'date-time', 'description': 'Başlangıç tarihi'},
                    'deadline': {'type': 'string', 'format': 'date-time', 'description': 'Bitiş tarihi'},
                    'progress': {'type': 'number', 'description': 'Proje ilerleme yüzdesi'},
                    'priority': {'type': 'string', 'description': 'Proje öncelik sırası'},
                    'description': {'type': 'string', 'description': 'Proje açıklaması'},
                    'status':{'type':'string', 'description': 'Proje durumu'}
                }
            }
        }
    ],
    'responses':{
        200:{
            'description':'Proje başarıyla güncellendi'
        },
        404:{
            'description':'Proje bulunamadı'
        },
        500:{
            'description':'Sunucu hatası'
        }
    }
})
def update_project_route(project_id):
    try:
        data = request.get_json()
        validated_data = ProjectUpdateSchema().load(data)

        result = update_project(project_id, validated_data) # Artık PyMongo result nesnesi dönüyor
        if result.matched_count == 0:
            return jsonify({"error": "Project not found"}), 404
        if result.modified_count == 0:
            return jsonify({"message": "No changes were made"}), 200

        return jsonify({"message": "Project updated successfully"}), 200
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@project_bp.route('/projects/<project_id>', methods=['DELETE'])
@swag_from({
    'tags':['Projects'],
    'summary':'Proje sil',
    'description':'Belirtilen proje ID\'sine sahip projeyi siler',
    'parameters':[
        {
            'name': 'project_id',
            'in': 'path',
            'required': True,
            'type': 'string',
            'description': 'Proje ID'
        }
    ],
    'responses':{
        200:{
            'description':'Proje başarıyla silindi'
        },
        404:{
            'description':'Proje bulunamadı'
        },
        500:{
            'description':'Sunucu hatası'
        }
    }
})
def delete_project_route(project_id):
    try:
        result = delete_project(project_id)
        if result.deleted_count == 0:
            return jsonify({"error": "Project not found"}), 404
        return ('', 204)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@project_bp.route('/projects/<project_id>/tasks', methods=['POST'])
@swag_from({
    'tags':['Projects'],
    'summary':'Proje ID ile göreve ekle',
    'description':'Belirtilen proje ID\'sine sahip projeye yeni görev ekler',
    'parameters':[
        {
            'name': 'project_id',
            'in': 'path',
            'required': True,
            'type': 'string',
            'description': 'Proje ID'
        },
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'task': {
                        'type': 'object',
                        'properties': {
                            'title': {'type': 'string', 'description': 'Görev başlığı'},
                            'priority': {'type': 'string', 'description': 'Görevin öncelik sırası'},
                            'description': {'type': 'string', 'description': 'Görev açıklaması'},
                            'status': {'type':'string', 'description': "Görev durumu"}
                        }
                    }
                }
            }
        }
    ],
    'responses':{
        201:{
            'description':'Görev başarıyla eklendi',
            'schema': {
                'type': 'object',
                'properties': {
                    "message": {"type": "string"},
                    "task_id": {"type": "string"}
                }
            }
        },
        400:{
            "description":"Eksik görev verisi"
        },
        500:{
            "description":"Sunucu hatası"
        }
    }
})
def add_task_to_project_route(project_id):
    try:
        data = request.get_json()
        if not data or "task" not in data:
            return jsonify({"error": "Missing task data"}), 400
        task_id = add_task_to_project(project_id, data["task"])
        return jsonify({"message": "Task added to project", "task_id": task_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@project_bp.route('/projects/<project_id>/tasks/<task_id>', methods=['DELETE']) 
@swag_from({
    'tags':['Projects'],
    'summary':'Proje ID ile görev sil',
    'description':'Belirtilen proje ID\'sine sahip projeden görevi siler',
    'parameters':[
        {
            'name': 'project_id',
            'in': 'path',
            'required': True,
            'type': 'string',
            'description': 'Proje ID'
        },
        {
            'name': 'task_id',
            'in': 'path',
            'required': True,
            'type': 'string',
            'description': 'Görev ID'
        }
    ],
    'responses':{
        200:{
            'description':'Görev başarıyla silindi'
        },
        404:{
            'description':'Görev bulunamadı'
        },
        500:{
            'description':'Sunucu hatası'
        }
    }
})
def delete_task_from_project(project_id, task_id):
    try:
        result = remove_task_from_project(project_id, task_id)
        if result.modified_count == 0:
            return jsonify({"error": "Task not found in project or already removed"}), 404
        return ('', 204)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@project_bp.route('/projects/users/<user_id>', methods=['GET'])
@swag_from({
    'tags':['Projects'],
    'summary':'Kullanıcı ID ile projeleri getir',
    'description':'Belirtilen kullanıcı ID\'sine sahip projeleri getirir',
    'parameters':[
        {
            'name': 'user_id',
            'in': 'path',
            'required': True,
            'type': 'string',
            'description': 'Kullanıcı ID'
        }
    ],
    'responses':{
        200:{
            'description':'Projeler başarıyla listelendi',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        '_id': {'type': 'string'},
                        'name': {'type': 'string'},
                        'category': {'type': 'string'},
                        'stakeholders': {'type': 'array', 'items': {'type': 'string'}},
                        'team_members': {'type': 'array', 'items': {'type': 'string'}},
                        'user_id': {'type': 'string'},
                        'start_time': {'type': 'string', 'format': 'date-time'},
                        'deadline': {'type': 'string', 'format': 'date-time'},
                        'progress': {'type': 'number'},
                        'priority': {'type': 'string'},
                        'description': {'type': 'string'},
                        'status': {'type': 'string'}
                    }
                }
            }
        },
        404:{
            'description':'Kullanıcıya ait proje bulunamadı'
        },
        500:{
            'description':'Sunucu hatası'
        }
    }
})
def get_projects_by_user_route(user_id):
    try:
        projects = get_projects_by_user(user_id)
        if not projects:
            return jsonify({"error": "No projects found for this user"}), 404
        return jsonify([project_dict(project) for project in projects]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@project_bp.route('/projects/status/<status>', methods=['GET'])
@swag_from({
    'tags':['Projects'],
    'summary':'Proje durumuna göre projeleri getir',
    'description':'Belirtilen duruma sahip projeleri getirir',
    'parameters':[
        {
            'name': 'status',
            'in': 'path',
            'required': True,
            'type': 'string',
            'description': 'Proje durumu'
        }
    ],
    'responses':{
        200:{
            'description':'Projeler başarıyla listelendi',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        '_id': {'type': 'string'},
                        'name': {'type': 'string'},
                        'category': {'type': 'string'},
                        'stakeholders': {'type': 'array', 'items': {'type': 'string'}},
                        'team_members': {'type': 'array', 'items': {'type': 'string'}},
                        'user_id': {'type': 'string'},
                        'start_time': {'type': 'string', 'format': 'date-time'},
                        'deadline': {'type': 'string', 'format': 'date-time'},
                        'progress': {'type': 'number'},
                        'priority': {'type': 'string'},
                        'description': {'type': 'string'},
                        'status': {'type': 'string'}
                    }
                }
            }
        },
        400:{
            'description':'Geçersiz durum'
        },
        404:{
            'description':'Duruma ait proje bulunamadı'
        },
        500:{
            'description':'Sunucu hatası'
        }
    }
})
def get_projects_by_status_route(status):
    try:
        if status not in [s.value for s in Status]:
            return jsonify({"error": "Invalid status"}), 400
        projects = get_projects_by_status(status)
        if not projects:
            return jsonify({"error": "No projects found with this status"}), 404
        return jsonify([project_dict(project) for project in projects]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@project_bp.route('/projects/date', methods=['GET'])
@swag_from({
    'tags':['Projects'],
    'summary':'Tarih aralığına göre projeleri getir',
    'description':'Belirtilen tarih aralığında olan projeleri getirir',
    'parameters':[
        {
            'name': 'start',
            'in': 'query',
            'required': True,
            'type': 'string',
            'format': 'date-time',
            'description': 'Başlangıç tarihi'
        },
        {
            'name': 'end',
            'in': 'query',
            'required': True,
            'type': 'string',
            'format': 'date-time',
            'description': 'Bitiş tarihi'
        }
    ],
    'responses':{
        200:{
            'description':'Projeler başarıyla listelendi',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        '_id': {'type': 'string'},
                        'name': {'type': 'string'},
                        'category': {'type': 'string'},
                        'stakeholders': {'type': 'array', 'items': {'type': 'string'}},
                        'team_members': {'type': 'array', 'items': {'type': 'string'}},
                        'user_id': {'type': 'string'},
                        'start_time': {'type': 'string', 'format': 'date-time'},
                        'deadline': {'type': 'string', 'format': 'date-time'},
                        'progress': {'type': 'number'},
                        'priority': {'type': 'string'},
                        'description': {'type': 'string'},
                        'status': {'type': 'string'}
                    }
                }
            }
        },
        404:{
            'description':'Tarih aralığında proje bulunamadı'
        },
        500:{
            'description':'Sunucu hatası'
        }
    }
})
def get_projects_by_date_route():
    try:
        start = request.args.get('start')
        end = request.args.get('end')
        projects = get_projects_by_date(start,end)
        if not projects:
            return jsonify({"error": "No projects found for this date"}), 404
        return jsonify([project_dict(project) for project in projects]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@project_bp.route('/projects/<project_id>/status', methods=['PUT'])
@swag_from({
    'tags':['Projects'],
    'summary':'Proje durumunu güncelle',
    'description':'Belirtilen proje ID\'sine sahip projenin durumunu günceller',
    'parameters':[
        {
            'name': 'project_id',
            'in': 'path',
            'required': True,
            'type': 'string',
            'description': 'Proje ID'
        },
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'status': {'type': 'string', 'description': 'Yeni proje durumu'}
                }
            }
        }
    ],
    'responses':{
        200:{
            'description':'Proje durumu başarıyla güncellendi'
        },
        404:{
            'description':'Proje bulunamadı'
        },
        400:{
            "description":"Eksik durum verisi"
        },
        500:{
            "description":"Sunucu hatası"
        }
    }
})
def mark_project_status(project_id):
    try:
        data = request.get_json()
        validated = StatusUpdateSchema().load(data)
        # Genel güncelleme servisini kullanarak sadece status alanını güncelle
        result = update_project(project_id, {"status": validated['status']})
        if result.matched_count == 0:
            return jsonify({"error": "Project not found"}), 404
        if result.modified_count > 0:
            return jsonify({"message": "Project status updated successfully"}), 200
        return jsonify({"message": "No changes were made"}), 200
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@project_bp.route('/projects/<project_id>/tasks', methods=['GET'])
@swag_from({
    'tags':['Projects'],
    'summary':'Proje ID ile projeye ait görevleri getir',
    'description':'Belirtilen proje ID\'sine sahip projedeki görevleri getirir',
    'parameters':[
        {
            'name': 'project_id',
            'in': 'path',
            'required': True,
            'type': 'string',
            'description': 'Proje ID'
        }
    ],
    'responses':{
        200:{
            'description':'Görevler başarıyla listelendi',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        '_id': {'type': 'string'},
                        'title': {'type': 'string'},
                        'priority': {'type': 'string'},
                        'description': {'type': 'string'},
                        'status': {'type': 'string'},
                        'user_id': {'type': 'string'},
                        'created_at': {'type': 'string', 'format': 'date-time'}
                    }
                }
            }
        },
        404:{
            'description':'Projeye ait görev bulunamadı'
        },
        500:{
            'description':'Sunucu hatası'
        }
    }
})
def get_tasks_by_project_route(project_id):
    try:
        tasks=get_tasks_by_project_id(project_id)
        if not tasks:
            return jsonify({"error": "No tasks found for this project"}), 404
        return jsonify([task_dict(task) for task in tasks]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@project_bp.route('/projects/priority/<priority>', methods=['GET'])
@swag_from({
    'tags':['Projects'],
    'summary':'Proje önceliğine göre projeleri getir',
    'description':'Belirtilen önceliğe sahip projeleri getirir',
    'parameters':[
        {
            'name': 'priority',
            'in': 'path',
            'required': True,
            'type': 'string',
            'description': 'Proje önceliği'
        }
    ],
    'responses':{
        200:{
            'description':'Projeler başarıyla listelendi',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        '_id': {'type': 'string'},
                        'name': {'type': 'string'},
                        'category': {'type': 'string'},
                        'stakeholders': {'type': 'array', 'items': {'type': 'string'}},
                        'team_members': {'type': 'array', 'items': {'type': 'string'}},
                        'user_id': {'type': 'string'},
                        'start_time': {'type': 'string', 'format': 'date-time'},
                        'deadline': {'type': 'string', 'format': 'date-time'},
                        'progress': {'type': 'number'},
                        'priority': {'type': 'string'},
                        'description': {'type': 'string'},
                        'status': {'type': 'string'}
                    }
                }
            }
        },
        400:{
            'description':'Geçersiz öncelik'
        },
        404:{
            'description':'Önceliğe ait proje bulunamadı'
        },
        500:{
            'description':'Sunucu hatası'
        }
    }
})
def get_projects_by_priority_route(priority):
    try:
        if priority not in [p.value for p in Priority]:
            return jsonify({"error": "Invalid priority"}), 400
        projects = get_projects_by_priority(priority)
        if not projects:
            return jsonify({"error": "No projects found with this priority"}), 404
        return jsonify([project_dict(project) for project in projects]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@project_bp.route('/projects/income/<income>', methods=['GET']) 
@swag_from({
    'tags':['Projects'],
    'summary':'Gelire göre projeleri getir',
    'description':'Belirtilen gelire sahip projeleri getirir',
    'parameters':[
        {
            'name': 'income',
            'in': 'path',
            'required': True,
            'type': 'number',
            'description': 'Proje geliri'
        }
    ],
    'responses':{
        200:{
            'description':'Projeler başarıyla listelendi',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        '_id': {'type': 'string'},
                        'name': {'type': 'string'},
                        'category': {'type': 'string'},
                        'stakeholders': {'type': 'array', 'items': {'type': 'string'}},
                        'team_members': {'type': 'array', 'items': {'type': 'string'}},
                        'user_id': {'type': 'string'},
                        'start_time': {'type': 'string', 'format': 'date-time'},
                        'deadline': {'type': 'string', 'format': 'date-time'},
                        'progress': {'type': 'number'},
                        'priority': {'type': 'string'},
                        'description': {'type': 'string'},
                        'status': {'type': 'string'}
                    }
                }
            }
        },
        404:{
            'description':'Gelire ait proje bulunamadı'
        },
        500:{
            'description':'Sunucu hatası'
        }
    }
})
def get_projects_by_income_route(income):
    try:
        projects = get_projects_by_income(income)
        if not projects:
            return jsonify({"error": "No project found with this income"}), 404
        return jsonify([project_dict(project) for project in projects]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@project_bp.route('/projects/<project_id>/progress', methods=['GET'])
@swag_from({
    'tags':['Projects'],
    'summary':'Proje ilerlemesini getir',
    'description':'Belirtilen proje ID\'sine sahip projenin ilerleme yüzdesini getirir',
    'parameters':[
        {
            'name': 'project_id',
            'in': 'path',
            'required': True,
            'type': 'string',
            'description': 'Proje ID'
        }
    ],
    'responses':{
        200:{
            'description':'Proje ilerlemesi başarıyla getirildi',
            'schema': {
                'type': 'object',
                'properties': {
                    'progress': {'type': 'number', 'description': 'Proje ilerleme yüzdesi'}
                }
            }
        },
        404:{
            'description':'Proje bulunamadı'
        },
        500:{
            'description':'Sunucu hatası'
        }
    }
})
def get_project_progress_route(project_id):
    try:
        progress = get_project_progress(project_id)
        if progress is None:
            return jsonify({"error": "Project not found"}), 404
        return jsonify({"progress": progress}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@project_bp.route('/projects/<project_id>/team_members', methods=['POST'])
@swag_from({
    'tags':['Projects'],
    'summary':'Proje ID ile ekip üyeleri ekle',
    'description':'Belirtilen proje ID\'sine sahip projeye ekip üyeleri ekler',
    'parameters':[
        {
            'name': 'project_id',
            'in': 'path',
            'required': True,
            'type': 'string',
            'description': 'Proje ID'
        },
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'team_members': {
                        'type': 'array',
                        'items': {
                            'type': 'string',
                            'description': "Kullanıcı ID'si"
                        }
                    }
                }
            }
        }
    ],
    'responses':{
        201:{
            'description':'Ekip üyeleri başarıyla eklendi',
            'schema': {
                'type': 'object',
                'properties': {
                    "message": {"type": "string"},
                    "team_members": {"type": "array", "items": {"type": "string"}}
                }
            }
        },
        400:{
            "description":"Eksik ekip üyeleri verisi"
        },
        500:{
            "description":"Sunucu hatası"
        }
    }
})
def add_team_members_to_project(project_id):
    try:
        data = request.get_json()
        validated = TeamMemberSchema().load(data)
        updated_project = add_team_member_to_project(project_id, validated["team_members"])
        if not updated_project:
            return jsonify({"error": "Project not found or could not be updated"}), 404
        return jsonify({"message": "Team members added to project", "project": project_dict(updated_project)}), 200
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@project_bp.route('/projects/<project_id>/team_members', methods=['DELETE'])
@swag_from({
    'tags':['Projects'],
    'summary':'Proje ID ile ekip üyeleri sil',
    'description':'Belirtilen proje ID\'sine sahip projeden ekip üyelerini siler',
    'parameters':[
        {
            'name': 'project_id',
            'in': 'path',
            'required': True,
            'type': 'string',
            'description': 'Proje ID'
        },
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'team_members': {
                        'type': 'array',
                        'items': {
                            'type': 'string',
                            'description': "Kullanıcı ID'si"
                        }
                    }
                }
            }
        }
    ],
    'responses':{
        200:{
            'description':'Ekip üyeleri başarıyla silindi',
            'schema': {
                'type': 'object',
                'properties': {
                    "message": {"type": "string"},
                    "team_members": {"type": "array", "items": {"type": "string"}}
                }
            }
        },
        400:{
            "description":"Eksik ekip üyeleri verisi"
        },
        500:{
            "description":"Sunucu hatası"
        }
    }
})
def remove_team_members_from_project(project_id):   
    try:
        data = request.get_json()
        # Gelen verinin bir liste olduğunu varsayarak şemayı güncelleyelim
        # veya doğrudan kullanalım. Şimdilik doğrudan kullanıyoruz.
        validated = TeamMemberSchema().load(data) # Bu şema tek bir üye mi bekliyor, liste mi?
        result = remove_team_member_from_project(project_id, validated["team_members"])
        if result.modified_count == 0:
            return jsonify({"error": "Team members not found on project or already removed"}), 404
        return ('', 204)
    except ValidationError as e:    
        return jsonify({"error": e.messages}), 400  
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@project_bp.route('/projects/<project_id>/stakeholders', methods=['POST'])
@swag_from({
    'tags':['Projects'],
    'summary':'Proje ID ile paydaş ekle',
    'description':'Belirtilen proje ID\'sine sahip projeye paydaş ekler',
    'parameters':[
        {
            'name': 'project_id',
            'in': 'path',
            'required': True,
            'type': 'string',
            'description': 'Proje ID'
        },
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'stakeholders': {
                        'type': 'array',
                        'items': {
                            'type': 'string',
                            'description': "Kullanıcı ID'si"
                        }
                    }
                }
            }
        }
    ],
    'responses':{
        201:{
            'description':'Paydaşlar başarıyla eklendi',
            'schema': {
                'type': 'object',
                'properties': {
                    "message": {"type": "string"},
                    "stakeholders": {"type": "array", "items": {"type": "string"}}
                }
            }
        },
        400:{
            "description":"Eksik paydaş verisi"
        },
        500:{
            "description":"Sunucu hatası"
        }
    }
})
def add_stakeholders_to_project(project_id):
    try:
        data = request.get_json()
        validated=StakeholderSchema().load(data)
        updated_project = add_stakeholder_to_project(project_id, validated["stakeholders"])
        return jsonify({"message": "Stakeholders added to project", "project": project_dict(updated_project)}), 200
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@project_bp.route('/projects/<project_id>/stakeholders', methods=['DELETE'])
@swag_from({
    'tags':['Projects'],
    'summary':'Proje ID ile paydaş sil',
    'description':'Belirtilen proje ID\'sine sahip projeden paydaşları siler',
    'parameters':[
        {
            'name': 'project_id',
            'in': 'path',
            'required': True,
            'type': 'string',
            'description': 'Proje ID'
        },
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'stakeholders': {
                        'type': 'array',
                        'items': {
                            'type': 'string',
                            'description': "Kullanıcı ID'si"
                        }
                    }
                }
            }
        }
    ],
    'responses':{
        200:{
            'description':'Paydaşlar başarıyla silindi',
            'schema': {
                'type': 'object',
                'properties': {
                    "message": {"type": "string"},
                    "stakeholders": {"type": "array", "items": {"type": "string"}}
                }
            }
        },
        400:{
            "description":"Eksik paydaş verisi"
        },
        500:{
            "description":"Sunucu hatası"
        }
    }
})
def remove_stakeholders_from_project(project_id):
    try:
        data = request.get_json()
        validated = StakeholderSchema().load(data)
        result = remove_stakeholder_from_project(project_id, validated["stakeholders"])
        if result.modified_count == 0:
            return jsonify({"error": "Stakeholders not found on project or already removed"}), 404
        return ('', 204)
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@project_bp.route('/projects/category/<category>', methods=['GET'])
@swag_from({
    'tags':['Projects'],
    'summary':'Kategoriye göre projeleri getir',
    'description':'Belirtilen kategoriye ait projeleri getirir',
    'parameters':[
        {
            'name': 'category',
            'in': 'path',
            'required': True,
            'type': 'string',
            'description': 'Proje kategorisi'
        }
    ],
    'responses':{
        200:{
            'description':'Projeler başarıyla listelendi',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        '_id': {'type': 'string'},
                        'name': {'type': 'string'},
                        'category': {'type': 'string'},
                        'stakeholders': {'type': 'array', 'items': {'type': 'string'}},
                        'team_members': {'type': 'array', 'items': {'type': 'string'}},
                        'user_id': {'type': 'string'},
                        'start_time': {'type': 'string', 'format': 'date-time'},
                        'deadline': {'type': 'string', 'format': 'date-time'},
                        'progress': {'type': 'number'},
                        'priority': {'type': 'string'},
                        'description': {'type': 'string'},
                        'status': {'type': 'string'}
                    }
                }
            }
        },
        404:{
            'description':'Kategoriye ait proje bulunamadı'
        },
        500:{
            'description':'Sunucu hatası'
        }
    }
})
def get_projects_by_category_route(category):
    try:
        projects = get_projects_by_category(category)
        if not projects:
            return jsonify({"error": "No projects found in this category"}), 404
        return jsonify([project_dict(project) for project in projects]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@project_bp.route('/projects/search', methods=['GET'])
@swag_from({
    'tags':['Projects'],
    'summary':'Proje ismine göre projeleri ara',
    'description':'Belirtilen isimle eşleşen projeleri getirir',
    'parameters':[
        {
            'name': 'name',
            'in': 'query',
            'required': True,
            'type': 'string',
            'description': 'Proje ismi'
        }
    ],
    'responses':{
        200:{
            'description':'Projeler başarıyla listelendi',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        '_id': {'type': 'string'},
                        'name': {'type': 'string'},
                        'category': {'type': 'string'},
                        'stakeholders': {'type': 'array', 'items': {'type': 'string'}},
                        'team_members': {'type': 'array', 'items': {'type': 'string'}},
                        'user_id': {'type': 'string'},
                        'start_time': {'type': 'string', 'format': 'date-time'},
                        'deadline': {'type': 'string', 'format': 'date-time'},
                        'progress': {'type': 'number'},
                        'priority': {'type': 'string'},
                        'description': {'type': 'string'},
                        'status': {'type': 'string'}
                    }
                }
            }
        },
        400:{
            "description":"Eksik isim parametresi"
        },
        404:{
            "description":"Bu isimle eşleşen proje bulunamadı"
        },
        500:{
            "description":"Sunucu hatası"
        }
    }
})
def search_projects_by_name():
    name = request.args.get('name')
    if not name:
        return jsonify({"error": "Name parameter is required"}), 400
    try:
        projects = get_project_by_name(name)
        if not isinstance(projects, list):
            return jsonify({"error": "Internal error: projects is not a list"}), 500
        if not projects:
            return jsonify({"error": "No projects found with this name"}), 404
        return jsonify([project_dict(project) for project in projects]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
