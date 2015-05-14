/**
* node module for scraping information from google scholar - static html 
* @author Hannah
*/

const request = require('request');
const cheerio = require('cheerio'); //for constructing a DOM from retrieved HTML web page, and to use some kind of server side jQuery

//parses the google scholar result subtitle, e.g., 
//journal: 'P Tassin, L Zhang, R Zhao, A Jain, T Koschny… - Physical review  …, 2012 - APS' 
//journal: '…, N Papon, V Courdavault, I Thabet, O Ginis… - Planta, 2011 - Springer'
//proceeding: 'P Tassin, G Van Der Sande… - … on Optics and …, 2005 - proceedings.spiedigitallibrary.org' 
//no title:  'M Braem, K Verlaenen, N Joncheere, W Vanderperren… - 2006 - Springer'
var parseSubTitle = function(subtitle){

    var parts = subtitle.split("-");

    //parse year, journal and publisher
    var year = parseInt(parts[1].match(/\d{4}/)[0]); //match four numeric characters 
    var journal = parts[1].match(/[^,]*/)[0].replace(/\d{4}/, '').trim(); //match anything but  ",", remove year,  and trim whitespaces
    var publisher = parts[2].replace(/\d{4}/, '').trim(); //trim whitespaces

    //parse authors 
    var authorsStrings = parts[0].split(",");
    var authors = [];
    for(var i = 0; i < authorsStrings.length; ++i) {
      var nameArray = authorsStrings[i].replace(/(^\s)/, '').split(" "); //remove first whitespace and then split on whitespace
      if (nameArray.length >= 2){
        var lastName = "";
         for (var index = 1; index < nameArray.length; index++) { //collect all parts of the last name
          lastName = lastName + nameArray[index] + " ";
         }
        var author = { //To Do: multiple initials?
          firstName: nameArray[0].trim(),
          lastName: lastName.trim()
        }
        authors.push(author);
      };
    }
    return [authors, journal, year, publisher];
};



var scrapeOneResult = function(result, type){
    var subtitleEntries = parseSubTitle(result.find( ".gs_a" ).text());
    var foundArticleData = {
          title : result.find( ".gs_rt" ).text().replace(/(\[BOOK\]|\[PDF\]|\[B\])*/,'').trim(),
          authors : subtitleEntries[0], 
          journalOrBookTitle : subtitleEntries[1],
          year: subtitleEntries[2],
          publisherOrOrganisation : subtitleEntries[3],
          abstract : result.find( ".gs_rs" ).text(),
          citations : parseInt(result.find( ".gs_fl" ).children().eq(2).text().match(/\d+/)[0]), //regex extracts the number, e.g., 149 from 'Cited by 149'
          url : result.find( ".gs_md_wp" ).children().attr('href')
    };
    return foundArticleData;
};

//when searching on an name of someone who has a Google Scholar account, the first result is related to that account 
//and should therefore be skipped
const regEx_userProfile = /.*User profiles.*/i;
var isProfileResult = function(result){ 
  return result.find( ".gs_rt" ).text().match(regEx_userProfile);
};

//********* scrape Functions (to pass to scrapeGoogleScholar function)

var scrapeFirstResult = function($){ //$ represents the DOM created from the received html
  var isProfileRes = isProfileResult($(".gs_r").eq(0));
  return(scrapeOneResult($(".gs_r").eq(isProfileRes? 1:0))); //skip profile result
};

var scrapeAllResults = function($){ //$ represents the DOM created from the received html
  var result = [];
  $(".gs_r").each(function(){ //for each of the google scholar search results on the page
    if (!isProfileResult($(this))){
      try{
        result.push(scrapeOneResult($(this)));
      }
      catch(error){}; //continue for-each loop
    };   
  });
  return result;
};

//*********

//create the URL to the webpage resulting from a basic google scholar query
const prefix = "https://scholar.google.com/scholar?q="; 
const postfix = "&btnG=&hl=en&as_sdt=0%2C5";
var createGoogleScholarURL = function(searchTerms){
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
  	if (!err && resp.statusCode === 200) { //request succeeded
      try {
        $ = cheerio.load(body); //create traversable DOM from retrieved html
        var result = scrapeFunc($); //array or single object, according to the scrapeFunc used 
        clb(null, result); 
      } catch(error) {
        clb(new Error("Failed to scrape results"), null);
      }
	  } else
      //clb(new Error("Request to Google Scholar failed"), null);
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
















