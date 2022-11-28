import docker
from datetime import datetime
from pathlib import Path
from uuid import uuid4
from flask import render_template, url_for, redirect, request
from flask_login import login_required, current_user

from flaskapp import db
from flaskapp.blueprints.editor import bp
from flaskapp.blueprints.editor.forms import LatexEditorForm, SnippetEditorForm
from flaskapp.models import Snippet, Tag

# TODO: Setup paths in config
# TODO: Use instance object to overwrite
# TODO: Allow admin to edit in dashboard
# TODO: Create admin dashboard
INSTANCE_DIR = Path('.', 'instance')
TEMPLATE_DIR = Path(INSTANCE_DIR, 'test')

USERDATA_DIR = Path(INSTANCE_DIR, 'userdata')
BUILD_DIR = Path(USERDATA_DIR, 'build')

snippet_template = """\subsection*{Math}
\\begin{displaymath}
  \int_0^\infty e^{-st}f(t)dt
\end{displaymath}"""


@bp.route('/latex_editor', methods=['GET', 'POST'])
def latex_editor():
    user = {'username': 'Johnny'}
    snippet_id = 8
    snippet = Snippet.query.get(snippet_id)
    form = LatexEditorForm()
    if request.method == 'GET':
        return render_template('latex_editor.html', form=form, user=user, snippet=snippet)
    if request.method == 'POST':
        return f'{request.form}'


# TODO: Split into editor (editor blueprint) route and submithandler (api route)
@bp.route('/latex_editor_flask', methods=['GET', 'POST'])
def latex_editor_flask():
    form = LatexEditorForm()
    user = {'username': 'Johnny'}
    if request.method == 'GET':
        return render_template('editor.html', form=form, user=user)
    if request.method == 'POST':
        # create temporary directory
        _dir = str(uuid4())
        build_dir = Path(BUILD_DIR, _dir)
        build_dir.mkdir(exist_ok=True, parents=True)
        # Template dir should have been created earlier
        # TODO: Just verify
        TEMPLATE_DIR.mkdir(exist_ok=True, parents=True)

        # copy template directory
        # copytree(TEMPLATE_DIR, build_dir,
        #          copy_function=copy, dirs_exist_ok=True)

        # add requested userdata
        latex_file = Path(build_dir, 'file.tex')
        latex_file.write_text(form.text.data)

        # compile latex
        docker_client = docker.from_env()
        # docker run
        #   texlive/texlive:latest
        #   -i
        #   --rm
        #   -v "$PWD"/test:/usr/src/app
        #   -w /usr/src/app
        #   pdflatex test
        r = docker_client.containers.run(
            'texlive/texlive:latest',
            remove=True,
            volumes={str(build_dir.resolve()): {
                'bind': '/usr/src/app', 'mode': 'rw'}},
            working_dir='/usr/src/app',
            # User needs to be the same as the user executing the Flask-process
            # TODO: Set user in Dockerfile
            user='1000:1000',
            command='pdflatex file')

        filename = str(Path(build_dir, 'file.pdf').resolve())

        # return link to build
        return f'[ <a href={url_for("api.get_file", filename=filename)}>output.pdf</a> ]'

        # BUG: send_file fails due to nonexistent file -> wait?
        # return send_file(Path(build_dir, 'file.pdf'))


@bp.route('/snippet/', defaults={'id': None}, methods=['GET', 'POST'])
@bp.route('/snippet/<id>', methods=['GET', 'POST'])
@login_required
def snippet(id):
    form = SnippetEditorForm()
    snippet = Snippet()

    if id == None:
        db.session.add(snippet=Snippet(created_by=current_user))
        db.session.commit()
        print('id=', snippet.id)
        return redirect(url_for('editor.snippet', id=snippet.id))
    else:
        snippet = Snippet.query.get(int(id))

    if form.validate_on_submit():

        # BUG: form.populate_obj
        #  - overwrite values with None for unrendered fields
        #  - stringified datetime-objects are not cast back correctly
        # form.populate_obj(snippet)
        snippet.description = form.description.data
        snippet.content = form.content.data

        # TODO: created_by -> one-to-many

        tags_list = form.tags.data.split(',')
        for tag_name in tags_list:
            t = Tag.query.filter_by(name=tag_name).first()
            if t == None:
                t = Tag(name=tag_name)
            # BUG: Creates new tag even if it exists -> require unique?
            # TODO: Remove old tags
            snippet.tags.append(t)

        # Add snippet to database
        db.session.add(snippet)
        db.session.commit()

    form = SnippetEditorForm(obj=snippet)

    return render_template('edit_snippet.html', form=form, snippet=snippet)
