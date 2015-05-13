var d = require('./testRandomData.js');

function requests(clb) {
	describe('opvraging van data tests:', function() {

		var ctr = 0
		afterEach(function() {
			if(++ctr == 9) clb(null, true);
  		});	

		it('opvragen van gebruiker', function(done) {
			d.db.loadUser(d.nUser.username, function(error, usr) {
				expect(error).toBeNull();
				expect(usr).toBeDefined();
				expect(usr.getFirstName()).toBe(d.nUser.firstName);
				expect(usr.getLastName()).toBe(d.nUser.lastName);
				expect(usr.getUsername()).toBe(d.nUser.username);
				expect(usr.getEmail()).toBe(d.nUser.email);
				expect(usr.getResearchGroup()).toBe(d.nUser.researchGroup);
				expect(usr.getDepartment()).toBe(d.nUser.department);
				expect(usr.getFaculty()).toBe(d.nUser.faculty);
				expect(usr.getInstitution()).toBe(d.nUser.institution);
				expect(usr.getResearchDomains()[0].major).toBe(d.nUser.researchDomains[0].major);   //need custom matcher for arrays
				expect(usr.getResearchDomains()[0].minor).toBe(d.nUser.researchDomains[0].minor);   //need custom matcher for arrays
				expect(usr.getLanguage()).toBe(d.nUser.language);
				//need to check password hash-->bcrypt?
				//expect(usr.password).toBe('RandomPass123');

				done();
			});
		});

		it('opvragen van publicatie data', function(done) {
			d.db.getPublication(d.tempJournalId, function(error, journal) {
				expect(error).toBeNull();

				expect(journal.type).toBe(d.pubJournal.type);
				expect(journal.journal).toBe(d.pubJournal.journal);
				expect(journal.publisher).toBe(d.pubJournal.publisher);
				expect(journal.volume).toBe(d.pubJournal.volume);
				expect(journal.number).toBe(d.pubJournal.number);
				expect(journal.year).toBe(d.pubJournal.year);
				expect(journal.abstract).toBe(d.pubJournal.abstract);
				expect(journal.citations).toBe(d.pubJournal.citations);
				expect(journal.url).toBe(d.pubJournal.url);
				expect(journal.private).toBe(d.pubJournal.private);
				done();

			});
		});

		it('opvragen van publicatie uploader', function(done) {
			d.db.uploadedBy(d.tempJournalId, function(error, res) {
				expect(error).toBeNull();
				expect(res).toBe(d.nUser.username);
				done();
			});
		});

		it('opvragen bibliotheken van gebruiker', function(done) {
			d.db.loadLibraries(d.nUser.username, function(error, res) {
				expect(error).toBeNull();
				expect(res.indexOf('Uploaded')).not.toBe(-1);
				expect(res.indexOf('Favorites')).not.toBe(-1);
				expect(res.indexOf('Portfolio')).not.toBe(-1);
				expect(res.indexOf('randomLib')).not.toBe(-1);

				done();
			});
		});

		it('opvragen publicaties in bibliotheek', function(done) {
			d.db.loadLibrary(d.nUser.username, 'Uploaded', function(error, res) {
				expect(error).toBeNull();
				expect(res.length).toBe(2);
				d.db.loadLibrary(d.nUser.username, 'randomLib', function(error2, res2) {
					expect(error2).toBeNull();
					expect(res2.length).toBe(1);
					done();
				});
			});
		});

		it('simpel zoeken naar publicatie', function(done) {
			d.db.querySimple('random', 10, function(error, res) {
				expect(error).toBeNull();
				expect(res.length).toBe(2);
				d.db.querySimple('random', 1, function(error1, res1) {
					expect(error).toBeNull();
					expect(res1.length).toBe(1);
					d.db.querySimple('woordkomtnietvoor', 10, function(error2, res2) {
						expect(error).toBeNull();
						expect(res2.length).toBe(0);
						done();
					});
				});
			});
		});

		it('geavanceerd zoeken naar publicatie', function(done) {
			d.db.queryAdvanced(d.correctCriteria, 10, function(error, res) {
				expect(error).toBeNull();
				expect(res.length).toBe(1);
				d.db.queryAdvanced(d.incorrectCriteria, 10, function(error1, res1) {
					expect(error).toBeNull();
					expect(res1.length).toBe(0);
					done();
				});
			});
		}, 5500);

		it('vind alle publicaties van een auteur', function(done) {
			d.ODB.query('select from Author where firstName = \'random\' and lastName = \'random\'').all()
			.then(function(res) {
				expect(res.length).toBe(1);
				d.db.authorPublications(d.RID.getRid(res[0]), function(error1, res1) {
					expect(error1).toBeNull();
					expect(res1.length).toBe(1);
					expect(res1[0].type).toBe('journal');
					done();
				});
			}).error(function(er) {
				expect(er).toBeNull();
				done();
			});
			
		});

		it('vind alle auteurs met gegeven naam', function(done) {
			d.db.searchAuthor('random', 'random', 10, function(error, res) {
				expect(error).toBeNull();
				expect(res.length).toBe(3);
				done();
			});
		});

	});
}

exports.requests = requests;