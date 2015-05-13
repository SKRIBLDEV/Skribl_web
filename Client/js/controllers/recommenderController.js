webapp.controller('recommenderController', function($scope, serverService, appData, metaService, publicationsService) {
	$scope.recommendations = {}

	$scope.fetchingRecommendations = false;
	$scope.reqestingMetadata = false;
	$scope.showMeta = true;
	$scope.showSpinner = false;

	$scope.getRecommendations = function(){
		if (appData.currentUser && !$scope.fetchingRecommendations){
			$scope.fetchingRecommendations = true;

			serverService.getRecommendations(5)
			.success(function(data) {
				$scope.recommendations = data;
				console.log(data);
				$scope.fetchingRecommendations = false;
			})
			.error(function(data, status){
				$scope.fetchingRecommendations = false;
				toast("Failed to get recommendations, please try again later", 4000);
			});	
			
		}
	}

	$scope.likeRecommendation = function(like){
		var pubID = metaService.currentMeta().id;
		serverService.likeRecommendation(like, pubID)
		.success(function(data) {
			if (like){
				publicationsService.addPublication('favorites', pubID);
			} else {
				toast("We're sorry you didn't like that, and optimesed our algoritm", 4000);
			}
		})
		.error(function(data, status){
			toast("Failed to post recommendation, please try again later", 4000);
		});	
	}

	$scope.setMetaData =function(data){
		metaService.forceMetaData(data);
		metaService.showMeta = true;
		console.log(metaService.currentMeta());
	}

	$scope.clearMetadata = function(){
		metaService.forceMetaData({});
	}

	$scope.hasRecommendations = function(){
		return ($scope.recommendations.length >= 1);
	}

	$scope.getMetadata = function(){
		return metaService.currentMeta();
	}

	if (! $scope.hasRecommendations()){
		$scope.getRecommendations();	
	}

});