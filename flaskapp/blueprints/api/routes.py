from flask import request, send_file, jsonify

from flaskapp.models import Document, User, Snippet, Tag
from flaskapp.blueprints.api import bp


@bp.route('/file', methods=['GET'])
def get_file():
    filename = request.args.get('filename')
    return send_file(filename)


# TODO: User authentication and retrieval(use JWT?)

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
# GET  /snippet/all
#      RETURN [snippet]
# TODO: POST /snippet
#       CREATE and RETURN new snippet
# GET  /snippet/<id>
#      RETURN snippet
# TODO: PUT  /snippet/<id>
#       UPDATE and RETURN document


@bp.route('/snippet/all', methods=['GET'])
def get_snippets() -> str:
    """Retrieve an array of Snippets based on filters provided by request arguments.
    Arguments may be defined multiple times; _all_ parameters are required to be present.

    Available arguments:
        tag=<tagname>

    Examples:
        /all 
            return all available Snippets

        /all?tag=a
            return all Snippets containing Tag(name='a')

        /all?tag=a&tag=b
            return all Snippets containing Tag(name='a') and Tag(name='b')

    Returns:
        str: JSON-serialized array of Snippet objects
    """

    # The 'tag=<tagname>' argument may be provided multiple times, retrieve all as an array
    tagnames = request.args.getlist('tag')

    snippets = Snippet.query

    # Require all tags to be present
    for tagname in tagnames:
        snippets = snippets.filter(Snippet.tags.any(Tag.name == tagname))

    snippets = snippets.all()

    return jsonify([snippet.to_dict() for snippet in snippets])


@bp.route('/snippet/<int:id>', methods=['GET'])
def get_snippet(id: int) -> str:
    """Retrieve a Snippet by id

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
