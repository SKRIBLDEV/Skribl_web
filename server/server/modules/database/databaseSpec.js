describe('Database API Tests', 
	function(){
		var dAPI=require('./database.js');
		var UM = require('../user.js');

		var serverConfig = {ip:'localhost', port:2424, username:'root', password:'root'};
		var dbConfig = {dbname:'skribl_database', username:'admin', password:'admin'};
		var db = new dAPI.Database(serverConfig, dbConfig);

			/* instantiates the database server instance */
		var server = Oriento({
			host: serverConfig.ip,
			port: serverConfig.port,
			username: serverConfig.username || 'root',
			password: serverConfig.password || 'root'
		});

			/** instantiates the database instance*/
		var ODB = server.use({
			name: dbConfig.dbname,
			username: dbConfig.username || 'admin',
			password: dbConfig.password || 'admin'
		});

		var nUser = {firstName: 'randomName', 
				lastName: 'randomOtherName', 
				username: 'randomUsername', 
				password: 'RandomPass123', 
				email: 'randomName@vub.ac.be', 
				language: 'ENG', 
				institution: 'Random University', 
				faculty: 'RandomFaculty', 
				department: 'RandomDepartment', 
				researchGroup: 'RandomResearchGroup', 
				researchDomains: ['Biological Sciences']};
		var pubJournal = {
				type: 'journal',
				journal: 'random Journal',
				publisher: 'random Publisher',
				volume: '666',
				number: '666',
				year: 666,
				abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rhoncus massa quam, sed iaculis nibh semper et. Cras sit amet efficitur risus, et pellentesque lorem.',
				citations: 25,
				url: 'www.random.be',
				private: false,
				authors: [{firstName: 'random', lastName: 'random'}]
				researchDomains: ['Computer Sciences', 'Biological Sciences', 'Languages'],
				keywords: ['random1']};
		var pubProceeding = {
				type: 'proceeding',
				booktitle: 'random Booktitle',
				organisation: 'random Organisation',
				year: 666,
				abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rhoncus massa quam, sed iaculis nibh semper et. Cras sit amet efficitur risus, et pellentesque lorem.',
				citations: 25,
				url: 'www.random.be',
				private: false,
				authors: [{firstName: 'random', lastName: 'random'}]
				researchDomains: ['Computer Sciences', 'Biological Sciences', 'Languages'],
				keywords: ['random2']};
		var fObject = {
			path: './testfile2.pdf',
			originalname: 'testfile2.pdf'
		}
		var tempJournalId;
		var tempProceedingId;


		it('connecting to database', function(done){
			expect(db).toBeDefined();
			done();
		});

		it('adding user to database', function(done) {
			UM.createUser(nUser, function(error, user) {
				db.createUser(user, function(error, value) {
					expect(error).toBeNull();
					done();
				});
			});	
		});

		it('adding journal to database', function(done) {
			db.addJournal(pubJournal.title, fObject, 'randomUsername', function(error, res) {
				expect(error).toBeNull();
				expect(res).toEqual(jasmine.any(String));
				tempJournalId = res;
				done();
			});
		});

		it('adding proceeding to database', function(done) {
			db.addProceeding(pubProceeding.title, fObject, 'randomUsername', function(error, res) {
				expect(error).toBeNull();
				expect(res).toEqual(jasmine.any(String));
				tempProceedingId = res;
				done();
			});
		});

		it('adding library to user', function(done) {
			db.addLibrary('randomUsername', 'randomLib', function(error, res) {
				expect(error).toBeNull();
				expect(res).toBe(true);
			});
			db.addLibrary('randomUsername', 'randomLib', function(error, res) {
				expect(error).not.toBeNull();
				expect(res).toBe(true);
				done();
			});
		});

		it('adding publication to library', function(done) {
			db.addToLibrary('randomUsername', 'randomLib', tempJournalId, function(error, res) {
				expect(error).toBeNull();
				expect(res).toBe(true);
				done();
			});
		});

		it('updating publication data', function(done) {
			db.updatePublication(tempJournalId, pubJournal, function(error, res) {
				expect(error).toBeNull();
				expect(res).toBe(true);
				db.updatePublication(tempProceedingId, pubProceeding, function(error, res) {
					expect(error).toBeNull();
					expect(res).toBe(true);
					done();
				});
			});
		});

		describe('persistentie tests', function() {

			it('test user data', function(done) {
				ODB.query('select from User where username = \'randomUsername\'').all()
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
				ODB.query('select from Author where firstName = \'random\' and lastName = \'random\'').all()
				.then(function(authors) {
					expect(authors.length).toBe(2);
					ODB.query('select from Author where firstName = \'randomName\' and lastName = \'randomOtherName\'').all()
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
				ODB.query('select from Library where username = \'randomUsername\'').all()
				.then(function(libs) {
					expect(libs.length).toBe(4);
					done();
				}).error(function(er) {
					expect(er).toBeNull();
					done();
				});
			});

			it('test journal data', function(done) {
				ODB.query('select from Publication where id = \'' + tempJournalId + '\'').all()
				.then(function(journals) {
					expect(journals.length).toBe(1);
					var journal = journals[0];
					expect(journal.type).toBe(pubJournal.type);
					expect(journal.journal).toBe(pubJournal.journal);
					expect(journal.publisher).toBe(pubJournal.publisher);
					expect(journal.volume).toBe(pubJournal.volume);
					expect(journal.number).toBe(pubJournal.number);
					expect(journal.year).toBe(pubJournal.year);
					expect(journal.abstract).toBe(pubJournal.abstract);
					expect(journal.citations).toBe(pubJournal.citations);
					expect(journal.url).toBe(pubJournal.url);
					expect(journal.private).toBe(pubJournal.private);
					done();
				}).error(function(er) {
					expect(er).toBeNull();
					done();
				});
			});

			it('test proceeding data', function(done) {
				ODB.query('select from Publication where id = \'' + tempProceedingId + '\'').all()
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
				ODB.query('select expand(out(\'HasResearchGroup\')) from (select expand(out(\'HasDepartment\')) from (select expand(out(\'HasFaculty\')) from (select from Institution where Name = \'' + nUser.institution + '\') where Name = \'' + nUser.faculty + '\') where Name = \'' + nUser.department + '\') where Name = \'' + nUser.researchGroup + '\'').all()
				.then(function(rsGroup) {
					expect(rsGroup.length).toBe(1);
					done();
				}).error(function(er) {
					expect(er).toBeNull();
					done();
				});
			});

			it('test researchDomains data', function(done) {
				ODB.query('select from ResearchDomain where Name = \'Biological Sciences\' or Name = \'Computer Sciences\' or Name = \'Languages\'').all()
				.then(function(researchDomains) {
					expect(researchDomains.length).toBe(3);
				}).error(function(er) {
					expect(er).toBeNull();
					done();
				});
			});

			it('test keywords data', function(done) {
				ODB.query('select from Keyword where Name = \'Biological Sciences\' or Name = \'Computer Sciences\' or Name = \'Languages\'').all()
				.then(function(researchDomains) {
					expect(researchDomains.length).toBe(3);
				}).error(function(er) {
					expect(er).toBeNull();
					done();
				});
			});

		});

	describe('opvraging van data tests', function() {});

	describe('verwijderen van data tests', function() {});

		

	}
)