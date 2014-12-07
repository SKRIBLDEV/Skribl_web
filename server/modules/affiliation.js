
var RID = require('./rid.js');
function Affiliation(db) {
	/**
	 * adds a new researchgroup
	 * @private
	 * @param {Object}   newData
	 * @param {String}   departmentRid
	 * @param {callBack} callback
	 */
	function addResearchGroup(newData, departmentRid, callback) {
		db.vertex.create({
			'@class': 'ResearchGroup',
			Name: newData.getResearchGroup(), 
			Department: departmentRid})
		.then(function(ResearchGroup) {
			var researchGroupRid = RID.getRid(ResearchGroup);
			callback(researchGroupRid);
		});
	}

	/**
	 * adds a new department
	 * @private
	 * @param {Object}   newData
	 * @param {[String]}   facultyRid
	 * @param {callBack} callback
	 */
	function addDepartment(newData, facultyRid, callback) {
		db.vertex.create({
			'@class': 'Department',
			Name: newData.getDepartment(), 
			Faculty: facultyRid})
		.then(function(department) {
			var departmentRid = RID.getRid(department);
			addResearchGroup(newData, departmentRid, function(researchGroupRid) {
				db.exec('update Department add ResearchGroups = ' + researchGroupRid + ' where @rid = ' + departmentRid)
				.then(function() {
					callback(departmentRid, researchGroupRid);
				});
			});
		});
	}

	/**
	 * adds a new faculty
	 * @private
	 * @param {Object}   newData
	 * @param {String}   instituteRid
	 * @param {callBack} callback
	 */
	function addFaculty(newData, instituteRid, callback) {
		db.vertex.create({
			'@class': 'Faculty',
			Name: newData.getFaculty(), 
			Institution: instituteRid})
		.then(function(faculty) {
			var facultyRid = RID.getRid(faculty);
			addDepartment(newData, facultyRid, function(departmentRid, researchGroupRid) {
				db.exec('update Faculty add Departments = ' + departmentRid + ' where @rid = ' + facultyRid)
				.then(function() {
					callback(facultyRid, researchGroupRid);
				});
			});
		});
	}

	/**
	 * adds a new institution
	 * @private
	 * @param {Object}   newData
	 * @param {callBack} callback
	 */
	function addInstitution(newData, callback) {
		db.vertex.create({
			'@class': 'Institution',
			Name: newData.getInstitution()})
		.then(function(inst) {
			var institutionRid = RID.getRid(inst);
			addFaculty(newData, institutionRid, function(facultyRid, researchGroupRid) {
				db.exec('update Institution add Faculties = '+ facultyRid + ' where @rid = ' + institutionRid)
				.then(function() {
					callback(null, researchGroupRid);
				});
			});
		});
	}
	
	/**
	 * will make sure that a certain affiliation (string of institute-faculty-department-researchgroup) exists, if it doesn't it will be added.
	 * will execute checkInstitution().
	 * @private
	 * @param {Object}   newData
	 * @param {callBack} callback
	 * @return {String}	returns rid of researchgroup
	 */
	 this.addAffiliation = function(newData, callback) {

		/**
		 * checks if an institute with certain name exists, if it does it jumps to checkFaculty(), if it doesn't it jumps to addInstitution()		
		 * @return {String}	returns rid of researchgroup
		 */
		function checkInstitution() {
			db.select().from('Institution').where({Name: newData.getInstitution()}).all()
			.then(function (institutions) {
				if(institutions.length === 0){
					addInstitution(newData, callback);
				}
				else{
					var institution = institutions[0];
					var institutionRid = RID.getRid(institution);
					checkFaculty(institutionRid);
				}
			});
		}

		/**
		 * checks if an faculty with certain name exists, if it does it jumps to checkDepartment(), if it doesn't it jumps to addFaculty()		
		 */
		function checkFaculty(institutionRid) {
			db.select().from('Faculty').where({Name: newData.getFaculty(), Institution: institutionRid}).all()
			.then(function (faculties) {
				if(faculties.length === 0) {
					addFaculty(newData, institutionRid, function(facultyRid, ResearchGroupRid) {
						db.exec('update Institution add Faculties = '+ facultyRid + ' where @rid = ' + institutionRid)
							.then(function() {
								callback(null, ResearchGroupRid);
							});
					});
				}
				else{
					var faculty = faculties[0];
					var facultyRid = RID.getRid(faculty);
					checkDepartment(facultyRid);
				}
			});
		}

		/**
		 * checks if an department with certain name exists, if it does it jumps to checkResearchGroup(), if it doesn't it jumps to addDepartment()		
		 */
		function checkDepartment(facultyRid) {
			db.select().from('Department').where({Name: newData.getDepartment(), Faculty: facultyRid}).all()
			.then(function (departments) {
				if(departments.length === 0) {
					addDepartment(newData, facultyRid, function(departmentRid, ResearchGroupRid) {
						db.exec('update Faculty add Departments = ' + departmentRid + ' where @rid = ' + facultyRid)
							.then(function() {
								callback(null, ResearchGroupRid);
							});
					});
				}
				else{
					var department = departments[0];
					var departmentRid = RID.getRid(department);
					checkResearchGroup(departmentRid);
				}
			});
		}

		/**
		 * checks if an researchgroup with certain name exists, if it does it calls the callback with the rid, if it doesn't it jumps to addResearchGroup()		
		 */
		function checkResearchGroup(departmentRid) {
			db.select().from('ResearchGroup').where({Name: newData.getResearchGroup(), Department: departmentRid}).all()
			.then(function (researchGroups) {
				if(researchGroups.length === 0) {
					addResearchGroup(newData, departmentRid, function(ResearchGroupRid) {
						db.exec('update Department add ResearchGroups = ' + ResearchGroupRid + ' where @rid = ' + departmentRid)
							.then(function() {
								callback(null, ResearchGroupRid);
							});
					});
				}
				else{
					var ResearchGroup = researchGroups[0];
					var ResearchGroupRid = RID.getRid(ResearchGroup);
					callback(null, ResearchGroupRid);
				}
			});
		}

		checkInstitution();
	};


		/**
		 * will get the researchgroup of a user and then collect the whole affiliation chain.
		 * @private
		 * @param  {Object}   user
		 * @param  {callBack} callback
		 * @return {[Object]}
		 */
	this.getAffiliation = function(user, callback) {
	  	var cUser = user;
	  	var results;
		var content;
		var researchgroup;
		var department;
		var faculty;
		var institution;
		db.exec('select * from (traverse * from (select * from User where username = \'' + cUser.username + '\') while $depth < 2) where @class = \'ResearchGroup\'')
		.then(function(information) {
			results = information.results[0];
			content = results.content[0];
			researchgroup = content.value;
			cUser.researchgroup = researchgroup.Name;
		})
		.then(function() {
			var departmentRid = RID.transformRid(researchgroup.Department);
			db.query('select from Department where @rid = ' + departmentRid)
			.then(function(departments) {
				department = departments[0];
				cUser.department = department.Name;
			})
			.then(function() {
				var facultyRid = RID.transformRid(department.Faculty);
				db.query('select from Faculty where @rid = ' + facultyRid)
				.then(function(faculties) {
					faculty = faculties[0];
					cUser.faculty = faculty.Name;
				})
				.then(function() {
					var institutionRid = RID.transformRid(faculty.Institution);
					db.query('select from Institution where @rid = ' + institutionRid)
					.then(function(institutions) {
						institution = institutions[0];
						cUser.institution = institution.Name;
						callback(null, cUser);
					});

				});
			});
		});
	};
}

exports.Affiliation = Affiliation;