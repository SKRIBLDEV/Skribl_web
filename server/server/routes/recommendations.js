/* --- IMPORTS --- */

const recommender = require('../modules/recommender.js');
const errors = require('./routeErrors.js');
const serverError = errors.serverError;
const userError = errors.userError;

/* --- RECOMMEND PUBLICATIONS --- */

const __DEFAULT_PUB_LIMIT__ = 20;

/**
  * Recommend publications to a SKRIBL-user
  * @param {Object} req - HTTP request sent to server
  * @param {Object} res - HTTP response object
  * @param {Object} context - application context
 */
function getRecommendations(req, res, context) {

	var username = req.params['username'];
	var database = context.db;
	var limit = req.query('limit');
	limit = (limit? parseInt(limit) : __DEFAULT_PUB_LIMIT__);

	recommender.recommend(username, limit, function(err, recs) {
		if(err)
			serverError(res, err);
		else {
			res.status(200);
			res.json(recs);
		}
	});
}

/** Checks if user is authenticated to load his/her recommendations
  * @param {object} auth - result of authentication
  * @param {object} req - provides context for authentication
  * @param {Object} context - server context with extra configurations and external objects
  * @param {Function} clb - callback; to be called with boolean to indicate authentication success/failure
  */
getRecommendations.auth = function(auth, req, context, clb) {

	var requiredUsername = req.params['username'];
	clb(null, auth && (auth.getUsername() === requiredUsername));
}

/* --- EXPORT ROUTE --- */

exports.path = '/user/:username/recommendations';
exports.get = getRecommendations;