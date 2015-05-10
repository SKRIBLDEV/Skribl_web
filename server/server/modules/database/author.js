var RID = require('./rid.js');


 /** 
   *Create a new Author object, provides functionality to database Object.
   *@class
   *@classdesc Represents a domain-specific Author instance
   *@constructor 
 *@param {Object} db - database link
 */
function Author(db) {

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
		//XXX: gebruik gewoon (authors) ipv die typeof ... toestand
		//XXX: dus (authors && authors.length)
		if(typeof authors !== 'undefined' && authors.length) {
			var ctr = 0;
			//XXX: stop length hier eerst in een variabele ipv ze telkens van authors eruit te halen
			//XXX: dus var len = authors.length en gebruik ook dan len hieronder
			for (var i = 0; i < authors.length; i++) {
				addAuthor(authors[i]['firstName'], authors[i]['lastName'], i, trx, function(error, res) {
					//XXX: ctr++ gevolgd door ctr kan korter als '++ctr';
					//XXX: gebruik ook === ipv ==
					//XXX: zie ook opmerking van len hierboven
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
		//XXX: gebruik geen typeof hier (zie boven)
		//XXX: steek len opnieuw in een variabele
		if(typeof authors !== 'undefined' && authors.length) {
			var ctr = 0;
			//XXX: gebruik hier dan len
			for (var i = 0; i < authors.length; i++) {
				connectAuthor(authors[i], i, trx, function(error, res) {
					//XXX: zelfde 3 opmerkingen als hierboven
					//XXX: 1) gebruik ===
					//XXX: 2) gebruik ++ctr;
					//XXX: 3) gebruik len
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

	/**
	 * gets all authors of a publication
	 * @param  {String} pubId publication id
	 * @param  {callBack} clb   
	 * @return {Array<Object>}       returns an array with objects that contain firstname, lastname and author id
	 */
	this.getPubAuthors = function(pubId, clb) {
		db.query('select expand(in(\'AuthorOf\')) from ' + pubId)
		.then(function(authors) {
			//XXX: if test is hier niet nodig!
			//XXX: heel deze blok code kan in zeer kort met een map (cf. inf.)
			if(authors.length) {
				var res = [];
				var ctr = 0;
				//XXX: ctr & i lopen parallel, gebruik een gewone for lust
				//XXX: of gebruik hier map! (nog korter en gemakkelijker!)
				//XXX: authors.map(function(el) { return {firstName: el.firstName, ...})
				//XXX: is denk ik genoeg voor dit hele codeblok (met de clb dan nog wel) 
				for (var i = 0; i < authors.length; i++) {
					var obj = {
						firstName: authors[i].firstName,
						lastName: authors[i].lastName,
						rid: RID.getRid(authors[i])
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
		//XXX: geef meteen mijn callback mee?
		}).error(function(er) {
			clb(er);
		});
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
			//XXX: kan korter als clb(null, res.legnth? RID.getRid(res[0]):undefined)
			//XXX: of laat het gewoon zo staan, maar doe die undefined weg in de else-tak (is al default)
			//XXX: (tweede is eigenlijk beter denkn ik);
			if(res.length) {
				clb(null, RID.getRid(res[0]));
			}
			else {
				clb(null, undefined);
			}
		//XXX: idem
		}).error(function(er) {
			clb(er);
		});
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
		//XXX: geef direct mijn callback mee
		}).error(function(er) {
			clb(er);
		});
	}

	/**
	 * iterates over given author array and returns an array of objects containing firstnam, lastname and author id
	 * @param  {Array<String>} authors 
	 * @param  {callBack} clb     
	 * @return {Array<Object>}         array of objects containing firstnam, lastname and author id
	 */
	this.getAuthorObjects = function(authors, clb) {
		//XXX: gebruik len variabele
		if(authors && authors.length) {
			var ctr = 0;
			//XXX: gebruik len
			for (var i = 0; i < authors.length; i++) {
				getAuthor(authors[i], function(error, res) {
					if(error) {
						clb(error);
					}
					else {
						authors[ctr] = {firstName: res.firstName, lastName: res.lastName, id: RID.getRid(res)};
						//XXX: zelfde 3 opmerkingen als hierboven
						//XXX: 1) gebruik ===
						//XXX: 2) gebruik ++ctr;
						//XXX: 3) gebruik len
						ctr++;
						if(ctr == authors.length) {
							clb(null, authors);
						}
					}
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
		//XXX: geef direct mijn callback mee
		}).error(function(er) {
			callback(er);
		});
	};

	/**
	 * searches for an author with given name
	 * @param  {String} fName firstname
	 * @param  {String} lName lastname
	 * @param  {Integer} limit maximum number of results
	 * @param  {callBack} clb   
	 * @return {Array<Object>}       array of objects containing firstnam, lastname,  author id and user id if author is connected to a user profile
	 */
	this.searchAuthor = function(fName, lName, limit, clb) {
		function addPubs(authors, i, clb2) {
			function cleanup(arr, clb1) {
				var ctr = 0;
				//XXX: gebruik length variabele
				//XXX: ctr is hier volstrekt onnodig!
				//XXX: doe gewoon een for-lus, gevolgd door een callback
				//XXX: merk op dat j & ctr volledig parallel lopen...
				//XXX: en er dus redundantie is
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
			//XXX: gebruik len variabele
			for (var i = 0; i < authors.length; i++) {
				addPubs(authors, i, function(error, nr) {
					addProfile(authors, nr, function(error, res) {
						authors[nr].authorId = RID.getRid(authors[nr]);
						delete authors[nr]['@rid'];
						delete authors[nr]['@class'];
						delete authors[nr]['@type'];
						delete authors[nr]['out_AuthorOf'];
						delete authors[nr]['in_IsAuthor'];
						//XXX: zelfde 3 opmerkingen als hierboven
						//XXX: 1) gebruik ===
						//XXX: 2) gebruik ++ctr;
						//XXX: 3) gebruik len	
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
		//XXX: geef direct mijn callback mee
		}).error(function(er) {
			clb(er);
		});
	}

}

exports.Author = Author;