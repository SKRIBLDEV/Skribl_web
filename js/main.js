 /**
  * Initialisation of a new angular app with the name 'skribApp',
  * currently using ngRouge as a dependency. This app can be referenced in HTML
  * using < ... ng-app='skriblApp'> ... </...>
  * @type {angular module}
  */

var webapp = angular.module('skriblApp', ['ngRoute']);


/**
 * Configuration of the angular webapp global.
 * We configure the different views/routes depending on the current URl
 * EX:
 * 		/index.html#home
 * 		/index.html#login
 * 		...
 * 	[home, login, …] are all routes that will display a different (aspect of a) view, yet the page will be fixed (~>SPA)
 *
 * for each route we configure:
 * 		- route name
 * 		- template URL | link to HTML-content to be inserted into ng-view
 * 		- controller
 * @param  {routeProvider} $routeProvider the ng-route provider associated with the app
 */
webapp.config(['$routeProvider', function($routeProvider) {

	$routeProvider.when('/login', 			{ templateUrl: 'templates/login.html', 			controller: 'loginController' });
	$routeProvider.when('/dashboard', 		{ templateUrl: 'templates/dashboard.html', 		controller: 'dashController'});
	$routeProvider.when('/home', 			{ templateUrl: 'templates/home.html', 			controller: 'homeController' });
	$routeProvider.when('/register', 		{ templateUrl: 'templates/register.html',		controller: 'registerController' });
	$routeProvider.otherwise({redirectTo: '/home'});

}]);


/*
	now we will define the different controllers for the webapp,
	these will determine the application behaviour etc..

	syntax: <module>.controller(<name>, <implementation>);
	implementation is a function that is able to use AngularJS'
	so called 'services' by adding them as parameters <implementation>,
	which is a function.

	for instance:
		$scope := every controller has a certain $scope-object that can
			hold variables, functions, ... that can be used within
			the HTML of that controller! (see HTML-code for example)
		$http := abstraction useful for AJAX-calls etc...
		$location := allows to switch between routes/views
		$appData := custom service (cf. sidenote)

 * SIDENOTE:
	first, we'll add our own custom service $appData that will allow
	controllers to simply share data with each other
	(since they don't share the same $scope-object)
	We do this by naming the service, then providing a constructor.
	(AngularJS will make a singleton (!) using this constructor...)
 */


/**
 * Initialisation of the appdata with the empty object
 */
webapp.service('$appData', function() {});


/**
 * Initialisation of the homeController (an angular controller),
 * has an symbiotic relationship with home.html
 * 
 * @param  {object} $scope    the scope object of the controller
 * @param  {object} $location for switching between routes/views
 * @param  {object} $appData  our custom service for shared data

 */
webapp.controller('homeController', function($scope, $location, $appData) {

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


/**
 * Initialisation of the registerController (an angular controller),
 * has an symbiotic relationship with register.html
 * 
 * @param  {object} $scope    	the scope object of the controller
 * @param  {object} $http 		abstraction for making http-related calls (ex: ajax)
 * @param  {object} $location 	for switching between routes/views
 * @param  {object} $appData  	our custom service for shared data

 */
webapp.controller('registerController', function($scope, $http, $location, $appData) {

	// optional: load credentials from cookie or other persistent storage?
	
	/**
	 * home routing function
	 */
	$scope.goToHome = function() {
		$location.path('/home');
	};

	/**
	 * To be used by the html wether the user has submitted the registration
	 * @type {Boolean}
	 */
	$scope.submitted = false;

	/**
	 * Returns the language that a user has entered, or "invalid" if nothing was
	 * selected. It will be used as a boolean value in order to determine wether
	 * a user has entered a value at all in the radio (see register.html)
	 * @return {String} The language a user has given into the form
	 */
	$scope.hasLanguage = function(){
		return $scope.userinput.language
	}

	/**
	 * Collection of the input values upon registratoin
	 * @type {Object}
	 */
	$scope.userinput = {};

	/**
	 * Collection of available languages
	 * @type {Array}
	 */
	$scope.languages = [ 'FR', 'DU', 'EN'];


	// ! move this so this only happens when the regisration is succesful!
	/**
	 * Add the current user to the app data
	 * @type {Object}
	 */
	
	/**
	 * The actual register function, registers the "currentUser" in appData and handles the routing
	 */
	$scope.register = function() {
		// write register function here
		if ($scope.signup_form.$valid){
					
			$appData.currentUser = {
				username: $scope.userinput.username,
				passkey: $scope.userinput.password,
				name: $scope.userinput.name,
				firstname: $scope.userinput.firstname,
				email: $scope.userinput.email,
				language: $scope.userinput.language
			};

			$location.path('/dashboard');
		} else {
			$scope.signup_form.submitted = true;
		}
	}
});


/**
 * Initialisation of the loginController (an angular controller),
 * has an symbiotic relationship with login.html
 * 
 * @param  {object} $scope    	the scope object of the controller
 * @param  {object} $http 		abstraction for making http-related calls (ex: ajax)
 * @param  {object} $location 	for switching between routes/views
 * @param  {object} $appData  	our custom service for shared data

 */
webapp.controller('loginController', function($scope, $http, $location, $appData) {

	// optional: load credentials from cookie or other persistent storage?
	// $scope.userinput.username = 'alice';
	// $scope.userinput.password = 'wonderland';

	/**
	 * home routing function
	 */
	$scope.goToHome = function() {
		$location.path('/home');
	};
	
	/**
	 * Collection of the input values upon login
	 * @type {Object}
	 */
	$scope.userinput = {};

	/**
	 * The actual login function
	 */
	$scope.login = function() {
//TODO loading "page"
		var JSONToSend = {
				username : $scope.userinput.username,
				password : $scope.userinput.password};
		var loginRequest = $http.post('.../login',JSONToSend);
		loginRequest.success(function(data, status, headers, config) {
			var pad = '.../user/'.concat($scope.userinput.username);
			var loadUserInfoRequest = $http.get(pad);
			loadUserInfoRequest.success(function(data, status, headers, config) {
				$appData.currentUser = data;
			});
			loadUserInfoRequest.error(function(data, status, headers, config) {
				//TODO melding dat er een fout is met ONZE database.
			});
			
			//TODO STOP loading "page"
			// change route to #/dashboard
			$location.path('/dashboard');
		});
		loginRequest.error(function(data, status, headers, config) {
			//TODO stop loading page
			//TODO error door ongeldige login en password combinatie
		});
	}
});


/**
 * Initialisation of the dashController (an angular controller),
 * has an symbiotic relationship with dashboard.html
 * 
 * @param  {object} $scope    	the scope object of the controller
 * @param  {object} $http 		abstraction for making http-related calls (ex: ajax)
 * @param  {object} $location 	for switching between routes/views
 * @param  {object} $appData  	our custom service for shared data

 */
webapp.controller('dashController', function($scope, $location, $appData) {

	/* controller for dashboard */

	console.log($appData);
	/**
	 * duplication of the username to be used in Dashboard.html
	 * @type {String}
	 */
	$scope.username = $appData.currentUser.username;

	/**
	 * The actual logout function
	 */
	$scope.logout = function() {
		$location.path('/home');
		$appData.currentUser = {};
		// remove cookie
	}
});
