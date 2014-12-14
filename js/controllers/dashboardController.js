
/**
 * Initialisation of the dashController (an angular controller),
 * has an symbiotic relationship with dashboard.html
 * 
 * @param  {object} $scope    	the scope object of the controller
 * @param  {object} $http 		abstraction for making http-related calls (ex: ajax)
 * @param  {object} $location 	for switching between routes/views
 * @param  {object} $appData  	our custom service for shared data

 */
angular.module('skriblApp').controller('dashController', function($scope, $http, $location, $appData) {

	//Control if user has already loged in, or if he tries to go the dashboard without login in.
	if(!($appData.currentUser))
	{
		$location.path('/home');
		return;
	}

	/**
	 * duplication of the username to be used in Dashboard.html
	 * @type {String}
	 */
	$scope.username = $appData.currentUser.username;

	 // The logout function
	$scope.logout = function() {
		$location.path('/home');
		$appData.currentUser = null;
	};

	// TODO DELETE USER WEKRT NIET OP SERVER
	//The delete function
	$scope.deleteUser = function(){
		var path = serverApi.concat('/users/').concat($scope.username);
		var config = {headers:  {
		        'Authorization': $appData.Authorization
		    }
		};
		var deleteRequest = $http.delete(path,config);

		deleteRequest.success(function(data, status, headers, config) {
			$scope.logout();

		});
		/*deleteRequest.error(function(data, status, headers, config) {
			//Error while deleting user
			document.getElementById("error").innerHTML = "Database error, please try again later.";
			});*/
	};

});