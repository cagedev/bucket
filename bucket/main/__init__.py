# Main blueprint

from flask import Blueprint

bp = Blueprint('main', __name__)

from bucket.main import routes