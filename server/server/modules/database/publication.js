

var RID = require('./rid.js');
var fs = require('fs');
var Path = require('path');
var Author = require('./author.js');
var researchDomain = require('./researchdomain.js');
var keyword = require('./keyword.js');
var Oriento = require('oriento');

 /** 
   *Create a new Publication object, provides functionality to database Object.
   *@class
   *@classdesc Represents a domain-specific publication instance
   *@constructor 
 *@param {Object} db - database link
 */
function Publication(db) {

	var AUT = new Author.Author(db);
	var RD = new researchDomain.ResearchDomain(db);
	var Kw = new keyword.Keyword(db);

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

	 this.addJournal = function(title, fileObj, uploader, callback) {
		var fileName = fileObj.originalname;
	/**
		 * Will add vertices and links to database.
		 * @param  {Object} error dummy var, will never catch Error.
		 * @param  {Object} data  data loaded by getFile	
		 */
		function createPub(error, data) {
			db.select().from('Publication').where({title: title}).all()
			.then(function(res) {
				if(res.length) {
					callback(new Error('publication with title: ' + title + ' already exists.'))
				}
				else {
					var trx = db.let('library', function(s) {
						s.select().from('Library').where({username: uploader, name: 'Uploaded'});
					});
					db.create('vertex', 'Journal')
					.set({
						title: title,
						data: data,
						fileName: fileName
					}).one()
					.then(function(res) {
						trx.let('publication', function(s) {
							console.log(res);
							s.select().from(RID.getORid(res));
						})
						.let('pubEdge', function(s) {
							s.create('edge', 'HasPublication')
							.from('$library')
							.to('$publication');
						})
						.commit().return('$publication').all()
						.then(function(pub) {
							callback(null, RID.getRid(pub[0]));
						});
					});
				}
			});
		}
		getFile(fileObj.path, createPub);
	};

	/**
	 * Will add a publication and link it with the proper uploader and author.
	 * @param {Object}   pubRecord object which contains information about the publication.
	 * @param {callBack} callback 
	 * @return {String}	 callback called with publicationRid
	 */
	 this.addProceeding = function(title, fileObj, uploader, callback) {
		var fileName = fileObj.originalname;	
	/**
		 * Will add vertices and links to database.
		 * @param  {Object} error dummy var, will never catch Error.
		 * @param  {Object} data  data loaded by getFile	
		 */
		function createPub(error, data) {
			db.select().from('Publication').where({title: title}).all()
			.then(function(res) {
				if(res.length) {
					callback(new Error('publication with title: ' + title + ' already exists.'))
				}
				else {
					var trx = db.let('library', function(s) {
						s.select().from('Library').where({username: uploader, name: 'Uploaded'});
					});
					db.create('vertex', 'Proceeding')
					.set({
						title: title,
						data: data,
						fileName: fileName
					}).one()
					.then(function(res) {
						trx.let('publication', function(s) {
							console.log(res);
							s.select().from(RID.getORid(res));
						})
						.let('pubEdge', function(s) {
							s.create('edge', 'HasPublication')
							.from('$library')
							.to('$publication');
						})
						.commit().return('$publication').all()
						.then(function(pub) {
							callback(null, RID.getRid(pub[0]));
						});
					});
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
			fs.writeFile(path, res.data, function (err) {
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

	this.updatePublication = function(id, metObject, clb) {
		db.select().from(id).all()
		.then(function(res) {
			if(res[0]['@class'] == metObject.type) {
				var trx;
				if(metObject.type == 'Journal') {
					var trx = db.let('publication', function(s) {
						s.update(id)
						.set({
							journal: metObject.journal,
							publisher: metObject.publisher,
							volume: metObject.volume,
							number: metObject.number
						});
					});					
				}
				else {
					var trx = db.let('publication', function(s) {
						s.update(id)
						.set({
							booktitle: metObject.booktitle,
							organisation: metObject.organisation
						});
					});	
				}
				trx.let('publication', function(s) {
					s.update(id)
					.set({
						year: metObject.booktitle,
						abstract: metObject.abstract,
						citations: metObject.citations,
						url: metObject.url,
						private: metObject.private
					});
				})
				.let('publication', function(s) {
					s.select().from(Oriento.RID(id));
				});

				AUT.addAuthors(metObject.authors, trx, function(error, res) {
					if(error) {
						clb(error);
					}
					else {
						AUT.connectAuthors(metObject.knownAuthors, trx, function(error, res) {
							if(error) {
								clb(error);
							}
							else {
								RD.addResearchDomainsPub(metObject.researchDomains, trx, function(error, res) {
									Kw.addKeywords(metObject.keywords, trx, function(error, res) {
										trx
										.commit().return('$publication').all()
										.then(function(res) {
											clb(null, true);
										});
									});
								});
							}
						});
					}
				});
			}
			else {
				clb(new Error('type of given metadata: ' + metObject.type + ' does not match type of publication with id: ' + id + ', and type: ' + res[0]['@class']));
			}
		});
	}
}
exports.Publication = Publication;
