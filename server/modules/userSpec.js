
var UM = require("./user.js");

describe('userInfo Module Tests: ',function(){

	var validation_error = new Error('server-side-validation-error');

	describe("createUser >> ", function() {


    	var account;

		beforeEach(function(done) { // reset before testing (account properties set to incorrect values inside test function body)
    		account = {
				firstName: 'Hannah',
				lastName: 'Pinson',
				email:  'hpinson@vub.ac.be',
				username: 'hpinson_94',
				password: 'iajenGG34',
                researchGroup: 'WISE',
                department: 'Computer Science',
                faculty: 'Sciences and Bio-engineering', 
                institution: 'Vrije Universiteit Brussel'
			}
            done();
  		});

        it('account defined', function(){ //meta-test
            expect(account).toBeDefined();
        });


    	it('firstName undefined', function(done) {
    		account.firstName = undefined; //incorrect value
    		UM.createUser(account, function(error, result) {
        	expect(error).toEqual(validation_error);
        	expect(result[0]).toEqual('input ' + 'firstName' + ' is not a valid name'); //result should be an array containing a string with specific error informartion
        	done(); // test waits untill done() is called asynchronously, default timeout of 5 seconds 
    		});
    	});


    	it('email with leading whitespaces', function(done) {
    		account.email = '     hpinson@vub.ac.be'; //incorrect value
    		UM.createUser(account, function(error, result) {
        	expect(error).toEqual(validation_error);
        	expect(result[0]).toEqual('input ' + 'email' + ' is not a valid email'); //result should be an array containing a string with specific error informartion
        	done(); // test waits untill done() is called asynchronously, default timeout of 5 seconds 
    		});
    	});


    	it('incorrect first AND last name', function(done) {
    		account.firstName = '123'; //incorrect value
    		account.lastName = '&_a'; //incorrect value
    		UM.createUser(account, function(error, result) {
        	expect(error).toEqual(validation_error);
        	expect(result[0]).toEqual('input ' + 'firstName' + ' is not a valid name'); //result should be an array containing a string with specific error informartion
        	expect(result[1]).toEqual('input ' + 'lastName' + ' is not a valid name');
        	done(); // test waits untill done() is called asynchronously, default timeout of 5 seconds 
    		});
    	});


    	it('correct account', function(done) {
    		UM.createUser(account, function(error, result) {
        	expect(error).toBeNull();
        	done(); // test waits untill done() is called asynchronously, default timeout of 5 seconds 
    		});
    	});

    });
});
