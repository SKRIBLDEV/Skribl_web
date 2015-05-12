webapp.controller('recommenderController', function($scope, serverService, appData, metaService) {
	$scope.recommendations = {}

	$scope.fetchingRecommendations = false;
	$scope.reqestingMetadata = false;
	$scope.showMeta = true;
	$scope.showSpinner = false;

	$scope.getRecommendations = function(){
		if (appData.currentUser && !$scope.fetchingRecommendations){
			$scope.fetchingRecommendations = true;
			console.log("in recommendations");

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