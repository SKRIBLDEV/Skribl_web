/**
 * @exports User
 * @exports loadUser
 * @exports createUser
 * @exports deleteUser
 */



var VAL = require("./validation.js");
var DB = require("./Database_API.js");



//***non-exported functions***///

function userFromDBRecord(dbUserRecord){
	return (new User(dbRecord.firstName, dbRecord.lastName, dbRecord.language, dbRecord.email, dbRecord.username, dbRecord.password));
}; 


//**exported functions***///



/**
 * @class User
 * @classdesc Contains user information. Private members: all constructor parameters;  method "validate".  Public members: attribute getters (except for password).
 * @param firstName
 * @param lastName
 * @param language - preferred language. 
 * @param username
 * @param password - ?encrypted?
 * 
 */
exports.User = function(firstName, lastName, language, email, username, password) {
	//to become: function(firstName, lastName, field, group, department, faculty, institution, prefLanguage, email, username, password)


	//public:
	function getFirstName(){return this.firstName;};
	function getLastName(){return this.lastName;};
	//function getResearchGroup(){return this.researchGroup;}
	//function getDepartment(){return this.department;};
	//function getFaculty(){return this.faculty;};
	//function getInstitution(){return this.institution;};
	function getprefLanguage(){return this.language;};
	function getEmail(){return this.email;};
	function getUsername(){return this.username;};
	//no getter for password


	//private:

	//all constructor parameters are private members 

	//private validation method 
	//this method is private for easy access to private members
	function validate(clb){

		var validation_error = new Error('server-side-validation-error');
		var e = []; //array for specific error information

		//check if all properties are defined
		for (var key in this) { //loops over all object *prototype* keys
			if ( ! this.hasOwnProperty(key)) { //property not defined, e.g, no firstName key and value pair 
				e.push('property ' + key + 'undefined');
			}
		}

		if(e.length) // some properties are undefined
			clb(validation_error, e); //quit validation and pass array of errors, !here as value of the callback

		else{ //continue validation

			for (var key in this){
				if( ! VAL.nonEmpty(this.key)) { // value only contains whitespaces (includes 'tab' etc.)
					e.push('input ' + key + ' consists solely of whitespace characters');
				}
				else if( ! VAL.noLeadingWhitespace(this.key) || ! VAL.noTrailingWhitespace(this.key) )
					e.push('input ' + key + ' contains leading or trailing whitespaces');
			}

			if (! VAL.isGeneralName(this.firstName))
				e.push('input ' + key + ' is not a valid name');
			if (! VAL.isGeneralName(this.lastName))
				e.push('input ' + key + ' is not a valid name');
			if (! VAL.isEmailAdress(this.email))
				e.push('input ' + key + ' is not a valid email');
			if (! VAL.isUsername(this.username))
				e.push('input ' + key + ' is not a valid username');
			if (! VAL.isPassword(this.password))   //already encrypted????
				e.push('input ' + key + ' is not a valid password');

			/*if (! VAL.isResearchField(this.field))
				e.push('input ' + key + ' is not recognized by the system');
			if (! VAL.isGeneralName(this.researchGroup))
				e.push('input ' + key + ' is not a valid name');
			if (! VAL.isGeneralName(this.department))
				e.push('input ' + key + ' is not a valid name');
			if (! VAL.isGeneralName(this.faculty))
				e.push('input ' + key + ' is not a valid name');
			if (! VAL.isGeneralName(this.institution))
				e.push('input ' + key + ' is not a valid name');*/

			// preferred language validation needed 

			if(e.length)
				clb(validation_error, e); //do not add user to database, pass errors !array of specific error information passed as result!
			else 
				clb(null, true); //clb without errors
		}
	};
};


/**
 * @function loadUser. Given username and password are checked against database, if authentification succeeds, a new user object is created
 * @param username
 * @param password
 * @param db - database
 * @callback clb - called with (null, userObject) if succeeded, and with errors 'wrong-username'/'wrong-password' if not.
 */


exports.loadUser = function(username, password, db, clb){
	db.checkCredentials(username, password, function(err, dbRecord){
		if (err)
			clb(err);
		else
			clb(null, userFromRecord(dbRecord));
	});
};



/**
 * @function createUser. Proposed account data gets (server-side) validated, and if valid, a new user is added to the database. 
 * @param newData - contains the proposed account data
 * @param db - database
 * @callback clb - called with (null, userObject) if succeeded, with ('server-side-validation-error', arrayOfErrors) if validation does not succeed, or with errors 'email-taken'/'username-taken'.
 * 
 */


exports.createUser = function(newData, db, clb) {	
	newData.validate(function(err, errorArrayOrResult){
		if (err) //'server-side-validation-error': errorArrayOrResult is an array containing specific error information
			clb(err, errorArrayOrResult); 
		else  //valid new account
			db.createUser(newData, clb); //assumes db.createUser calls clb with errors ('username-taken', 'email-taken') 
	});
};


/**
 * @function deleteUser. If user exists, the user record is deleted in the database. 
 * @param user - object of type user
 * @param db - database
 * @callback clb - ....
 * 
 */

// check against Ivo needed for details of this function 
exports.deleteUser = function(user, db, clb) {
	db.exists(user, function(err, exists){
		if (exists)
			db.deleteUser(user, db, clb);
		else 
			clb(new Error('deletion-non-existing-user'));
	});
};
