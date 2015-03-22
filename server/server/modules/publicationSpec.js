var P = require("./publication.js");

describe('publication.js Module Tests: ',function(){

	describe("extract metadata with Google Scholar >> ", function() {

    	var metadata; //acts as metadata object received from front-end, minimally the title shouldbe defined
    	var GSError = new Error('Failed to extract data from Google Scholar');

		beforeEach(function(done) { // reset before testing (metadata properties set to incorrect values inside test function body)
    	   metadata = {
	           title: "Some Title",
	  		   authors : undefined,
	  		   journal: undefined,
	  		   volume: undefined,
	 		   number: undefined,
	  		   year: undefined,
	  		   publisher: undefined,
	  		   abstract : undefined,
	  		   citations : undefined, 
	  		   article_url : undefined,
	  		   keywords : undefined
           };
           done();
  		});

        it('is metadata defined?', function(){ //meta-test
            expect(metadata).toBeDefined();
        });


    	it('title undefined', function(done) {
    		metadata.title = undefined; //incorrect value
    		P.extract(metadata, function(error, result) {
        	expect(error).toEqual(GSError);
        	done(); // test waits untill done() is called asynchronously, default timeout of 5 seconds 
    		});
    	});

        /*it('incorrect language preference', function(done) {
            metadata.language = 'FR'; //incorrect value
            UM.createUser(metadata, function(error, result) {
            expect(error).toEqual(validation_error);
            expect(result[0]).toEqual('input ' + 'language' + ' is not a valid language option'); //result should be an array containing a string with specific error informartion
            done(); // test waits untill done() is called asynchronously, default timeout of 5 seconds 
            });
        });

        it('incorrect researchDomains', function(done) {
            metadata.researchDomains = ['something', 'somethingElse']; //incorrect value
            UM.createUser(metadata, function(error, result) {
            expect(error).toEqual(validation_error);
            expect(result[0]).toEqual('input ' + 'research domain' + ' is not recognized');
            expect(result[1]).toEqual('input ' + 'research domain' + ' is not recognized'); //result should be an array containing a string with specific error informartion
            done(); // test waits untill done() is called asynchronously, default timeout of 5 seconds 
            });
        });*/

    });

});


/*
//test code:

var testInfo = {
  title: "Low-Loss Metamaterials Based on Classical Electromagnetically Induced Transparency",
  authors : undefined,
  journal: undefined,
  volume: undefined,
  number: undefined,
  year: undefined,
  publisher: undefined,
  abstract : undefined,
  citations : undefined, 
  article_url : undefined,
  keywords : undefined
}

extract(testInfo, function(err, res){
  if (err)
    console.log(err);
  else
    console.log(testInfo);
});

/*
van GUI: 
testInfo = {
  title: "Low-Loss Metamaterials Based on Classical Electromagnetically Induced Transparency"
}

na scraping:

testInfo = 
{ title: 'Low-Loss Metamaterials Based on Classical Electromagnetically Induced Transparency',
  authors: 
   [ { firstName: 'P', lastName: 'Tassin' },
     { firstName: 'L', lastName: 'Zhang' },
     { firstName: 'T', lastName: 'Koschny' },
     { firstName: 'EN', lastName: 'Economou…' } ],
  journal: 'Physical review  …',
  year: '2009',
  publisher: 'APS',
  abstract: 'Abstract We demonstrate theoretically that electromagnetically induced transparency can be achieved in metamaterials, in which electromagnetic radiation is interacting resonantly with mesoscopic oscillators rather than with atoms. We describe novel metamaterial designs  ...',
  citations: '318',
  article_url: 'http://arxiv.org/pdf/0807.2478' }

*/