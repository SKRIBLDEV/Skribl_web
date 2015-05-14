var SM = require("./GS_scraping_with_cheerio.js");

describe('Scraping Tests: ',function(){

	describe("Scrape Using Title >> ", function() {

    	var metadata ;

        beforeEach(function(done) { // reset before testing (metadata properties set to incorrect values inside test function body)
           metadata = {
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
           };
           done();
        });

        it('Scrape all', function(done){ 
        	SM.extractAll(metadata.title, function(err, res){
        		expect(err).toBeNull();
        		expect(res.length).not.toEqual(0);
                expect(res[0].authors).toBeDefined;
                expect(res[0].year).toBeDefined;
                expect(res[0].citations).toBeDefined;
        		done();
        	})
            
        });

        it('Scrape first', function(done){ 
        	SM.extractOne(metadata.title, function(err, res){
        		expect(err).toBeNull();
        		expect(res).toBeDefined();
        		done();
        	})
            
        });

    });
});