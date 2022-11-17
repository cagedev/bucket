from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager

from app.config import Config

db = SQLAlchemy()
migrate = Migrate()
login = LoginManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    login.init_app(app)

    # app.redis = Redis.from_url(app.config['REDIS_URL'])
    # app.task_queue = rq.Queue(app.config['REDIS_QUEUE'], connection=app.redis)

    from app.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    from app.auth import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')

    from app.editor import bp as edit_bp
    app.register_blueprint(edit_bp, url_prefix='/editor')

    from app.main import bp as main_bp
    app.register_blueprint(main_bp)

    return app

from app import models