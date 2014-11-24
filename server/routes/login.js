var UM = require('././modules/user.js');

/* for testing:
var UM = {

	checkCredentials: function(usr, pas, context, clb) {

		clb(null, usr == 'noah' && pas == 'test');
	}
}
*/

function validateCredentials(req, res, context) {

	var username = req.body.username;
	var password = req.body.password;

	if (username && password) {

		UM.checkCredentials(username, password, context.db, function(err, usr) {

			if(!err & usr) {

				var txt = username + ':' + password;
				var enc = new Buffer(txt).toString('base64');

				res.json({
					Authorization: "Basic " + enc
				});

			} else {

				//unauthorized
				res.status(401).end(); 
			}

		});

	} else {

		res.status(401);
		res.send('expected username:password');
	}
}

exports.post = validateCredentials;
exports.path = '/login';