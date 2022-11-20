# Main blueprint

from flask import Blueprint

bp = Blueprint('main', __name__)

from flaskapp.blueprints.main import routes