![alt tag](https://dl.dropboxusercontent.com/u/7276586/logo.gif)

Skribl_web
==========

> SKRIBL is something new. Its something that will deal with academical writings, be it papers, journals, or anything remotely related. Furthermore it will be some kind of professional social network. We think.

> But hey, we just started, cut us some slack! Lets see how far we can push this thing.

### Code Quality

> Current Score by CodeClimate:  [![CodeClimate](https://codeclimate.com/github/SKRIBLDEV/Skribl_web/badges/gpa.svg)](https://codeclimate.com/github/SKRIBLDEV/Skribl_web)

### Code organisation

- /public contains the index.html file
- files in /static are directly accesible by url (images, client-side js, css, ...)
- main.js is the main executable for the server
- /server has all the other code for the server, including its routes/modules, ...

> TODO: add package.json for dependencies, metadata, ...

## Install

### MacOSX / Unix
- Fire up terminal
- Navigate to the directory of Skribl_web (make sure you can see "index.html" when pressing | ls; |)
- type | python -m SimpleHTTPServer; |
- open up your favorite browser and navigate to "http://localhost:8000/"

### Windows
Don't know, don't wanna know. At this point you can probably just run the index.html
