
var UM = require("./user.js");

describe('userInfo Module Tests: ',function(){

	var validation_error = new Error('server-side-validation-error');

	describe("createUser >> ", function() {

       


		var missingEmail= {
			firstName: 'Hannah',
			lastName: 'Pinson',
			username: 'hpinson_94',
			password: 'iajenGG34'
		};

		

        it('missing property emailadress', function(done) {
            UM.createUser(missingEmail, function(error, result) {
                expect(error).toEqual(validation_error);
                expect(result[0]).toEqual('property ' + 'email' + ' undefined'); //result should be an array containing a string with specific error informartion
                done(); // test waits untill done() is called asynchronously, default timeout of 5 seconds 
            });
        });


    	var account;

		beforeEach(function(done) { // reset before testing (account properties set to incorrect values inside test function body)
    		account = {
				firstName: 'Hannah',
				lastName: 'Pinson',
				email:  'hpinson@vub.ac.be',
				username: 'hpinson_94',
				password: 'iajenGG34'
			}
            done();
  		});

        it('account defined', function(){
            expect(account).toBeDefined();
        });



    	it('firstName undefined', function(done) {
    		account.firstName = undefined; //incorrect value
    		UM.createUser(account, function(error, result) {
        	expect(error).toEqual(validation_error);
        	expect(result[0]).toEqual('property ' + 'firstName' + ' undefined'); //result should be an array containing a string with specific error informartion
        	done(); // test waits untill done() is called asynchronously, default timeout of 5 seconds 
    		});
    	});


    	it('email with leading whitespaces', function(done) {
    		account.email = '     hpinson@vub.ac.be'; //incorrect value
    		UM.createUser(account, function(error, result) {
        	expect(error).toEqual(validation_error);
        	expect(result[0]).toEqual('input ' + 'email' + ' contains leading or trailing whitespaces'); //result should be an array containing a string with specific error informartion
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
            //expect(true).toBe(true);
        	done(); // test waits untill done() is called asynchronously, default timeout of 5 seconds 
    		});
    	});


    	it('correct account', function(done) {
    		UM.createUser(account, function(error, result) {
        	expect(error).toBeNull();
        	expect(result).toBe(true); 
        	done(); // test waits untill done() is called asynchronously, default timeout of 5 seconds 
    		});
    	});

    });
});
