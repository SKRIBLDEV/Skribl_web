/* --- IMPORTS --- */

const errors = require('./routeErrors.js');
const serverError = errors.serverError;
const userError = errors.userError;

/* --- SEARCH FOR AUTHORS --- */

//limit number of query results
const __AUTHOR_LIMIT__ = 5;

/**
  * Search for authors with a matching name
  * @param {Object} req - HTTP request sent to server
  * @param {Object} res - HTTP response object
  * @param {Object} context - application context
 */
function searchAuthors(req, res, context) {

	var firstname = req.query['firstname'];
	var lastname = req.query['lastname'];
	var limit = req.query['limit'];

	if(!(firstname && lastname))
		return userError(res, 'Expected firstname:lastname');

	limit = (limit ? parseInt(limit) : __AUTHOR_LIMIT__);
	
	context.db.searchAuthor(firstname, lastname, limit, function(err, authors) {
		if(err)
			serverError(res, err.toString());
		else {
			res.status(200);
			res.json(authors);
		}
	});
}

/* --- EXPORTS --- */

exports.path = '/authors';
exports.get = searchAuthors;