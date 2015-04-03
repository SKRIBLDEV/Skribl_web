/* --- IMPORTS --- */

const PUB = require('../modules/publication.js');
const errors = require('./routeErrors.js');
const serverError = errors.serverError;
const userError = errors.userError;
const request = require('request');
const uuid = require('node-uuid');
const http = require('http');
const mime = require('mime');
const fs = require('fs');

const nop = function() {}

/* --- TEST STUB --- /

var bogusDb = {
	addJournal: function(t, f, u, clb) {
		console.log("ADDING JOURNAL TO DB: ")
		console.log("title: " + t);
		console.log("file: " + "(" + f.originalname + ", " + f.path + ")");
		console.log("uploader: " + u);
		clb(null, "#23:42");
	},	
	addProceeding: function(t, f, u, clb) {
		console.log("ADDING PROCEEDING TO DB: ")
		console.log("title: " + t);
		console.log("file: " + "(" + f.originalname + ", " + f.path + ")");
		console.log("uploader: " + u);
		clb(null, "#23:41");
	},
	querySimple: function(k, l, clb) {
		console.log("SIMPLE QUERY ON DB: ");
		console.log("KEYWORD: " + k);
		console.log("LIMIT: " + l);
		clb(null, [1,2,3,4,5]);
	},
	queryAdvanced: function(c, l, clb) {
		console.log("ADVANCED QUERY ON DB: ")
		console.log("CRITERIA: " + c);
		console.log("LIMIT: " + l);
		clb(null, [5,4,3,2,1]);
	} 
}
*/

/* --- CREATE PUBLICATIONS --- */

/**
  * Creates a new publication, given an uploaded publication or url
  * @param {Object} req - HTTP-request sent to upload the publication
  * @param {Object} res - HTTP-response to output id of new publication (or error)
  * @param {Object} context - server context with extra configurations and external objects
*/
function createPublication(req, res, context) {

	var db = context.db;

	/* VALIDATION */
	var title = req.query['title'];
	if(!title)
		return userError(res, 'no publication title specified');
	title = title.replace('+', ' ');

	var type = req.query['type'];
	var addPublication;
	switch (type) {
		case 'journal':
			addPublication = db.addJournal;
			break;
		case 'proceeding':
			addPublication = db.addProceeding;
			break;
		default:
			return userError(res, 'invalid or unspecified publication type')
	}

	/* ADD A PUBLICATION TO DB */
	function addToDatabase(publicationFile) {		
		//add publication to the database
		addPublication(title, publicationFile, req.uploader, function(err, pubId) {
			if (err)
				serverError(res, err.toString());
			else {
				res.status(201); //HTTP 201 CREATED
				res.json({id: pubId}); //send id in response
				fs.unlink(publicationFile.path, nop); //delete the file
			}
		});
	}

	//check if file/url is provided
	var publicationFile = req.files.inputFile;
	var publicationUrl = req.body.url;

	/* FILE */
	if (publicationFile) {
		//check file type
		var fileType = publicationFile.mimetype;
		if (fileType !== 'application/pdf')
			return userError(res, 'unsupported filetype: ' + fileType);
		//update relative file path to an absolute one
		publicationFile.path = context.workingDir + '/' + publicationFile.path;
		//add file to database
		addToDatabase(publicationFile);

	/* URL */
	} else if (publicationUrl) {
		//file data
 	 	var file = Object.create(null);
		file.name = publicationUrl.substring(publicationUrl.lastIndexOf('/')+1);
		file.path = context.workingDir + '/temp/' + uuid.v1();
 	 	var fileStream = fs.createWriteStream(file.path);
 	 	//download file
 	 	request.get(publicationUrl)
 	 	  .on('error', function(err) {
 	 	  	fs.unlink(file.path, nop);
 	 	  	serverError(res, 'download from URL failed: ' + err.toString());
 	 	  })
 	 	  .on('response', function(resp) {
 	 	  	var type = resp.headers['content-type'];
 	 	  	file.mimetype = (type? type : mime.lookup(file.path));
 	 		fileStream.on('finish', function() {
 	 			filestream.close(nop);
 	 			addToDatabase(file);
 	 		});
 	 	  })
 	 	  .pipe(file.path);

  	/* NO FILE? */	
  	} else
  		userError(res, 'No file was provided!');
}

/**
  * Checks who successfully authenticated to identify the uploader
  * @param {Object} auth - user that successfully authenticated itself (false if none)
  * @param {Object} req - HTTP-request sent to the server
  * @param {Object} context - server context with extra configurations and external objects
  * @param {Function} clb - callback; to be called with boolean to indicate authentication success/failure
*/
createPublication.auth = function(auth, req, context, clb) {

	// it doesn't really matter who autenticates, uploader just needs to be a user...
	// (if we want to support guest uploaders, we have to change it here...)
	if (auth) {
		req.uploader = auth.getUsername();
		clb(null, true);
		return;
	}

	clb(null, false);
}


/* --- QUERY PUBLICATIONS --- */

//limit number of results
const __INTERNAL_LIMIT__ = 5;
const __EXTERNAL_LIMIT__ = 5;

/**
  * Searches for a publication based on certain criteria
  * @param {Object} req - HTTP-request sent with query parameters
  * @param {Object} res - HTTP-response with array of matched publication id's
  * @param {Object} context - server context with extra configurations and external objects
*/  
function queryPublications(req, res, context) {

	var db = context.db;
	var keyword = req.query['q'];

	/* BASIC SEARCH */
	if(keyword) {
		keyword = keyword.replace('+', ' '); //add spaces between words
		db.querySimple(keyword, __INTERNAL_LIMIT__, function(err, data) {
			if (err)
				serverError(res, err.toString());
			else {
				var result = { internal: data };
				//include external results as well?
				if (req.query['external']) {
					PUB.search(keyword, __EXTERNAL_LIMIT__, function(err, data) {
						if(err)
							serverError(res, err.toString());
						else {
							result.external = data;
							res.status(200);
							res.json(result);
						}
					});
				} else {
					res.status(200);
					res.json(result);
				}
			}
		});

	/* ADVANCED SEARCH */
	} else {

		var criteria = req.body;

		db.queryAdvanced(criteria, __INTERNAL_LIMIT__, function(err, data) {
			if(err)
				serverError(res, err.toString());
			else {
				res.status(200);
				res.json(data);
			}
		});
	}
}

/* --- EXPORTS --- */

exports.path = '/publications';
exports.put = createPublication;
exports.get = queryPublications;