

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


		describe('add and remove publication', function(done) {
			var publicationRid;
			var p = path.join(__dirname, '/testfile2.pdf');
			var pRec = {getUploader	: function() {return 'jshep';},
						getTitle	: function() {return 'test 11'},
						getFirstName: function() {return 'Ivo'},
						getLastName: function() {return 'Vervlimmeren'},
						loadPath	: function(clb) { clb(p)}
			}
			//consumes file
			it('add a publication', function(done1) {
				db.addPublication(pRec, function(error, pubRid) {
					expect(error).toBeNull();
					publicationRid = pubRid;
					done1();
				});
			});

		});
	}
)
