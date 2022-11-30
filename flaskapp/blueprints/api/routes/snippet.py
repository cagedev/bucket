from flask import Blueprint, redirect, url_for, request
from flask.json import jsonify
from flask.wrappers import Response

from flaskapp import db
from flaskapp.models import User, Snippet, Tag

bp = Blueprint('snippet', __name__)


# Snippet Routes
# GET  /snippet/all
#      RETURN [snippet]
# GET  /snippet/<id>
#      RETURN snippet
# POST /snippet
#      CREATE and RETURN new snippet
# TODO: PUT  /snippet/<id>
#       UPDATE and RETURN document


@bp.route('/all', methods=['GET'])
def get_snippets() -> Response:
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
        Response: JSON-serialized array of Snippet objects
    """

    # The 'tag=<tagname>' argument may be provided multiple times, retrieve all as an array
    tagnames = request.args.getlist('tag')

    snippets = Snippet.query

    # Require all tags to be present
    for tagname in tagnames:
        snippets = snippets.filter(Snippet.tags.any(Tag.name == tagname))

    snippets = snippets.all()

    return jsonify([snippet.to_dict() for snippet in snippets])


@bp.route('/<int:id>', methods=['GET'])
def get_snippet(id: int) -> Response:
    """Retrieve a Snippet by id

    Args:
        id (int): snippet id

    Returns:
        Response: JSON-serialized Snippet object
    """
    return jsonify(Snippet.query.get_or_404(id).to_dict())


@bp.route('/', methods=['POST'])
def create_snippet() -> Response:
    """Create a new Snippet and redirect to return the new Snippet

    Returns:
        Response: redirect
    """
    # TODO: Authentication
    # DEBUG: Use User(id=1) as the current user
    current_user = User.query.get(1)

    snippet = Snippet(created_by=current_user)
    db.session.add(snippet)
    db.session.commit()
    return redirect(url_for('.get_snippet', id=snippet.id))


@bp.route('/<int:id>', methods=['PUT'])
def edit_snippet(id: int):
    payload = request.get_json()
    snippet = Snippet.query.get(id)

    # fields = ['description', 'content']
    # TODO: Do this programmatically based on a update array
    snippet.description = payload['description']
    snippet.content = payload['content']

    # TODO: Do this in a better way than set intersection
    new_tags = set(payload['tags'])
    old_tags = {tag.name for tag in snippet.tags}

    tags_to_remove = old_tags - new_tags
    tags_to_add = new_tags - old_tags

    # Remove old tags, save new tags
    for tag in tags_to_remove:
        # TODO: Make tags unique
        t = Tag.query.filter_by(name=tag).first()
        snippet.tags.remove(t)

    # Add new tags, check for duplicates
    for tag in tags_to_add:
        t = Tag.query.filter_by(name=tag).first()
        if t == None:
            t = Tag(name=tag)
        snippet.tags.append(t)

    # Update snippet in database
    db.session.add(snippet)
    db.session.commit()

    return redirect(url_for('.get_snippet', id=id))
