		dAPI=require('../../SE repository/server/server/modules/database/database.js');
		module.exports.RID=require('../../SE repository/server/server/modules/database/rid.js');
		module.exports.UM = require('../../SE repository/server/server/modules/user.js');
		Oriento = require('oriento');

		//serverConfig = {ip:'wilma.vub.ac.be', port:2424, username:'root', password:'root'};
		serverConfig = {ip:'localhost', port:2424, username:'root', password:'root'};
		
		dbConfig = {dbname:'skribl', username:'admin', password:'admin'};
		module.exports.db = new dAPI.Database(serverConfig, dbConfig);

			/* instantiates the database server instance */
		server = Oriento({
			host: serverConfig.ip,
			port: serverConfig.port,
			username: serverConfig.username || 'root',
			password: serverConfig.password || 'root'
		});

			/** instantiates the database instance*/
		module.exports.ODB = server.use({
			name: dbConfig.dbname,
			username: dbConfig.username || 'admin',
			password: dbConfig.password || 'admin'
		});

		module.exports.nUser = {firstName: 'randomName', 
				lastName: 'randomOtherName', 
				username: 'randomUsername', 
				password: 'RandomPass123', 
				email: 'randomName@vub.ac.be', 
				language: 'ENG', 
				institution: 'Random University', 
				faculty: 'RandomFaculty', 
				department: 'RandomDepartment', 
				researchGroup: 'RandomResearchGroup', 
				researchDomains: [{ major:'Computer and Information Science', minor: 'Artificial Intelligence'}]};
		module.exports.pubJournal = {
				title: 'randomJournalTitle',
				fileName: 'testfile2.pdf',
				type: 'journal',
				journal: 'random Journal',
				publisher: 'random Publisher',
				volume: 666,
				number: 666,
				year: 666,
				abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rhoncus massa quam, sed iaculis nibh semper et. Cras sit amet efficitur risus, et pellentesque lorem.',
				citations: 25,
				url: 'www.random.be',
				private: false,
				authors: [{firstName: 'random', lastName: 'random'}],
				researchDomains: [{ major:'Computer and Information Science', minor: 'Artificial Intelligence'}],
				keywords: ['random1']};
		module.exports.pubProceeding = {
				title: 'randomProceedingTitle',
				fileName: 'testfile2.pdf',
				type: 'proceeding',
				booktitle: 'random Booktitle',
				organisation: 'random Organisation',
				year: 666,
				abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rhoncus massa quam, sed iaculis nibh semper et. Cras sit amet efficitur risus, et pellentesque lorem.',
				citations: 25,
				url: 'www.random.be',
				private: false,
				authors: [{firstName: 'random1', lastName: 'random1'}],
				researchDomains: [{ major:'Computer and Information Science', minor: 'Artificial Intelligence'}],
				keywords: ['random2']};

		module.exports.correctCriteria = {
				title: this.pubJournal.title,
				journal: this.pubJournal.journal,
				publisher: this.pubJournal.publisher,
				fileName: this.pubJournal.fileName,
				volume: this.pubJournal.volume,
				number: this.pubJournal.number,
				url: this.pubJournal.url,
				researchDomains: this.pubJournal.researchDomains,
				keywords: this.pubJournal.keywords,
				authors: this.pubJournal.authors};

		module.exports.incorrectCriteria = {
				title: 'foutieve titel',
				journal: this.pubJournal.journal,
				publisher: this.pubJournal.publisher,
				fileName: this.pubJournal.fileName,
				volume: this.pubJournal.volume,
				number: this.pubJournal.number,
				url: this.pubJournal.url,
				researchDomains: this.pubJournal.researchDomains};

		module.exports.fObject = {
			path: './testfile2.pdf',
			originalname: 'testfile2.pdf'
		}
		module.exports.tempJournalId;
		module.exports.tempProceedingId;
		module.exports.tempUserId;

		module.exports.testVar = 'testing testing';