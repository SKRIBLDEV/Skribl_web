

function User(db) {

	this.getUser = function(username) {

	db.select().from('User').where({Name: username}).all()
	.then(function(users) {
		console.log('test');
		if(users.length) {
		 	var res = users[0];
			return res;
		}
		else {

			return false;
		}
	});
	}
}

exports.User = User;