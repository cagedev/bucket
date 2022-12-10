from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.orderinglist import ordering_list

from flaskapp import db, login

# TODO: Refactor into seperate modules


class User(UserMixin, db.Model):
    # Table Data
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(128), index=True, unique=True)
    password_hash = db.Column(db.String(128))

    # Relationships (many-to-many)
    snippets = db.relationship('Snippet', backref='created_by')
    documents = db.relationship('Document', backref='created_by')

    # Required for UserMixin
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    # Data seralization
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,

            'snippets': [snippet.to_dict() for snippet in self.snippets],
        }

    def __repr__(self):
        return f'<User {self.username}>'

# LoginManager


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


snippet_tag = db.Table(
    'snippet_tag',
    db.Column('snippet_id', db.Integer, db.ForeignKey('snippet.id')),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'))
)


document_tag = db.Table(
    'document_tag',
    db.Column('document_id', db.Integer, db.ForeignKey('document.id')),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'))
)


class DocumentSnippet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    snippet_id = db.Column(db.Integer, db.ForeignKey('snippet.id'))
    index = db.Column(db.Integer)

    document = db.relationship(
        'Document', back_populates='snippets_association')
    snippet = db.relationship(
        'Snippet', back_populates='documents_association')

    def __init__(self, document=None, snippet=None, index=None, **kwargs):
        if document is not None:
            kwargs['document'] = document
        if snippet is not None:
            kwargs['snippet'] = snippet
        if index is not None:
            kwargs['index'] = index
        db.Model.__init__(self, **kwargs)


class Snippet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    last_modified = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.now())
    description = db.Column(db.String(240))
    content = db.Column(db.String(3000))

    created_by_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    tags = db.relationship('Tag', secondary=snippet_tag, backref='snippets')
    documents_association = db.relationship(
        'DocumentSnippet',
        back_populates='snippet')
    documents = association_proxy('documents_association',
                                  'document',
                                  # QUESTION: Is the creator required?
                                  creator=lambda snippet, index=None: DocumentSnippet(snippet=snippet, index=index))

    def to_dict(self):
        return {
            'id': self.id,
            'created': self.created,
            'last_modified': self.last_modified,
            'description': self.description,
            'content': self.content,

            'tag_names': [tag.name for tag in self.tags],
            'document_ids': [ds.document_id for ds in self.documents_association],
        }

    def __repr__(self):
        return f'<Snippet {self.id}>'


class Document(db.Model):
    # Table data
    id = db.Column(db.Integer, primary_key=True)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    last_modified = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.now())
    description = db.Column(db.String(240))
    content = db.Column(db.String(3000))

    created_by_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    tags = db.relationship('Tag', secondary=document_tag, backref='documents')
    snippets_association = db.relationship(
        'DocumentSnippet',
        back_populates='document',
        collection_class=ordering_list('index'),
        order_by=[DocumentSnippet.index])
    # TODO: Figure out how the creator lambda works
    snippets = association_proxy('snippets_association', 'snippet',
                                 creator=lambda snippet, index=None: DocumentSnippet(snippet=snippet, index=index))

    def to_dict(self):
        return {
            'id': self.id,
            'created': self.created,
            'last_modified': self.last_modified,
            'description': self.description,
            'content': self.content,

            'tags': [tag.to_dict() for tag in self.tags],
            'snippet': [snippet.to_dict() for snippet in self.snippets],
        }

    def __repr__(self):
        return f'<Snippet {self.id}>'


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
        }

    def __repr__(self):
        return self.name
