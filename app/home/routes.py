from pathlib import Path
from flask import render_template
from flask_login import login_required, current_user

from app.home import bp
from app.models import User, Snippet


@bp.route('/home', methods=['GET', 'POST'])
@login_required
def profile(user=current_user):
    return render_template('profile.html', user=user)


@bp.route('/snippets', methods=['GET', 'POST'])
@login_required
def snippets(user=current_user):
    snippets = Snippet.query.all()
    # snippets = [
    #     {
    #         'id':1,
    #         'description': 'Test snippet',
    #         'content': 'Lots of LaTeX data'
    #     },
    #     {
    #         'id':2,
    #         'description': 'Test snippet number 2',
    #         'content': 'A bit less LaTeX data'
    #     },
    # ]
    return render_template('snippets.html', snippets=snippets)
