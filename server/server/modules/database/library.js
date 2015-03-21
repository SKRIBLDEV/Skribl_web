

var RID = require('./rid.js');

function Library(db) {

	 function createLibrary(user, name, trx, clb) { 
	 	trx.let(name, function(s) {
			s.create('vertex', 'Library')
			.set({
				username: user,
				name: name
			});
		})
		.let(name + 'Edge', function(s) {
			s.create('edge', 'HasLibrary')
			.from('$user')
			.to('$' + name);
		});
		clb(null, true);
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

	this.addDefaults = function(username, trx, clb) {
		createLibrary(username, 'Uploaded', trx, function(error, res) {
			if(error) {
				clb(error);
			}
			else {
				createLibrary(username, 'Favorites', trx, function(error, res) {
					if(error) {
						clb(error);
					}
					else {
						createLibrary(username, 'Portfolio', trx, function(error, res) {
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

	function deleteLibrary(username, name, trx, clb) {
		trx.let(name, function(s) {							///!!!!name will cause troubles if it is more than 1 word!!!!!
			s.delete('vertex', 'Library')
			.where('username = ' + username + ' and name = ' + name);
		});
		clb(null, true);
	}

	this.deleteDefaults = function(username, trx, clb) {
		deleteLibrary(username, 'Uploaded', trx, function(error, res) {
			deleteLibrary(username, 'Favorites', trx, function(error, res) {
				deleteLibrary(username, 'Portfolio', trx, function(error, res) {
					clb(null, true);
				});
			});
		});
	}
}
exports.Library = Library;