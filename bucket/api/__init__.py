from flask import Blueprint

bp = Blueprint('api', __name__)

from bucket.api import routes