var RID = require('./rid.js');


 /** 
   *Create a new Author object, provides functionality to database Object.
   *@class
   *@classdesc Represents a domain-specific Author instance
   *@constructor 
 *@param {Object} db - database link
 */
function Author(db) {

	function addAuthor(fName, lName, trx_id, trx, callback) {
		trx.let(trx_id, function(s) {
			s.create('vertex', 'Author')
			.set({
				firstName: fName,
				lastName: lName			
			});
		})
		.let('authorEdge', function(s) {
			s.create('edge', 'AuthorOf')
			.from('$' + trx_id)
			.to('$publication');
		});
		callback(null, true);
	};

	this.createAuthor = function(fName, lName, trx, callback) {
		trx.let('author', function(s) {
			s.create('vertex', 'Author')
			.set({
				firstName: fName,
				lastName: lName			
			});
		})
		.let('isAuthorEdge', function(s) {
			s.create('edge', 'isAuthor')
			.from('$user')
			.to('$author');
		});
		callback(null, true);
	};

	this.addAuthors = function(authors, trx, callback) {
		if(typeof authors !== 'undefined' && authors.length) {
			var ctr = 0;
			for (var i = 0; i < authors.length; i++) {
				addAuthor(authors[i]['firstName'], authors[i]['lastName'], i, trx, function(error, res) {
					ctr++;
					if(ctr == authors.length) {
						callback(null, true);
					}
				});
			};
		}
		else {
			callback(null, true);
		}
	};

	function connectAuthor(id, trx_id, trx, callback) {
		trx.let(trx_id, function(s) {
			s.select().from(id);
		})
		.let('authorEdge', function(s) {
			s.create('edge', 'AuthorOf')
			.from('$' + trx_id)
			.to('$publication');
		});
		callback(null, true);
	};

	this.connectAuthors = function(authors, trx, callback) {
		if(typeof authors !== 'undefined' && authors.length) {
			var ctr = 0;
			for (var i = 0; i < authors.length; i++) {
				connectAuthor(authors[i], i, trx, function(error, res) {
					ctr++;
					if(ctr == authors.length) {
						callback(null, true);
					}
				});
			};
		}
		else {
			callback(null, true);
		}
	};

	
	this.getPubAuthors = function(pubId, clb) {
		db.query('select expand(in(\'AuthorOf\')) from ' + pubId)
		.then(function(authors) {
			if(authors.length) {
				var res = [];
				var ctr = 0;
				for (var i = 0; i < authors.length; i++) {
					var obj = {
						firstName: authors[i].firstName,
						lastName: authors[i].lastName
					};
					res.push(obj);
					ctr++;
					if(ctr == authors.length) {
						clb(null, res);
					}
				};
			}
			else {
				clb(null, []);
			}
		}).error(function(er) {
			clb(er);
		});
	}

	/**
	 * will return an object with author info.	
	 * @param  {String}   fName    firstname
	 * @param  {String}   lName    lastname
	 * @param  {callback} callback 
	 * @return {Object}   calls callback with resulting Object.
	 */
	this.loadAuthor = function(fName, lName, callback) {
		db.select().from('Author').where({firstName: fName, lastName: lName}).all()
		.then(function(authors) {
			if(authors.length) {
				callback(null, authors[0]);
			}
			else {
				callback(new Error('Author with name: ' + fName + ' ' + lName + ' does not exist.'));
			}
		}).error(function(er) {
			callback(er);
		});
	};

	this.searchAuthor = function(fName, lName, limit, clb) {
		function addPubs(authors, i, clb2) {
			function cleanup(arr, clb1) {
				var ctr = 0;
				for (var j = 0; j < arr.length; j++) {
					arr[j] = {id: RID.transformRid(arr[j].rid), title: arr[j].title};
					ctr++;
					if(ctr == arr.length) {
						clb1(null, arr);
					}
				};

			}

			db.query('select @rid, title from (select expand(out(\'AuthorOf\')) from ' + RID.getRid(authors[i]) + ')').all()
			.then(function(res) {
				if(res.length) {
					cleanup(res, function(error, arr) {
						authors[i].publications = arr;
						clb2(null, i);
					});
				}
				else {
					authors[i].publications = [];
					clb2(null, i);
				}
			}).error(function(er) {
				clb(er);
			});
		}

		function addProfile(authors, i, clb3) {
			db.query('select from (select expand(in(\'IsAuthor\')) from ' + RID.getRid(authors[i]) + ')').all()
			.then(function(res) {
				if(res.length) {
					authors[0].profile = res[0].username;
					clb3(null, true);
				}
				else {
					clb3(null, authors);	
				}
			}).error(function(er) {
				clb(er);
			});
		}

		function prepResArray(authors, clb4) {
			var ctr = 0;
			for (var i = 0; i < authors.length; i++) {
				addPubs(authors, i, function(error, nr) {
					addProfile(authors, nr, function(error, res) {
						authors[nr].authorId = RID.getRid(authors[nr]);
						delete authors[nr]['@rid'];
						delete authors[nr]['@class'];
						delete authors[nr]['@type'];
						delete authors[nr]['out_AuthorOf'];
						delete authors[nr]['in_IsAuthor'];
						ctr++;
						if(ctr == authors.length) {
							clb4(null, authors);
						}
					});
				});
			};
		}

		db.select().from('Author').where('firstName like \'%' + fName + '%\' and lastName like \'%' + lName + '%\'').all()
		.then(function(res) {
			if(res.length) {
				prepResArray(res, clb);
			}
			else {
				clb(null, []);
			}
		}).error(function(er) {
			clb(er);
		});
	}

}

exports.Author = Author;