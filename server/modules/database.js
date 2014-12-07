/**
*Database API
*author: Ivo
*co-authors: Hannah, Noah
*exports one constructor: Database(serverConfig, dbConfig)
*with methods to interact this database */

/* ---- TODO -------- *
* rewrite tests for jasmine
* test with jasmine
* ----- END TODO ---- */

/**
 * This callback is displayed as a global member.
 * @callback callBack
 * @param {object} error - null or error object
 * @param {mixed} returnvalue - any value that needs to be returned
 */


 /** 
   *Create a new database object.
   *@class
   *@classdesc Represents a domain-specific database instances
   *@constructor 
 *@param {object} serverConfig - includes configuration for server
 *@param {object} dbConfig - includes configuration for database
 */

/*** @IVO *** 
	Remarks:
	   	>> I still need to check it, sorry...
	   	>> Try to fix the researchdomains-array thing we talked about
	   	>> Try to fix F to at least a B on CodeClimate (and preferably an A)
	   	>> I might add stuff once I review this, but for now, good work! ;)
/*** --- END --- ***/ 

var Oriento = require('oriento');
var UM = require('./user.js');

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

	var self = this;

	/**
	 * adds a new researchgroup
	 * @private
	 * @param {Object}   newData
	 * @param {String}   departmentRid
	 * @param {callBack} callback
	 */
	function addResearchGroup(newData, departmentRid, callback) {
		db.vertex.create({
			'@class': 'ResearchGroup',
			Name: newData.getResearchGroup(), 
			Department: departmentRid})
		.then(function(ResearchGroup) {
			var researchGroupRid = getRid(ResearchGroup);
			callback(researchGroupRid);
		});
	}

	/**
	 * adds a new department
	 * @private
	 * @param {Object}   newData
	 * @param {[String]}   facultyRid
	 * @param {callBack} callback
	 */
	function addDepartment(newData, facultyRid, callback) {
		db.vertex.create({
			'@class': 'Department',
			Name: newData.getDepartment(), 
			Faculty: facultyRid})
		.then(function(department) {
			var departmentRid = getRid(department);
			addResearchGroup(newData, departmentRid, function(researchGroupRid) {
				db.exec('update Department add ResearchGroups = ' + researchGroupRid + ' where @rid = ' + departmentRid)
				.then(function(response) {
					callback(departmentRid, researchGroupRid);
				})
			});
		});
	}

	/**
	 * adds a new faculty
	 * @private
	 * @param {Object}   newData
	 * @param {String}   instituteRid
	 * @param {callBack} callback
	 */
	function addFaculty(newData, instituteRid, callback) {
		db.vertex.create({
			'@class': 'Faculty',
			Name: newData.getFaculty(), 
			Institution: instituteRid})
		.then(function(faculty) {
			var facultyRid = getRid(faculty);
			addDepartment(newData, facultyRid, function(departmentRid, researchGroupRid) {
				db.exec('update Faculty add Departments = ' + departmentRid + ' where @rid = ' + facultyRid)
				.then(function(response) {
					callback(facultyRid, researchGroupRid);
				})
			});
		});
	}

	/**
	 * adds a new institution
	 * @private
	 * @param {Object}   newData
	 * @param {callBack} callback
	 */
	function addInstitution(newData, callback) {
		db.vertex.create({
			'@class': 'Institution',
			Name: newData.getInstitution()})
		.then(function(inst) {
			var institutionRid = getRid(inst);
			addFaculty(newData, institutionRid, function(facultyRid, researchGroupRid) {
				db.exec('update Institution add Faculties = '+ facultyRid + ' where @rid = ' + institutionRid)
				.then(function(response) {
					callback(null, researchGroupRid);
				})
			});
		});
	}
	
	/**
	 * will make sure that a certain affiliation (string of institute-faculty-department-researchgroup) exists, if it doesn't it will be added.
	 * will execute checkInstitution().
	 * @private
	 * @param {Object}   newData
	 * @param {callBack} callback
	 * @return {String}	returns rid of researchgroup
	 */
	function addAffiliation(newData, callback) {

		/**
		 * checks if an institute with certain name exists, if it does it jumps to checkFaculty(), if it doesn't it jumps to addInstitution()		
		 * @return {String}	returns rid of researchgroup
		 */
		function checkInstitution() {
			db.select().from('Institution').where({Name: newData.getInstitution()}).all()
			.then(function (institutions) {
				if(institutions.length === 0){
					addInstitution(newData, callback);
				}
				else{
					var institution = institutions[0];
					institutionRid = getRid(institution);
					checkFaculty(institutionRid);
				}
			});
		}

		/**
		 * checks if an faculty with certain name exists, if it does it jumps to checkDepartment(), if it doesn't it jumps to addFaculty()		
		 */
		function checkFaculty(institutionRid) {
			db.select().from('Faculty').where({Name: newData.getFaculty(), Institution: institutionRid}).all()
			.then(function (faculties) {
				if(faculties.length === 0) {
					addFaculty(newData, institutionRid, function(facultyRid, ResearchGroupRid) {
						db.exec('update Institution add Faculties = '+ facultyRid + ' where @rid = ' + institutionRid)
							.then(function(response) {
								callback(null, ResearchGroupRid);
							})
					})
				}
				else{
					var faculty = faculties[0];
					facultyRid = getRid(faculty);
					checkDepartment(facultyRid);
				}
			})
		}

		/**
		 * checks if an department with certain name exists, if it does it jumps to checkResearchGroup(), if it doesn't it jumps to addDepartment()		
		 */
		function checkDepartment(facultyRid) {
			db.select().from('Department').where({Name: newData.getDepartment(), Faculty: facultyRid}).all()
			.then(function (departments) {
				if(departments.length === 0) {
					addDepartment(newData, facultyRid, function(departmentRid, ResearchGroupRid) {
						db.exec('update Faculty add Departments = ' + departmentRid + ' where @rid = ' + facultyRid)
							.then(function(response) {
								callback(null, ResearchGroupRid);
							})
					})
				}
				else{
					var department = departments[0];
					departmentRid = getRid(department);
					checkResearchGroup(departmentRid);
				}
			})
		}

		/**
		 * checks if an researchgroup with certain name exists, if it does it calls the callback with the rid, if it doesn't it jumps to addResearchGroup()		
		 */
		function checkResearchGroup(departmentRid) {
			db.select().from('ResearchGroup').where({Name: newData.getResearchGroup(), Department: departmentRid}).all()
			.then(function (researchGroups) {
				if(researchGroups.length === 0) {
					addResearchGroup(newData, departmentRid, function(ResearchGroupRid) {
						db.exec('update Department add ResearchGroups = ' + ResearchGroupRid + ' where @rid = ' + departmentRid)
							.then(function(response) {
								callback(null, ResearchGroupRid);
							})
					})
				}
				else{
					var ResearchGroup = researchGroups[0];
					ResearchGroupRid = getRid(ResearchGroup);
					callback(null, ResearchGroupRid);
				}
			})
		}

		checkInstitution();
	}

		/**
		 * will get the researchgroup of a user and then collect the whole affiliation chain.
		 * @private
		 * @param  {Object}   user
		 * @param  {callBack} callback
		 * @return {[Object]}
		 */
	function getAffiliation(user, callback) {
	  	var cUser = user
	  	var results;
		var content;
		var researchgroup;
		var department;
		var faculty;
		var institution;
		db.exec('select * from (traverse * from (select * from User where username = \'' + cUser.username + '\') while $depth < 2) where @class = \'ResearchGroup\'')
		.then(function(information) {
			results = information.results[0];
			content = results.content[0];
			researchgroup = content.value;
			cUser['researchgroup'] = researchgroup.Name;
		})
		.then(function(e) {
			var departmentRid = transformRid(researchgroup.Department);
			db.query('select from Department where @rid = ' + departmentRid)
			.then(function(departments) {
				department = departments[0];
				cUser['department'] = department.Name;
			})
			.then(function(e) {
				var facultyRid = transformRid(department.Faculty);
				db.query('select from Faculty where @rid = ' + facultyRid)
				.then(function(faculties) {
					faculty = faculties[0];
					cUser['faculty'] = faculty.Name;
				})
				.then(function(e) {
					var institutionRid = transformRid(faculty.Institution);
					db.query('select from Institution where @rid = ' + institutionRid)
					.then(function(institutions) {
						institution = institutions[0];
						cUser['institution'] = institution.Name;
						callback(null, cUser);
					})

				})
			})
		})
	}

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
			var divisionRid = getRid(division);
			db.query('select Name from ' + classSubDivisions + ' where ' + className +' = ' + divisionRid)
			.then(function(results) {
				var resArray = []; //TODO replace by new Array(results.length)??
				for(var i = 0; i < results.length; i++) {
					resArray.push(results[i].Name);
				}
				callback(null, resArray);
			})
		}

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
			.then(function(e) {
				if(faculty === undefined) {
					compileResult('Faculties', 'Faculty');
				} else {
					var institutionRid = getRid(division)
					db.query('select from Faculty where Name = \'' + faculty + '\' and Institution = ' + institutionRid)
					.then(function(faculties) {
						if(faculties.length) {
							division = faculties[0];
						} else {
							callback(new Error('Faculty with name: ' + faculty + ' does not exist'));
						}
					})
					.then(function(e) {
						if(department === undefined) {
							compileResult('Departments', 'Department');
						} else {
							var facultiesRid = getRid(division)
							db.query('select from Department where Name = \'' + department + '\' and Faculty = ' + facultiesRid)
							.then(function(departments) {
								if(departments.length) {
									division = departments[0];
									compileResult('ResearchGroups', 'ResearchGroup');
								} else {
									callback(new Error('Department with name: ' + department + ' does not exist'));
								}
							})
						}
					})
				}
			})
		}
	}
	
	/**
	 * adds a researchdomain with given name
	 * @private
	 * @param {String}   domain
	 * @param {callBack} callback
	 */
	function addResearchDomain(domain, callback) {
		var domName = domain;
		db.select().from('ResearchDomain').where({Name: domName}).all()
		.then(function(domains) {
			if(domains.length) {
				var domain = domains[0];
				var domainRid = getRid(domain);
				callback(null, domainRid);
			}
			else {
				db.vertex.create({
				'@class': 'ResearchDomain',
				Name: domName})
				.then(function (ResearchDomain) {
					var domainRid = getRid(ResearchDomain);
					callback(null, domainRid);
				});
			}
		});
	}


	/**
	 * adds user with given data to database
	 * @private
	 * @param {Object}   newData
	 * @param {callBack} callback
	 */
	function addUser(newData, callback){
		var userRid;
		db.vertex.create({
			'@class': 'User',
			firstName: newData.getFirstName(),
			lastName: newData.getLastName(),
			email: newData.getEmail(),
			username: newData.getUsername(),
			password: newData.getPassword(),
			language: newData.getLanguage()})
			.then(function (user) {
				userRid = getRid(user);
				addAffiliation(newData, function(error, ResearchGroupRid) {
					db.edge.from(userRid).to(ResearchGroupRid).create('HasResearchGroup')
					.then(function(edge) {
						addResearchDomain(newData.getResearchDomain(), function(error, domainRid) {
							if(error) {
								callback(error);
							}
							else {
								db.edge.from(userRid).to(domainRid).create('HasResearchDomain')
								.then(function(edge) {
									callback(null, true);
								});
							}
						});
					});
				});	
			});
	}

	/**
	 * will check if a user exists
	 * @private
	 * @param  {[type]}   data
	 * @param  {Function} callback
	 * @return {[type]}
	 */
	this.userExists = function(data, callback) {

		db.select().from('User').where({username: data.getUsername()}).all()
			.then(function (resultUsernames) {
				callback(null, resultUsernames.length > 0);
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
	}
	
	/**
	*will check if user already exists before calling addUser() to add user to the database.
	*@private
	*@param {object} newData - object which contains userinfo
	*@param {callBack} callback - will be called when done with function, with 'username-taken', 'email-taken' or passed to addUser()
	*/
	this.createUser = function(newData, callback) {

		this.userExists(newData, function(err, exists) {

			// TODO: err should have seperate if-clause
			if (err || exists) {
				callback(new Error('username taken!'));
			} else {
				addUser(newData, callback);
			}
		});
	}
					
	/**
	 * Deletes user with given username from database, throws error if user doesn't exist.
	 * @param  {string}   username
	 * @param  {callback} callback
	 */
	this.deleteUser = function (username, callback) {
		db.select().from('User').where({username: username}).column('@rid').all()
		.then(function (rid) {
			if(rid.length === 1) {
				db.vertex.delete(rid[0]) 
				.then(function(){
					callback(null, true);
				});
			} else {
				callback(new Error("user doesn't exist!"));
			}
		});
	}
	
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
				getAffiliation(dbRec, function(error, user) {
					self.getResearchDomains(user.username, function(error, resdomains) {
						user['researchdomains'] = resdomains;
						callback(error, new UM.UserRecord(user));
					});
				});
			} 
			else {
			   callback(new Error('user not found'));
			}
		});
	}

	/**
	 * if given a username: will return all researchdomains of user in an Array, otherwise will return all researchdomains.
	 * @param  {String}   username
	 * @param  {callBack} callback
	 * @return {Array<String>}	array of researchdomain names.
	 */
	this.getResearchDomains = function(username, callback) {
		if(typeof username === 'string') {
			db.query('select * from (traverse * from (select * from User where username = \'' + username + '\') while $depth < 2) where @class = \'ResearchDomain\'')
			.then(function(researchdomains) {
				var resArray = [];
				for (var i = 0; i < researchdomains.length; i++) {
					resArray.push(researchdomains[i].Name);
				};
				callback(null, resArray);
			});
		}
		else {
			db.select().from('ResearchDomain').all()
			.then(function(domains) {
				var resArray = [];
				for (var i = 0; i < domains.length; i++) {
					resArray.push(domains[i].Name);
				};
				callback(null, resArray);
			});
		}
	}


	/**
	 * returns the record id of an object as a string.
	 * @private
	 * @param  {Object} object
	 * @return {String}
	 */
	function getRid(object) {
		var rid = object['@rid'];
		var cluster = rid.cluster;
		var position = rid.position;
		var result = '#' + cluster + ':' + position;
		return result;
	}

	/**
	 * gets rid in object form and transforms it into stringform
	 * @private
	 * @param  {Object} data
	 * @return {String}
	 */
	function transformRid(data) {
		var cluster = data.cluster;
		var position = data.position;
		var result = '#' + cluster + ':' + position;
		return result;
	}

}

exports.Database = Database;

// TESTCODE 
var serverConfig = {ip:'wilma.vub.ac.be', port:2424, username:'root', password:'root'};
var dbConfig = {dbname:'skribl_database', username:'skribl', password:'skribl'};
var database = new Database(serverConfig, dbConfig);


function stop(){
	process.exit(code=0)
}

function callBack(error, result){
	if (error){
	console.log(error)
	}
	else{
	console.log(result);
	printUser(result);
	}
	stop()
}
function printUser(user){
	console.log(user.getFirstName());
	console.log(user.getLastName());
	console.log(user.getUsername());
	console.log(user.getEmail());
	console.log(user.getLanguage());
	console.log(user.getInstitution());
	console.log(user.getResearchDomains());
	stop();
}
var dummy={firstName:'Helene', lastName:'Vervlimmeren', username:'asdf', password:'asdf', email:'helene@vub.ac.be', language:'english'};
var dummy2={firstName:'Ivo', lastName:'Vervlimmeren', username:'qwerty', password:'qwerty', email:'ivo@vub.ac.be', language:'english'};
var dummy3={firstName:'John', lastName:'Shepard', username:'jshep', password:'jshep', email:'jshep@vub.ac.be', language:'english', institution: 'KU Leuven', faculty: 'letteren en wijsbegeerte', department: 'taal en letterkunde', researchgroup: 'duits', researchdomain: ''}


//var dummy4 = new UM.UserRecord(dummy3);

//database.loadUser('gurdnot', callBack);
database.deleteUser('gurdnot', callBack);
//database.createUser(dummy4, callBack);
//<<<<<<< HEAD
//=======

//database.getAffiliation(dummy4, callBack);
//database.getSubdivisions(callBack, 'KU Leuven', 'letteren en wijsbegeerte', 'taal en letterkunde')
//<<<<<<< Updated upstream
//database.getResearchDomains('gurdnot', callBack)

var nUser = {firstName:'Grunt', lastName:'Urdnot', username:'gurdnot', password:'Algoon5', email:'gurdnot@vub.ac.be', language:'english', institution: 'Vrije Universiteit Brussel', faculty: 'letteren en wijsbegeerte', department: 'taal en letterkunde', researchgroup: 'engels', researchdomains: ['Ammo']}

UM.createUser(nUser, function(error, user) {
	database.createUser(user, callBack);
});
/*
<<<<<<< HEAD
=======
>>>>>>> FETCH_HEAD

>>>>>>> fc23f93aaf4fe1614bcc84fe2f86cdd70be52e7f
=======
//var nUser = {firstName:'Mordin', lastName:'Solus', username:'msolus', password:'Algoon7', email:'msolus@vub.ac.be', language:'english', institution: 'Vrije Universiteit Brussel', faculty: 'letteren en wijsbegeerte', department: 'taal en letterkunde', researchgroup: 'engels'}
//UM.createUser(nUser, function(error, user) {
//	database.createUser(user, function() {});
//});
/*
>>>>>>> FETCH_HEAD
>>>>>>> Stashed changes
*/