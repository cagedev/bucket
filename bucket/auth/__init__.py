# Authentication blueprint

from flask import Blueprint

bp = Blueprint('auth', __name__)

from bucket.auth import routes