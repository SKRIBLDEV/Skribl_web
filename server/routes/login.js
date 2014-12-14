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

				//server error
				res.status(501).end();
			}
		});

	} else {

		//user error, credentials not supplied
		res.status(401);
		res.send('expected username:password');
	}

}

/* --- EXPORTS --- */

exports.post = validateCredentials;
exports.path = '/login';