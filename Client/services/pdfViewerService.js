webapp.factory('pdfViewerService', function($http, appData, pdfDelegate){

	var showPublicationViewer = false;

	var disablePublicationViewer = function(){ 
		showPublicationViewer = false;
    };

    var publicationViewerEnabled = function(){ 
    	return self.showPublicationViewer;
    };
    
    var displayPDF = false;

    var toggleDisplayPDF = function(){
    	self.displayPDF = !self.displayPDF;
    }

    var changePDFURL = function(newURL){
    	pdfDelegate.$getByHandle('my-pdf-container').load(newURL);
    }

    var service = {
    	changePDFURL : changePDFURL,
    	showPublicationViewer: showPublicationViewer,
    	disablePublicationViewer: disablePublicationViewer,
    	publicationViewerEnabled : publicationViewerEnabled,
    	displayPDF : displayPDF,
    	toggleDisplayPDF : toggleDisplayPDF,
    	changePDFURL : changePDFURL
    };

    return service;

});