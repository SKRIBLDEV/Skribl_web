var d = require('./testRandomData.js');

function setup(clb) {
	var ctr = 0
	afterEach(function() {
		if(++ctr == 7) clb(null, true);
  	});	

		it('connecting to database', function(done){
			expect(d.db).toBeDefined();
			done();
		});

		it('adding user to database', function(done) {
			d.UM.createUser(d.nUser, function(error, user) {
				d.db.createUser(user, function(error, userId) {
					expect(error).toBeNull();
					expect(userId).toEqual(jasmine.any(String));
					d.tempUserId = userId;
					done();
				});
			});	
		});

		it('adding journal to database', function(done) {
			d.db.addJournal(d.pubJournal.title, d.fObject, 'randomUsername', function(error, res) {
				expect(error).toBeNull();
				expect(res).toEqual(jasmine.any(String));
				d.tempJournalId = res;
				done();
			});
		});

		it('adding proceeding to database', function(done) {
			d.db.addProceeding(d.pubProceeding.title, d.fObject, 'randomUsername', function(error, res) {
				expect(error).toBeNull();
				expect(res).toEqual(jasmine.any(String));
				d.tempProceedingId = res;
				done();
			});
		});

		it('adding library to user', function(done) {
			d.db.addLibrary('randomUsername', 'randomLib', function(error, res) {
				expect(error).toBeNull();
				expect(res).toBe(true);
			});
			d.db.addLibrary('randomUsername', 'randomLib', function(error, res) {
				expect(error).not.toBeNull();
				done();
			});
		});


		it('adding publication to library', function(done) {
			d.db.addToLibrary('randomUsername', 'randomLib', d.tempJournalId, function(error, res) {
				expect(error).toBeNull();
				expect(res).toBe(true);
				done();
			});
		});

		it('updating publication data', function(done) {
			d.db.updatePublication(d.tempJournalId, d.pubJournal, function(error, res) {
				expect(error).toBeNull();
				expect(res).toBe(true);
				d.db.updatePublication(d.tempProceedingId, d.pubProceeding, function(error, res) {
					expect(error).toBeNull();
					expect(res).toBe(true);
					done();
				});
			});
		});

}
exports.setup = setup;