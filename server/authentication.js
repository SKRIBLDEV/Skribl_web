/** Authenticate - authenticates user based on request+context
  * @param {object} request - original user request
  * @param {object} context - context to authenticate in
  * @returns an object that represents an authenticated user or false
  */
function authenticate(req, context, clb) {

	if (req.basicAuth) {

		var username = req.basicAuth.name;
		var password = req.basicAuth.pass;

		if (username && password) {

			context.db.loadUser(username, function(err, usr) {

				if(!err && usr) {

					usr.checkCredentials(password, function(err, ok) {
						
						if (!err && ok) {
							clb(usr);
						} else {
							//incorrect password (or hash error)
							clb(false);
						}
					});

				} else {
					//could not load user
					clb(false);
				}
			});

		} else {
			//invalid input
			clb(false);
		}
	
	} else {
		//invalid input
		clb(false);
	}
}

exports.auth = authenticate;