
var d = require('./testRandomData.js');
var setup = require('./databaseSetupSpecs.js');
var persistence = require('./databasePersistenceSpecs.js');
var requests = require('./databaseRequestsSpecs.js');
var deletion = require('./databaseDeletionSpecs.js');
describe('Database API Tests:', function() {
	jasmine.getEnv().defaultTimeoutInterval = 10000;

	setup.setup(function(error, res) {
		console.log('setup done');

		persistence.persistence(function(error, res) {
			console.log('persistence done');
			requests.requests(function(error, res) {
				console.log('requests done');
				deletion.deletion(function(error, res) {
					console.log('deletion done');
					console.log('testing finished');
				});	
			});
		});

	});		
});