var d = require('./testRandomData.js');

function deletion(clb) {
	xdescribe('verwijderen van data tests', function() {

		it('verwijder publicatie uit bibliotheek', function(done) {
			d.db.removeFromLibrary(d.nUser.username, 'randomLib', d.tempJournalId, function(error, res) {
				expect(error).toBeNull();
				expect(res).toBe(true);
				d.ODB.query('select expand(out(\'HasPublication\')) from Library where username = \'' + d.nUser.username + '\' and name = \'randomLib\'').all()
				.then(function(res) {
					expect(res.length).toBe(0);
					done();
				}).error(function(er) {
					expect(er).toBeNull();
					done();
				});
			});
		});

		it('verwijder bibliotheek van gebruiker', function(done) {
			d.db.removeLibrary(d.nUser.username, 'randomLib', function(error, res)  {
				expect(error).toBeNull();
				expect(res).toBe(true);
				d.ODB.query('select from Library where username = \'' + d.nUser.username + '\' and name = \'randomLib\'').all()
				.then(function(libs) {
					expect(res.length).toBe(0);
					d.db.removeLibrary(d.nUser.username, 'Favorites', function(error1, res1) {
						expect(error).toBeDefined();
						done();
					});
				}).error(function(er) {
					expect(er).toBeNull();
					done();
				});
			});
		});

		it('verwijder journal publicatie', function(done) {
			d.db.removePublication(d.tempJournalId, function(error, res) {
				expect(error).toBeNull();
				expect(res).toBe(true);
				d.ODB.record.get(d.tempJournalId)
				.then(function(res) {
					expect(res).toBeUndefined();
					done();
				}).error(function(er) {
					expect(er).toBeNull();
					done();
				});
			});
		});

		it('verwijder proceeding publicatie', function(done) {
			d.db.removePublication(d.tempProceedingId, function(error, res) {
				expect(error).toBeNull();
				expect(res).toBe(true);
				d.ODB.record.get(d.tempProceedingId)
				.then(function(res) {
					expect(res).toBeUndefined();
					done();
				}).error(function(er) {
					expect(er).toBeNull();
					done();
				});
			});
		});

		it('verwijder user', function(done) {
			d.db.deleteUser(d.nUser.username, function(error, res) {
				expect(error).toBeNull();
				expect(res).toBe(true);
				d.ODB.record.get(d.tempUserId)
				.then(function(res) {
					expect(res).toBeUndefined();
					done();
				}).error(function(er) {
					expect(er).toBeNull();
					done();
				});
			});
		});
	});
}

exports.deletion = deletion;