var d = require('./testRandomData.js');

	function persistence(clb) {


		describe('persistentie tests:', function() {

			var ctr = 0
			afterEach(function() {
				if(++ctr == 8) clb(null, true);
  			});	

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
					expect(usr.language).toBe('ENG');
					done();
				}).error(function(er) {
						expect(er).toBeNull();
						done();
					});
			});

			it('test author data', function(done) {
				d.ODB.query('select from Author where (firstName = \'random\' and lastName = \'random\') or (firstName = \'random1\' and lastName = \'random1\')').all()
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
				d.ODB.query('select from Publication where @rid = \'' + d.tempJournalId + '\'').all()
				.then(function(journals) {
					expect(journals.length).toBe(1);
					var journal = journals[0];
					expect(journal['@class'].toLowerCase()).toBe(d.pubJournal.type);
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
				d.ODB.query('select from Publication where @rid = \'' + d.tempProceedingId + '\'').all()
				.then(function(proceedings) {
					expect(proceedings.length).toBe(1);
					var proceeding = proceedings[0];
					expect(proceeding['@class'].toLowerCase()).toBe(d.pubProceeding.type);
					expect(proceeding.booktitle).toBe(d.pubProceeding.booktitle);
					expect(proceeding.organisation).toBe(d.pubProceeding.organisation);
					expect(proceeding.year).toBe(d.pubProceeding.year);
					expect(proceeding.abstract).toBe(d.pubProceeding.abstract);
					expect(proceeding.citations).toBe(d.pubProceeding.citations);
					expect(proceeding.url).toBe(d.pubProceeding.url);
					expect(proceeding.private).toBe(d.pubProceeding.private);
					done();
				}).error(function(er) {
					expect(er).toBeNull();
					done();
				});
			});

			it('test affiliation data', function(done) {
				d.ODB.select().from('Institution').where('Name = \'' + d.nUser.institution +'\'').all()
				.then(function(inst) {
					expect(inst.length).toBe(1);
					d.ODB.query('select from (select expand(out(\'HasFaculty\')) from ' + d.RID.getRid(inst[0]) + ') where Name = \'RandomFaculty\'').all()
					.then(function(fac) {
						expect(fac.length).toBe(1);
						d.ODB.query('select from (select expand(out(\'HasDepartment\')) from ' + d.RID.getRid(fac[0]) + ') where Name = \'RandomDepartment\'').all()
						.then(function(dep) {
							expect(dep.length).toBe(1);
							d.ODB.query('select from (select expand(out(\'HasResearchGroup\')) from ' + d.RID.getRid(dep[0]) + ') where Name = \'RandomResearchGroup\'').all()
							.then(function(rsGroup) {
								expect(rsGroup.length).toBe(1);
								done();
							}).error(function(er) {
								expect(er).toBeNull();
								done();
							});
						}).error(function(er) {
							expect(er).toBeNull();
							done();
						});
					}).error(function(er) {
						expect(er).toBeNull();
						done();
					});
				}).error(function(er) {
					expect(er).toBeNull();
					done();
				});
			});

			it('test researchDomains data', function(done) {
				d.ODB.query('select from ResearchDomain where Name = \'Biological Sciences\' or Name = \'Computer Sciences\' or Name = \'Languages\'').all()
				.then(function(researchDomains) {
					expect(researchDomains.length).toBe(3);
					done();
				}).error(function(er) {
					expect(er).toBeNull();
					done();
				});
			});

			it('test keywords data', function(done) {
				d.ODB.query('select from Keyword where keyword = \'random1\' or keyword = \'random2\'').all()
				.then(function(researchDomains) {
					expect(researchDomains.length).toBe(2);
					done();
				}).error(function(er) {
					expect(er).toBeNull();
					done();
				});
			});
		});
}

exports.persistence = persistence;