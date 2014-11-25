/**
*Database API
*author: Ivo
*co-authors: Hannah, Noah
*exports one constructor: Database(serverConfig, dbConfig)
*with methods to interact this database */

/* ---- TODO -------- *
* complete documentation
* write tests for jasmine
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
	
	/** adds user with given data to database 
	  * @private
	  */
	// [I] should this function return a user object if successful?
	// [N] add .error or something? (callback arguments are quite useless right now)
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
				callback(null, undefined);
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
}

exports.Database = Database;

/* TODO
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