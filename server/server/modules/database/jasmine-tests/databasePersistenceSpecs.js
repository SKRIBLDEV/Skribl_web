var d = require('./testRandomData.js');

	function persistence(clb) {
		xdescribe('persistentie tests:', function() {
			it('test user data', function(done) {
				d.ODB.query('select from User where username = \'randomUsername\'').all()
				.then(function(users) {
					expect(users.length).toBe(1);
					var usr = users[0];
					expect(usr.firstName).toBe('randomName');
					expect(usr.lastName).toBe('randomOtherName');
					//password check? how?
					expect(usr.username).toBe('randomUsername');
					expect(usr.email).toBe('randomName@vub.ac.be');
					expect(usr.researchDomains[0]).toBe('Biological Sciences');   //need custom matcher for arrays
					expect(usr.language).toBe('ENG');
					done();
				}).error(function(er) {
						expect(er).toBeNull();
						done();
					});
			});

			it('test author data', function(done) {
				d.ODB.query('select from Author where firstName = \'random\' and lastName = \'random\'').all()
				.then(function(authors) {
					expect(authors.length).toBe(2);
					d.ODB.query('select from Author where firstName = \'randomName\' and lastName = \'randomOtherName\'').all()
					.then(function(authors) {
						expect(authors.length).toBe(1);
						done();
					}).error(function(er) {
						expect(er).toBeNull();
						done();
					});
				}).error(function(er) {
					expect(er).toBeNull();
					done();
				});
			});

			it('test library data', function(done) {
				d.ODB.query('select from Library where username = \'randomUsername\'').all()
				.then(function(libs) {
					expect(libs.length).toBe(4);
					done();
				}).error(function(er) {
					expect(er).toBeNull();
					done();
				});
			});

			it('test journal data', function(done) {
				d.ODB.query('select from Publication where id = \'' + d.tempJournalId + '\'').all()
				.then(function(journals) {
					expect(journals.length).toBe(1);
					var journal = journals[0];
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
				}).error(function(er) {
					expect(er).toBeNull();
					done();
				});
			});

			it('test proceeding data', function(done) {
				d.ODB.query('select from Publication where id = \'' + d.tempProceedingId + '\'').all()
				.then(function(proceedings) {
					expect(proceedings.length).toBe(1);
					var proceeding = proceedings[0];
					expect(proceeding.type).toBe(proceeding.type);
					expect(proceeding.booktitle).toBe(proceeding.booktitle);
					expect(proceeding.organisation).toBe(proceeding.organisation);
					expect(proceeding.year).toBe(proceeding.year);
					expect(proceeding.abstract).toBe(proceeding.abstract);
					expect(proceeding.citations).toBe(proceeding.citations);
					expect(proceeding.url).toBe(proceeding.url);
					expect(proceeding.private).toBe(proceeding.private);
					done();
				}).error(function(er) {
					expect(er).toBeNull();
					done();
				});
			});

			it('test affiliation data', function(done) {
				d.ODB.query('select expand(out(\'HasResearchGroup\')) from (select expand(out(\'HasDepartment\')) from (select expand(out(\'HasFaculty\')) from (select from Institution where Name = \'' + d.nUser.institution + '\') where Name = \'' + d.nUser.faculty + '\') where Name = \'' + d.nUser.department + '\') where Name = \'' + d.nUser.researchGroup + '\'').all()
				.then(function(rsGroup) {
					expect(rsGroup.length).toBe(1);
					done();
				}).error(function(er) {
					expect(er).toBeNull();
					done();
				});
			});

			it('test researchDomains data', function(done) {
				d.ODB.query('select from ResearchDomain where Name = \'Biological Sciences\' or Name = \'Computer Sciences\' or Name = \'Languages\'').all()
				.then(function(researchDomains) {
					expect(researchDomains.length).toBe(3);
				}).error(function(er) {
					expect(er).toBeNull();
					done();
				});
			});

			it('test keywords data', function(done) {
				d.ODB.query('select from Keyword where Name = \'Biological Sciences\' or Name = \'Computer Sciences\' or Name = \'Languages\'').all()
				.then(function(researchDomains) {
					expect(researchDomains.length).toBe(3);
				}).error(function(er) {
					expect(er).toBeNull();
					done();
				});
			});
		});
}

exports.persistence = persistence;