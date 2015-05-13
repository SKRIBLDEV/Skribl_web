
var d = require('./testRandomData.js');
var setup = require('./databaseSetupSpecs.js');
var persistence = require('./databasePersistenceSpecs.js');
var requests = require('./databaseRequestsSpecs.js');
var deletion = require('./databaseDeletionSpecs.js');

/*
to test: call this file with jasmine-node
 */
describe('Database API Tests:', function() {
	jasmine.getEnv().defaultTimeoutInterval = 10000;

//this ensures all tests are executed in the correct sequence
//	setup tests
	setup.setup(function(error, res) {
		console.log('setup done');
		//persistence tests
		persistence.persistence(function(error, res) {
			console.log('persistence done');
			//requests tests
			requests.requests(function(error, res) {
				console.log('requests done');
				//deletion tests
				deletion.deletion(function(error, res) {
					console.log('deletion done');
					console.log('testing finished');
				});	
			});
		});

	});		
});