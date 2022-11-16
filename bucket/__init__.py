from flask import Flask
# from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate

# from bucket.config import Config

# db = SQLAlchemy()
# migrate = Migrate()

# def create_app(config_class=Config):
def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'secret'

    # db.init_app(app)
    # migrate.init_app(app, db)

    # app.redis = Redis.from_url(app.config['REDIS_URL'])
    # app.task_queue = rq.Queue(app.config['REDIS_QUEUE'], connection=app.redis)

    from bucket.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    from bucket.auth import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')

    from bucket.editor import bp as edit_bp
    app.register_blueprint(edit_bp, url_prefix='/editor')

    from bucket.main import bp as main_bp
    app.register_blueprint(main_bp)

    return app
