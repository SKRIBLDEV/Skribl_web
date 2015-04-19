/**
* Module for application logic concerning 'users', between server and database. 
* @module user
* 
*/

var VAL = require("./validation.js");
var bcrypt = require('bcrypt');
var strength = 10; //hash strength

//array with properties for which the values should conform to generalName-RegEx
var generalNames = ['firstName', 'lastName', 'researchGroup', 'department', 'faculty', 'institution'];

/** 
* Constructor for creating UserRecords, with public getters for account information, and a method to check credentials. UserRecords are returned from the database.
* @see database module #loadUser
* @constructor UserRecord
* @param info (private)  : object containing validated user account info. 
*/
function UserRecord(info) {

	/** 
	* @method get*property* (public) : getter for user property, e.g., myUser.getFirstName()
	*/

	this.getFirstName = function() { return info.firstName; };
	this.getLastName = function() { return info.lastName; };
	this.getAuthorId = function() {return info.authorId};
	this.getLanguage = function() { return info.language; };
	this.getEmail = function() { return info.email; };
	this.getUsername = function() { return info.username; };
	this.getPassword = function() { return info.password; };
	this.getResearchGroup = function() { return info.researchGroup; };
	this.getDepartment = function() { return info.department; };
	this.getFaculty = function() { return info.faculty; };
	this.getInstitution = function() { return info.institution; };
	this.getResearchDomains = function() { return info.researchDomains; };

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

createUser = function(info, clb) {

	function validate(info, clb) {

		/* the validation functions defined in the validation.js module check:
		* - input defined?
		* - input not solely whitespace, and no leading or trailing whitespaces? (included in RegEx)
		* - form against specific RegEx
		*/

		var e = []; //array for specific error information, passed as the result to the clb if validation does not succeed

		//check all 'general names'
		for (var i = 0; i < generalNames.length; i++) {
			if (! VAL.isGeneralName( info[generalNames[i]] ))
				e.push('input ' + generalNames[i] + ' is not a valid name');
		}

		//check specific properties
		if (!VAL.isEmailAdress(info.email))
			e.push('input ' + 'email' + ' is not a valid email');
		if (!VAL.isUsername(info.username))
			e.push('input ' + 'username' + ' is not a valid username');
		if (!VAL.isPassword(info.password))  
			e.push('input ' + 'password' + ' is not a valid password');
		if(!VAL.isGeneralName(info.language)) // future implementation using isLanguage
			e.push('input ' + 'language' + ' is not a valid language option');


		//check array of researchDomains
		if ( !info.researchDomains || !info.researchDomains.constructor === Array)
			e.push('input ' + 'research domain' + ' is not defined or is not an array');
		else{
			for (var i = 0; i < info.researchDomains.length; i++){
				if (! VAL.isGeneralName( info.researchDomains[i] )) // future implementation using isResearchDomain
					e.push('input ' + 'research domain' + ' is not recognized');
			}
		}

		//check for errors during validation
		if(e.length) 
				clb(new Error('server-side-validation-error'), e); // pass error, !array with specific error information passed as result!
		else 
				clb(null, true); //succes, clb without error		
		
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



exports.UserRecord = UserRecord;
exports.createUser = createUser;