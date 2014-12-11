/**
 * Initialisation of the homeController (an angular controller),
 * has an symbiotic relationship with home.html
 * 
 * @param  {object} $scope    the scope object of the controller
 * @param  {object} $location for switching between routes/views
 * @param  {object} $appData  our custom service for shared data

 */
angular.module('skriblApp').controller('homeController', function($scope, $location, $appData) {

	$appData.currentUser = null;

	/**
	 * login routing function
	 */
	$scope.login = function() {
		$location.path('/login');
	};

	/**
	 * register routing function
	 */
	$scope.register = function() {
		$location.path('/register');
	};
	
});


