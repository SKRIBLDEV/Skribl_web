
/*** @HANNAH *** 
	Todo's in this code:
	   	>> Use of global variable re (the JS-trap!)
	   	>> Lots of code duplication, basically always the same pattern
	   	>> Cleaner example:

	// higher order function to generate check functions

	function check(regex) {
		return function(inp) {
			return regex.test(inp);
		}
	}

	// followed by these definitions

	var nonEmpty = check(/.\$+./);
	var isPassword = check(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/);
	var isUsername = check(/^\w+$/);
	var isEmailAdress = ...
	...

	// OR YOU CAN EVEN DEFINE CHECK LIKE THIS ...
	// ... TO ELIMINATE NEEDED_PROPERTIES-CHECK IN USER.JS

	function check(regex) {
		return function(inp) {
			return inp && regex.test(inp);
		}
	}

	// ... MAYBE ALSO ADD !isEmpty etc. to check?

/*** --- END --- ***/ 

exports.nonEmpty = function(input) {
	re = /.\S+./; // RE for any number of characters (.), followed by at least one non-whitespace character (\S)
	return (re.test(input));
};

exports.noLeadingWhitespace = function(input) {
	re = /(\s+[\S\s]*)/; //RE for one or more (+) whitespace characters (\s) before any other character ([\S\s]*)
	return !(re.test(input));
};

exports.noTrailingWhitespace = function(input) {
	re = /([\S\s]*\s+)/; //RE for one or more (+) whitespace characters (\s) after any other character ([\S\s]*)
	return !(re.test(input));
};



//!= RFC2822 standard regex
exports.isEmailAdress = function(input) { 
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(input);
};

exports.isPassword = function(input) {
	//at least one number, one lowercase and one uppercase letter 
	// at least six characters
	var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
	return re.test(input);
};

exports.isUsername = function(input) {
	// only letters, numbers and underscores
	var re = /^\w+$/; 
	return re.test(input);
};

exports.isGeneralName = function(input){
	//one or more words in all languages, with apostrophes and hyphens 
	//excludes numbers and all the special (non-letter) characters commonly found on keyboards
	var re = /^[a-zA-Z\xC0-\uFFFF '-]+[a-zA-Z\xC0-\uFFFF'-]*/;
	return re.test(input);
};

exports.isDefinedResearchField = function(input){
	// ... file with list of research fields needed
	return true;
};
