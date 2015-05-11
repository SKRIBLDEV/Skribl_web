/* --- IMPORTS --- */

const errors = require('./routeErrors.js');
const serverError = errors.serverError;
const userError = errors.userError;

/* --- RATE PUBLICATIONS --- */

/**
  * Let a SKRIBL-user rate a publication
  * @param {Object} req - HTTP request sent to server
  * @param {Object} res - HTTP response object
  * @param {Object} context - application context
 */
function ratePublication(req, res, context) {

	var pubID = req.params['pubId'];

	context.db.getPublication(pubId, function(err, data) {
		if(err)
			serverError(res, err);
		else {
			var recommender = context.recommender;
			var username = req.params['username'];
			var rating = req.query['like'];
			rating = (rating === 'true');
			recommender.rate(username, pubId, rating, function(err) {
				if(err)
					serverError(res)
				else
					res.status(200).end()
			})
		}
	});
}

/** Checks if user is authenticated to rate a publication
  * @param {object} auth - result of authentication
  * @param {object} req - provides context for authentication
  * @param {Object} context - server context with extra configurations and external objects
  * @param {Function} clb - callback; to be called with boolean to indicate authentication success/failure
  */
ratePublication.auth = function(auth, req, context, clb) {

	var requiredUsername = req.params['username'];
	clb(null, auth && (auth.getUsername() === requiredUsername));
}

/* --- EXPORT ROUTE --- */

exports.path = '/user/:username/publication/:pubId';
exports.post = ratePublication;