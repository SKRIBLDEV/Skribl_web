webapp.factory('recommendationService', function($http, appData, serverService, pdfViewerService){

	var recommendations = {};

	var setRecommendations = function(data){
		recommendations = data;
	}

	var resetRecommendations = function(){
		recommendations = {};
	}

	var getRecommendations = function(){
		return recommendations;
	}

	var deleteRecommendation = function(pubID){
		for(var i = recommendations.length - 1; i >= 0; i--) {
			if(recommendations[i].id === pubID) {
				recommendations.splice(i, 1);
			}
		}

	}

	var service = {
		setRecommendations : setRecommendations,
		resetRecommendations : resetRecommendations,
		getRecommendations : getRecommendations,
		hasRecommendations : function(){ return recommendations.length>=1},
		deleteRecommendation : deleteRecommendation

	};
	
	return service;
});