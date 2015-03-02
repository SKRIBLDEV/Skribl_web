describe('Database API Tests', 
	function(){
		var dAPI=require('./database.js');
		var UM = require('../user.js');
		var path = require('path');

		var serverConfig = {ip:'localhost', port:2424, username:'root', password:'root'};
		var dbConfig = {dbname:'skribl_database', username:'skribl', password:'skribl'};
		var db=new dAPI.Database(serverConfig, dbConfig);

			//if test is executed jasmine crashes? results are not shown.
			//function wil also deleate file on database.
		xit('load a publication', function(done2) {
			db.loadPublication(publicationRid, p, function(error, value) {
				expect(value).toBe(true);
				expect(error).toBeNull();
				done2()
			});
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