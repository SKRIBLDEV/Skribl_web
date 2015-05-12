webapp.controller('recommenderController', function($scope, serverService, appData) {
	$scope.recommendations = {}

	$scope.fetchingRecommendations = false;

	$scope.getRecommendations = function(){
		if (appData.currentUser && !$scope.fetchingRecommendations){
			$scope.fetchingRecommendations = true;
			console.log("in recommendations");

			serverService.getRecommendations(5)
			.success(function(data) {
				$scope.recommendations = data;
				console.log(data);
				$scope.fetchingRecommendations = false;
				toast("We found some new recommendations you might like", 4000);
			})
			.error(function(data, status){
				$scope.fetchingRecommendations = false;
				toast("Failed to get recommendations, please try again later", 4000);
			});	
			
		}
	}

	$scope.hasRecommendations = function(){
		return ($scope.recommendations.length < 1);
	}

	if (! $scope.hasRecommendations()){
		$scope.getRecommendations();	
	}

});