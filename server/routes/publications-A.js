/* --- IMPORTS --- */

const errors = require('./routeErrors.js');
const fs = require('fs');
const serverError = errors.serverError;
const userError = errors.userError;

const nop = function() {}

/* --- CREATE PUBLICATIONS --- */

/**
  * Creates a new publication, given an uploaded publication
  * @param {Object} req - HTTP-request sent to upload the publication
  * @param {Object} res - HTTP-response to output id of new publication (or error)
  * @param {Object} context - server context with extra configurations and external objects
*/
function createPublication(req, res, context) {

	//check file existence
	var publicationFile = req.files.inputFile;
	if(!publicationFile)
		return userError(res, 'no file has been provided!');

	//check file type
	var type = publicationFile.mimetype;
	if (type !== 'application/pdf')
		return userError(res, 'unsupported filetype: ' + type);

	//convert relative to absolute path
	publicationFile.path = __dirname + publicationFile.path;

	context.db.addPublication(publicationFile, req.uploader, function(err, pubId) {
		if (err)
			serverError(res, err.toString());
		else {
			res.status(201); //HTTP 201 CREATED
			res.json({id: pubId}); //send id in response
			fs.unlink(path, nop); //delete the file
		}
	});
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

/**
  * Searches for a publication based on certain criteria
  * @param {Object} req - HTTP-request sent with query parameters
  * @param {Object} res - HTTP-response with array of matched publication id's
  * @param {Object} context - server context with extra configurations and external objects
*/  
function queryPublications(req, res, context) {

	var database = context.db;
	var criteria = req.query;

	database.queryPublications(criteria, function(err, ids) {
		if(err)
			serverError(res, err.toString());
		else {
			res.status(200);
			res.json(ids);
		}
	});
}

/* --- EXPORTS --- */

exports.path = '/publications';
exports.put = createPublication;
exports.get = queryPublications;