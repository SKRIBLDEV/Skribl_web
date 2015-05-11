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


const Oriento = require('oriento');
const UM = require('../user.js');
const Affil = require('./affiliation.js');
const RDomain = require('./researchdomain.js');
const RID = require('./rid.js');
const Publication = require('./publication.js');
const Classifier = require('./classifier.js');
const library = require('./library.js');
const keyword = require('./keyword.js');
const authors = require('./author.js');
const Graph = require('./graph.js');
const reset = require('./reset.js');
const path = require('path');

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
	var aff = new Affil.Affiliation(db, self);
	var RD = new RDomain.ResearchDomain(db, self);
	var PUB = new Publication.Publication(db, self);
	var CLS = new Classifier.Classifier(db, self);
	var Lib = new library.Library(db, self);
	var Kw = new keyword.Keyword(db, self);
	var AUT = new authors.Author(db, self);
	var RS = new reset.ResetDB(db, self);
	var graph = new Graph.Graph(db, AUT, self);


	/* provides functions */
	this.reset = RS.reset;
	this.getAuthorGraph = graph.getAuthorGraph;

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
				var resLength = results.length;
				//XXX: of nog beter, gebruik Array.prototype.map voor nog elegantere code!
				var resArray = new Array(resLength);
				for(var i = 0; i < resLength; i++) {
					resArray[i] = results[i].Name;
				}
				callback(null, resArray);
			}).error(callback);
		}

		if(!institution) {
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
				if(!faculty) {
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
						if(!department) {
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
							}).error(callback);
						}
					}).error(callback);
				}
			}).error(callback);
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
			}).error(callback);
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
			if(err) {
				callback(err);
			}
			else if (exists) {
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
				var resDomLength = researchDomains.length;
				//XXX: or again, it's even beter to use researchDomains.map here!
				var resArray = new Array(resDomLength);
				for (var i = 0; i < resDomLength; i++) {
					var currDomain = researchDomains[i];
					resArray[i] = {major: currDomain.major, minor: currDomain.minor};
				}
				callback(null, resArray);
			}).error(callback);
		}
		else {
			db.select().from('ResearchDomain').all()
			.then(function(domains) {
				var domLength = domains.length;
				//XXX: or again, it's even beter to use domains.map here!
				var resArray = new Array(domLength);
				for (var i = 0; i < domLength; i++) {
					var currDomain = domains[i];
					resArray[i] = {major: currDomain.major, minor: currDomain.minor};
				}
				callback(null, resArray);
			}).error(callback);
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
					}).error(callback);
				});
			}
			else {
				callback(new Error('user with username: ' + username + ' does not exist'));
			}
		}).error(callback);
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
		}).error(callback);
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
							self.addResearchDomains(newData.getResearchDomains(), trx, function(error, res) {
								if(error) {
									callback(error);
								}
								else {
									trx.commit().return('$user').all()
									.then(function(res) {
										callback(null, RID.getRid(res[0]));
									}).error(callback);
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
			}).error(callback);
		}).error(callback);
	};
}

exports.Database = Database;