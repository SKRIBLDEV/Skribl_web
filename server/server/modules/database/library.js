

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

	 this.addLibrary = function(user, name, clb) {
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
	 	}).error(function(er) {
			clb(er);
		});

	}

	this.addToLibrary = function(user, library, id, clb) {
		db.select('@rid').from('Pulication').where('@rid = ' + id).all()
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
						}).error(function(er) {
							clb(er);
						});
					}
					else {
						clb(new Error('publication with id: ' + id + ', is already in library'));
					}
				}).error(function(er) {
					clb(er);
				});
			}
			else {
				clb(new Error('Publication with id: ' + id + ' does not exist'));
			}
		}).error(function(er) {
			clb(er);
		});
		
		
	}

	this.removeFromLibrary = function(user, library, id, clb) {
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
				}).error(function(er) {
					clb(er);
				});
			}
			else {
				clb(new Error('library does not exist'));
			}
		}).error(function(er) {
			clb(er);
		});
		

	}


	this.loadLibraries = function(user, clb) {
		function getName(array, callB) {
			var ctr = 0;
			for (var i = 0; i < array.length; i++) {
				array[ctr] = array[ctr].name;
				ctr++;
				if(ctr == array.length) {
					callB(null, array);
				}
			};
		}

		db.query('select name from (select expand(out(\'HasLibrary\')) from User where username = \'' + user + '\')')
		.then(function(res) {
			if(res.length) {
				getName(res, clb);
			}
			else {
				clb(new Error('no libraries found'));
			}
		}).error(function(er) {
			clb(er);
		});
	}

	 this.loadLibrary = function(user, library, clb) {

		function prepResults(array, callB) {
			var ctr = 0;
			for (var i = 0; i < array.length; i++) {
				array[ctr] = {id: RID.transformRid(array[ctr]['rid']), title: array[ctr]['title']};
				ctr++
				if(ctr == array.length) {
					callB(null, array);
				} 
			};
		}
		db.query('select from Library where username = \'' + user + '\' and name = \'' + library + '\'')
		.then(function(res) {
			if(res.length) {
				db.query('select title, @rid from (select expand(out(\'HasPublication\')) from Library where username = \'' + user + '\' and name = \'' + library + '\')')
				.then(function(publications) {
					if(publications.length) {
						prepResults(publications, function(error, res) {
							clb(null, res);
						})
					}
					else{
						clb(null, []);
					}
				}).error(function(er) {
					clb(er);
				});
			}
			else {
				clb(new Error('library: ' + library + ' of user: ' + user + 'does not exist'));
			}
		}).error(function(er) {
			clb(er);
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

	this.removeLibrary = function(user, name, clb) {
		db.select().from('Library').where('username = \'' + user + '\' and name = \'' + name + '\'').all()
		.then(function(res) {
			if(res.length) {
				if(res[0].name == 'Uploaded' || res[0].name == 'Favorites' || res[0].name == 'Portfolio') {
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
						}).error(function(er) {
							clb(er);
						});
					});
				}
			}
			else {
				clb(new Error('user: ' + user + ' has no library with name: ' + name));
			}
		}).error(function(er) {
			clb(er);
		});
	}

	function deleteLibrary(username, name, trx, clb) {
		trx.let(name, function(s) {							///!!!!name will cause troubles if it is more than 1 word!!!!!
			s.delete('vertex', 'Library')
			.where('username = \'' + username + '\' and name = \'' + name + '\'');
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