from pathlib import Path
from flask import render_template

from bucket.main import bp


@bp.route('/', methods=['GET', 'POST'])
def index():
    # dummy user
    user = {'username': 'Johnny'}
    return render_template('index.html', user=user)
