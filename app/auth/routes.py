from flask import render_template, redirect

from app.auth import bp
from app.auth.forms import LoginForm


@bp.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()

    # TODO: Authentication
    if form.validate_on_submit():
        return redirect(f'/?user={form.username.data}')

    return render_template('login.html', form=form)
