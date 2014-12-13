/**
 * Initialisation of the homeController (an angular controller),
 * has an symbiotic relationship with home.html
 * 
 * @param  {object} $scope    the scope object of the controller
 * @param  {object} $location for switching between routes/views
 * @param  {object} $appData  our custom service for shared data

 */
angular.module('skriblApp').controller('homeController', function($scope, $location, $appData, anchorSmoothScroll) {

	//Used to control if user has already logged-in.
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

	$scope.gotoElement = function (eID){
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash('middle');
 
      // call $anchorScroll()
      anchorSmoothScroll.scrollTo(eID);
    };	
});


