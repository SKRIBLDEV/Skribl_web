

var RID = require('./rid.js');
var fs = require('fs');
var Path = require('path');
var Author = require('./author.js');

 /** 
   *Create a new Publication object, provides functionality to database Object.
   *@class
   *@classdesc Represents a domain-specific publication instance
   *@constructor 
 *@param {Object} db - database link
 */
function Publication(db) {

	var AUT = new Author.Author(db);

	/**
	 * Will add a publication and link it with the proper uploader and author.
	 * @param {Object}   pubRecord object which contains information about the publication.
	 * @param {callBack} callback 
	 * @return {String}	 callback called with publicationRid
	 */
	
	 this.addPublication = function(fileObj, uploader, callback) {
		var publicationRid;
		var fileName = fileObj.originalname;

		/**
		 * will load a file into a buffer as base64 encoded.
		 * @param  {String}   path     path to file
		 * @param  {callBack} callback 
		 * @return {Object}   calls callback with resulting data
		 */
		function getFile(path, clb) {
			var file;

			fs.readFile(path, 'base64', function(error, data) {
				if(error) {
					callback(error);
				}
				else {
					clb(null, data);
				}
			});
		}
	
	/**
		 * Will add vertices and links to database.
		 * @param  {Object} error dummy var, will never catch Error.
		 * @param  {Object} data  data loaded by getFile	
		 */
		function createPub(error, data) {
			db.select().from('User').where({username: uploader}).all()
			.then(function(users) {
				if(users.length) {
					db.query('create vertex Publication set data = \'' + data + '\', fileName = \'' + fileName + '\'')
					.then(function(publication) {
						publicationRid = RID.getRid(publication[0]);		
						var userRid = RID.getRid(users[0]);
						db.select().from('Library').where({username: uploader, name: 'Uploaded'}).all()
						.then(function(Libraries) {
							var libRid = RID.getRid(Libraries[0]);
							db.edge.from(libRid).to(publicationRid).create({
							'@class': 'HasPublication'
							})
							.then(function() {
								callback(null, publicationRid);
							});
						});
						
					});
				}
				else {
					callback(new Error('User with username: ' + pubRecord.getUploader() + ' does not exist.'));
				}
			});	
		}
		getFile(fileObj.path, createPub);
	};


	/**
	 * constructs a function that takes a path and a callback, to load a file from database to a given location.
	 * @param  {String}   id       record id of publication
	 * @param  {callBack} callback
	 * @return {Object}   a function is returned.
	 */
	this.loadPublication = function(id, path, clb) {
		db.record.get(id)
		.then(function(res) {
			fs.writeFile(_dirname + path, res.data, function (err) {
  				if (err) {
  					clb(new Error(err));
  				}
  				else {
  					clb(null, res.fileName);
  				}
			});
		});
	}

	this.getPublication = function(id, clb) {
		db.record.get(id)
		.then(function(res) {
			if(res) {
				var metObject = res;
				delete metObject.data;
				delete metObject['@type'];
				delete metObject['@class'];
				delete metObject['in_HasPublication'];
				delete metObject['@version'];
				clb(null, metObject);
			}
			else {
				clb(new Error('Publication not found'));
			}
		});
		
	}

	this.removePublication = function(id, callback) {
		db.query('select from Publication where @rid = ' + id)
		.then(function(publications) {
			if(publications.length) {
				db.vertex.delete(id)
				.then(function(nr) {
					callback(null, true);
				});
			}
			else {
				callback(null, true);
			}
		});
	};

	this.uploadedBy = function(id, clb) {
		//
		//db.query('traverse V.in, E.out from ' + id + ' while $depth < 2 and (@class = \'Library\' and name = \'Uploaded\')')
		db.query('select username from (select expand( in(\'HasPublication\')) from ' + id + ') where name = \'Uploaded\'')
			.then(function(libraries) {
				if(libraries.length) {
					clb(null, libraries[0].username);
				}
				else {
					
					clb(new Error('library not found, error in function: uploadedBy in database->publication.js'));
				}
			});
	}

	this.queryPublication = function(criteria, clb) {
		/*
		will search with
		title
		author ->not yet
		year
		uploader
		publisher
		journal
		 */
		
		 function startQueryTitle(clb) {
		 	if(criteria.title === undefined) {
		 		db.select().from('Publication').all()
		 		.then(function(publications) {
		 			queryYear(RID.getRids(publications), clb);
		 		});
		 	}
		 	else {
		 		db.select().from('Publication').where({title: criteria.title}).all()
		 		.then(function(publications) {
		 			queryYear(RID.getRids(publications), clb);
		 		});
		 	}
		 }

		 function queryYear(tempRes, clb) {
		 	if(criteria.year === undefined) {
		 		queryPublisher(tempRes, clb);
		 	}
		 	else {
		 		db.select().from(tempRes).where({year: criteria.year}).all()
		 		.then(function(publications) {
		 			queryJournal(RID.getRids(publications), clb);
		 		});
		 	}
		 }

		 function queryJournal(tempRes, clb) {
		 	if(criteria.jourbal === undefined) {
		 		queryPublisher(tempRes, clb);
		 	}
		 	else {
		 		db.select().from(tempRes).where({journal: criteria.journal}).all()
		 		.then(function(publications) {
		 			queryPublisher(RID.getRids(publications), clb);
		 		});
		 	}
		 }

		 function queryPublisher(tempRes, clb) {
		 	if(criteria.publisher === undefined) {
		 		queryUploader(tempRes, clb);
		 	}
		 	else {
		 		db.select().from(tempRes).where({publisher: criteria.publisher}).all()
		 		.then(function(publications) {
		 			queryUploader(RID.getRids(publications), clb);
		 		});
		 	}
		 }

		 function queryUploader(tempRes, clb) {
		 	if(criteria.uploader === undefined) {
		 		queryAuthors(tempRes, clb);
		 	}
		 	else {
		 		db.query('select * from (select in(\'HasPublication\') from (select * from ' + tempRes +')) where name = \'Uploaded\' and username = \'' + criteria.uploader + '\'')
				.then(function(publications) {
					queryAuthors(RID.getRids(publications), clb);
				});
		 	}
		 }

		 /*
		 function queryAuthors(tempRes, clb) {
		 	if(criteria.authors === undefined) {
		 		queryAuthors(tempRes, clb);
		 	}
		 	else {
		 		db.query('select * from (select in(\'HasPublication\') from (select * from ' + tempRes +')) where @class = \'Author\' and Username = \'' + criteria.uploader + '\'')
				.then(function(publications) {
					queryAuthors(RID.getRids(publications), clb);
				});
		 	}
		 }
		 */
		
		function queryAuthors(tempRes, clb) {
			giveRes(tempRes, clb);
		}

		function giveRes(tempRes, clb) {
			clb(null, tempRes);
		}

	}
//old function
/*
	this.updatePublication = function(id, metObject, clb) {
		db.update('Publication').set({fileName: metObject.fileName,
									  keywords: metObject.keywords,
									  year: metObject.year,
									  abstract: metObject.abstract,
									  title: metObject.title,
									  articleUrl: metObject.articleUrl,
									  volume: metObject.volume,
									  number: metObject.number,
									  citations: metObject.citations,
									  journal: metObject.journal,
									  publisher: metObject.publisher})
		.where({'@rid': id}).scalar()
		.then(function() {
			clb(null, true);
		});
	}
	*/
	this.updatePublication = function(id, metObject, clb) {
		db.exec(
			'update Publication set fileName = \'' + metObject.fileName +
									'\', keywords = \'' + metObject.keywords +
									'\', year = \'' + metObject.year +
									'\', abstract = \'' + metObject.abstract +
									'\', title = \'' + metObject.title +
									'\', articleUrl = \'' + metObject.articleUrl +
									'\', volume = \'' + metObject.volume +
									'\', number = \'' + metObject.number +
									'\', citations = \'' + metObject.citations +
									'\', journal = \'' + metObject.journal +
									'\', publisher = \'' + metObject.publisher +
			' where @rid = ' + id)
		.then(function() {
			clb(null, true);
		});
	}
}
exports.Publication = Publication;
