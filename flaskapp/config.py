class Config(object):
    SECRET_KEY = 'secret'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///../instance/db.sqlite'
    SQLALCHEMY_TRACK_MODIFICATIONS = False