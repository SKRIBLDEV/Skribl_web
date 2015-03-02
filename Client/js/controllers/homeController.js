/**
 * Initialisation of the homeController (an angular controller),
 * has an symbiotic relationship with home.html
 * 
 * @param  {object} $scope    the scope object of the controller
 * @param  {object} $location for switching between routes/views
 * @param  {object} appData  our custom service for shared data
 * @param  {object} $anchorSmoothScroll  custom service for smooth scrolling functionality

 */
webapp.controller('homeController', function($scope, $location, appData, anchorSmoothScroll) {    
	/**
	 * Collection of the input values upon registratoin
	 * @type {Object}
	 */
	$scope.userinput = {};
    
	/**
	 * The copy text for the home page, might be dynamic in futre iterations
	 * @type {String}
	 */
	$scope.copy = "LET YOUR PUBLICATIONS DO THE NETWORKING"

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

	/**
	 * go to element (scrolling) function uses anchorSmoothScroll
	 * @param  {[type]} eID the tag where we want the viewport to scroll to
	 */
	$scope.gotoElement = function (eID){
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash('middle');
 
      // call $anchorScroll()
      anchorSmoothScroll.scrollTo(eID);
    };	
});

