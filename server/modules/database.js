/**
*Database API
*author: Ivo
*co-authors: Hannah, Noah
*exports one constructor: Database(serverConfig, dbConfig)
*with methods to interact this database */

/* ---- TODO -------- *
* add support for affilliation and researchdomain
* complete documentation
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

var Oriento = require('C:/Program Files/nodejs/node_modules/oriento');
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
	
	function addAffiliation(newData, callback) {

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
			researchgroup = content.value
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
				var resArray = [];
				for(var i = 0; i < results.length; i++) {
					resArray.push(results[i].Name);
				}
				callback(null, resArray);
			})
		}

		if(institution === undefined) {
			callback(new Error('No path to subdivisions, give at least Institution.'));
		}
		else {
			db.query('select from Institution where Name = \'' + institution +'\'')
			.then(function(institutions) {
				if(institutions.length) {
					division = institutions[0];
				}
				else {
					callback(new Error('Institution with name: \'' + institution + '\' does not exist'));
				}
			})
			.then(function(e) {
				if(faculty === undefined) {
					compileResult('Faculties', 'Faculty');
				}
				else {
					var institutionRid = getRid(division)
					db.query('select from Faculty where Name = \'' + faculty + '\' and Institution = ' + institutionRid)
					.then(function(faculties) {
						if(faculties.length) {
							division = faculties[0];
						}
						else {
							callback(new Error('Faculty with name: ' + faculty + ' does not exist'));
						}
					})
					.then(function(e) {
						if(department === undefined) {
							compileResult('Departments', 'Department');
						}
						else {
							var facultiesRid = getRid(division)
							db.query('select from Department where Name = \'' + department + '\' and Faculty = ' + facultiesRid)
							.then(function(departments) {
								if(departments.length) {
									division = departments[0];
									compileResult('ResearchGroups', 'ResearchGroup');
								}
								else {
									callback(new Error('Department with name: ' + department + ' does not exist'));
								}
							})
						}
					})
				}
			})
		}
	}
	


	/** adds user with given data to database 
	  * @private
	  * TODO
	  * create links to researchdomain&affiliation
	  */
	function addUser(newData, callback){
		db.vertex.create({
			'@class': 'User',
			firstName: newData.getFirstName(),
			lastName: newData.getLastName(),
			email: newData.getEmail(),
			username: newData.getUsername(),
			password: newData.getPassword(),
			language: newData.getLanguage()})
			.then(function (user) {
				var userRid = getRid(user);
				addAffiliation(newData, function(error, ResearchGroupRid) {
					db.edge.from(userRid).to(ResearchGroupRid).create('HasResearchGroup')
					.then(function(edge) {
						callback(null, true);
					});
				});	
			});
	}

	// [N] added this function, might need it later on...
	// also, add .error for callback(err, data) ?
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
	*@param {object} newData - object which contains userinfo
	*@param {function} callback - will be called when done with function, with 'username-taken', 'email-taken' or passed to addUser()
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
	*Deletes user with given username from database, will not notice if user existed before deletion
	*[H] ?it does notice if non-existing and throws error?
	*/
	//is there a better way to get record id?
	this.deleteUser = function (username, callback) {
		db.select().from('User').where({username: username}).column('@rid').all()
		.then(function (rid) {
			if(rid.length === 1){
				db.vertex.delete(rid[0])  //check if this works
				.then(function(){
					callback(null, true);
				})
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
					callback(error, new UM.UserRecord(user));
				});
			} 
			else {
			   callback(new Error('user not found'));
			}
		});
	}

	this.getResearchDomains = function(callback) {
		db.select().from('ResearchDomain').all()
		.then(function(domains) {
			var resArray = [];
			for (var i = 0; i < domains.length; i++) {
				resArray.push(domains[i].Name);
			};
			callback(null, resArray);
		});
	}

	this.addResearchDomain = function(domain, callback) {
		db.vertex.create({
			'@class': 'ResearchDomain',
			Name: domain
			})
			.then(function (ResearchDomain) {
				callback(null, true);
		});
	}

	function getRid(object) {
		var rid = object['@rid'];
		var cluster = rid.cluster;
		var position = rid.position;
		var result = '#' + cluster + ':' + position;
		return result;
	}

	function transformRid(data) {
		var cluster = data.cluster;
		var position = data.position;
		var result = '#' + cluster + ':' + position;
		return result;
	}

	this.test = function(name, callback) {
		db.select().from('User').where({username: name}).all()
		.then(function(users) {
			user = users[0];
			var rid = getRid(user);
			callback(null, rid);
		})
	}

}

exports.Database = Database;

/* TESTCODE */
var serverConfig = {ip:'localhost', port:2424, username:'root', password:'root'};
var dbConfig = {dbname:'skribl_database', username:'skribl', password:'skribl'};
var database= new Database(serverConfig, dbConfig);

function stop(){
process.exit(code=0)
}
function callBack(error, result){
	if (error){
	console.log(error)
	}
	else{
	console.log(result);
	//printUser(result);
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
	stop();
}
var dummy={firstName:'Helene', lastName:'Vervlimmeren', username:'asdf', password:'asdf', email:'helene@vub.ac.be', language:'english'};
var dummy2={firstName:'Ivo', lastName:'Vervlimmeren', username:'qwerty', password:'qwerty', email:'ivo@vub.ac.be', language:'english'};
var dummy3={firstName:'John', lastName:'Shepard', username:'jshep', password:'jshep', email:'jshep@vub.ac.be', language:'english', institution: 'KU Leuven', faculty: 'letteren en wijsbegeerte', department: 'taal en letterkunde', researchgroup: 'duits'}


//var dummy4 = new UM.UserRecord(dummy3);

//database.loadUser('jshep', callBack);
//database.deleteUser('qwerty', callBack);
//database.createUser(dummy4, callBack);
//database.getAffiliation(dummy4, callBack);
//database.getSubdivisions(callBack, 'KU Leuven', 'letteren en wijsbegeerte', 'taal en letterkunde')
/*
var nUser = {firstName:'Mordin', lastName:'Solus', username:'msolus', password:'Algoon7', email:'msolus@vub.ac.be', language:'english', institution: 'Vrije Universiteit Brussel', faculty: 'letteren en wijsbegeerte', department: 'taal en letterkunde', researchgroup: 'engels'}
UM.createUser(nUser, function(error, user) {
	database.createUser(user, callBack);
});

*/