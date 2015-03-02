

//currently with static scraping
var GS_scraping = require('./GS_scraping_with_cheerio.js');


/*
function PublicationRecord(uploader, pdfData){

  // pdfData is always defined, but not all metadata properties might be present
  // therefore the result of these getters might be 'undefined'

  this.getUploader = function() { return uploader; }; //username of uploader
  this.getTitle = function() { return pdfData.title; }; 
  //[I] the database now expects that getAuthors returns an array of objects that support getFirstName() and getLastName
  this.getAuthors = function() {return pdfData.authors;};
  this.getSubject = function() { return pdfData.subject; }; 
  this.getDescription = function() { return pdfData.description; }; 
  this.getPublisher = function() { return pdfData.publisher; }; 
  this.getRights = function() { return pdfData.rights; };  
  this.getUrl = function() { return pdfData.url; }; 

  this.loadPath= function(clb) {return clb(null, pdfData.path);};
}


//author object 
function Author(first, last) { 
    this.getFirstName  = function() {return first;};
    this.getLastName  = function() {return last;};
}

*/

/**
* replaces undefined values of object received from front with values found by scraping GS
*/
function setUndefinedProperties(metadataGUI, metadataGS){
  for (var property in metadataGS) {
    if (metadataGS.hasOwnProperty(property) && metadataGS[property]){
        if( ! metadataGUI[property] ) //undefined property (not specified)
          metadataGUI[property] = metadataGS[property];
    };
  };
};

/**
* extract data from google scholar first search result and update reveived metadata object accordingly
* @param info :: contains metadata supplied from front-end: Minimally, it contains info.title as a keyword for google scholar scraping
* @param clb: callback with updated metadata after scraping
*/


function extract(info, clb){
  GS_scraping.extractOne(info.title, function(err, res){ //extract the first GS result; if the title is correct, this is usually the only result
    if (err){
      var GSError = new Error('Failed to extract data from Google Scholar');
      clb(GSError, info); //returns the unchanged info object
    }
    else{
      setUndefinedProperties(info, res);
      clb(null, info);
    } 
  });
 };

 exports.extract = extract;
     

/**
* creates a publicationRecord object from info object, where info object contains a path to the pdf an the username of the uploader.
**/

/*

function createPublication(info, clb){
  /*
  getMetadata(info.path, function(err, res){
    var data = {}; 
    if (!err){ data = res;}; //if no error occured during parsing, bind the metadata to the data object, otherwise the metadata properties are left undefined
    data.path = info.path;
    clb(null, new PublicationRecord(info.uploader, data)); 
  });

  var data = {}; 
  authors = [new Author("someFirstName", "someLastName")]; // [H] @I: for database testing 
  data.authors = authors;
  data.path = info.path;    //[I] @H: path is needed too
  clb(null, new PublicationRecord(info.uploader, data)); 

};

exports.createPublication = createPublication;

*/


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



