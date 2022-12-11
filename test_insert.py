from flaskapp.models import User, Document, Snippet, Tag, DocumentSnippet
from flaskapp import db, create_app

app = create_app()

# with app.app_context():
# s1 = Snippet.query.get(5)
# s2 = Snippet.query.get(6)
# s3 = Snippet.query.get(7)
# s4 = Snippet.query.get(8)
# u1 = User.query.get(1)
# d1 = Document(created_by=u1, snippets=[s1, s4, s2, s3], description='doc2 description', content='...')
# db.session.add(d1)
# db.session.commit()

with app.app_context():
    s1 = Snippet.query.get(10)
    s2 = Snippet.query.get(11)
    s3 = Snippet.query.get(12)
    u1 = User.query.get(1)
    # d1 = Document(created_by=u1, snippets=[s3, s2, s1], description='doc3 description', content='...')
    d1 = Document.query.get(5)
    # d1 = Document(created_by=u1, description='Test x', content='...')
    db.session.add(d1)
    # d1.snippets = []
    # for s in d1.snippets:
    #     d1.snippets.remove(s)
    # for i, s in enumerate([s1, s2, s3]):
    #     d1.snippets_association.append(DocumentSnippet(d1, s1, i))

    d1.snippets = [s3, s2, s1]
    # d1.snippets.append(Snippet(content="content", description="description"))
    # d1.snippets_association.append(DocumentSnippet(d1, s2, 1))
    # d1.snippets_association.append(DocumentSnippet(d1, s3, 2))
    # d1.snippets_association.append(DocumentSnippet(d1, s1, 3))
    # d1.snippets.remove(s1)
    db.session.commit()