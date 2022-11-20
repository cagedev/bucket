from flask import Blueprint

bp = Blueprint('editor', __name__)

from flaskapp.blueprints.editor import routes