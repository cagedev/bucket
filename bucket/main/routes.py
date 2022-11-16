from pathlib import Path
from shutil import copy, copytree
from uuid import uuid4
from flask import render_template, request, send_file, url_for
from flask_wtf import FlaskForm
from wtforms import SubmitField, TextAreaField

import docker

from bucket.main import bp


INSTANCE_DIR = Path('.', 'instance')
TEMPLATE_DIR = Path(INSTANCE_DIR, 'test')

USERDATA_DIR = Path(INSTANCE_DIR, 'userdata')
BUILD_DIR = Path(USERDATA_DIR, 'build')

tex_template = """\documentclass[12pt]{article}
\\begin{document}

\section*{Lorem Iosum}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse augue mauris, 
consequat tincidunt augue quis, malesuada sollicitudin metus. Donec ac luctus quam. 
Praesent sed lacinia magna. Nulla nisi libero, iaculis et pulvinar non, pretium 
sed est. Sed sit amet erat eu sapien porttitor gravida. Phasellus vitae ante sed 
augue facilisis facilisis. Integer vitae congue ex, sed porta eros. Pellentesque 
viverra vel tortor nec cursus.

\subsection*{Math}

\\begin{displaymath}
  \int_0^\infty e^{-st}f(t)dt
\end{displaymath}

\end{document}
"""


class SubmitForm(FlaskForm):
    text = TextAreaField('Area', default=tex_template,
                         render_kw={'rows': 25, 'cols': 90})
    submit = SubmitField('Submit')


@bp.route('/', methods=['GET', 'POST'])
def index():
    form = SubmitForm()
    user = {'username': 'Johnny'}
    if request.method == 'GET':
        return render_template('index.html', form=form, user=user)
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
        return f'[ <a href={url_for("main.get_file", filename=filename)}>output.pdf</a> ]'

        # return send_file(Path(build_dir, 'file.pdf'))


@bp.route('/file', methods=['GET'])
def get_file():
    filename = request.args.get('filename')
    return send_file(filename)
