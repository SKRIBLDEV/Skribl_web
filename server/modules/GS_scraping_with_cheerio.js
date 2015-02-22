
var request = require('request');
var cheerio = require('cheerio'); //for constructing a DOM from retrieved HTML web page, and to use some kind of server side jQuery

//static scraping: retrieve the information from static hmtl 

//create the URL to the webpage resulting from a basic google scholar query
var createGoogleScholarURL = function(searchTerms){

  var prefix = "https://scholar.google.com/scholar?q="; 
  var postfix = "&btnG=&hl=en&as_sdt=0%2C5";

  var transformedTerms = searchTerms.split(" ").join("+"); //replace all spaces with "+" for use in URL

  var url = prefix.concat(transformedTerms, postfix);

  return url;
} 


// retrieve the html page at the given url and extract the needed metadata
/*
* returns an array containg objects with metadata for each listed search result
*/
var scrapeGoogleScholar = function(url, clb) {

  var result = [];

  request({ encoding: 'binary', method: "GET", uri: url}, function(err, resp, body) { //http request 

  	if (!err && resp.statusCode == 200) { //request succeeded

    	$ = cheerio.load(body); //create traversable DOM from retrieved html

      //console.log($("#gs_cit").find("#gs_citd").text());//("#gs_md_w").find(".gs_citi").html());

    	$(".gs_r").each(function() { //for each of the google scholar search results on the page

    		var articleData = { 
    			title : $( this ).find( ".gs_rt" ).text(),
    			authors : $( this ).find( ".gs_a" ).text(), //this is not correct yet - dynamic scraping needed
    			abstract : $( this ).find( ".gs_rs" ).text(), //not the full abstract yet - dynamic scraping needed
    			citations : $( this ).find( ".gs_fl" ).children().eq(2).text(), //to do: extract number 
    			article_url : $( this ).find( ".gs_md_wp" ).children().attr('href')
    		};

    		result[result.length] = articleData; //add object to result array
   		
 	 });
   
    clb(null, result); 
	
	}
    else
    	clb(err, null); 

  });
};

/*

//test code:

var url = createGoogleScholarURL("philippe tassin");


scrapeGoogleScholar(url, function(err, result){
  if (!err){
    for (index = 0; index < result.length; index++) {
      console.log("**********************");
      console.log(result[index]);
      console.log("");
    }
  }
});

*/




