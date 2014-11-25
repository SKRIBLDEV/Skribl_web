var UM = require('././modules/user.js');

function serverError(res, reason) {

	// report server error
	res.status(501);
	res.end(reason);
}

function getUserInfo(req, res, context) {

	var username = req.param('username');
	UM.loadUser(username, context.db, function(err, data) {

		if (err) {

			serverError(res, err.toString());

		} else {

			res.json({
				username: data.getUserName(),
				firstName: data.getFirstName(),
				lastName: data.getLastName(),
				email: data.getEmail(),
				language: data.getLanguage()
			});
		}
	}
}

function deleteUserInfo(req, res, context) {

	var username = req.param('username');
	UM.deleteUser(username, context.db, function(err, data) {

		if (err) {

			serverError(res, err.toString());

		} else {

			//deleted
			res.status(204); 
			res.end();
		}
	} 
}

/** check if user is allowed to be deleted */
deleteUserInfo.auth = function(auth, req) {

	return (req.param('username') == auth);
}

function createUser(req, res) {

	UM.createUser( //createUser does the validation + password encryption + ...
		req.body.firstName,
		req.body.lastName,
		req.body.language,
		req.body.email,
		req.param('username'),
		req.body.password
		function(err, usr) {
			if(err) {
				serverError(res, err.toString());
			} else {
				usr.save(context.db, function(err, data) {
					if(err === null) {
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