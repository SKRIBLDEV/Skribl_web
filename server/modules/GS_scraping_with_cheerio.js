/**
* node module for scraping information from google scholar - static html 
* @author Hannah
*/


var request = require('./request');
var cheerio = require('./cheerio'); //for constructing a DOM from retrieved HTML web page, and to use some kind of server side jQuery


//parses the google scholar result subtitle, e.g., 
//'P Tassin, L Zhang, R Zhao, A Jain, T Koschny… - Physical review  …, 2012 - APS'
//'…, N Papon, V Courdavault, I Thabet, O Ginis… - Planta, 2011 - Springer'
var parseSubTitle = function(subtitle){
    var parts = subtitle.split("-");
    var year = parts[1].match(/\d+/)[0]; //match the numeric characters 
    var journal = parts[1].match(/[^,]*/)[0].trim(); //match anything  "," and trim whitespaces
    var publisher = parts[2].trim(); //trim whitespaces
    var authorsStrings = parts[0].split(",");
    var authors = [];
    for(i in authorsStrings){
      var nameArray = authorsStrings[i].replace(/(^\s)/, '').split(" "); //remove first whitespace and then split on whitespace
      if (nameArray.length >= 2){
        var author ={ //To Do: multiple initials?
          firstName : nameArray[0].trim(),
          lastName : nameArray[1].trim()
        }
        authors[authors.length] = author;
      };
    }
    return [authors, journal, year, publisher];
};

var scrapeOneResult = function(result){
    var subtitleEntries = parseSubTitle(result.find( ".gs_a" ).text());
    var articleData = {
          title : result.find( ".gs_rt" ).text(),
          authors : subtitleEntries[0], //this is not correctly parsed yet - the google scholar pages display a mix of truncated strings for the authors and publishers 
          journal: subtitleEntries[1],
          year: subtitleEntries[2],
          publisher: subtitleEntries[3],
          abstract : result.find( ".gs_rs" ).text(),
          citations : result.find( ".gs_fl" ).children().eq(2).text().match(/\d+/)[0], //regex extracts the number, e.g., 149 from 'Cited by 149'
          article_url : result.find( ".gs_md_wp" ).children().attr('href')
          /*volume:  (journal)
          number: (journal)
          /*booktitle: (proceeding)
          organization: (proceeding)
          keywords: 
          private: false //already on internet?
          */
    };
    return articleData;
};

//when searching on an name of someone who has a Google Scholar account, the first result is related to that account 
//and should therefore be skipped
var isProfileResult = function(result){ 
  var regex = /.*User profiles.*/i;
  return result.find( ".gs_rt" ).text().match(regex);//(results.eq(0).find( ".gs_rt" ).text().match(regex));
};

//********* scrape Functions (to pass to scrapeGoogleScholar function)

var scrapeFirstResult = function($){ //$ represents the DOM created from the received html
  if (isProfileResult($(".gs_r").eq(0)))
    return(scrapeOneResult($(".gs_r").eq(1))); //skip profile result
  else 
    return(scrapeOneResult($(".gs_r").eq(0)));
};

var scrapeAllResults = function($){ //$ represents the DOM created from the received html
  var result = [];
  $(".gs_r").each(function(){ //for each of the google scholar search results on the page
    if (!isProfileResult($(this))){
      try{
        result[result.length] = scrapeOneResult($(this));
      }
      catch(error){}; //continue for-each loop
    };   
  });
  return result;
};

//*********

//create the URL to the webpage resulting from a basic google scholar query
var createGoogleScholarURL = function(searchTerms){
  var prefix = "https://scholar.google.com/scholar?q="; 
  var postfix = "&btnG=&hl=en&as_sdt=0%2C5";
  var transformedTerms = searchTerms.split(" ").join("+"); //replace all spaces with "+" for use in URL
  var url = prefix.concat(transformedTerms, postfix);
  return url;
}; 


/**
* retrieve the html page at the given url and extract the needed metadata 
* @param searchTerms: searchterms for the GS query
* @param scrapeFunc: particular function used for the scraping (e.g., scrapeAll(), scrapeFirst())
* @param clb: callback(error, result)  
*/
var scrapeGoogleScholar = function(searchTerms, scrapeFunc, clb) {
  var url = createGoogleScholarURL(searchTerms);
  request({ encoding: 'binary', method: "GET", uri: url}, function(err, resp, body) { //http request 
  	if (!err && resp.statusCode == 200) { //request succeeded
      try{
        $ = cheerio.load(body); //create traversable DOM from retrieved html
        var result = scrapeFunc($); //array or single object, according to the scrapeFunc used 
        clb(null, result); 
      }
      catch(error){
        clb(new Error("Failed to scrape results"), null);
      }
	  }
    else
      clb(new Error("Failed to connect to Google Scholar"), null);
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

//var terms = "irina veretenicoff";
var terms = "Optical feedback induces polarization mode-hopping in vertical-cavity surface-emitting lasers";
//var terms = "philippe tassin";


console.log("Scraping the first result+++++++++++++++++");
extractOne(terms, function(err, res){
  if (!err){  
    console.log("the first result:");
    console.log(res);
  }
  else
    console.log(err);
});

console.log("Scraping all results+++++++++++++++++");
extractAll(terms, function(err, res){
  if (!err){  
    for (index = 0; index < res.length; index++) {
      console.log("**********************");
      console.log(res[index]);
      console.log("");
    }
  }
  else
    console.log(err);
});

*/











