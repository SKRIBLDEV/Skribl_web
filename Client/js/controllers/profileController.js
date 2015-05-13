webapp.controller('profileController', function GraphCtrl($scope, $http, appData, serverService, authorProfileService) {

	$scope.profile = appData.data.currentProfileData;
	

	$scope.hideContent = false;
	$scope.toggleContent = function(){
		$scope.hideContent = !$scope.hideContent;
	}

	$scope.shouldShow = function(){
		return (($scope.profile != null) && ($scope.profile.firstName != null));
	}

	$scope.loadPublications =function(){
		var firstName = $scope.profile.firstName;
		var lastName = $scope.profile.lastName;

		var url = serverApi.concat('/authors?firstname=').concat(firstName).concat('&lastname=').concat(lastName).concat('&limit=').concat(5);
		console.log(url);
		var getAuthorsRequest = $http.get(url, config);

		getAuthorsRequest.success(function(data, status, headers, config) {
			if (data.length < 1){
				toast("No publications found", 3000);	
			} else {
				$scope.profile.publications = data[0].publications;
			}

		})
		getAuthorsRequest.error(function(data, status, headers, config) {
			toast("No publications found", 3000);
		})
	}

	
});