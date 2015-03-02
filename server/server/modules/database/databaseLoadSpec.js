describe('Database API Tests', 
	function(){
		var dAPI=require('./database.js');
		var UM = require('../user.js');
		var path = require('path');

		var serverConfig = {ip:'localhost', port:2424, username:'root', password:'root'};
		var dbConfig = {dbname:'skribl_database', username:'skribl', password:'skribl'};
		var db=new dAPI.Database(serverConfig, dbConfig);


		it('loading user from database', function(done) {
			db.loadUser('randomUsername', function(error, user) {
				function checkUser(usr){
							expect(usr.getFirstName()).toBe('randomName');
							expect(usr.getLastName()).toBe('randomOtherName');
							expect(usr.getUsername()).toBe('randomUsername');
							expect(usr.getEmail()).toBe('randomName@vub.ac.be');
							expect(usr.getResearchGroup()).toBe('RandomResearchGroup');
							expect(usr.getDepartment()).toBe('RandomDepartment');
							expect(usr.getFaculty()).toBe('RandomFaculty');
							expect(usr.getInstitution()).toBe('Random University');
							expect(usr.getResearchDomains()[0]).toBe('Biological Sciences');   //need custom matcher for arrays
							expect(usr.getLanguage()).toBe('NL');
							//need to check password hash-->bcrypt?
							//expect(usr.password).toBe('RandomPass123');
							done();
						}
				expect(error).toBeNull();
				checkUser(user);
			});
		});

		it('get subdivisions of a given division', function(done) {
			db.getSubdivisions(function(error, resArray) {expect(error).toBeNull(); expect(resArray[0].toBe('RandomFaculty'));}, 'Random University');
			db.getSubdivisions(function(error, resArray) {expect(error).toBeNull(); expect(resArray[0].toBe('RandomDepartment'));}, 'RandomFaculty');
			db.getSubdivisions(function(error, resArray) {expect(error).toBeNull(); expect(resArray[0].toBe('RandomResearchGroup'));}, 'RandomDepartment');
			done();
		});
		
	}
)