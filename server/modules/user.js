/**
 * @exports User
 * @exports loadUser
 * @exports createUser
 * @exports deleteUser
 */

 /* TODO:
   - test
   - document
   - fix validation
   - ...
  */

var VAL = require("./validation.js");
var bcrypt = require('bcrypt');
var strength = 10; //hash strength

exports.UserRecord = function(info) {

	this.getFirstName = function() { return info.firstName; }
	this.getLastName = function() { return info.lastName; }
	//TODO::
	//function getResearchGroup(){return -->THIS?!<-- this.researchGroup;}
	//function getDepartment(){return this.department;};
	//function getFaculty(){return this.faculty;};
	//function getInstitution(){return this.institution;};
	this.getLanguage = function() { return info.language; }
	this.getEmail = function() { return info.email; }
	this.getUsername = function() { return info.username; }

	this.checkCredentials = function(pwd, callback) {
		bcrypt.compare(pwd, info.password, callback);
	}
}

exports.createUser = function(info, clb) {

	// TODO: FIX THIS => should validate everything inside info object

	function validate(clb) {

		var validation_error = new Error('server-side-validation-error');
		var e = []; //array for specific error information

		//check if all properties are defined
		for (var key in this) { //loops over all object *prototype* keys
			if (!this.hasOwnProperty(key)) { //property not defined, e.g, no firstName key and value pair 
				e.push('property ' + key + 'undefined');
			}
		}

		if(e.length) { // some properties are undefined
			clb(validation_error, e); //quit validation and pass array of errors, !here as value of the callback

		} else { //continue validation

			for (var key in this){
				if(!VAL.nonEmpty(this.key)) { // value only contains whitespaces (includes 'tab' etc.)
					e.push('input ' + key + ' consists solely of whitespace characters');
				}
				else if(!VAL.noLeadingWhitespace(this.key) || !VAL.noTrailingWhitespace(this.key) )
					e.push('input ' + key + ' contains leading or trailing whitespaces');
			}

			if (!VAL.isGeneralName(info.firstName))
				e.push('input ' + key + ' is not a valid name');
			if (!VAL.isGeneralName(info.lastName))
				e.push('input ' + key + ' is not a valid name');
			if (!VAL.isEmailAdress(info.email))
				e.push('input ' + key + ' is not a valid email');
			if (!VAL.isUsername(info.username))
				e.push('input ' + key + ' is not a valid username');
			if (!VAL.isPassword(info.password))   //already encrypted????
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
	}

	validate(function(err, data) {

		if (err) {
			clb(err, data);
		} else {
			bcrypt.hash(info.password, strength, function(err, hash) {
				if(err) {
					clb(err, null);
				} else {
					info.password = hash;
					clb(null, new UserRecord(info));
				}
			});
		}
	});
}