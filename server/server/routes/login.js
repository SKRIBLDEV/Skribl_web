const errors = require('./routeErrors.js');
const serverError = errors.serverError;
const userError = errors.userError;

/* --- VALIDATE --- */

/** 
  * Used to check user credentials for logging in
  * @param {Object} req - HTTP request that contains the credentials
  * @param {Object} res - HTTP response to output authorization or error
  * @param {Object} context - access to other configurations in server 
 */
function validateCredentials(req, res, context) {

	var username = req.body.username;
	var password = req.body.password;

	if (username && password) {

		context.db.loadUser(username, function(err, usr) {

			if (!err && usr) {

				usr.checkCredentials(password, function(err, ok) {
					
					if(!err && ok) {

						var txt = username + ':' + password;
						var enc = new Buffer(txt).toString('base64');
						res.json({ Authorization: "Basic " + enc });

					} else {

						//unauthorized
						res.status(401).end();
					} 
				});

			} else {

				serverError(res, err.toString());
			}
		});

	} else {

		userError('expected username:password');
	}

}

/* --- EXPORTS --- */

exports.path = '/login';
exports.post = validateCredentials;