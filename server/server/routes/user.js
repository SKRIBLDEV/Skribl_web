/* --- IMPORTS --- */

const UM = require('../modules/user.js');
const errors = require('./routeErrors.js');
const serverError = errors.serverError;

/* --- LOAD USERINFO --- */

/**
  * Loads requested user information
  * @param {Object} req - HTTP request sent to server
  * @param {Object} res - HTTP response object
  * @param {Object} context - application context
 */
function getUserInfo(req, res, context) {

	var username = req.params['username'];
	var database = context.db;

	database.loadUser(username, function(err, data) {

		if (err) {
			serverError(res, err.toString());
		} else {
			res.json({
				username: data.getUsername(),
				firstName: data.getFirstName(),
				lastName: data.getLastName(),
				email: data.getEmail(),
				language: data.getLanguage(),
				researchGroup: data.getResearchGroup(),
				department: data.getDepartment(),
				faculty: data.getFaculty(),
				institution: data.getInstitution(),
				researchDomain: data.getResearchDomains(),
				authorId : data.getAuthorId()
			});
		}
	});
}

/* --- REMOVE USER --- */

/**
  * Remove a certain user from the system
  * @param {Object} req - HTTP request sent to server
  * @param {Object} res - HTTP response object
  * @param {Object} context - application context
 */
function deleteUserInfo(req, res, context) {

	var username = req.params['username'];
	var database = context.db;

	database.deleteUser(username, function(err, data) {

		if (err) {
			serverError(res, err.toString());
		} else {
			//HTTP 204 deleted
			res.status(204); 
			res.end();
			//remove from recommendation engine
			var recommender = context.recommender;
			recommender.dropUser(username);
		}
	});
}

/** Checks if authenticated user is the user to be deleted
  * @param {object} auth - result of authentication
  * @param {object} req - provides context for authentication
  * @param {Object} context - server context with extra configurations and external objects
  * @param {Function} clb - callback; to be called with boolean to indicate authentication success/failure
  */
deleteUserInfo.auth = function(auth, req, context, clb) {

	var requiredUsername = req.params['username'];
	clb(null, auth && (auth.getUsername() === requiredUsername));
}

/* --- CREATE NEW USER --- */

/**
  * Create a new user in the system
  * @param {Object} req - HTTP request sent to server
  * @param {Object} res - HTTP response object
  * @param {Object} context - application context
 */
function createUser(req, res, context) {

	req.body.username = req.params['username'];
	UM.createUser(req.body, function(err, data) {
		if(err) {  
			serverError(res, data[0]);
		} else {
			var database = context.db;
			database.createUser(data, function(err, data) {
				if(!err) {
					res.status(201).end();
				} else {
					serverError(res, err.toString());
				}
			});
		}
	});
}

/* ---- EXPORT ROUTE ---- */

exports.path = '/users/:username';
exports.get = getUserInfo;
exports.put = createUser;
exports.delete = deleteUserInfo;
