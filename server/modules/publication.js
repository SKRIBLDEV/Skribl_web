

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


//the extracted metadata will not yet be correct/complete - further developments on dynamic scraping should resolve this

function extract(info, clb){
  GS_scraping.extractOne(info.title, function(err, res){
    if (err)
      clb(new Error('Failed to extract data from Google Scholar'), info); //returns the unchanged info object
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
  title: "Low-Loss Metamaterials Based on Classical Electromagnetically Induced Transparency"
}

extract(testInfo, function(err, res){
  if (err)
    console.log(err);
  else
    console.log(testInfo);
});

*/



