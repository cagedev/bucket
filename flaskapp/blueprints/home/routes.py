from pathlib import Path
from flask import render_template
from flask_login import login_required, current_user

from flaskapp.blueprints.home import bp
from flaskapp.models import User, Snippet, Tag


@bp.route('/home', methods=['GET', 'POST'])
@login_required
def profile(user=current_user):
    return render_template('profile.html', user=user)


@bp.route('/snippets', defaults={'tag_name': None}, methods=['GET', 'POST'])
@bp.route('/snippets/<tag_name>', methods=['GET', 'POST'])
@login_required
def snippets(tag_name, user=current_user):
    if tag_name == None:
        snippets = Snippet.query.all()
    else:
        snippets = Tag.query.filter_by(name=tag_name).first().snippets
    return render_template('snippets.html', snippets=snippets)
