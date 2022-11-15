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

### Proof of concept
Single page flask app that runs a blocking default build command in an anonymous directory and returns the created pdf. 