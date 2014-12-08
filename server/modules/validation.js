
/**
* Module for validation of input with regular expressions, for client- and server-side validation.
* @module validation
*/


var RD = require("./researchDomain-module.js");


//********* definition of regular expressions, exported for use with AngularJS (client-side validation)


//all regex imply that the matched string should not be empty (=solely whitespace characters) and should not contain leading or trailing whitespaces

// only letters, numbers and underscores
var RegEx_username = /^\w+$/; 

// common email 
var RegEx_emailAdress = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//at least one number, at least 6 and at most 20 characters from the set [a-zA-Z0-9!@#$%^&*]
var RegEx_password = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,20}$/; 

//one or more words in all languages, with apostrophes and hyphens 
//excludes numbers and all the special (non-letter) characters commonly found on keyboards
var RegEx_generalName = /^[a-zA-Z\xC0-\uFFFF '-]+[a-zA-Z\xC0-\uFFFF'-]$/; 


exports.RegEx_username = RegEx_username;
exports.RegEx_emailAdress = RegEx_emailAdress;
exports.RegEx_password = RegEx_password;
exports.RegEx_generalName = RegEx_generalName;



//********** functions used for server-side validation 

// includes testing of input 'undefined'

function check(regex) {
		return function(input) {
			return input && regex.test(input); 
		}
};

exports.isEmailAdress = check(RegEx_EmailAdress);
exports.isPassword = check(RegEx_Password); 
exports.isUsername = check(RegEx_username); 
exports.isGeneralName = check(RegEx_GeneralName);

exports.isResearchDomain = function(input) {
	return RD.majorPresent(input); //checks input is in the list of major ("general") research domains
 };

 exports.isLanguage = function(input) {
 	return (input === "NL") || (input === "ENG");
 }


