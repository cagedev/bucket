from flask import Blueprint

bp = Blueprint('api', __name__)

from flaskapp.blueprints.api import routes