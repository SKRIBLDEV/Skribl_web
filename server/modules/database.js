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
   *Create a new database object.
   *@class
   *@classdesc Represents a domain-specific database instances
   *@constructor 
 *@param {object} serverConfig - includes configuration for server
 *@param {object} dbConfig - includes configuration for database
 */

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



	function addResearchGroup(newData, departmentRid, callback) {
		db.vertex.create({
			'@class': 'ResearchGroup',
			Name: newData.getResearchGroup(), 
			Department: departmentRid})
		.then(function(ResearchGroup) {
			var ResearchGroupRid = getRid(ResearchGroup);
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
				db.exec('update Department add ResearchGroups = ' + ResearchGroupRid + ' where @rid = ' + departmentRid)
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
				callback(null, new UM.UserRecord(dbRec));
			} else {
			   callback(new Error('user not found'));
			}
		});
	}

	this.getResearchDomains = function(callback) {
		db.select().from('Domain').all()
		.then(function(domains) {
			callback(null, domains);
		});
	}

	this.addResearchDomain = function(domain, callback) {
		db.vertex.create({
			'@class': 'DomainName',
			Name: domain
			})
			.then(function (user) {
				callback(null, true);
		});
	}

	function getRid(data) {
		var rid = data['@rid'];
		var cluster = rid.cluster;
		var position = rid.position;
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

/* TESTCODE 
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
	stop();
}
var dummy={firstName:'Helene', lastName:'Vervlimmeren', username:'asdf', password:'asdf', email:'helene@vub.ac.be', language:'english'};
var dummy2={firstName:'Ivo', lastName:'Vervlimmeren', username:'qwerty', password:'qwerty', email:'ivo@vub.ac.be', language:'english'};
var dummy3={firstName:'John', lastName:'Shepard', username:'jshep', password:'jshep', email:'jshep@vub.ac.be', language:'english', institution: 'KU Leuven', faculty: 'letteren en wijsbegeerte', department: 'taal en letterkunde', researchgroup: 'duits'}


var dummy4 = new UM.UserRecord(dummy3);

//database.loadUser('qwerty', callBack);
//database.deleteUser('qwerty', callBack);
//database.createUser(dummy4, callBack);

*/