

var RID = require('./rid.js');

function Library(db) {

	function createLibrary(user, name, clb){ 
		db.select().from('User').where({Username: user}).all()
		.then(function (users) {
			if(users.length) {
				var userRid = RID.getRid(users[0]);
				db.vertex.create({
					'@class': 'Library',
					Username: user,
					Name: name})
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
		db.select().from('Library').where({Username: user, Name: library}).all()
		.then(function (libraries) {
			if(libraries.length) {
				var libRid = RID.getRid(libraries[0]);
				db.edge.from(libRid).to(id).create('HasPublication')
					.then(function() {
						clb(null, true);
					}
			}
			else {
				clb(new Error('Library does not exist'));
			}
		}
	}


	 this.loadLibrary = function(user, library, clb) {
	 	db.query('select * from (traverse * from (select * from Library where Username = \'' + user + '\' and Name = \'' + library + '\') while $depth < 2) where @class = \'Publication\'')
		.then(function(publications) {
			if(publications.length) {
				clb(null, publications);
			}
			else{
				clb(new Error('no publications found'));
			}

		}


	}
}
exports.Library = Library;