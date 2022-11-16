import docker
from pathlib import Path
from uuid import uuid4
from flask import render_template, url_for, request

from bucket.editor import bp
from bucket.editor.forms import LatexEditorForm

# TODO: Setup paths in config
# TODO: Use instance object to overwrite
# TODO: Allow admin to edit in dashboard
# TODO: Create admin dashboard
INSTANCE_DIR = Path('.', 'instance')
TEMPLATE_DIR = Path(INSTANCE_DIR, 'test')

USERDATA_DIR = Path(INSTANCE_DIR, 'userdata')
BUILD_DIR = Path(USERDATA_DIR, 'build')


# TODO: Split into editor (editor blueprint) route and submithandler (api route)
@bp.route('/latex_editor', methods=['GET', 'POST'])
def latex_editor():
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

        # return send_file(Path(build_dir, 'file.pdf'))
