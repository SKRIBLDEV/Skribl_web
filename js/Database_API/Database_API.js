 
 /** Speeds up calls to hasOwnProperty*/
var hasOwnProperty = Object.prototype.hasOwnProperty;

/** 
*isEmpty will check if given object contains anything.
*@param {object} object - object to check
*/
function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj === null){return true;}

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0){return false;}
    if (obj.length === 0){return true;}

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)){return false;}
    }
    return true;
}
 
 /** 
 *Creates a new database object.
 *@class
 *@classdesc This class will retain a database server instance and a database instance, and provide the methods createUser, deleteUser, getUser, checkCredentials.
 *@param {string} ip - ip of databaes server location.
 *@param {integer} port - access port for databaes server.
 *@param {string} username - username of database
 *@param {string} password - password of database
 */
var newDatabase=function(ip, port, dbname, username, password){
	var Oriento = require('oriento');
	
	/** instantiates the database server instance*/
	var server = Oriento({
		host: ip,
		port: port,
		username: 'root',
		password: 'root'
	});

	server.list().then(function (dbs) {
		console.log('There are ' + dbs.length + ' databases on the server.');
	})
	/** instantiates the database instance*/
	var db = server.use({
		name: dbname,
		username: username,
		password: password
	});
	
	console.log('Using database: ' + db.name);
	
	/**
	*Will check if a user with given username exists in the database.
	*@param {string} username - username to check
	*@param {function} callbackTrue - called if username exists.
	*@param {function} callbackFalse - called if username doesn't exist.
	*/	
	function userExists(username, callbackTrue, callbackFalse){
		db.select()
		.from('User')
		.where({username: username})
		.all()
		.then(function (users) {
			if (isEmpty(users)){
			callbackFalse();
			}
			else{
			callbackTrue();
			}
		})
	}
	
	/**
	*Will check if a user with given email exists in the database.
	*@param {string} email - email to check
	*@param {function} callbackTrue - called if email exists.
	*@param {function} callbackFalse - called if email doesn't exist.
	*/	
	function emailExists(email, callbackTrue, callbackFalse){
		db.select()
		.from('User')
		.where({email: email})
		.all()
		.then(function (users) {
			if (isEmpty(users)){
			callbackFalse();
			}
			else{
			callbackTrue();
			}
		})
	}
	
	/**
	*Will check if a user with given username, password combination exists in the database.
	*@param {string} username - username to check
	*@param {string} password - password to check
	*@param {function} callbackTrue - called if combination exists.
	*@param {function} callbackFalse - called if combination doesn't exist.
	*/	
	function checkPass(username, password, callbackTrue, callbackFalse){
	
		db.select()
		.from('User')
		.where({username: username, password: password})
		.all()
		.then(function (users) {
			if (isEmpty(users)){
			callbackFalse();
			}
			else{
			callbackTrue();
			}
		})
	
	}

	/**
	*Takes user information as parameters and tries to add a new user object to the database, will call callback with false if it fails and true if it succeeds.
	*/
	this.createUser=function (firstName, lastName, username, password, email, language, callback){
	userExists(	username, 
				function(){callback(false)}, 
				function(){emailExists(	email, 
										function(){callback(false)},
										function(){db.vertex.create({
														'@class': 'User',
														firstName: firstName,
														lastName: lastName,
														username:username,
														password: password,
														email: email,
														language: language})
														.then(function (vertex) {
															console.log('Created vertex: ', vertex);
															callback(true);
															})
										}	
									)
							}
			)
	}					
					
	/**
	*Deletes user with given username from database, will not notice if user existed before deletion. (but will log: "deleted 0 users")
	*/
	this.deleteUser=function (username, callback){
		db.delete().from('User').where({username: username}).limit(1).scalar()
		.then(function (total) {
		console.log('deleted', total, 'users');
		callback(true);
		})
	}
	
	/**
	*Will chack if a username/password combination exists and call the corresponding callback
	*@param {string} username - username.
	*@param {string} password - password.
	*@param {function} clbSuccess - called if combination exists.
	*@param {function} clbWrongPwd - called if password is incorrect. 
	*@param {function} clbNotExist - called if username doesn't exist.
	*/
	this.checkCredentials=function (username, password, clbSuccess, clbWrongPwd, clbNotExist){
	
		userExists(username, function(){checkPass(username, password, function(){clbSuccess()}, clbWrongPwd)}, clbNotExist)

	}
	
	/**
	*will return user information via callback args, or will call other callback if user doesn't exist.
	*@param {string} username - called if combination exists.
	*@param {function} clbExists - called if user exists. 
	*@param {function} clbNotExist - called if user doesn't exist.
	*/
	this.getUser=function(username, clbExists, clbNotExist){
	
		userExists(username, function(){
								db.select()
								.from('User')
								.where({username: username})
								.all()
								.then(function (users) {
									var user=users[0]
									clbExists(user.firstName, user.lastName, user.username, user.email, user.language);
								})
							},
							function(){clbNotExist()})
	}
}

exports.newDatabase=newDatabase;

//var database= new newDatabase('localhost', 2424, 'skribl_database', 'skribl', 'skribl');

/*
function stop(){
process.exit(code=0)
}

function callBack(result){
	if (result===true){
	console.log('insert successful')
	}
	else{
	console.log('insert unsuccessful')
	}
	stop()
}
function clbSuccess(){
console.log('clbSuccess')
stop()
}

function clbWrongPwd(){
console.log('clbWrongPwd')
stop()
}

function clbNotExist(){
console.log('clbNotExist')
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
*/

//database.getUser('colossus616', printUser, clbNotExist)
//database.checkCredentials('colossus616', 'colossus66', clbSuccess, clbWrongPwd, clbNotExist)
//database.deleteUser('colossus161', callBack)
//database.createUser('Helene', 'Vervlimmeren', 'colossus161', 'colossus616', 'helene@vub.ac.be', 'english', callBack)
//process.exit(code=0)
//var tst=require('./Database_API.js');
