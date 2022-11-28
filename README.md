# Bucket

LaTeX editor webapp using Python Flask

 - User login
 - LaTeX environment (TexLive?)
 - User file management
   - Support for partial documents (snippets/partials/...) for easy concatenation
   - Easy template management(if not editing)
   - Output caching
   - (Partial) Document (catalogue) sharing
 - Endpoints
   - /login
     - user login
   - /create
     - create tex snippets
   - /compose
     - arrange snippets into document

Model:
  - Snippet (v1)
    - id (int)
    - created (DateTime)
    - content (String; long!)
    - createdBy (User ref)
    - tags (Tag ref)

  - User
    - id
    - email
    - password

  - Document
    - createdBy
    - location
    - output_file (String filename)
    - input_file (String filename)
    

## TexLive Usage
```
sudo docker run -i --rm --name latex -v "$PWD"/test:/usr/src/app -w /usr/src/app texlive/texlive:latest pdflatex test
```

Note; Start Flask app with

```
docker run -v /var/run/docker.sock:/var/run/docker.sock ...
```
To be able to start other docker images


## Roadmap (status)
 - [x] proof-of-concept: Single page flask app that runs a blocking default build command in an anonymous directory and returns the created pdf.
 - [x] user-login: Provide a user management system
 - [ ] snippets: User profile and data management
   - [x] snippet creation and saving
   - [x] snippet tagging
   - [ ] snippet duplication
   - [ ] snippet deletion
   - [x] snippet ownership
   - [ ] image inclusion
   - [ ] data export
 - [ ] document composition
   - [ ] document object definition
   - [ ] insert from snippets (use tag filtering)
   - [ ] insert new snippet
   - [ ] document sharing
 - [ ] frontend
   - [x] latex editor
     - custom component
     - currently using codemirror
     - options: 
       - [codemirror](https://codemirror.net/), 
       - [monaco](https://microsoft.github.io/monaco-editor/),
       - [codejar](https://medv.io/codejar/)
     - notes:
       - codemirror does not support latex (possibly through a highlighter)
       - codejar requires an externalhighlighter (highlightjs or prismjs)
       - monaco does not support mobile web
     - custom components don't seem to be submittable:(
   - [ ] document composer
     - [ ] file format definition
       - [ ] json object
         - header
         - snippet-array
         - footer
     - [ ] (desktop-only) inline snippet editor
       - expand to edit, close to save (status feedback!)
     - [ ] snippet search and insert
   - [ ] tag selector
 - [ ] api
   - [ ] snippet CRUD(s)
   - [ ] document CRUD(s)


## Installation (TODO)
 - install dependencies: `pip install -r requirements.txt`
 - create instance location
 - create database: `flask db init; flask db migrate; flask db upgrade`