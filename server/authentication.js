var UM = require('././modules/user.js');

/* for testing:
var UM = {

	checkCredentials: function(usr, pas, context, clb) {

		clb(null, usr == 'noah' && pas == 'test');
	}
}
*/

function authenticate(req, context, clb) {

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

exports.auth = authenticate;