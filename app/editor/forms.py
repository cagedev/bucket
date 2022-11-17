from flask_wtf import FlaskForm
from wtforms import TextAreaField, SubmitField, StringField

tex_template = """\documentclass[12pt]{article}
\\begin{document}

\section*{Lorem Iosum}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse augue mauris, 
consequat tincidunt augue quis, malesuada sollicitudin metus. Donec ac luctus quam. 
Praesent sed lacinia magna. Nulla nisi libero, iaculis et pulvinar non, pretium 
sed est. Sed sit amet erat eu sapien porttitor gravida. Phasellus vitae ante sed 
augue facilisis facilisis. Integer vitae congue ex, sed porta eros. Pellentesque 
viverra vel tortor nec cursus.

\subsection*{Math}

\\begin{displaymath}
  \int_0^\infty e^{-st}f(t)dt
\end{displaymath}

\end{document}
"""


class LatexEditorForm(FlaskForm):
    text = TextAreaField('Area',
                         default=tex_template,
                         render_kw={'rows': 25, 'cols': 90})
    submit = SubmitField('Submit')


class SnippetEditorForm(FlaskForm):
    # id = StringField('id')
    # created_by = StringField('created_by')
    # created = StringField('created')
    # last_modified = StringField('last_modified')
    description = TextAreaField('description',
                                render_kw={'rows': 5, 'cols': 90})
    content = TextAreaField('content',
                            render_kw={'rows': 25, 'cols': 90})
    save = SubmitField('Save')
