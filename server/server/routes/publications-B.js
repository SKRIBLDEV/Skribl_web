/* --- IMPORTS --- */

const PUB = require('../modules/publication.js');
const errors = require('./routeErrors.js');
const serverError = errors.serverError;
const userError = errors.userError;
const uuid = require('node-uuid');
const fs = require('fs');

const nop = function() {}

/* --- PRIVATE --- */

/**
  * Is a certain user authorised to edit/delete a publication
  * @param {Object} db - database in which user/publication information is kept
  * @param {String} user - the user who is requesting access to the publication
  * @param {String} id - the id of the publication that needs to be accessed
  * @param {Function} clb - callback with true or false
  * @private
*/
function isAuthorised(db, user, id, clb) {

	db.uploadedBy(id, function(err, usr) {
		if (err)
			clb(err);
		else
			clb(null, usr === user.getUsername());
	});
}

/* --- GETTING PUBLICATIONS --- */

/**
  * Get a publication or its metadata, depending on the query parameter 'id'
  * @param {Object} req - HTTP-request with id of publication
  * @param {Object} res - HTTP-response with file or metadata in JSON
  * @param {Object} context - server context with extra configurations and external objects
*/
function getPublication(req, res, context) {

	var id = req.params['id'];
	var db = context.db;

	if (req.query['download']) {

		var path = context.workingDir + '/temp/' + uuid.v1();

		db.loadPublication(id, path, function(err, name) {
			if (err) {
				serverError(res, err.toString());
			} else {
				res.download(path, name, function() {
					fs.unlink(path, nop);
				});
			}
		});

	} else {

		db.getPublication(id, function(err, metadata) {
			if(err) {
				serverError(res, err.toString());
			} else {
				res.status(200);
				res.json(metadata);
			}
		});
	}
}

/* --- DELETING PUBLICATIONS --- */

/**
  * Remove a certain publication from the system
  * @param {Object} req - HTTP-request with id of publication
  * @param {Object} res - HTTP-response with status code
  * @param {Object} context - server context with extra configurations and external objects
*/
function removePublication(req, res, context) {

	var id = req.params['id'];
	var db = context.db;

	db.removePublication(id, function(err) {
		if(err)
			serverError(res, err.toString());
		else
			res.status(204).end(); //HTTP 204 DELETED
	});
}

/**
  * Checks if authenticated user has permission to delete publication
  * @param {Object} auth - user that successfully authenticated itself (false if none)
  * @param {Object} req - HTTP-request sent to the server
  * @param {Object} context - server context with extra configurations and external objects
  * @param {Function} clb - callback; to be called with boolean to indicate authentication success/failure
*/
removePublication.auth = function(auth, req, context, clb) {

	if(auth)
		isAuthorised(context.db, auth, req.params.id, clb);
	else
		clb(null, false);
}

/* ---  UPDATING PUBLICATIONS/METADATA --- */

/**
  * Updating a publications metadata, with the possiblity of scraping extra information server-side
  * @param {Object} req - HTTP-request with id of publication
  * @param {Object} res - HTTP-response with status code and possibly new metadata
  * @param {Object} context - server context with extra configurations and external objects
*/
function updatePublication(req, res, context) {

	var id = req.params['id'];

	var meta = req.body;
	if (!(meta.title && meta.type))
		return userError(res, "title & type are not specified in metadata!");

	var database = context.db;

	if (req.query['extract']) {

		console.log(meta);
		PUB.extract(meta, function(err, mt) {

			if(err)
				return serverError(res, "Scraping error: " + err.toString());

			database.updatePublication(id, mt, function(err) {
				if(err)
					serverError(res, err.toString());
				else {
					res.status(200);
					res.json(mt);
				}
			});
		});

	} else {

		database.updatePublication(id, meta, function(err) {
			if(err)
				serverError(res, err.toString());
			else
				res.status(200).end();
		});
	}
}

/**
  * Checks if authenticated user has permission to update the publication
  * @param {Object} auth - user that successfully authenticated itself (false if none)
  * @param {Object} req - HTTP-request sent to the server
  * @param {Object} context - server context with extra configurations and external objects
  * @param {Function} clb - callback; to be called with boolean to indicate authentication success/failure
*/
updatePublication.auth = function(auth, req, context, clb) {

	if(auth)
		isAuthorised(context.db, auth, req.params.id, clb);
	else
		clb(null, false);
}


/* --- EXPORTS --- */

//route path
exports.path = '/publications/:id';

//temporary fix for rid's starting with #
exports.preprocess = function(req, res, context, next) {
	req.params['id'] = '#' + req.params['id']; 
	next();
}

//http methods
exports.get = getPublication;
exports.post = updatePublication;
exports.delete = removePublication;