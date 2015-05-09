webapp.factory('metaService', function($http, appData, serverService, pdfDelegate){

	var currentMeta = {};
	var requestingMetaData = false;
	var showMeta = false;

	function changePDFURL(newURL){
        pdfDelegate.$getByHandle('my-pdf-container').load(newURL);
    }

	var setMetadata = function(pubId, handler){
		console.log("setting metadata")
		requestingMetaData = true;
		serverService.setMetadata(pubId)
		.success(function (data){
			currentMeta = data;
			changePDFURL(data.download);
			requestingMetaData = false;
			console.log("done setting")
			if (handler){
				handler(true, currentMeta);
				console.log(currentMeta);
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
		console.log(data);
		console.log("lolo");
	};

	var resetMetadata = function(){
		currentMeta.value = {};
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