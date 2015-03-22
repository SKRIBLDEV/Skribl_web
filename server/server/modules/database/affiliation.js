
var RID = require('./rid.js');
function Affiliation(db) {
	/**
	 * adds a new researchgroup
	 * @private
	 * @param {Object}   newData
	 * @param {String}   departmentRid
	 * @param {callBack} callback
	 */
	function addResearchGroup(newData, trx, callback) {
		trx.let('researchGroup', function(s) {
			s.create('vertex', 'ResearchGroup')
			.set({
				Name: newData.getResearchGroup()
			});
		});
		callback(null, true);
	}

	/**
	 * adds a new department
	 * @private
	 * @param {Object}   newData
	 * @param {[String]}   facultyRid
	 * @param {callBack} callback
	 */
	function addDepartment(newData, trx, callback) {
		trx.let('department', function(s) {
			s.create('vertex', 'Department')
			.set({
				Name: newData.getDepartment()
			});
		});
		addResearchGroup(newData, trx, function(error, res) {
			trx.let('departmentEdge', function(s) {
				s.create('edge', 'HasResearchGroup')
				.from('$department')
				.to('$researchGroup');
			});
			callback(error, res);
		});
	}

	/**
	 * adds a new faculty
	 * @private
	 * @param {Object}   newData
	 * @param {String}   instituteRid
	 * @param {callBack} callback
	 */
	function addFaculty(newData, trx, callback) {
		trx.let('faculty', function(s) {
			s.create('vertex', 'Faculty')
			.set({
				Name: newData.getFaculty()
			});
		});
		addDepartment(newData, trx, function(error, res) {
			trx.let('facultyEdge', function(s) {
				s.create('edge', 'HasDepartment')
				.from('$faculty')
				.to('$department');
			});
			callback(error, res);
		});
	}

	/**
	 * adds a new institution
	 * @private
	 * @param {Object}   newData
	 * @param {callBack} callback
	 */
	function addInstitution(newData, trx, callback) {
		trx.let('institution', function(s) {
			s.create('vertex', 'Institution')
			.set({
				Name: newData.getInstitution()
			});
		});
		addFaculty(newData, trx, function(error, res) {
			trx.let('institutionEdge', function(s) {
				s.create('edge', 'HasFaculty')
				.from('$institution')
				.to('$faculty');
			});
			callback(error, res);
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
	 this.addAffiliation = function(newData, trx, callback) {

		/**
		 * checks if an institute with certain name exists, if it does it jumps to checkFaculty(), if it doesn't it jumps to addInstitution()		
		 * @return {String}	returns rid of researchgroup
		 */
		function checkInstitution() {
			db.select().from('Institution').where({Name: newData.getInstitution()}).all()
			.then(function (institutions) {
				if(institutions.length === 0){
					addInstitution(newData, trx, callback);
				}
				else{
					trx.let('institution', function(s) {
						s.select().from('Institution').where({Name: newData.getInstitution()});
					});
					checkFaculty(RID.getRid(institutions[0]));
				}
			});
		}

		/**
		 * checks if an faculty with certain name exists, if it does it jumps to checkDepartment(), if it doesn't it jumps to addFaculty()		
		 */
		function checkFaculty(institutionRid) {
			db.select('expand( out(\'HasFaculty\') )').from(institutionRid).all()
			.then(function(tempfac) {
				db.select().from(RID.getORids(tempfac)).where({Name: newData.getFaculty()}).all()
				.then(function (faculties) {
					if(faculties.length === 0) {
						addFaculty(newData, trx, function(error, res) {
							trx.let('institutionEdge', function(s) {
								s.create('edge', 'HasFaculty')
								.from('$institution')
								.to('$faculty');
							});
							callback(error, res);
						});
					}
					else{
						trx.let('faculty', function(s) {
							s.select().from(RID.getORid(faculties[0]));
						});
						checkDepartment(RID.getRid(faculties[0]));
					}
				});
			});
		}

		/**
		 * checks if an department with certain name exists, if it does it jumps to checkResearchGroup(), if it doesn't it jumps to addDepartment()		
		 */
		function checkDepartment(facultyRid) {
			db.select('expand( out(\'HasDepartment\') )').from(facultyRid).all()
			.then(function(tempDep) {
				db.select().from(RID.getORids(tempDep)).where({Name: newData.getDepartment()}).all()
				.then(function (departments) {
					if(departments.length === 0) {
						addDepartment(newData, trx, function(error, res) {
							trx.let('facultyEdge', function(s) {
								s.create('edge', 'HasDepartment')
								.from('$faculty')
								.to('$department');
							});
							callback(error, res);	
						});
					}
					else{
						trx.let('department', function(s) {
							s.select().from(RID.getORid(departments[0]));
						});
						checkResearchGroup(RID.getRid(departments[0]));
					}
				});
			});
		}

		/**
		 * checks if an researchgroup with certain name exists, if it does it calls the callback with the rid, if it doesn't it jumps to addResearchGroup()		
		 */
		function checkResearchGroup(departmentRid) {
			//db.exec('select from (select expand( out(\'HasDepartment\') ) from ' + departmentRid + ') where Name = \'' + newData.getResearchGroup() + '\'')
			db.select('expand( out(\'HasResearchGroup\') )').from(departmentRid).all()
			.then(function(tempResGroups) {
				db.select().from(RID.getORids(tempResGroups)).where({Name: newData.getResearchGroup()}).all()
				.then(function (researchGroups) {
					if(researchGroups.length === 0) {
						addResearchGroup(newData, trx, function(error, res) {
							trx.let('departmentEdge', function(s) {
								s.create('edge', 'HasResearchGroup')
								.from('$department')
								.to('$researchGroup');
							});
							callback(error, res);
						});
					}
					else{
						trx.let('researchGroup', function(s) {
							s.select().from(RID.getORid(researchGroups[0]));
						});

						callback(null, true);
					}
				});
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
		var researchGroup;
		var department;
		var faculty;
		var institution;
		db.exec('select * from (traverse * from (select * from User where username = \'' + cUser.username + '\') while $depth < 2) where @class = \'ResearchGroup\'')
		.then(function(information) {
			results = information.results[0];
			content = results.content[0];
			researchGroup = content.value;
			cUser.researchGroup = researchGroup.Name;
		})
		.then(function() {
			var departmentRid = RID.transformRid(researchGroup.Department);
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