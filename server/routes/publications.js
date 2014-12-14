/* --- IMPORTS --- */

const PUB = require('../modules/publications.js');

/* --- ERRORS --- */

/**
  * Auto-generates error that indicates a server error
  * @param {Object} res - HTTP response to output error to
  * @param {String} reason - description of the error
  * @private
 */
function serverError(res, reason) {
	res.status(500);
	res.end('SERVER ERROR (publication-related): ' + reason);
}

/**
  * Auto-generates error that indicates a user error
  * @param {Object} res - HTTP response to output error to
  * @param {String} reason - description of the error
  * @private
 */
function userError(res, reason) {
	res.status(400);
	res.end('ERROR: ' + reason);
}

/* --- CREATE PUBLICATIONS --- */

/**
  * Creates a new publication, given an uploaded publication + some basic info
  * @param {Object} req - HTTP-request sent to upload the publication
  * @param {Object} res - HTTP-response to output id of new publication (or error)
  * @param {Object} context - server context with extra configurations and external objects
*/
function createPublication(req, res, context) {

	var publicationFile = req.files.inputFile;
	var type = publicationInfo.type;

	if (type !== 'application/pdf') {
		userError(res, 'unsupported filetype: ' + type);
		return;
	}

	var publicationInfo = {
		username: req.body.username,
		path: publicationFile.path,
		name: publicationFile.name
	}

	PUB.createPublication(publicationInfo, function(err, publication) {

		if (err) {
			serverError(res, err.toString());
		} else {
			var database = context.db;
			database.addPublication(publication, function(err, pubId) {
				if(!err) 
					res.status(201);
					res.json({id: pubId});
				} else {
					serverError(res, err.toString());
				}
			});
		}
	});
}

/**
  * Checks if authenticated user has permission to upload publication (which is currently true for every user)
  * @param {Object} auth - user that successfully authenticated itself (false if none)
  * @param {Object} req - HTTP-request sent to the server
*/
createPublication.auth = function(auth, req) {

	// it doesn't really matter who autenticates, uploader just needs to be a user...
	// (if we want to support guest uploaders, we have to change it here...)
	if (auth) {
		req.body.username = auth.getUsername();
		return true;
	}
	
	return false; 
}

/* --- EXPORTS --- */

exports.path = '/publications';
exports.put = createPublication;