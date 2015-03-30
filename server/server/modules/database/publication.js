

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
	var self = this;

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
		db.select().from(id).all()
		.then(function(pubs) {
			if(pubs.length) {
				var res = pubs[0];
				AUT.getPubAuthors(id, function(error, authors) {
					RD.getPubResearchDomains(id, function(error, resDomains) {
						Kw.getPubKeywords(id, function(error, resKeys) {
							if(typeof authors === 'defined') {
								res.authors = authors;
							}
							if(typeof resDomains === 'defined') {
								res.researchDomains = resDomains;
							}
							if(typeof resKeys === 'defined') {
								res.keywords = resKeys;
							}
							delete res.data;
							delete res['@type'];
							res.type = res['@class'].toLowerCase()
							delete res['@class'];
							delete res['in_HasPublication'];
							delete res['@version'];
							delete res['in_AuthorOf'];
							delete res['out_HasResearchDomain'];
							delete res['out_HasKeyword'];
							delete res['@rid'];
							clb(null, res);	
						});
					});
				});
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

	Array.prototype.unique = function() {
    	var a = this.concat();
    	for(var i=0; i<a.length; ++i) {
        	for(var j=i+1; j<a.length; ++j) {
            	if(a[i] === a[j])
               		a.splice(j--, 1);
        	}
    	}
    	return a;
	};


//change this to one big query for pagination and sorting
	this.querySimple = function(keyword, limit, clb) {
		function getTitle(id, clb2) {
			db.select('title').from(id).all()
			.then(function(res) {
				clb2(null, res[0].title);
			});
		}

		function prepResults(array, callB) {
			var ctr = 0;
			for (var i = 0; i < array.length; i++) {
				getTitle(array[ctr], function(error, res) {
					array[ctr] = {id: array[ctr], title: res};
					ctr++
					if(ctr == array.length) {
						callB(null, array);
					}
				});
			};
		}

		var ctr = 0;
		var nrOfQueries = 14;
		function counter() {
			ctr++;
			if(ctr == nrOfQueries) {
				prepResults(result.sort(RID.compareRid), function(error, res) {
					clb(null, res.slice(0, limit));
				});
			}
		}

		var result = [];
		db.select().from('Publication').where('title like \'%' + keyword + '%\' and private = false').all()
		.then(function(res) {
			if(res.length) {
				result = result.concat(RID.getRids(res)).unique();
			}
			counter();
		});

		db.select().from('Publication').where('abstract like \'%' + keyword + '%\' and private = false').all()
		.then(function(res) {
			if(res.length) {
				result = result.concat(RID.getRids(res)).unique();
			}
			counter();
		});

		db.select().from('Publication').where('fileName like \'%' + keyword + '%\' and private = false').all()
		.then(function(res) {
			if(res.length) {
				result = result.concat(RID.getRids(res)).unique();
			}
			counter();
		});

		db.select().from('Publication').where('Journal like \'%' + keyword + '%\' and private = false').all()
		.then(function(res) {
			if(res.length) {
				result = result.concat(RID.getRids(res)).unique();
			}
			counter();
		});

		db.select().from('Publication').where('publisher like \'%' + keyword + '%\' and private = false').all()
		.then(function(res) {
			if(res.length) {
				result = result.concat(RID.getRids(res)).unique();
			}
			counter();
		});

		db.select().from('Publication').where('volume like \'%' + keyword + '%\' and private = false').all()
		.then(function(res) {
			if(res.length) {
				result = result.concat(RID.getRids(res)).unique();
			}
			counter();
		});

		db.select().from('Publication').where('number like \'%' + keyword + '%\' and private = false').all()
		.then(function(res) {
			if(res.length) {
				result = result.concat(RID.getRids(res)).unique();
			}
			counter();
		});

		db.select().from('Publication').where('year like \'%' + keyword + '%\' and private = false').all()
		.then(function(res) {
			if(res.length) {
				result = result.concat(RID.getRids(res)).unique();
			}
			counter();
		});

		db.select().from('Publication').where('citations like \'%' + keyword + '%\' and private = false').all()
		.then(function(res) {
			if(res.length) {
				result = result.concat(RID.getRids(res)).unique();
			}
			counter();
		});

		db.select().from('Publication').where('url like \'%' + keyword + '%\' and private = false').all()
		.then(function(res) {
			if(res.length) {
				result = result.concat(RID.getRids(res)).unique();
			}
			counter();
		});

		db.select().from('Publication').where('booktitle like \'%' + keyword + '%\' and private = false').all()
		.then(function(res) {
			if(res.length) {
				result = result.concat(RID.getRids(res)).unique();
			}
			counter();
		});

		db.select().from('Publication').where('organisation like \'%' + keyword + '%\' and private = false').all()
		.then(function(res) {
			if(res.length) {
				result = result.concat(RID.getRids(res)).unique();
			}
			counter();
		});

		db.query('select expand(distinct(@rid)) from (select expand(in(\'HasKeyword\')) from Keyword where keyword like \'%' + keyword + '%\') where private = false')
		.then(function(res) {
			if(res.length) {
			result = result.concat(RID.getRids(res)).unique();
		}
		counter();
		});

		db.query('select expand(distinct(@rid)) from (select expand(in(\'HasResearchDomain\')) from ResearchDomain where Name like \'%' + keyword + '%\') where private = false')
		.then(function(res) {
			if(res.length) {
			result = result.concat(RID.getRids(res)).unique();
		}
		counter();
		});

		db.query('select expand(distinct(@rid)) from (select expand(in(\'AuthorOf\')) from Author where firstName like \'%' + keyword + '%\' or lastName like \'%' + keyword + '%\') where private = false')
		.then(function(res) {
			if(res.length) {
			result = result.concat(RID.getRids(res)).unique();
		}
		counter();
		});
	}

	this.queryAdvanced = function(criteria, limit, clb) {
		var query = '';
		var queryInitialized = false;

		function AuthorQuery(criteria, callBack) {
			if(criteria.authors === undefined) {
				callBack(null, true);
			}
			else {
				var authorArray = criteria.authors;
				query = 'select * from Publication where any() traverse(0,1) (firstName = \'' + authorArray[0].fName + '\' and lastName = \'' + authorArray[0].lName + '\')';
				authorArray.shift();
				queryInitialized = true;

				for (var i = 0; i < authorArray.length; i++) {
					query = 'select * from (' + query + ') where any() traverse(0,1) (firstName = \'' + authorArray[i].fName + '\' and lastName = \'' + authorArray[i].lName + '\')'
				};
				callBack(null, true);
			}
		}

		function keywordQuery(criteria, callBack) {
			if(criteria.keywords === undefined) {
				callBack(null, true);
			}
			else {
				var keywordArray = criteria.keywords;
				if(queryInitialized) {
					query = 'select * from (' + query +  ') where any() traverse(0,1) (keyword = \'' + keywordArray[0] +  '\')';
				}
				else {
					query = 'select * from Publication where any() traverse(0,1) (keyword = \'' + keywordArray[0] +  '\')';
				}
				keywordArray.shift();
				queryInitialized = true;

				for (var i = 0; i < keywordArray.length; i++) {
					query = 'select * from (' + query +  ') where any() traverse(0,1) (keyword = \'' + keywordArray[i] +  '\')';
				};
				callBack(null, true);
			}
		}

		function researchDomainQuery(criteria, callBack) {
			if(criteria.researchDomains === undefined) {
				callBack(null, true);
			}
			else {
				var researchDomainArray = criteria.researchDomains;
				if(queryInitialized) {
					query = 'select * from (' + query +  ') where any() traverse(0,1) (Name = \'' + researchDomainArray[0] +  '\')';
				}
				else {
					query = 'select * from Publication where any() traverse(0,1) (Name = \'' + researchDomainArray[0] +  '\')';
				}
				researchDomainArray.shift();
				queryInitialized = true;

				for (var i = 0; i < researchDomainArray.length; i++) {
					query = 'select * from (' + query +  ') where any() traverse(0,1) (Name = \'' + researchDomainArray[i] +  '\')';
				};
				callBack(null, true);
			}
		}

		function pubDataQuery(criteria, callBack) {
			var tempQuery = '';
			if(criteria.title !== undefined) {
				tempQuery = tempQuery + ' and title = \'' + criteria.title + '\'';
			}
			if(criteria.fileName !== undefined) {
				tempQuery = tempQuery + ' and fileName = \'' + criteria.fileName + '\'';
			}
			if(criteria.journal !== undefined) {
				tempQuery = tempQuery + ' and journal = \'' + criteria.journal + '\'';
			}
			if(criteria.publisher !== undefined) {
				tempQuery = tempQuery + ' and publisher = \'' + criteria.publisher + '\'';
			}
			if(criteria.volume !== undefined) {
				tempQuery = tempQuery + ' and volume = \'' + criteria.volume + '\'';
			}
			if(criteria.number !== undefined) {
				tempQuery = tempQuery + ' and number = \'' + criteria.number + '\'';
			}
			if(criteria.year !== undefined) {
				tempQuery = tempQuery + ' and year = \'' + criteria.year + '\'';
			}
			if(criteria.abstract !== undefined) {
				tempQuery = tempQuery + ' and abstract = \'' + criteria.abstract + '\'';
			}
			if(criteria.url !== undefined) {
				tempQuery = tempQuery + ' and url = \'' + criteria.url + '\'';
			}
			if(criteria.booktitle !== undefined) {
				tempQuery = tempQuery + ' and booktitle = \'' + criteria.booktitle + '\'';
			}
			if(criteria.organisation !== undefined) {
				tempQuery = tempQuery + ' and organisation = \'' + criteria.organisation + '\'';
			}
			if(tempQuery == '') {
				//console.log(query);
				db.query(query + 'limit ' + limit).all()
				.then(function(res) {
					callBack(null, res);
				});
			}
			else {
				if(query == '') {
					//console.log('select * from Publication where ' + tempQuery.slice(5) + ' limit ' + limit);
					db.query('select * from Publication where ' + tempQuery.slice(5) + ' limit ' + limit).all()
					.then(function(res) {
						callBack(null, res);
					});
				}
				else {
					//console.log('select * from (' + query + ') where ' + tempQuery.slice(5));
					db.query('select * from (' + query + ') where ' + tempQuery.slice(5) + ' limit ' + limit).all()
					.then(function(res) {
						callBack(null, res);
					});
				}
			}
		}

		AuthorQuery(criteria, function(error, res) {
			keywordQuery(criteria, function(error, res) {
				researchDomainQuery(criteria, function(error, res) {
					pubDataQuery(criteria, function(error, res) {
						var ridArray = RID.getRids(res);
						if(ridArray.length) {
							var ctr = 0;
							for (var i = 0; i < ridArray.length; i++) {
								self.getPublication(ridArray[i], function(error, res) {
									ridArray[ctr] = res;
									ctr++;
									if(ctr == ridArray.length) {
										clb(null, ridArray);
									}
								});
							};
						}
						else {
							clb(null, []);
						}
					});
				});
			});
		});

	}

//OLDQUERY
/*
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
/*
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
		/*
		function queryAuthors(tempRes, clb) {
			giveRes(tempRes, clb);
		}

		function giveRes(tempRes, clb) {
			clb(null, tempRes);
		}

	}
*/
	this.updatePublication = function(id, metObject, clb) {
		db.select().from(id).all()
		.then(function(res) {
			if(res.length) {
				if(res[0]['@class'].toLowerCase() == metObject.type) {
					var trx;
					if(metObject.type == 'journal') {
						var trx = db.let('publication1', function(s) {
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
						var trx = db.let('publication1', function(s) {
							s.update(id)
							.set({
								booktitle: metObject.booktitle,
								organisation: metObject.organisation
							});
						});	
					}
					trx.let('publication2', function(s) {
						s.update(id)
						.set({
							year: metObject.booktitle,
							abstract: metObject.abstract,
							citations: metObject.citations,
							url: metObject.url,
							private: metObject.private
						});
					});
					trx.let('publication', function(s) {
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
									RD.addPubResearchDomains(metObject.researchDomains, trx, function(error, res) {
										if(error) {
											clb(error);
										}
										else {
											Kw.addKeywords(metObject.keywords, trx, function(error, res) {
											if(error) {
												clb(error);
											}
											else {
												trx.commit().return('$publication').all()
												.then(function(res) {
													clb(null, true);
												});	
											}
											});
										}
									});
								}
							});
						}
					});
				}
				else {
					clb(new Error('type of given metadata: ' + metObject.type + ' does not match type of publication with id: ' + id + ', and type: ' + res[0]['@class']));
				}
			}
			else {
				clb(new Error('publication with id: ' + id + ' does not exist'));
			}
		});
	}
}
exports.Publication = Publication;
