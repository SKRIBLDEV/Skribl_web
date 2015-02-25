/**
* node module for scraping information from google scholar - static html 
* @author Hannah
*/


var request = require('request');
var cheerio = require('cheerio'); //for constructing a DOM from retrieved HTML web page, and to use some kind of server side jQuery

var result = [];


var scrapeOneResult = function(result){
  var articleData = {
          title : result.find( ".gs_rt" ).text(),
          authors : result.find( ".gs_a" ).text(), //this is not correctly parsed yet - the google scholar pages display a mix of truncated strings for the authors and publishers 
          abstract : result.find( ".gs_rs" ).text(),
          citations : result.find( ".gs_fl" ).children().eq(2).text().match(/\d+/)[0], //regex extracts the number, e.g., 149 from 'Cited by 149'
          article_url : result.find( ".gs_md_wp" ).children().attr('href')
          /*
          journal:
          volume:
          number:
          year:
          publisher: 
          booktitle: 
          organization: 
          keywords: 
          private: false //already on internet?
          */
  };
  return articleData;
};

//when searching on an name of someone who has a Google Scholar account, the first result is related to that account and should therefore be skipped
var hasProfileResult = function(results){ 
  var regex = /.*User profiles.*/i;
  return (results.eq(0).find( ".gs_rt" ).text().match(regex));
};

var scrapeFirstResult = function($){ //$ represents the DOM created from the received html
  if (hasProfileResult($(".gs_r")))
    result = scrapeOneResult($(".gs_r").eq(1)); //skip profile result
  else 
    result = scrapeOneResult($(".gs_r").eq(0));
};

var scrapeAllResults = function($){ //$ represents the DOM created from the received html
  result = [];
  $(".gs_r").each(function(){ //for each of the google scholar search results on the page
    result[result.length] = scrapeOneResult($(this)); //add metadata object to result array     
  });
  if (hasProfileResult($(".gs_r"))){ 
    result.shift(); //remove profile result
  };
};

//create the URL to the webpage resulting from a basic google scholar query
var createGoogleScholarURL = function(searchTerms){
  var prefix = "https://scholar.google.com/scholar?q="; 
  var postfix = "&btnG=&hl=en&as_sdt=0%2C5";
  var transformedTerms = searchTerms.split(" ").join("+"); //replace all spaces with "+" for use in URL
  var url = prefix.concat(transformedTerms, postfix);
  return url;
}; 

// retrieve the html page at the given url and extract the needed metadata
var scrapeGoogleScholar = function(searchTerms, scrapeFunc, clb) {
  var url = createGoogleScholarURL(searchTerms);
  request({ encoding: 'binary', method: "GET", uri: url}, function(err, resp, body) { //http request 
  	if (!err && resp.statusCode == 200) { //request succeeded
    	$ = cheerio.load(body); //create traversable DOM from retrieved html
      scrapeFunc($); 
      clb(null, result); //result (global var) - array or single object, according to the scrapeFunc used 
	  }
    else
    	clb(err, null); 
  });
};


//returns a single object containing the metadata of the first (non-profile) search result 
var extractOne = function(searchTerms, clb){
  scrapeGoogleScholar(searchTerms, scrapeFirstResult, clb);
}; 

//returns an array containing the metadata objects of the (non-profile) search results from the first page 
var extractAll = function(searchTerms, clb){
  scrapeGoogleScholar(searchTerms, scrapeAllResults, clb);
};

exports.extractOne = extractOne;
exports.extractAll = extractAll;



/*
//test code

var terms = "philippe tassin";


extractOne(terms, function(err, result){
  if (!err){
    for (index = 0; index < result.length; index++) {
      console.log("**********************");
      console.log(result[index]);
      console.log("");
    }
  }
});

*/






