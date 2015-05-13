webapp.factory('metaService', function($http, appData, serverService, pdfViewerService){

	var currentMeta = {};
	var requestingMetaData = false;
	var showMeta = false;

	var setMetadata = function(pubId, handler){
		requestingMetaData = true;
		serverService.setMetadata(pubId)
		.success(function (data){
			currentMeta = data;
			console.log("current metadata: ");
			console.log(data);
			pdfViewerService.changePDFURL(data.download);
			requestingMetaData = false;
			if (handler){
				handler(true, currentMeta);
			}
		})
		.error(function(){
			requestingMetaData = false;
			toast("Failed to find metadata, try again later", 4000);
			if (handler){
				handler(false);
			}
		});
	};

	//to show search results retrieved from google scholar in the preview
	var setExternalMetadata = function(GSmetadata, handler){
		currentMeta = GSmetadata;
		showMeta = true;
		requestingMetaData = false;
		if (handler){
			handler(true, currentMeta);
		}
	};

	var forceMetaData = function(data){
		currentMeta = data;
		pdfViewerService.changePDFURL(data.download);
	};

	var resetMetadata = function(){
		currentMeta = {};
	};

	var service = {
		currentMeta : function() { return currentMeta},
		requestingMetaData : function() {return requestingMetaData},
		showMeta : function() {return showMeta},
		toggleMeta : function(enable) {showMeta = enable},
		setMetadata : setMetadata,
		setExternalMetadata : setExternalMetadata,
		resetMetadata : resetMetadata,
		forceMetaData : forceMetaData
	};
	
	return service;
});