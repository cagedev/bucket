from flask import request, send_file, jsonify

from flaskapp.models import Document, User, Snippet
from flaskapp.blueprints.api import bp


@bp.route('/file', methods=['GET'])
def get_file():
    filename = request.args.get('filename')
    return send_file(filename)


# API Spec
# TODO: GET /v1/_openapi

# User Routes
# TODO: GET  /user/all
#       RETURN [user]
# TODO: POST /user/
#       CREATE and RETURN new user
# GET  /user/<id>
#      RETURN user
# TODO: GET  /user/<id>/documents
#       RETURN [user.document]
# TODO: GET  /user/<id>/snippets
#       RETURN [user.snippet]


# GET  /user/<id>
# RETURN user

@bp.route('/user/<int:id>')
def get_user(id: int):
    """Retrieve a User

    Args:
        id (int): User id

    Returns:
        json: JSON-serialized User object
    """
    return jsonify(User.query.get_or_404(id).to_dict())


# Snippet Routes
# TODO: GET  /snippet/all
#       RETURN [snippet]
# TODO: POST /snippet
#       CREATE and RETURN new snippet
# GET  /snippet/<id>
#      RETURN snippet
# TODO: PUT  /snippet/<id>
#       UPDATE and RETURN document

@bp.route('/snippet/<int:id>')
def get_snippet(id: int):
    """Retrieve a Snippet

    Args:
        id (int): snippet id

    Returns:
        json: JSON-serialized Snippet object
    """
    return jsonify(Snippet.query.get_or_404(id).to_dict())


# Document Routes
# TODO: GET  /document/all
#       RETURN [document]
# TODO: POST /document
#       CREATE and RETURN new document
# TODO: GET  /document/<id>
#       RETURN document
# TODO: PUT  /document/<id>
#       UPDATE and RETURN document

@bp.route('/document/<int:id>')
def get_document(id: int):
    """Retrieve a Document

    Args:
        id (int): Document id

    Returns:
        json: JSON-serialized Document object
    """
    return jsonify(Document.query.get_or_404(id).to_dict())
