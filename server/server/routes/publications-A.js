/* --- IMPORTS --- */

const PUB = require('../modules/publication.js');
const errors = require('./routeErrors.js');
const serverError = errors.serverError;
const userError = errors.userError;
const uuid = require('node-uuid');
const http = require('http');
const mime = require('mime');
const fs = require('fs');

const nop = function() {}

/* --- CREATE PUBLICATIONS --- */

/**
  * Creates a new publication, given an uploaded publication or url
  * @param {Object} req - HTTP-request sent to upload the publication
  * @param {Object} res - HTTP-response to output id of new publication (or error)
  * @param {Object} context - server context with extra configurations and external objects
*/
function createPublication(req, res, context) {

	/* VALIDATION */
	var title = req.query['title'];
	if(!title)
		return userError(res, 'no publication title specified');

	var type = req.query['type'];
	var addPublication;
	switch (type) {
		case 'journal':
			addPublication = context.db.addJournal;
			break;
		case 'proceeding':
			addPublication = context.db.addProceeding;
			break;
		default:
			return userError('invalid or unspecified publication type')
	}

	/* ADD A PUBLICATION TO DB */
	function addToDatabase(publicationFile) {		
		//add publication to the database
		addPublication(publicationFile, req.uploader, function(err, pubId) {
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
		var name = publicationUrl.substring(publicationUrl.lastIndexOf('/')+1);
		var path = context.workingDir + '/temp/' + uuid.v1();
 	 	var fileStream = fs.createWriteStream(path);
 	 	//download file
  		http.get(publicationUrl, function(bytes) {    		
  			fileStream.on('finish', function() {
      			file.close(nop);
    		});
    		bytes.pipe(fileStream);
    		addToDatabase({path: path,
    					   originalname: name,
    					   mimetype: mime.lookup(path)});
  		}).on('error', function(err) { // Handle errors
    		fs.unlink(path); // Delete the file async. (But we don't check the result)
    		serverError(res, 'DOWNLOAD FAILED: ' + err.toString());
  		});
  	}
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
		if(!criteria)
			return userError(res, 'no criteria specified!');

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