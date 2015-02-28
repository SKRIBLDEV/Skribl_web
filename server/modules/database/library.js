

var RID = require('./rid.js');

function Library(db) {

	 this.createLibrary = function(user, name, clb) { 
		db.select().from('User').where({Username: user}).all()
		.then(function (users) {
			if(users.length) {
				var userRid = RID.getRid(users[0]);
				db.vertex.create({
					'@class': 'Library',
					username: user,
					name: name})
				.then(function (lib) {
					libraryRid = RID.getRid(lib);
					db.edge.from(userRid).to(libraryRid).create('HasLibrary')
					.then(function() {
						clb(null, lib);
					});
				});
			}
			else {
				clb(new Error('user does not exist'));
			}
		});
	}

	this.addToLibrary = function(user, library, id, clb) {
		db.select().from('Library').where({username: user, name: library}).all()
		.then(function (libraries) {
			if(libraries.length) {
				var libRid = RID.getRid(libraries[0]);
				db.edge.from(libRid).to(id).create('HasPublication')
					.then(function() {
						clb(null, true);
					});
			}
			else {
				clb(new Error('Library does not exist'));
			}
		});
	}


	 this.loadLibrary = function(user, library, clb) {
	 	//db.query('select * from (traverse * from (select * from Library where username = \'' + user + '\' and name = \'' + library + '\') while $depth < 2) where @class = \'Publication\'')
	 	db.query('select out(\'HasPublication\') from Library where username = \'' + user + '\' and name = \'' + library + '\'')
		.then(function(publications) {
			if(publications.length) {

				clb(null, publications[0].out);
			}
			else{
				clb(new Error('no publications found'));
			}

		});
	}

	this.addDefaults = function(username, clb) {
		createLibrary(username, 'Uploaded', function(error, res) {
			if(error) {
				clb(error);
			}
			else {
				createLibrary(username, 'Favorites', function(error, res) {
					if(error) {
						clb(error);
					}
					else {
						createLibrary(username, 'Portfolio', function(error, res) {
							if(error) {
								clb(error);
							}
							else {
								clb(null, true);
							}
						});
					}
				});
			}
		});
	}
}
exports.Library = Library;