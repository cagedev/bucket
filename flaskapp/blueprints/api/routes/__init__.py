from flask import request
from flask.wrappers import Response

from flaskapp import db
from flaskapp.models import Document, User, Snippet, Tag
from flaskapp.blueprints.api import bp


# Register blueprint routes from submodules
from flaskapp.blueprints.api.routes.user import bp as user_bp
bp.register_blueprint(user_bp, url_prefix='/user')

from flaskapp.blueprints.api.routes.document import bp as doc_bp
bp.register_blueprint(doc_bp, url_prefix='/document')

from flaskapp.blueprints.api.routes.snippet import bp as snippet_bp
bp.register_blueprint(snippet_bp, url_prefix='/snippet')


# API Spec
# TODO: User authentication and retrieval(use JWT?)

# TODO: GET /v1/_openapi


@bp.route('/file', methods=['GET'])
def get_file() -> Response:
    filename = request.args.get('filename')
    return f'filename={filename}'
    # return send_file(filename)


