/* --- IMPORTS --- */

const GRAPH = require('../modules/graph.js');
const errors = require('./routeErrors.js');
const serverError = errors.serverError;

const __DEFAULT_GRAPH_DEPTH__ = 5;

/* --- LOAD AUTHOR'S PUBLICATIONS --- */

/**
  * Loads information on a specific author (given his/her RID)
  * @param {Object} req - HTTP request sent to server
  * @param {Object} res - HTTP response object
  * @param {Object} context - application context
 */
function getAuthorInfo(req, res, context) {

	var id = req.params['id'];
	var type = req.params['cmd'];
	var database = context.db;

	switch (type) {

		case 'publications':

			database.authorPublications(id, function(err, data) {
				if (err) {
					serverError(res, err.toString());
				} else {
					res.status(200);
					res.json(data);
				}
			});
			return;

		case 'graph':

			var limit = req.query['limit'];
			limit = (limit? parseInt(limit) : __DEFAULT_GRAPH_DEPTH__);

			database.getAuthorGraph(id, limit, function(err, graph) {
				if (err) {
					serverError(res, err.toString());
				} else {
					res.status(200);
					res.json(GRAPH.parseAuthorGraph(graph));
				}
			});
			return;

		default:

			userError(res, 'invalid author query');
			return;
	}
}

/* --- EXPORT ROUTE --- */

exports.preprocess = function(req, res, context, next) {
	req.params['id'] = '#' + req.params['id']; 
	next();
}

exports.path = '/authors/:id/:cmd';
exports.get = getAuthorInfo;