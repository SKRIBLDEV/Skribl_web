

var RID = require('./rid.js');
var Author = require('./author.js');

function Library(db, myDB) {


	var AUT = new Author.Author(db, myDB);

	/**
	 * creates a library and connects it to given user
	 * @param  {String} user username
	 * @param  {String} name libraryname
	 * @param  {Object} trx  transaction
	 * @param  {callBack} clb  
	 */
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

	/**
	 * uses createLibrary to add library to user if user doesn't have library with same name
	 * @param {String} user username
	 * @param {String} name libraryname
	 * @param {callBack} clb  
	 */
	 myDB.addLibrary = function(user, name, clb) {
	 	db.select().from('Library').where('username = \'' + user + '\' and name = \'' + name + '\'').all()
	 	.then(function(res) {
	 		if(res.length === 0) {
		 		var trx = db.let('user', function(s) {
					s.select().from('User').where('username = \'' + user + '\'');
				});
				createLibrary(user, name, trx, function(error, res) {
					trx.commit().return('$user').all()
					.then(function(user) {
						clb(null, true);
					}).error(function(er) {
						clb(er);
					});
				});	
	 		}
	 		else {
	 			clb(new Error('library of user: ' + user + ' with name: ' + name + ', already exists'));
	 		}
	 	}).error(clb);

	}

	/**
	 * adds a publication to a library if library doesn't already contain publication
	 * @param {String} user    username of library owner
	 * @param {String} library library name
	 * @param {String} id      publication id
	 * @param {callBack} clb    
	 */
	myDB.addToLibrary = function(user, library, id, clb) {
		db.select('@rid').from('Publication').where('@rid = ' + id).all()
		.then(function(res) {
			if(res.length) {
				db.query('select * from (select expand(out(\'HasPublication\')) from Library where username = \'' + user + '\' and name = \'' + library + '\') where @rid = \'' + id + '\'')
				.then(function(pubs) {
					if(pubs.length === 0) {
						db.select().from('Library').where({username: user, name: library}).all()
						.then(function (libraries) {
							if(libraries.length) {
								var libRid = RID.getRid(libraries[0]);
								db.create('edge', 'HasPublication')
								.from(libRid)
								.to(id).one()
								.then(function() {
									clb(null, true);
								}).error(function(er) {
									clb(er);
								});
							}
							else {
								clb(new Error('Library does not exist'));
							}
						}).error(clb);
					}
					else {
						clb(new Error('publication with id: ' + id + ', is already in library'));
					}
				}).error(clb);
			}
			else {
				clb(new Error('Publication with id: ' + id + ' does not exist'));
			}
		}).error(clb);
		
		
	}

	/**
	 * removes a publication from a library
	 * @param  {String} user    username of library owner
	 * @param  {String} library library name
	 * @param  {String} id      publication id
	 * @param  {callBack} clb     
	 */
	myDB.removeFromLibrary = function(user, library, id, clb) {
		db.select().from('Library').where('username = \'' + user + '\' and name = \'' + library + '\'').all()
		.then(function(res) {
			if(res.length) {
				db.select().from(id).all()
				.then(function(res) {
					if(res.length) {
						db.let('library', function(s) {
							s.select().from('Library').where('username = \'' + user + '\' and name = \'' + library + '\'');
						})
						.let('delEdge', function(s) {
							s.delete('edge', 'HasPublication')
							.from('$library')
							.to(id)
						})
						.commit().return('$library').all()
						.then(function(res) {
							clb(null, true);
						}).error(function(er) {
							clb(er);
						});
					}
					else {
						clb(new Error('Publication does not exist'));
					}
				}).error(clb);
			}
			else {
				clb(new Error('library does not exist'));
			}
		}).error(clb);
	}

	/**
	 * returns an array with all library names of given user
	 * @param  {String} user username
	 * @param  {callBack} clb  
	 * @return {Array<String>}      array of library names
	 */
	myDB.loadLibraries = function(user, clb) {
		function getName(array, callB) {
			var arrLength = array.length
			for (var i = 0; i < arrLength; i++) {
				array[i] = array[i].name;
			};
			callB(null, array);
		}

		db.query('select name from (select expand(out(\'HasLibrary\')) from User where username = \'' + user + '\')')
		.then(function(res) {
			if(res.length) {
				getName(res, clb);
			}
			else {
				clb(new Error('no libraries found'));
			}
		}).error(clb);
	}

	/**
	 * returns all publications in given library
	 * @param  {String} user    username of library owner
	 * @param  {String} library name of library
	 * @param  {callBack} clb     
	 * @return {Array<Object>}         publication array
	 */
	 myDB.loadLibrary = function(user, library, clb) {

		function prepResults(array, callB) {
			var arrLength = array.length;
			var ctr = 0;
			var ctr2 = 0;
			for (var i = 0; i < arrLength; i++) {
				if(array[i]['authors']) {
					array[i].authors = RID.transformRids(array[i]['authors']);
						AUT.getAuthorObjects(array[i]['authors'], function(error, res) {
							if(error) {
								clb(error);
							}
							array[ctr2] = {id: RID.transformRid(array[ctr2]['rid']), title: array[ctr2]['title'], type: array[ctr2]['class'], authors: array[ctr2]['authors']};
						if(++ctr2+ctr === arrLength) {
							callB(null, array);
						} 
					});
				}
				else {
					array[i] = {id: RID.transformRid(array[i]['rid']), title: array[i]['title'], type: array[i]['class']};
					if(++ctr+ctr2 === arrLength) {
						callB(null, array);
					} 
				}
			};
		}

		db.query('select from Library where username = \'' + user + '\' and name = \'' + library + '\'')
		.then(function(res) {
			if(res.length) {
				db.query('select title, @rid, @class, in(\'AuthorOf\') as authors from (select expand(out(\'HasPublication\')) from Library where username = \'' + user + '\' and name = \'' + library + '\')')
				.then(function(publications) {
					if(publications.length) {
						prepResults(publications, function(error, res) {
							clb(null, res);
						})
					}
					else{
						clb(null, []);
					}
				}).error(clb);
			}
			else {
				clb(new Error('library: ' + library + ' of user: ' + user + 'does not exist'));
			}
		}).error(clb);
	 	
	}

	/**
	 * add default libraries (Uploaded, Favorites, Portfolio) to user
	 * @param {String} username 
	 * @param {Object} trx      transaction
	 * @param {callBack} clb      
	 */
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

	/**
	 * removes a given library from given user. (will not destroy publications in library)
	 * @param  {String} user username
	 * @param  {String} name name of library
	 * @param  {callBack} clb  
	 */
	myDB.removeLibrary = function(user, name, clb) {
		db.select().from('Library').where('username = \'' + user + '\' and name = \'' + name + '\'').all()
		.then(function(res) {
			if(res.length) {
				if(res[0].name === 'Uploaded' || res[0].name == 'Favorites' || res[0].name == 'Portfolio') {
					clb(new Error('removing library: ' + name + ' not allowed'));
				}
				else {
					var trx = db.let('temp', function(s) {
						s.select().from('#1:1');
					});
					deleteLibrary(user, name, trx, function(error, res) {
						trx.commit().return().all()
						.then(function() {
							clb(null, true);
						}).error(clb);
					});
				}
			}
			else {
				clb(new Error('user: ' + user + ' has no library with name: ' + name));
			}
		}).error(clb);
	}

	/**
	 * deletes library
	 * @param  {String} username 
	 * @param  {String} name     name of library
	 * @param  {Object} trx      transaction
	 * @param  {callBack} clb      
	 */
	function deleteLibrary(username, name, trx, clb) {
		trx.let(name, function(s) {							///!!!!name will cause troubles if it is more than 1 word!!!!!
			s.delete('vertex', 'Library')
			.where('username = \'' + username + '\' and name = \'' + name + '\'');
		});
		clb(null, true);
	}

	/**
	 * delete the defaultLibraries from a user
	 * @param  {String} username 
	 * @param  {Object} trx      transaction
	 * @param  {callBack} clb      
	 */
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