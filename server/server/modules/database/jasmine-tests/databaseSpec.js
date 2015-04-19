
var d = require('./testRandomData.js');
var setup = require('./databaseSetupSpecs.js');
var persistence = require('./databasePersistenceSpecs.js');
var requests = require('./databaseRequestsSpecs.js');
var deletion = require('./databaseDeletionSpecs.js');
describe('Database API Tests:', function() {
	setup.setup('dummy');	
	persistence.persistence('dummy');
	requests.requests('dummy');
	deletion.deletion('dummy');	
	});