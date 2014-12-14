

describe('Database API Tests', 
	function(){
		var dAPI=require('./database.js');
		var UM = require('../user.js');
		var path = require('path');

		var serverConfig = {ip:'localhost', port:2424, username:'root', password:'root'};
		var dbConfig = {dbname:'skribl_database', username:'skribl', password:'skribl'};
		var db=new dAPI.Database(serverConfig, dbConfig);


		it('connecting to database', function(done){
			expect(db).toBeDefined();
			done();
		})

		it('adding user to database', function(done) {


			var nUser = {firstName: 'randomName', 
				lastName: 'randomOtherName', 
				username: 'randomUsername', 
				password: 'RandomPass123', 
				email: 'randomName@vub.ac.be', 
				language: 'NL', 
				institution: 'Random University', 
				faculty: 'RandomFaculty', 
				department: 'RandomDepartment', 
				researchGroup: 'RandomResearchGroup', 
				researchDomains: ['Biological Sciences']};

			UM.createUser(nUser, function(error, user) {
				db.createUser(user, function(error, value) {
					expect(error).toBeNull();
					done();
				});
			});	
		})

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

		describe('add and remove publication', function(done) {
			var publicationRid;
			var p = path.join(__dirname, '/testfile2.pdf');
			var pRec = {getUploader	: function() {return 'jshep';},
						getTitle	: function() {return 'test 11'},
						getFirstName: function() {return 'Ivo'},
						getLastName: function() {return 'Vervlimmeren'},
						loadPath	: function(clb) { clb(p)}
			}
			it('add a publication', function(done1) {
				db.addPublication(pRec, function(error, pubRid) {
					expect(error).toBeNull();
					publicationRid = pubRid;
					done1();
				});
			});

			xit('load a publication', function(done2) {
				db.loadPublication(publicationRid, p, function(error, value) {
					expect(value).toBe(true);
					expect(error).toBeNull();
					done2()
				});
			});
			done();
		});

		it('delete user from database', function(done) {
			db.deleteUser('randomUsername', function(error, value) {
				expect(value).toBe(true);
				db.loadUser('randomUsername', function(error) {
					expect(error).not.toBeNull();
					done();
				});
			});
		});
	}
)
