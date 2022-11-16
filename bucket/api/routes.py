from flask import request, send_file

from bucket.api import bp


@bp.route('/file', methods=['GET'])
def get_file():
    filename = request.args.get('filename')
    return send_file(filename)
