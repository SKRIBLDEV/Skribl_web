/* --- IMPORTS --- */

const errors = require('./routeErrors.js');
const serverError = errors.serverError;
const userError = errors.userError;

/* --- RECOMMEND PUBLICATIONS --- */

const __DEFAULT_PUB_DEPTH__ = 10;

/**
  * Recommend publications to a SKRIBL-user
  * @param {Object} req - HTTP request sent to server
  * @param {Object} res - HTTP response object
  * @param {Object} context - application context
 */
function getRecommendations(req, res, context) {

	var username = req.params['username'];
	var database = context.db;
	var recommender = context.recommender;
	var depth = req.query['depth'];
	
	depth = (depth? parseInt(depth) : __DEFAULT_PUB_DEPTH__);

	recommender.recommend(username, depth, function(err, recs) {
		if(err)
			serverError(res, err);
		else {
			recs.forEach(function(pub) {
				var id = pub.id;
				pub.download = req.protocol + '://'
							 + req.hostname + ':'
							 + context.port + '/'
							 + 'publications' + '/'
							 + id.substring(1)
							 + '?download=true';
			});
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