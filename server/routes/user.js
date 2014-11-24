var UM = require('././modules/user.js');

function getUserInfo(req, res, context) {

	UM.get(req.param.user, context.db, function(err, data) {

		if(err) {

			res.status(501); //server error
			res.end();

		} else {

			res.json(data);
		}
	}
}

function deleteUserInfo(req, res, context) {



}

function createUser(req, res) {





}

function authenticate(req, res, context, clb) {

	if (req.basicAuth) {

		var username = req.basicAuth.name;
		var password = req.basicAuth.pass;

		if (username && password) {

			UM.checkCredentials(username, password, context.db, function(err, res) {
				
				if (!err && res) {
						clb(username);
				   	} else {
						clb(false); 
					}
			});

		} else {

			clb(false);
		}
	
	} else {

		clb(false);
	}

}

/* ---- EXPORT ROUTE ---- */

exports.path = '/users/:username';
exports.get = getUserInfo;
exports.put = createUser;
exports.delete = deleteUserInfo;