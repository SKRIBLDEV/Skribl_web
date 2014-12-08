var RDL = require("./researchDomain-list.js");

/* major = major research discipline (e.g., computer science, physics)
*  minor = more specific research discipline (e.g., artificial intelligence)
*/

// creates and returns a list containing all major research disciplines 
exports.getMajors = function(){
	var majors = [];
	RDL.forEach(function(entry){
		majors.push(entry.major.name);
	});	
	return majors;
};

// creates and returns a list containing all minor (=more specific) research disciplines
exports.getMinors = function(majorName){
	var minors = [];
	RDL.forEach(function(entry){
		if (entry.major.name === majorName){
			entry.minor.forEach(function(minorEntry){
				minors.push(minorEntry.name);
			});
		};
	});
	return minors;
};


//check if certain major is in list
exports.majorPresent = function(majorName){ 
	for (var i = 0; i < RDL.length; i++) { //might be faster than using getMajors() (if large list)
		if (RDL[i].major.name === majorName)
			return true;
	};
	return false;
};

//check if certain minor is part of minors for some major
exports.minorPresent = function(minor,major){
	return getMinors(major).indexOf(minor) !== -1; //small lists
};


