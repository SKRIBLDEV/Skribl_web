

const RID = require('./rid.js');
const fs = require('fs');
const Path = require('path');
const Author = require('./author.js');
const researchDomain = require('./researchdomain.js');
const keyword = require('./keyword.js');
const Oriento = require('oriento');

 /** 
   *Create a new Publication object, provides functionality to database Object.
   *@class
   *@classdesc Represents a domain-specific publication instance
   *@constructor 
 *@param {Object} db - database link
 */
function Publication(db) {

	const AUT = new Author.Author(db); //XXX: verander dit door db van zodra je aanpassingen zijn gemaakt
	const RD = new researchDomain.ResearchDomain(db);
	const Kw = new keyword.Keyword(db);
	const self = this;

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
					clb(error);
				}
				else {
					clb(null, data);
				}
			});
		}

		/**
		 * adds a publication as a journal type, and creates the necessary links.
		 * @param {string}   title    title of publication
		 * @param {Object}   fileObj  object which contains fileName and path.
		 * @param {String}   uploader username of uploader
		 * @param {callBack} callback
		 * @return {string} id of publication
		 */
	 db.addJournal = function(title, fileObj, uploader, callback) {
		var fileName = fileObj.originalname;
	/**
		 * Will add vertices and links to database.
		 * @param  {Object} error dummy var, will never catch Error.
		 * @param  {Object} data  data loaded by getFile	
		 */
		function createPub(error, data) {
			var trx = db.let('library', function(s) {
				s.select().from('Library').where({username: uploader, name: 'Uploaded'});
			});
			db.create('vertex', 'Journal')
			.set({
				title: title,
				data: data,
				fileName: fileName,
				viewCount: 0,
				private: false
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
				}).error(callback);
			}).error(callback);
		}
		getFile(fileObj.path, createPub);
	};

	/**
		 * adds a publication as a journal type, and creates the necessary links.
		 * @param {string}   title    title of publication
		 * @param {Object}   fileObj  object which contains fileName and path.
		 * @param {String}   uploader username of uploader
		 * @param {callBack} callback
		 * @return {string} id of publication
		 */
	 db.addProceeding = function(title, fileObj, uploader, callback) {
		var fileName = fileObj.originalname;	
	/**
		 * Will add vertices and links to database.
		 * @param  {Object} error dummy var, will never catch Error.
		 * @param  {Object} data  data loaded by getFile	
		 */
		function createPub(error, data) {
			var trx = db.let('library', function(s) {
				s.select().from('Library').where({username: uploader, name: 'Uploaded'});
			});
			db.create('vertex', 'Proceeding')
			.set({
				title: title,
				data: data,
				fileName: fileName,
				viewCount: 0,
				private: false
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
				}).error(callback);
			}).error(callback);
		}
		getFile(fileObj.path, createPub);
	};


	/**
	 * Loads a file from database to given path.
	 * @param  {String}   id       record id of publication
	 * @param {String} path path where file must be written to.
	 * @param  {callBack} callback
	 * @return {Object}   a function is returned.
	 */
	db.loadPublication = function(id, path, clb) {
		db.query('update ' + id +' INCREMENT viewCount = 1 lock record')
		.then(function(dummy) {
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
			}).error(clb);
		}).error(clb);
	}

	/**
	 * will return all metadata of givn publication.
	 * @param  {String} id  id of publication
	 * @param  {callBack} clb 
	 * @return {Object}     object with publication metadata.
	 */
	db.getPublication = function(id, clb) {
		db.select('title, fileName, @class, journal, publisher, volume, number, year, abstract, citations, url, private, booktitle, organisation, lastUpdated, viewCount').from(id).all()
		.then(function(pubs) {
			if(pubs.length) {
				var res = pubs[0];
				AUT.getPubAuthors(id, function(error, authors) {
					RD.getPubResearchDomains(id, function(error, resDomains) {
						Kw.getPubKeywords(id, function(error, resKeys) {
							if(authors.length) {
								res.authors = authors;
							}
							if(resDomains.length) {
								res.researchDomains = resDomains;
							}
							if(resKeys.length) {
								res.keywords = resKeys;
							}
							delete res['@type'];
							res.type = res['class'].toLowerCase()
							delete res['class'];
							delete res['@rid'];
							clb(null, res);	
						});
					});
				});
			}
			else {
				clb(new Error('Publication not found'));
			}
		}).error(clb);
	}

	/**
	 * deletes a publication.
	 * @param  {String}   id       publication id
	 * @param  {callBack} callback 
	 * @return {Bool}            returns true (regardless if a pub was deleted or not)
	 */
	db.removePublication = function(id, callback) {
		db.delete('vertex').where('@rid = \'' + id + '\'').one()
		.then(function(nr) {
			callback(null, true);
		}).error(callback);
	};

	/**
	 * returns username of user who uploaded the publication with given id.		
	 * @param  {string} id  id of publication
	 * @param  {callBack} clb
	 * @return {String}     username of uploader
	 */
	db.uploadedBy = function(id, clb) {
		db.query('select username from (select expand( in(\'HasPublication\')) from ' + id + ') where name = \'Uploaded\'')
			.then(function(libraries) {
				if(libraries.length) {
					clb(null, libraries[0].username);
				}
				else {
					
					clb(new Error('library not found, error in function: uploadedBy in database->publication.js'));
				}
			}).error(clb);
	}

	/**
	 * adds additional functionality to array, removes any duplicates from array
	 * @return {void} 
	 */
	 //XXX: vermeld bron!
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
	/**
	 * given a word will search in database for publications that match (fully or partially)
	 * @param  {String} keyword word to search for
	 * @param  {Int} limit   number of results
	 * @param  {callBack} clb    
	 * @return {Array<Object>}         array of result objects 
	 */
	db.querySimple = function(keyword, limit, clb) {
		/**
		 * given publication id, returns an object with certain info about pulication
		 * @param  {String} id   publication id
		 * @param  {callBack} clb2 
		 * @return {Object}      result object
		 */
		function getInfo(id, clb2) {
			db.select('title, @class, lastUpdated, in(\'AuthorOf\') as authors').from(id).all()
			.then(function(res) {
				res[0].authors = RID.transformRids(res[0].authors);
				AUT.getAuthorObjects(res[0].authors, function(error, dummy) {
					clb2(null, res[0]);
				});
			}).error(clb);
		}

		/**
		 * iterates over array of publication id's and (with getInfo) replaces said id's with result objects.
		 * @param  {Array<String>} array array of id's
		 * @param  {callBack} callB 
		 * @return {Array<Object>}       results array
		 */
		function prepResults(array, callB) {
			var arrLength = array.length;
			if(arrLength) {
				var ctr = 0;
				for (var i = 0; i < arrLength; i++) {
					getInfo(array[i], function(error, res) {
						array[ctr] = {id: array[ctr], title: res.title, type: res.class.toLowerCase(), authors: res.authors};
						if(++ctr === arrLength) {
							callB(null, array);
						}
					});
				};
			}
			else {
				callB(null, []);
			}
		}

		var ctr = 0;
		var nrOfQueries = 4;
		var query = '';
		function counter() {
			if(++ctr === nrOfQueries) {
				prepResults(result.sort(RID.compareRid), function(error, res) {
					clb(null, res.slice(0, limit));
				});
			}
		}

		var result = [];
		db.query('select @rid from Publication where private = false and (title like \'%' + keyword + '%\' or abstract like \'%' + keyword + '%\' or fileName like \'%' + keyword + '%\' or journal like \'%' + keyword + '%\' or publisher like \'%' + keyword + '%\' or volume like \'%' + keyword + '%\' or number like \'%' + keyword + '%\' or year like \'%' + keyword + '%\' or citations like \'%' + keyword + '%\' or url like \'%' + keyword + '%\' or booktitle like \'%' + keyword + '%\' or organisation like \'%' + keyword + '%\')')
		.then(function(res) {
			if(res.length) {
				result = result.concat(RID.getFieldRids(res)).unique();
			}
			counter();
		}).error(clb);

		db.query('select expand(distinct(@rid)) from (select expand(in(\'HasKeyword\')) from Keyword where keyword like \'%' + keyword + '%\') where private = false')
		.then(function(res) {
			if(res.length) {
			result = result.concat(RID.getRids(res)).unique();
		}
		counter();
		}).error(clb);

		db.query('select expand(distinct(@rid)) from (select expand(in(\'HasResearchDomain\')) from ResearchDomain where major like \'%' + keyword + '%\' or minor like \'%' + keyword + '%\') where private = false')
		.then(function(res) {
			if(res.length) {
			result = result.concat(RID.getRids(res)).unique();
		}
		counter();
		}).error(clb);

		db.query('select expand(distinct(@rid)) from (select expand(in(\'AuthorOf\')) from Author where firstName like \'%' + keyword + '%\' or lastName like \'%' + keyword + '%\') where private = false')
		.then(function(res) {
			if(res.length) {
			result = result.concat(RID.getRids(res)).unique();
		}
		counter();
		}).error(clb);
	}

	/**
	 * wille return an array filled with metadata of that satisfy given criteria
	 * @param  {Object} criteria contains search criteria 
	 * @param  {Int} limit    max number of results
	 * @param  {callBack} clb      
	 * @return {Array<Object>}          result array
	 */
	db.queryAdvanced = function(criteria, limit, clb) {
		var query = '';
		var queryInitialized = false;
		var tempRes = [];

		/**
		 * will create sql string to search on authors
		 * @param {Object} criteria search criteria
		 * @param {callBack} callBack 
		 */
		function AuthorQuery(criteria, callBack) {
			if(!criteria.authors || !criteria.authors.length) {
				callBack(null, true);
			}
			else {
				var authorArray = criteria.authors;
				query = 'select expand(out(AuthorOf)) from Author where (firstName like \'%' + authorArray[0].firstName + '%\' and lastName like \'%' + authorArray[0].lastName + '%\')';
				authorArray.shift();
				queryInitialized = true;

				for (var i = 0; i < authorArray.length; i++) {
					query = 'select from (' + query + ') where any() traverse(0,1) (firstName like \'%' + authorArray[i].firstName + '%\' and lastName like \'%' + authorArray[i].lastName + '%\')'
				};
				callBack(null, true);
			}
		}

		/**
		 * will create sql string to search on keyword
		 * @param {Object} criteria search criteria
		 * @param {callBack} callBack 
		 */
		function keywordQuery(criteria, callBack) {
			if(!criteria.keywords || !criteria.keywords.length) {
				callBack(null, true);
			}
			else {
				var keywordArray = criteria.keywords;
				
				if(queryInitialized) {
					query = 'select from (' + query +  ') where any() traverse(0,1) (keyword = \'' + keywordArray[0] +  '\')';
				}
				else {
					query = 'select expand(in(HasKeyword)) from Keyword where keyword = \'' + keywordArray[0] +  '\'';
				}

				keywordArray.shift();
				queryInitialized = true;

				for (var i = 0; i < keywordArray.length; i++) {
					query = 'select from (' + query +  ') where any() traverse(0,1) (keyword = \'' + keywordArray[i] +  '\')';
				};
				callBack(null, true);
			}
		}

		/**
		 * will create sql string to search on researchDomain
		 * @param {Object} criteria search criteria
		 * @param {callBack} callBack 
		 */
		function researchDomainQuery(criteria, callBack) {
			if(!criteria.researchDomains || !criteria.researchDomains.length) {
				callBack(null, true);
			}
			else {
				var researchDomainArray = criteria.researchDomains;
				if(queryInitialized) {
					query = 'select from (' + query +  ') where any() traverse(0,1) (major = \'' + researchDomainArray[0].major +  '\' and minor = \'' + researchDomainArray[0].minor + '\')';
				}
				else {
					query = 'select expand(in(HasResearchDomain)) from ResearchDomain where (major = \'' + researchDomainArray[0].major +  '\' and minor = \'' + researchDomainArray[0].minor + '\')';
				}
				researchDomainArray.shift();
				queryInitialized = true;

				for (var i = 1; i < researchDomainArray.length; i++) {
					query = 'select from (' + query +  ') where any() traverse(0,1) (major = \'' + researchDomainArray[i].major +  '\' and minor = \'' + researchDomainArray[i].minor + '\')';
				};
				callBack(null, true);
			}
		}

		/**
		 * will create sql string to search on publication properties
		 * @param {Object} criteria search criteria
		 * @param {callBack} callBack 
		 */
		function pubDataQuery(criteria, callBack) {
			var tempQuery = '';
			if(criteria.title !== undefined) {
				tempQuery = tempQuery + ' and title like \'%' + criteria.title + '%\'';
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
			tempQuery = tempQuery + ' and private = false';
			//tempquery never empty, remove?
			if(tempQuery === '') {
				db.query('select @rid, title, @class, lastUpdated, in(\'AuthorOf\') as authors from (' + query + ') limit ' + limit).all()
				.then(function(res) {
					callBack(null, res);
				}).error(clb);
			}
			else {
				if(query === '') {
					db.query('select @rid, title, @class, lastUpdated, in(\'AuthorOf\') as authors from Publication where ' + tempQuery.slice(5) + ' limit ' + limit).all()
					.then(function(res) {
						callBack(null, res);
					}).error(clb);
				}
				else {
					db.query('select @rid, title, @class, lastUpdated, in(\'AuthorOf\') as authors from (' + query + ') where ' + tempQuery.slice(5) + ' limit ' + limit).all()
					.then(function(res) {
						callBack(null, res);
					}).error(clb);
				}
			}
		}


		AuthorQuery(criteria, function(error, res) {
			keywordQuery(criteria, function(error, res) {
				researchDomainQuery(criteria, function(error, res) {
					pubDataQuery(criteria, function(error, res) {
						var rLength = res.length;
						if(rLength) {
							var ctr = 0;
							for (var i = 0; i < rLength; i++) {
								delete res[i]['@rid'];
								delete res[i]['@type'];
								res[i].authors = RID.transformRids(res[i]['authors']);
								res[i].type = res[i]['class'];
								delete res[i]['class'];
								res[i].id = RID.transformRid(res[i].rid);
								delete res[i]['rid'];
								AUT.getAuthorObjects(res[i].authors, function(error, dummy) {
									if(error) {
										clb(error);
									}
									if(++ctr === rLength) {
										clb(null, res);
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

	/**
	 * updates metadata of publication
	 * @param  {String} id        publication id
	 * @param  {Object} metObject object which contains metadata to be updated
	 * @param  {callBack} clb       
	 * @return {Bool}    returns true when finished       
	 */
	db.updatePublication = function(id, metObject, clb) {
		db.record.get(id)
		.then(function(res) {
			if(res) {
				if(res['@class'].toLowerCase() == metObject.type) {
					var trx;
					if(metObject.type === 'journal') {
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
						var d = new Date();
						s.update(id)
						.set({
							title: metObject.title,
							year: metObject.year,
							abstract: metObject.abstract,
							citations: metObject.citations,
							url: metObject.url,
							private: metObject.private,
							lastUpdated: d.toISOString()
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
												}).error(clb);	
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
		}).error(clb);	
	}

	/**
	 * returns all publications from given author
	 * @param  {String} authId 
	 * @param  {callBack} clb    
	 * @return {Array<Object>}        returns a publication array.
	 */
	db.authorPublications = function(authId, clb) {
		db.query('select expand(out(\'AuthorOf\').include(\'title\', \'@rid\', \'lastUpdated\')) from ' + authId).all()
		.then(function(pubs) {
			var pubLength = pubs.length;
			if(pubLength) {
				var ctr = 0;
				for (var i = 0; i < pubLength; i++) {
					AUT.getPubAuthors(RID.getRid(pubs[i]), function(error, res) {
						if(error) {
							clb(error);
						}
						pubs[ctr].rid = RID.getRid(pubs[ctr]);
						delete pubs[ctr]['@rid'];
						pubs[ctr].type = pubs[ctr]['@class'].toLowerCase();
						delete pubs[ctr]['@class'];
						pubs[ctr].authors = res;
						delete pubs[ctr]['@type'];
						if(++ctr === pubLength) {
							clb(null, pubs)
						}
					});
				};
			}
			else {
				clb(null, []);
			}
		}).error(clb);	
	}

	db.nearbyPublications = function(usr, depth, clb) {
		db.query('select @rid, title, @class, lastUpdated, in(\'AuthorOf\') as authors from (traverse * from (select @rid from User where username = \'' + usr + '\') while $depth <= ' + depth + ') where @class = \'Proceeding\' or @class = \'Journal\' limit order by viewCount').all()
		.then(function(pubs) {
			var pubsLength = pubs.length;
			if(pubsLength) {
				var ctr = 0;
				for (var i = 0; i < pubsLength; i++) {
					delete pubs[i]['@rid'];
					delete pubs[i]['@type'];
					pubs[i].authors = RID.transformRids(pubs[i]['authors']);
					pubs[i].type = pubs[i]['class'];
					delete pubs[i]['class'];
					pubs[i].id = RID.transformRid(pubs[i].rid);
					delete pubs[i]['rid'];
					AUT.getAuthorObjects(pubs[i].authors, function(error, dummy) {
						if(error) {
							clb(error);
						}
						if(++ctr === pubsLength) {
							clb(null, pubs);
						}
					});
				};
			}
			else {
				clb(null, []);
			}
		}).error(clb);
	}
}

exports.Publication = Publication;