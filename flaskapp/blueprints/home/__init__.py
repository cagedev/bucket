# Home blueprint

from flask import Blueprint

bp = Blueprint('home', __name__)

from flaskapp.blueprints.home import routes