from flask import request, send_file

from flaskapp.blueprints.api import bp


@bp.route('/file', methods=['GET'])
def get_file():
    filename = request.args.get('filename')
    return send_file(filename)
