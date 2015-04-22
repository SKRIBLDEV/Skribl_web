webapp.factory('metaService', function($http, appData, serverService, pdfDelegate){

	var currentMeta = {};
	var requestingMetaData = false;

	function changePDFURL(newURL){
        pdfDelegate.$getByHandle('my-pdf-container').load(newURL);
    }

	var setMetadata = function(pubId, handler){
		requestingMetaData = true;
		serverService.setMetadata(pubId)
		.success(function (data){
			console.log(data);
			currentMeta = data;
			changePDFURL(data.download);
			console.log("***current meta: " + data);
			requestingMetaData = false;
			if (handler){
				handler(true);
			}
			console.log(currentMeta);
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
		if (handler){
			handler(true);
		}
	};

	var resetMetadata = function(){
		currentMeta.value = {};
	};

	var service = {
		currentMeta : function() { return currentMeta},
		requestingMetaData : function() {return requestingMetaData},
		setMetadata : setMetadata,
		setExternalMetadata : setExternalMetadata,
		resetMetadata : resetMetadata
	};
	
	return service;
});