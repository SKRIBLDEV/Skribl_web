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
			.from('$publication')
			.to('$' + trx_id);
		});
		callback(null, true);
	};

	this.addAuthors = function(authors, trx, callback) {
		var ctr = 0;
		for (var i = 0; i < authors.length; i++) {
			addAuthor(authors[i]['fName'], authors[i]['lName'], i, trx, function(error, res) {
				ctr++;
				if(ctr == authors.length) {
					callback(null, true);
				}
			});
		};
	};

	function connectAuthor(id, trx_id, trx, callback) {
		trx.let(trx_id, function(s) {
			s.select().from(id);
		})
		.let('authorEdge', function(s) {
			s.create('edge', 'AuthorOf')
			.from('$publication')
			.to('$' + trx_id);
		});
		callback(null, true);
	};

	this.connectAuthors = function(authors, trx, callback) {
		var ctr = 0;
		for (var i = 0; i < authors.length; i++) {
			addAuthor(authors[i], i, trx, function(error, res) {
				ctr++;
				if(ctr == authors.length) {
					callback(null, true);
				}
			});
		};
	};

	/**
	 * adds an author with given names to database and returns record id OR returns record id if author already exists.
	 * @param {String}   fName    firstname of author
	 * @param {String}   lName    lastname of author
	 * @param {callBack} callback
	 * @return {String}	 callback called with authorRid
	 */
	/*
	this.addAuthor = function(fName, lName, callback) {
		db.select().from('Author').where({firstName: fName, lastName: lName}).all()
		.then(function(authors) {
			if(authors.length) {
				var author = authors[0];
				var authorRid = RID.getRid(author);
				callback(null, authorRid)
			}
			else {

				db.vertex.create({
					'@class': 'Author',
					firstName: fName,
					lastName: lName
				 })
				.then(function(author) {
					var authorRid = RID.getRid(author);
					console.log('here');
					callback(null, authorRid);
				});
			}
		});
	};
	*/


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
		});
	};

}

exports.Author = Author;