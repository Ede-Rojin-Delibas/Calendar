from flask import jsonify
import traceback
import logging

#logs dosyasına kaydetme
logging.basicConfig(filename='error.log',level=logging.ERROR)

def register_error_handler(app):
    @app.errorhandler(Exception)
    def handle_exception(e):
        #hata loglama
        logging.error(f"Exception: {str(e)}\n{traceback.format_exc()}")

        #API yanıtı olarak kullanıcıya dön
        response={
            "success": False,
            "message": "Bir hata oluştu",
            "error":str(e)
        }

        return jsonify(response), 500
