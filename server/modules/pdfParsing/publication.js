/*var PDFParser = require('./pdf2json');
var parser = new PDFParser();*/


// [H]: a somewhat confusing name to me, since this isn't the result of a database query (= a record)? 
// [N]: pdfData should include uploader. Keep in mind, Ivo uses this constructor as well...
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


function Author(first, last) {
    this.getFirstName  = function() {return first;};
    this.getLastName  = function() {return last;};
}


/*
* In fetching the metadata, the whole PDF document is parsed. This can be used in future implementations (right now, it makes the process much slower than it ought to be).
* TODO : fix this implementation for a bug in the parsing-library, occurring for a JPEG error during parsing of a PDF. This somehow 'slips trough' the system 
* of emitters and listeners, and subsequently breaks the code.   
*/

//metadata from parsing file
/*getMetadata = function(filePath, clb){

  parser.on('pdfParser_dataReady', function(pdf) {
    clb(null, pdf.data.Id); //pdf.data.id is an object with metadata or an empty object
  });

  parser.on('pdfParser_dataError', function(error){
    clb(error, null);
  });

  parser.loadPDF(filePath);
    
};*/


/**
* creates a publicationRecord object from info object, where info object contains a path to the pdf an the username of the uploader.
**/

function createPublication(info, clb){
  /*
  getMetadata(info.path, function(err, res){
    var data = {}; 
    if (!err){ data = res;}; //if no error occured during parsing, bind the metadata to the data object, otherwise the metadata properties are left undefined
    data.path = info.path;
    clb(null, new PublicationRecord(info.uploader, data)); 
  });*/

  var data = {}; 
  authors = [new Author("someFirstName", "someLastName")]; // [H] @I: for database testing 
  data.authors = authors;
  data.path = info.path;    //[I] @H: path is needed too
  clb(null, new PublicationRecord(info.uploader, data)); 

};

exports.createPublication = createPublication;

/* test code:

var filename = "test_a";
var path = "./" + filename + ".pdf";

var info = {
  uploader: "hpinson_94",
  path: path
};

createPublication(info, function(err, res){
  if (!err){
    console.log(res.getUploader());
    console.log(res.getTitle());
    console.log(res.getAuthors()[0].getFirstName());
    console.log(res.getSubject());
    console.log(res.getDescription());
    console.log(res.getPublisher());
    console.log(res.getRights());
    console.log(res.getUrl());
  }
  else 
    console.log(err);
});

*/
