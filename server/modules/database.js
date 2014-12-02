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

	function getRid(data) {
		var rid = data['@rid'];
		var cluster = rid.cluster;
		var position = rid.position;
		var result = '#' + cluster + ':' + position;
		return result;
	}

/*
	function addResearchGroup(newdata, departmentRid, callback) {
		db.vertex.create({
		'@class': 'ResearchGroup',
		Name: newData.getResearchGroup(), 
		Department: departmentRid})
		.then(function(ResearchGroup) {
			var rid = getRid(ResearchGroup);
			callback(null, true);
		});
	}

	function addDepartment(newdata, facultyRid, callback) {
		db.vertex.create({
		'@class': 'Department',
		Name: newData.getDepartment(), 
		Faculty: facultyRid})
		.then(function(department) {
			var rid = getRid(department);
			addResearchGroup(newdata, rid, callback);
		});
	}

	function addFaculty(newdata, instituteRid, callback) {
		db.select().from('Faculty').where({Name: newData.getFaculty(), Institution: instituteRid}).all()
		.then(function (faculty) {
				if(result.length === 1) {
					var rid = getRid(faculty);
					addDepartment(newdata, rid, function(departmentRid) {
						db.exec('update Faculty add Departments=:newDep where @rid=:facRid', {
  							params: {
    							newDep: departmentRid
    							instRid: facRid}})
						.then(function(response) {
							callback(rid);
						})
					});
				}
				else if(result.length === 0) {
					db.vertex.create({
					'@class': 'Faculty',
					Name: newData.getFaculty()})
					.then(function(faculty) {
						var rid = getRid(faculty);
						addDepartment(newdata, rid, function(departmentRid) {
							db.exec('update Faculty add Departments=:newDep where @rid=:facRid', {
  								params: {
    								newDep: departmentRid
    								instRid: facRid}})
							.then(function(response) {
								callback(rid);
							})
						});
					})
				}
				else {
					callback(new error('there are ' + faculty.length + ' duplicate faculties in database'));
				}

		db.vertex.create({
		'@class': 'Faculty',
		Name: newData.getFaculty(),
		Institution: instituteRid})
		.then(function(faculty) {
			var rid = getRid(faculty);
			addDepartment(newdata, rid, callback);
		});
	}

	function addInstitution(newdata, callback) {
		db.select().from('Institution').where({Name: newData.getInstitution()}).all()
		.then(function (institution) {
				if(institution.length === 1){
					var rid = getRid(institution);
					addFaculty(newdata, rid, function(facultyRid) {
						db.exec('update Institution add Faculties=:newFac where @rid=:instRid', {
  							params: {
    							newFac: facultyRid
    							instRid: rid}})
						.then(function(response) {
							callback(null, true);
						})
					});
				}
				else if(institution.length === 0) {
					db.vertex.create({
					'@class': 'Institution',
					Name: newData.getInstitution()})
					.then(function(institution) {
						var rid = getRid(institution);
						addFaculty(newdata, rid, function(facultyRid) {
							db.exec('update Institution add Faculties=:newFac where @rid=:instRid', {
  								params: {
    								newFac: facultyRid
    								instRid: rid}})
							.then(function(response) {
								callback(null, true);
							})
						});
					})
				}
				else{
					callback(new error('there are ' + institution.length + ' universities with the same name in database'));
				}
	}
	
	function addAffiliation(newData, callback) {
		addInstitution(newdata, callback)
	}
	*/


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
				callback(null, true);
			});
	}

	// [N] added this function, might need it later on...
	// also, add .error for callback(err, data) ?
	this.userExists = function(data, callback) {

		db.select().from('User').where({username: data.getUsername()}).all()
			.then(function (resultUsernames) {
				callback(null, resultUsernames.length > 0);
			}
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

		db.userExists(newData, function(err, exists) {

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
					callback(null, undefined);
				})
			} else {
				callback(new Error("user doesn't exist!"));
			}
		});
	}

/* ..NOT IN USE RIGHT NOW..
	this.getPassword = function(username, callback) {

		db.select().from('User').where({username: username}).column('password').all()
		.then(function (pwd) {
			if(pwd.length){
				clb(null, pwd[0]);
			} else {
				callback(new Error("user doesn't exist!"));
			}
		});
	}
*/
	
	/**
	...NOT IN USE RIGHT NOW... SORRY IVO!
	*Will check if a username/password combination exists and call callback with corresponding argument
	*@param {string} username - username.
	*@param {string} password - password.
	*@param {function} callback - called with 'wrong-password', 'wrong-username' or nothing if combination exists
	
	this.checkCredentials=function (username, password, callback){
		db.select().from('User').where({username: username}).all()
		.then(function (resultUsers){
				if (resultUsers.length!==0){  
					db.select().from('User').where({username: username, password: password}).all()  //possible to search array instead of making a new query?
					.then(function(user){
						if(user.length!==0){
						callback(null, user[0]);
						}
						else{
						callback('wrong-password');
						}
					})
				}
				else{
					callback('wrong-username');
				}
			})
	}
	*/
	
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
	}

}

exports.Database = Database;

/* TESTCODE
var database= new newDatabase('localhost', 2424, 'skribl_database', 'skribl', 'skribl');
function stop(){
process.exit(code=0)
}
function callBack(result){
	if (result !== undefined){
	console.log(result);
	}
	else{
	console.log('callback successful')
	}
	stop()
}
function printUser(firstName, lastName, username, email, language){
	console.log(firstName)
	console.log(lastName)
	console.log(username)
	console.log(email)
	console.log(language)
	stop()
}
var dummy={firstName:'Helene', lastName:'Vervlimmeren', username:'asdf', password:'asdf', email:'helene@vub.ac.be', language:'english'};
var dummy2={firstName:'Ivo', lastName:'Vervlimmeren', username:'qwerty', password:'qwerty', email:'ivo@vub.ac.be', language:'english'};
*/

//database.getUser('asdf', callBack);
//database.checkCredentials('asdf', 'asdf', callBack);
//database.deleteUser('asdf', callBack);
//database.createUser(dummy, callBack);
//process.exit(code=0)
//var tst=require('./Database_API.js');