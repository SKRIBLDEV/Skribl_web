var UM = require('../modules/user.js');

function serverError(res, reason) {

	// report server error
	res.status(501);
	res.end(reason);
}

function getUserInfo(req, res, context) {

	var username = req.param('username');
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
				language: data.getLanguage()
			});
		}
	});
}

function deleteUserInfo(req, res, context) {

	var username = req.param('username');
	var database = context.db;

	database.deleteUser(username, function(err, data) {

		if (err) {
			serverError(res, err.toString());
		} else {
			//HTTP 204 deleted
			res.status(204); 
			res.end();
		}
	});
}

/** Checks if authenticated user is the user to be deleted
  * @param {object} auth - result of authentication
  * @param {object} req - provides context for authentication
  * @return boolean to accept/refuse request
  */
deleteUserInfo.auth = function(auth, req) {

	var requiredUsername = req.param('username');
	return (auth ? (auth.getUsername() === requiredUsername) : false);
}

function createUser(req, res, context) {

	req.body.username = req.param('username');
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
