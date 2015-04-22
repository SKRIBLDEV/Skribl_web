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
			currentMeta = data;
			changePDFURL(data.download);
			requestingMetaData = false;
			if (handler){
				handler(true);
			}
		})
		.error(function(){
			requestingMetaData = false;
			toast("Failed to find metadata, try again later", 4000);
			if (handler){
				handler(false);
			}
		});
	}

	var resetMetadata = function(){
		currentMeta.value = {};
	}

	var service = {
		currentMeta : function() { return currentMeta},
		requestingMetaData : function() {return requestingMetaData},
		setMetadata : setMetadata,
		resetMetadata : resetMetadata
	}
	
	return service;
});