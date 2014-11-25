exports.nonEmpty = function(input) {
	re = /([^\S]+)/; //RE for one or more (+) non-whitespace characters (\S), matching beginning of input (^)
	return re.test(input);
};

exports.noLeadingWhitespace = function(input) {
	re = /(^\s+[\S\s]*)/; //RE for one or more (+) whitespace characters (\s) before any other character ([\S\s]*)
	return not(re.test(input));
};

exports.noTrailingWhitespace = function(input) {
	re = /(^[\S\s]*\s+)/; //RE for one or more (+) whitespace characters (\s) after any other character ([\S\s]*)
	return not(re.test(input));
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
	// test names : 
	/*
	Elkj¾rd
	AndrŽ
	la Cour
	Anne-Marie 
	Kungliga Tekniska hšgskolan
	Institut d'Alembert
	 */
	var re = /^[a-zA-Z\xC0-\uFFFF '-]+[a-zA-Z\xC0-\uFFFF'-]*/;
	return re.test(input);
};

exports.isDefinedResearchField = function(input){
	// ... file with list of research fields needed
	return true;
};
