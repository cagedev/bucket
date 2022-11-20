# Authentication blueprint

from flask import Blueprint

bp = Blueprint('auth', __name__)

from flaskapp.blueprints.auth import routes