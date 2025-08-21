import os
from dotenv import load_dotenv
from flask import Flask,jsonify, send_from_directory 
from flask_cors import CORS
from routes.user_route import user_bp
from routes.plan_route import plan_bp
from routes.task_route import task_bp
from flasgger import Swagger, swag_from
from routes.project_route import project_bp
from routes.event_route import event_bp
from routes.reminder_route import reminder_bp
from routes.notification_route import notification_bp
from routes.userStats_route import user_stats_bp
from flask_jwt_extended import JWTManager
from routes.auth_route import auth_bp
from services.reminder_worker import start_reminder_scheduler
from routes.calendar_route import calendar_bp
from middleware import register_error_handler
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# .env dosyasındaki ortam değişkenlerini yükle
load_dotenv()

# Proje başlarken log klasörünün var olduğundan emin ol
os.makedirs('logs', exist_ok=True)

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "varsayilan-guclu-bir-anahtar") # Ortam değişkeninden oku
jwt = JWTManager(app)
# CORS konfigürasyonu
CORS(app)

# Hata yakalama middleware'i kaydet
register_error_handler(app)

limiter=Limiter(
    get_remote_address,
    app=app,
    default_limits=["100 per hour"], #tüm api için varsayılan limit
    # Geliştirme ortamında Redis zorunlu olmasın diye bu satırı yorumla.
    # storage_uri="redis://localhost:6379" 
)


# Swagger konfigürasyonu
swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'apispec_1',
            "route": '/apispec_1.json',
            "rule_filter": lambda rule: True,
            "model_filter": lambda tag: True,
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/apidocs/"
}

swagger_template = {
    "swagger": "2.0",
    "info": {
        "title": "Remote Work Assistant API",
        "description": "Remote Work Assistant için REST API",
        "version": "1.0.0",
        "contact": {
            "name": "API Support",
            "email": "support@example.com"
        }
    },
    "host": "127.0.0.1:5002",
    "basePath": "/",
    "schemes": ["http"]
}

swagger = Swagger(app, config=swagger_config, template=swagger_template)

app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(plan_bp, url_prefix='/api')
app.register_blueprint(task_bp, url_prefix='/api')
app.register_blueprint(project_bp, url_prefix='/api')
app.register_blueprint(event_bp, url_prefix='/api')
app.register_blueprint(reminder_bp, url_prefix='/api')
app.register_blueprint(notification_bp, url_prefix='/api')
app.register_blueprint(user_stats_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth') # auth rotaları için daha spesifik
app.register_blueprint(calendar_bp, url_prefix='/api/calendar') # calendar rotaları için daha spesifik

# Serve uploaded files (e.g., avatars)
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    upload_root = os.path.join(os.getcwd(), 'uploads')
    return send_from_directory(upload_root, filename)

if __name__ == "__main__":
    # Loglamayı, diğer kütüphaneler müdahale etmeden önce yapılandır
    import logging
    logging.basicConfig(level=logging.INFO)

    # Arka plan zamanlayıcısını başlat
    start_reminder_scheduler()
    # Flask uygulamasını çalıştır
    app.run(host="127.0.0.1", debug=True, port=5002)
