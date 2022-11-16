from flask import Blueprint

bp = Blueprint('editor', __name__)

from app.editor import routes