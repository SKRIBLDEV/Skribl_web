

//currently with static scraping
var GS_scraping = require('./GS_scraping_with_cheerio.js');


/**
* replaces undefined values of object received from front with values found by scraping GS
*/
function setUndefinedProperties(metadataGUI, metadataGS){
  for (var property in metadataGS) {
    if (metadataGS.hasOwnProperty(property) && metadataGS[property]){
        if(!metadataGUI[property] ) //undefined property (not specified)
          metadataGUI[property] = metadataGS[property];
    };
  };
};

/**
* changes general properties (such as journalOrBookTitle) to specific properties, such as journal for a journal article and bookTitle for a proceeding article
*/

function setToType(type, metadataGS){
  if (type == "journal"){
    metadataGS.journal = metadataGS.journalOrBookTitle;
    metadataGS.publisher = metadataGS.publisherOrOrganization;
  };
  if (type == "proceeding"){
    metadataGS.bookTitle = metadataGS.journalOrBookTitle;
    metadataGS.organization = metadataGS.publisherOrOrganization;
  };
  delete metadataGS.journalOrBookTitle;
  delete metadataGS.publisherOrOrganization;
};

/**
* extract data from google scholar first search result and update reveived metadata object accordingly
* @param info :: contains metadata supplied from front-end: Minimally, it contains info.title as a keyword for google scholar scraping
* @param type :: journal or proceeding, indicates whether the properties of the found result should be interpreted as journal title or booktitle, etc.  
* @param clb: callback with updated metadata after scraping
*/


function extract(info, clb){
  GS_scraping.extractOne(info.title, function(err, res){ //extract the first GS result; if the title is correct, this is usually the only result
    if (err){
      clb(err, info); //returns the unchanged info object
    }
    else{
      var type = info.type;
      setToType(type, res);
      setUndefinedProperties(info, res);
      clb(null, info);
    } 
  });
 };


 /**
* extract data from all google scholar search results on the first page, return the results in an array  (= BASIC search)
* @param searchTerms 
* @param limit :: limit on the number of results to be returned (the maximal number of returned results is ten, since there are 10 results on the first page)
* @param clb: callback 
*/


function search(searchTerms, limit, clb){
  GS_scraping.extractAll(searchTerms, function(err, res){ //extract the GS results of the first page
    if (err){
      clb(err, null); 
    }
    else{
      if (res.length > limit){
        res.length = limit; 
      }
      clb(null, res);
    }; 
  });
 };


//exports 

exports.search = search;

exports.extract = function(info, clb){
  extract(info, clb);
 };






//test code:
/*
 var proceedingArticle = "Analytical model for the optical propagation in a nonlinear left-handed material";
 var journalArticle = "Low-Loss Metamaterials Based on Classical Electromagnetically Induced Transparency";


var testInfo = {
  title: journalArticle,
  type: "journal"
}

extract(testInfo, function(err, res){
  if (err)
    console.log(err);
  else
    console.log(testInfo);
});*/



/*var searchKey = 'optical properties of metamaterials';

search(searchKey, 4, function(err, res){
  if (err)
    console.log(err);
  else
    console.log(res);
});*/



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



