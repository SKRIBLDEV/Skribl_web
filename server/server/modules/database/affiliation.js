
const RID = require('./rid.js');
function Affiliation(db, myDB) {

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
			}).error(callback);
		}

		/**
		 * checks if an faculty with certain name exists, if it does it jumps to checkDepartment(), if it doesn't it jumps to addFaculty()		
		 */
		function checkFaculty(institutionRid) {
			db.select('expand( out(\'HasFaculty\') )').from(institutionRid).all()
			.then(function(tempfac) {
				db.select().from('[' + RID.getRids(tempfac).toString() + ']').where({Name: newData.getFaculty()}).all() 
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
				}).error(callback);
			}).error(callback);
		}

		/**
		 * checks if an department with certain name exists, if it does it jumps to checkResearchGroup(), if it doesn't it jumps to addDepartment()		
		 */
		function checkDepartment(facultyRid) {
			db.select('expand( out(\'HasDepartment\') )').from(facultyRid).all()
			.then(function(tempDep) {
				db.select().from('[' + RID.getRids(tempDep).toString() + ']').where({Name: newData.getDepartment()}).all()
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
				}).error(callback);
			}).error(callback);
		}

		/**
		 * checks if an researchgroup with certain name exists, if it does it calls the callback with the rid, if it doesn't it jumps to addResearchGroup()		
		 */
		function checkResearchGroup(departmentRid) {
			db.select('expand( out(\'HasResearchGroup\') )').from(departmentRid).all()
			.then(function(tempResGroups) {
				db.select().from('[' + RID.getRids(tempResGroups).toString() + ']').where({Name: newData.getResearchGroup()}).all()
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
				}).error(callback);
			}).error(callback);
		}

		checkInstitution();
	};

	/**
	 * adds affiliation fields to given object
	 * @param  {Object}   user     user object
	 * @param  {callBack} callback 
	 * @return {Object}            user object
	 */
	this.getAffiliation = function(user, callback) {
		db.query('select expand(out(\'InResearchGroup\')) from ' + RID.getRid(user)).all()
		.then(function(res) {
			user.researchGroup = res[0].Name;
			db.query('select expand(in(\'HasResearchGroup\')) from ' + RID.getRid(res[0])).all()
			.then(function(res) {
				user.department = res[0].Name;
				db.query('select expand(in(\'HasDepartment\')) from ' + RID.getRid(res[0])).all()
				.then(function(res) {
					user.faculty = res[0].Name;
					db.query('select expand(in(\'HasFaculty\')) from ' + RID.getRid(res[0])).all()
					.then(function(res) {
						user.institution = res[0].Name;
						callback(null, user);
					}).error(callback);
				}).error(callback);
			}).error(callback);
		}).error(callback);
	};
}

exports.Affiliation = Affiliation;