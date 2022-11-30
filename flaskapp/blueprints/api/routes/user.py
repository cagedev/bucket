from flask import Blueprint
from flask.json import jsonify
from flask.wrappers import Response

from flaskapp.models import User

bp = Blueprint('user', __name__)

# User Routes
# TODO: GET  /user/all
#       RETURN [user]
# GET  /user/<id>
#      RETURN user
# TODO: POST /user/
#       CREATE and RETURN new user
# TODO: GET  /user/<id>/documents
#       RETURN [user.document]
# TODO: GET  /user/<id>/snippets
#       RETURN [user.snippet]


# GET  /user/<id>
# RETURN user

@bp.route('/<int:id>', methods=['GET'])
def get_user(id: int) -> Response:
    """Retrieve a User

    Args:
        id (int): User id

    Returns:
        Response: JSON-serialized User object
    """
    return jsonify(User.query.get_or_404(id).to_dict())
