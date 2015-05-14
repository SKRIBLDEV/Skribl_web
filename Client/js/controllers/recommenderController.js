webapp.controller('recommenderController', function($scope, serverService, appData, metaService, publicationsService, recommendationService) {

	$scope.fetchingRecommendations = false;
	$scope.reqestingMetadata = false;
	$scope.showMeta = true;
	$scope.showSpinner = false;

	$scope.recommendations = function(){
		return recommendationService.getRecommendations();
	}

	$scope.getRecommendations = function(){
		if (appData.currentUser && !$scope.fetchingRecommendations){
			$scope.fetchingRecommendations = true;
			metaService.resetMetadata();
			serverService.getRecommendations(10)
			.success(function(data) {
				recommendationService.setRecommendations(data);
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
				publicationsService.addPublication('Favorites', pubID);
			} else {
				toast("Sorry you didn't like that, we optimised our algoritm", 4000);
			}

			recommendationService.deleteRecommendation(pubID);
			metaService.resetMetadata();

		})
		.error(function(data, status){
			toast("Failed to post recommendation, please try again later", 4000);
		});	
	}

	$scope.setMetaData =function(data){
		metaService.forceMetaData(data);
		metaService.showMeta = true;
	}

	$scope.clearMetadata = function(){
		metaService.forceMetaData({});
	}

	$scope.hasRecommendations = function(){
		return recommendationService.hasRecommendations();
	}

	$scope.getMetadata = function(){
		return metaService.currentMeta();
	}

	if (! $scope.hasRecommendations()){
		$scope.getRecommendations();
		metaService.resetMetadata();
	}

});