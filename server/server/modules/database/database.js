/**
*Database API
*author: Ivo
*co-authors: Hannah, Noah
*exports one constructor: Database(serverConfig, dbConfig)
*with methods to interact this database */


/**
 * This callback is displayed as a global member.
 * @callback callBack
 * @param {object} error - null or error object
 * @param {mixed} returnvalue - any value that needs to be returned
 */


//XXX: gebruik 'const' ipv 'var'

var Oriento = require('oriento');
var UM = require('../user.js');
var Affil = require('./affiliation.js');
var RDomain = require('./researchdomain.js');
var RID = require('./rid.js');
var Publication = require('./publication.js');
var Classifier = require('./classifier.js');
var library = require('./library.js');
var keyword = require('./keyword.js');
var authors = require('./author.js');
var Graph = require('./graph.js');
var reset = require('./reset.js');
var path = require('path');

 /** 
   *Create a new database object.
   *@class
   *@classdesc Represents a domain-specific database instances
   *@constructor 
 *@param {object} serverConfig - includes configuration for server
 *@param {object} dbConfig - includes configuration for database
 */
function Database(serverConfig, dbConfig) {
	
	/* instantiates the database server instance */
	var server = Oriento({
		host: serverConfig.ip,
		port: serverConfig.port,
		username: serverConfig.username || 'root',
		password: serverConfig.password || 'root'
	});

	/** instantiates the database instance*/
	var db = server.use({
		name: dbConfig.dbname,
		username: dbConfig.username || 'admin',
		password: dbConfig.password || 'admin'
	});

	//XXX: zie opmerking over modules in affiliation.js

	var self = this;
	var aff = new Affil.Affiliation(db);
	var RD = new RDomain.ResearchDomain(db);
	var PUB = new Publication.Publication(db);
	var CLS = new Classifier.Classifier(db);
	var Lib = new library.Library(db);
	var Kw = new keyword.Keyword(db);
	var AUT = new authors.Author(db);
	var RS = new reset.ResetDB(db, self);
	var graph = new Graph.Graph(db, AUT);


	/* provides functions */
	this.reset = RS.reset;
	this.addJournal = PUB.addJournal;
	this.queryAdvanced = PUB.queryAdvanced;
	this.addProceeding = PUB.addProceeding;
	this.loadPublication = PUB.loadPublication;
	this.getPublication = PUB.getPublication;
	this.querySimple = PUB.querySimple;
	this.updatePublication = PUB.updatePublication;
	this.removePublication = PUB.removePublication;
	this.authorPublications = PUB.authorPublications;
	this.uploadedBy = PUB.uploadedBy;
	this.loadLibrary = Lib.loadLibrary;
	this.loadLibraries = Lib.loadLibraries;
	this.addToLibrary = Lib.addToLibrary;
	this.addLibrary = Lib.addLibrary;
	this.removeLibrary = Lib.removeLibrary;
	this.removeFromLibrary = Lib.removeFromLibrary;
	this.addDefaults = Lib.addDefaults;
	this.searchAuthor = AUT.searchAuthor;
	this.getAuthorGraph = graph.getAuthorGraph;
	this.saveClassifier = CLS.saveClassifier;
	this.loadClassifier = CLS.loadClassifier;

	/**
	*Will give the subdivisions of a given division.
	*@param {callBack} callback - handles response
	*@param {String} institution - name of institution
	*@param {String} [faculty] - name of faculty
	*@param {String} [department] - name of department
	*@return {Array<String>} array of names of subdivisions
	*/
	this.getSubdivisions = function(callback, institution, faculty, department) {
		var division;
		function compileResult(nameSubdivisions, classSubDivisions) {
			var className = division['@class'];
			var divisionRid = RID.getRid(division);
			db.query('select Name from ' + classSubDivisions + ' where ' + className +' = ' + divisionRid)
			.then(function(results) {
				//XXX: zoals je zelf voorstelt in je TODO ;)
				//XXX: gebruik ook var len = results.length
				//XXX: of nog beter, gebruik Array.prototype.map voor nog elegantere code!
				var resArray = []; //TODO replace by new Array(results.length)??
				for(var i = 0; i < results.length; i++) {
					resArray.push(results[i].Name);
				}
				callback(null, resArray);
			//XXX: geef gewoon mijn callback mee
			}).error(function(er) {
				callback(er);
			});
		}

		//XXX: gebruik '!institution' ipv deze check (undefined ~= false)
		if(institution === undefined) {
			callback(new Error('No path to subdivisions, give at least Institution.'));
		} else {
			db.query('select from Institution where Name = \'' + institution +'\'')
			.then(function(institutions) {
				if(institutions.length) {
					division = institutions[0];
				} else {
					callback(new Error('Institution with name: \'' + institution + '\' does not exist'));
				}
			})
			.then(function() {
				//XXX: idem
				if(faculty === undefined) {
					compileResult('Faculties', 'Faculty');
				} else {
					var institutionRid = RID.getRid(division);
					db.query('select from Faculty where Name = \'' + faculty + '\' and Institution = ' + institutionRid)
					.then(function(faculties) {
						if(faculties.length) {
							division = faculties[0];
						} else {
							callback(new Error('Faculty with name: ' + faculty + ' does not exist'));
						}
					})
					.then(function() {
						//XXX: idem
						if(department === undefined) {
							compileResult('Departments', 'Department');
						} else {
							var facultiesRid = RID.getRid(division);
							db.query('select from Department where Name = \'' + department + '\' and Faculty = ' + facultiesRid)
							.then(function(departments) {
								if(departments.length) {
									division = departments[0];
									compileResult('ResearchGroups', 'ResearchGroup');
								} else {
									callback(new Error('Department with name: ' + department + ' does not exist'));
								}
							//XXX: geef meteen mijn callback mee
							}).error(function(er) {
								callback(er);
							});
						}
					//XXX: idem
					}).error(function(er) {
						callback(er);
					});
				}
			//XXX: idem
			}).error(function(er) {
				callback(er);
			});
		}
	};
	
	/**
	 * will check if a user exists
	 * @private
	 * @param  {Object}   	contains user info
	 * @param  {callback} 	callback
	 * @return {Boolean}	by callback
	 */
	this.userExists = function(data, callback) {
		db.select().from('User').where({username: data.getUsername()}).all()
			.then(function (resultUsernames) {
				callback(null, resultUsernames.length > 0);
			//XXX: geef meteen mijn callback mee
			}).error(function(er) {
				callback(er);
			});
			// @ Ivo, if you want, add e-mail check here too...
			// however, i don't think its necessary right now...
			// I copy pasted the code down here, so you wouldn't lose it ;)
			// @ Noah, do we allow multiple users with the same e-mail adress? or does the check take place somewhere else? otherwise I think we need this.
			/* 
					db.select().from('User').where({email: newData.email}).all()
						.then(function (resultEmail) {
								if (resultEmail.length){
									callback('email-taken');
								}
			*/
	};
	
	/**
	*will check if user already exists before calling addUser() to add user to the database.
	*@private
	*@param {object} newData - object which contains userinfo
	*@param {callBack} callback - will be called when done with function, with 'username-taken', 'email-taken' or passed to addUser()
	*/
	this.createUser = function(newData, callback) {
		this.userExists(newData, function(err, exists) {

			//XXX: do TODO!
			// TODO: err should have seperate if-clause
			if (err || exists) {
				callback(new Error('username taken!'));
			} else {
				addUser(newData, callback);
			}
		});
	};
					


	/**
	 * if given a username: will return all researchdomains of user in an Array, otherwise will return all researchdomains.
	 * @param  {String}   username
	 * @param  {callBack} callback
	 * @return {Array<String>}	array of researchdomain names.
	 */
	this.getResearchDomains = function(username, callback) {
		if(typeof username === 'string') {
			db.query('select * from (traverse * from (select * from User where username = \'' + username + '\') while $depth < 2) where @class = \'ResearchDomain\'')
			.then(function(researchDomains) {
				//XXX: use len variable...
				//XXX: use new Array(len) ipv []
				//XXX: use len in for condition
				//XXX: or again, it's even beter to use researchDomains.map here!
				var resArray = [];
				for (var i = 0; i < researchDomains.length; i++) {
					//XXX: introduce temporary variable for researchDomains[i]
					resArray.push({major: researchDomains[i].major, minor: researchDomains[i].minor});
				}
				callback(null, resArray);
			//XXX: geef callback meteen mee
			}).error(function(er) {
				callback(er);
			});
		}
		else {
			db.select().from('ResearchDomain').all()
			.then(function(domains) {
				//XXX: use len variable...
				//XXX: use new Array(len) ipv []
				//XXX: use len in for condition
				//XXX: or again, it's even beter to use domains.map here!
				var resArray = [];
				for (var i = 0; i < domains.length; i++) {
					//XXX: introduce temporary variable for domains[i]
					resArray.push({major: domains[i].major, minor: domains[i].minor});
				}
				callback(null, resArray);
			//XXX: geef callback meteen mee
			}).error(function(er) {
				callback(er);
			});
		}
	};

	/**
	 * Deletes user with given username from database, throws error if user doesn't exist.
	 * @param  {string}   username
	 * @param  {callback} callback
	 */
	this.deleteUser = function (username, callback) {
		db.select().from('User').where({username: username}).all()
		.then(function(res) {
			if(res.length) {
				var usrRid = RID.getRid(res[0]);
				var trx = db.let('user', function(s) {
					s.select()
					.from('User')
					.where({username: username});
				});
				Lib.deleteDefaults(username, trx, function(error, res) {
					trx.let('delUser', function(s) {
						s.delete('vertex', 'User')
						.where('@rid = ' + usrRid);
					})
					.commit().return('$delUser').all()
					.then(function(res) {
						callback(null, true);
					//XXX: geef callback meteen mee
					}).error(function(er) {
						callback(er);
					});
				});
			}
			else {
				callback(new Error('user with username: ' + username + ' does not exist'));
			}
		//XXX: geef callback meteen mee
		}).error(function(er) {
				callback(er);
			});
	};

	/**
	*will return user object by callback
	*@param {string} username - called if combination exists.
	*@param {function} callback - called with user object if success or with 'user-not-found' if fail
	*/
	this.loadUser = function(username, callback) {
		db.select().from('User').where({username: username}).all()
		.then(function(users) {
			if(users.length) {
				var dbRec = users[0];
				aff.getAffiliation(dbRec, function(error, user) {
					self.getResearchDomains(user.username, function(error, resdomains) {
						user.researchDomains = resdomains;
						AUT.getAuthorId(RID.getRid(user), function(error, autId) {
							if(error) {
								clb(error);
							}
							else {
								user.authorId = autId;
								var ret = new UM.UserRecord(user);
								callback(error, ret);
							}
						});
					});
				});
			} 
			else {
			   callback(new Error('user not found'));
			}
		//XXX: geef callback meteen mee
		}).error(function(er) {
				callback(er);
			});
	};


	/**
	 * adds user with given data to database
	 * @private
	 * @param {Object}   newData
	 * @param {callBack} callback
	 */
	function addUser(newData, callback){
		var trx = db.let('user', function(s) {
			s.create('vertex', 'User')
			.set({
				firstName: newData.getFirstName(),
				lastName: newData.getLastName(),
				email: newData.getEmail(),
				username: newData.getUsername(),
				password: newData.getPassword(),
				language: newData.getLanguage()
			});
		});

		AUT.createAuthor(newData.getFirstName(), newData.getLastName(), trx, function(error, res) {
			Lib.addDefaults(newData.getUsername(), trx, function(error, res) {
					if(error) {
						callback(error);
					}
					else {
						aff.addAffiliation(newData, trx, function(error, res) {
							trx.let('researchGroupEdge', function(s) {
								s.create('edge', 'InResearchGroup')
								.from('$user')
								.to('$researchGroup');
							});
							RD.addResearchDomains(newData.getResearchDomains(), trx, function(error, res) {
								if(error) {
									callback(error);
								}
								else {
									trx.commit().return('$user').all()
									.then(function(res) {
										callback(null, RID.getRid(res[0]));
									//XXX: geef callback meteen mee
									}).error(function(er) {
										callback(er);
									});
								}
							});
						});
					}
			});
		});

	}

	/**
	 * currently only in use for testing purposes, deletes a researchdomain.
	 * @param  {String}   name     name of domain
	 * @param  {callBack} callback 
	 */
	this.deleteResearchDomain = function(name, callback) {
		db.select().from('ResearchDomain').where({Name: name}).all()
		.then(function(domain) {
			var domainRid = RID.getRid(domain[0]);
			db.vertex.delete(domainRid) 
			.then(function(){
				callback(null, true);
			//XXX: geef callback meteen mee
			}).error(function(er) {
				callback(er);
			});
		//XXX: geef callback meteen mee
		}).error(function(er) {
			callback(er);
		});
	};
}

exports.Database = Database;
