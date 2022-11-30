from flask import Blueprint, redirect, url_for
from flask.json import jsonify
from flask.wrappers import Response

from flaskapp import db
from flaskapp.models import User, Document

bp = Blueprint('document', __name__)

# Document Routes
# TODO: GET  /document/all
#       RETURN [document]
# GET  /document/<id>
#      RETURN document
# TODO: POST /document
#       CREATE and RETURN new document
# TODO: PUT  /document/<id>
#       UPDATE and RETURN document


@bp.route('/<int:id>')
def get_document(id: int) -> Response:
    """Retrieve a Document

    Args:
        id (int): Document id

    Returns:
        Response: JSON-serialized Document object
    """
    return jsonify(Document.query.get_or_404(id).to_dict())


@bp.route('/', methods=['POST'])
def create_document() -> Response:
    """Create a new Document and redirect to return the new Document

    Returns:
        Response: redirect
    """
    # TODO: Authentication
    # DEBUG: Use User(id=1) as the current user
    current_user = User.query.get(1)

    document = Document(created_by=current_user)
    db.session.add(document)
    db.session.commit()
    return redirect(url_for('.get_document', id=document.id))
