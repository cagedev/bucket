from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

from flaskapp import db, login


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(128), index=True, unique=True)
    password_hash = db.Column(db.String(128))

    snippets = db.relationship('Snippet', backref='created_by')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,

            'snippets': [snippet.to_dict() for snippet in self.snippets],
        }

    def __repr__(self):
        return f'<User {self.username}>'


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


snippet_tag = db.Table(
    'snippet_tag',
    db.Column('snippet_id', db.Integer, db.ForeignKey('snippet.id')),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'))
)


class Snippet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    last_modified = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.now())
    description = db.Column(db.String(240))
    content = db.Column(db.String(3000))

    created_by_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    tags = db.relationship('Tag', secondary=snippet_tag, backref='snippets')

    def to_dict(self):
        return {
            'id': self.id,
            'created': self.created,
            'last_modified': self.last_modified,
            'description': self.description,
            'content': self.content,

            'tags': [tag.to_dict() for tag in self.tags],
        }

    def __repr__(self):
        return f'<Snippet {self.id}>'


document_tag = db.Table(
    'document_tag',
    db.Column('document_id', db.Integer, db.ForeignKey('document.id')),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'))
)


class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    last_modified = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.now())
    description = db.Column(db.String(240))
    content = db.Column(db.String(3000))  # list of snippets?

    created_by_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    tags = db.relationship('Tag', secondary=document_tag, backref='documents')

    def to_dict(self):
        return {
            'id': self.id,
            'created': self.created,
            'last_modified': self.last_modified,
            'description': self.description,
            'content': self.content,

            'tags': [tag.to_dict() for tag in self.tags],
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

    # def __repr__(self):
    #     return f'<Tag "{self.name}">'

    def __repr__(self):
        return self.name
