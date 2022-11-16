from flask import Blueprint

bp = Blueprint('editor', __name__)

from bucket.editor import routes