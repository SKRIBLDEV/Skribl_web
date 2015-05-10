var RID = require('./rid.js');


 /** 
   *Create a new Author object, provides functionality to database Object.
   *@class
   *@classdesc Represents a domain-specific Author instance
   *@constructor 
 *@param {Object} db - database link
 */
function Author(db, myDB) {

	//XXX: zie algemene opmerking in affiliation.js

	/**
	 * adds an author to database and connects it to a publication.
	 * @param {String}   fName    firstname of author
	 * @param {String}   lName    lastname of author
	 * @param {Integer}   trx_id   nr to help identify new author in the transaction
	 * @param {Object}   trx      transaction
	 */
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
			.to('$publication')
			.set({
				dummy: 'dummy'
			});
		});
		callback(null, true);
	};

	/**
	 * adds an author to the database and connects it to a user
	 * @param  {String}   fName    firstname of author
	 * @param  {String}   lName    lastname of author
	 * @param  {Object}   trx      transaction
	 * @param  {callBack} callback 
	 */
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

	/**
	 * uses addAuthor to add given authors to database
	 * @param {Array<String>}   authors  
	 * @param {transaction}   trx      transaction
	 * @param {callBack} callback 
	 */
	this.addAuthors = function(authors, trx, callback) {
		var autLength = authors.length;
		if(authors && autLength) {
			var ctr = 0;
			for (var i = 0; i < autLength; i++) {
				addAuthor(authors[i]['firstName'], authors[i]['lastName'], i, trx, function(error, res) {
					if(++ctr === autLength) {
						callback(null, true);
					}
				});
			};
		}
		else {
			callback(null, true);
		}
	};

	/**
	 * connects existing author to a publication
	 * @param  {String}   id       author id
	 * @param  {Integer}   trx_id   nr to help distinguish author in transaction
	 * @param  {Object}   trx      transaction
	 * @param  {callBack} callback 
	 */
	function connectAuthor(id, trx_id, trx, callback) {
		trx.let(trx_id, function(s) {
			s.select().from(id);
		})
		.let('authorEdge', function(s) {
			s.create('edge', 'AuthorOf')
			.from('$' + trx_id)
			.to('$publication')
			.set({
				dummy: 'dummy'
			});
		});
		callback(null, true);
	};

	/**
	 * uses connectAuthor to connect multiple authors to a publication
	 * @param  {Array<String>}   authors  
	 * @param  {Object}   trx      transaction
	 * @param  {callBack} callback 
	 */
	this.connectAuthors = function(authors, trx, callback) {
		var autLength = authors.length;
		if(authors && autLength) {
			var ctr = 0;
			for (var i = 0; i < autLength; i++) {
				connectAuthor(authors[i], i, trx, function(error, res) {
					if(++ctr === autLength) {
						callback(null, true);
					}
				});
			};
		}
		else {
			callback(null, true);
		}
	};

	/**
	 * gets all authors of a publication
	 * @param  {String} pubId publication id
	 * @param  {callBack} clb   
	 * @return {Array<Object>}       returns an array with objects that contain firstname, lastname and author id
	 */
	this.getPubAuthors = function(pubId, clb) {
		db.query('select expand(in(\'AuthorOf\')) from ' + pubId)
		.then(function(authors) {
			var autLength = authors.length;
			//XXX: heel deze blok code kan in zeer kort met een map (cf. inf.)
				var res = [];
				//XXX: of gebruik hier map! (nog korter en gemakkelijker!)
				//XXX: authors.map(function(el) { return {firstName: el.firstName, ...})
				//XXX: is denk ik genoeg voor dit hele codeblok (met de clb dan nog wel) 
				for (var i = 0; i < autLength; i++) {
					var obj = {
						firstName: authors[i].firstName,
						lastName: authors[i].lastName,
						rid: RID.getRid(authors[i])
					};
					res.push(obj);
				};
				clb(null, res);
		}).error(clb);
	}

	/**
	 * given userId  retrieves id of connected author profile 
	 * @param  {String} userId 
	 * @param  {callBack} clb    
	 * @return {String}        author id
	 */
	this.getAuthorId = function(userId, clb) {
		db.select('expand(out(\'IsAuthor\')) from ' + userId).all()
		.then(function(res) {
			if(res.length) {
				clb(null, RID.getRid(res[0]));
			}
			else {
				clb(null);
			}
		}).error(clb);
	}

	/**
	 * given id retrieves author data
	 * @param  {String} authorId 
	 * @param  {callBack} clb      
	 * @return {Object}          object containing author data
	 */
	 function getAuthor(authorId, clb) {
		db.record.get(authorId)
		.then(function(author) {
			clb(null, author);
		}).error(clb);
	}

		/**
	 * given id retrieves username if it exists, otherwise undefined
	 * @param  {String} authorId 
	 * @param  {callBack} clb      
	 * @return {Object}          object containing author data
	 */
	 function getAuthorUsername(authorId, clb) {
		db.select('expand(in(\'IsAuthor\')) from ' + authorId).all()
		.then(function(res) {
			if(res.length) {
				clb(null, res[0].username);
			}
			else {
				clb(null);
			}
		}).error(clb);
	}

	/**
	 * iterates over given author array and returns an array of objects containing firstnam, lastname and author id
	 * @param  {Array<String>} authors 
	 * @param  {callBack} clb     
	 * @return {Array<Object>}         array of objects containing firstnam, lastname and author id
	 */
	this.getAuthorObjects = function(authors, clb) {
		var autLength = authors.length;
		if(authors && autLength) {
			var ctr = 0;
			for (var i = 0; i < autLength; i++) {
				getAuthor(authors[i], function(error, res) {
					getAuthorUsername(RID.getRid(res), function(error, usrname) {
						if(error) {
							clb(error);
						}
						else {
							authors[ctr] = {firstName: res.firstName, lastName: res.lastName, id: RID.getRid(res), username: usrname};
							if(++ctr === autLength) {
								clb(null, authors);
							}
						}
					});
				});
			};
		}
		else {
			clb(null, []);
		}
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
		}).error(callback);
	};

	/**
	 * searches for an author with given name
	 * @param  {String} fName firstname
	 * @param  {String} lName lastname
	 * @param  {Integer} limit maximum number of results
	 * @param  {callBack} clb   
	 * @return {Array<Object>}       array of objects containing firstnam, lastname,  author id and user id if author is connected to a user profile
	 */
	myDB.searchAuthor = function(fName, lName, limit, clb) {
		function addPubs(authors, i, clb2) {
			function cleanup(arr, clb1) {
				var arrLength = arr.length;
				for (var j = 0; j < arrLength; j++) {
					arr[j] = {id: RID.transformRid(arr[j].rid), title: arr[j].title};
				};
				clb1(null, arr);
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
			}).error(clb);
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
			}).error(clb);
		}

		function prepResArray(authors, clb4) {
			var autLength = authors.length;
			var ctr = 0;
			for (var i = 0; i < autLength; i++) {
				addPubs(authors, i, function(error, nr) {
					addProfile(authors, nr, function(error, res) {
						authors[nr].authorId = RID.getRid(authors[nr]);
						delete authors[nr]['@rid'];
						delete authors[nr]['@class'];
						delete authors[nr]['@type'];
						delete authors[nr]['out_AuthorOf'];
						delete authors[nr]['in_IsAuthor'];
						if(++ctr === autLength) {
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
		}).error(clb);
	}

}

exports.Author = Author;