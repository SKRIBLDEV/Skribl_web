/**
* Module for application logic concerning 'users', between server and database. 
* @module user
* 
*/


 /* TODO:
   - test
   - ...
  */



var VAL = require("./validation.js");
var db = require("./database.js");
var bcrypt = require('bcrypt');
var strength = 10; //hash strength

//[I] changed because otherwise error at line 149
exports.UserRecord = UserRecord;

/** 
* Constructor for creating UserRecords, with public getters for account information (except password), and a method to check credentials. UserRecords are returned from the database.
* @see database module #loadUser
* @constructor UserRecord
* @param info (private)  : object containing validated user account info. 
*/
function UserRecord(info) {

	/** 
	* @method get*property* (public) : getter for user property, e.g., myUser.getFirstName()
	*/

	this.getFirstName = function() { return info.firstName; }
	this.getLastName = function() { return info.lastName; }
	//TODO::
	//function getResearchGroup(){return -->THIS?!<-- info.researchGroup;}
	//function getDepartment(){return info.department;};
	//function getFaculty(){return info.faculty;};
	//function getInstitution(){return info.institution;};
	this.getLanguage = function() { return info.language; }
	this.getEmail = function() { return info.email; }
	this.getUsername = function() { return info.username; }

	//[I] tijdelijk toegevoegd om database te testen
	this.getPassword = function() { return info.password; }
	this.getResearchGroup = function() {return info.researchgroup;}
	this.getDepartment = function() {return info.department;}
	this.getFaculty = function() {return info.faculty;}
	this.getInstitution = function() {return info.institution;}
	this.getResearchDomains = function() {return info.researchdomains;}

	/**
	* @method checkCredentials: checks a given password against (encrypted) password stored in UserRecord
	* @param password
	* @callback callback passed to bcrypt.compare  
	*/
	this.checkCredentials = function(pwd, callback) {
		bcrypt.compare(pwd, info.password, callback);
	}
}



/** 
* createUser validates the given account information, encrypts the password and creates a new UserRecord object, to be passed to the database.
* @see route user.js #createUser
* @param info : object containing account information, not yet validated on the server side
* @callback : clb(err, data) called either with err = validation error and data = array containing specific error information, or with err = null and data = true. 
*/


exports.createUser = function(info, clb) {

	function validate(info, clb) {

		var validation_error = new Error('server-side-validation-error');
		var e = []; //array for specific error information

		var neededProperties = ['firstName', 'lastName', 'email', 'username', 'password']; //NOT COMPLETE
     

		//check if all needed properties are defined
		for (var i = 0; i < neededProperties.length; i++){
			if( ! (neededProperties[i] in info) || ! info[neededProperties[i]] )  //property itself undefined or, if property found, value undefined
				e.push('property ' + neededProperties[i] + ' undefined');
		}


		if(e.length) {  // some properties are undefined
			clb(validation_error, e); //quit validation and pass array of errors, !here as value of the callback
		}

		//continue validation
		else { 

			//check whitespace characters 
			for (var i = 0; i < neededProperties.length; i++){
				if(!VAL.nonEmpty(info[neededProperties[i]])) { // value only contains whitespaces (includes 'tab' etc.)
					e.push('input ' + neededProperties[i] + ' consists solely of whitespace characters');
				}
				else if(!VAL.noLeadingWhitespace(info[neededProperties[i]]) || !VAL.noTrailingWhitespace(info[neededProperties[i]]) )
					e.push('input ' + neededProperties[i] + ' contains leading or trailing whitespaces');
			}

			//check general 'form'
			if (!VAL.isGeneralName(info.firstName))
				e.push('input ' + 'firstName' + ' is not a valid name');
			if (!VAL.isGeneralName(info.lastName))
				e.push('input ' + 'lastName' + ' is not a valid name');
			if (!VAL.isEmailAdress(info.email))
				e.push('input ' + 'email' + ' is not a valid email');
			if (!VAL.isUsername(info.username))
				e.push('input ' + 'username' + ' is not a valid username');
			if (!VAL.isPassword(info.password))   //already encrypted????
				e.push('input ' + 'password' + ' is not a valid password');

			/*if (! VAL.isResearchField(info.field))
				e.push('input ' + key + ' is not recognized by the system');
			if (! VAL.isGeneralName(info.researchGroup))
				e.push('input ' + key + ' is not a valid name');
			if (! VAL.isGeneralName(info.department))
				e.push('input ' + key + ' is not a valid name');
			if (! VAL.isGeneralName(info.faculty))
				e.push('input ' + key + ' is not a valid name');
			if (! VAL.isGeneralName(info.institution))
				e.push('input ' + key + ' is not a valid name');*/

			// preferred language validation needed 

			if(e.length) //errors during validation
				clb(validation_error, e); // pass error, !array with specific error information passed as result!
			else 
				clb(null, true); //succes, clb without errors
		}
	}

	
	validate(info, function(err, data) {
		if (err) {
			clb(err, data); // err = 'server-side-validation-error' -> 'data' = an array consisting of specific error information
		} else {
			//encrypt password
			bcrypt.hash(info.password, strength, function(encryptErr, hash) {
				if(encryptErr) {
					clb(encryptErr, null); 
				} else {
					info.password = hash;
					clb(null, new UserRecord(info));
				}
			});
		}
	});
}

