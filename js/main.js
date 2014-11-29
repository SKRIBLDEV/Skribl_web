/*
	make a new app with the name 'skribApp'
	dependencies currently used: ngRoute
	this app can be referenced in HTML with < ... ng-app='skriblApp'> ... </...>
 */

var webapp = angular.module('skriblApp', ['ngRoute']);
/*
	configure the different view/routes depending on current URL
	for example:

		- /index.html#home
		- /index.html#login
		- /index.html#register
		- ...
	home, login and register are all routes here that will display
	a different view, but on the same page (= no browser reload ~ SPA)

	for each route, we configure:
		- route name, obviously
		- template URL, link to HTML-content to be inserted into ng-view (for this particalar view)
		- controller, which controller to use for application logic (see later)
 */

webapp.config(['$routeProvider', function($routeProvider) {

	$routeProvider.when('/login', 		{ templateUrl: 'templates/login.html', 			controller: 'loginController' });
	$routeProvider.when('/dashboard', { templateUrl: 'templates/dashboard.html', 	controller: 'dashController'});
	$routeProvider.when('/home', 			{ templateUrl: 'templates/home.html', 			controller: 'homeController' });
	$routeProvider.when('/register', 	{ templateUrl: 'templates/register.html',		controller: 'registerController' });
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

//appdata = empty object => empty constuctor
webapp.service('$appData', function() {});

webapp.controller('homeController', function($scope, $location, $appData) {

	/* controller for dashboard */

	$scope.login = function() {
		$location.path('/login');
	};

	$scope.register = function() {
		$location.path('/register');
	};

});

webapp.controller('registerController', function($scope, $http, $location, $appData) {

	// optional: load credentials from cookie or other persistent storage?
	// $scope.userinput.username = 'alice';
	// $scope.userinput.password = 'wonderland';
	
	$scope.goToHome = function() {
		$location.path('/home');
	};

	$scope.submitted = false;

	// init other data
	$scope.userinput = {};

	$scope.languages = [ 'FR', 'DU', 'EN'];


	// stub function for testing (login always succeeds)
	$appData.currentUser = {
			username: $scope.userinput.username,
			passkey: $scope.userinput.password,
			name: $scope.userinput.name,
			firstname: $scope.userinput.firstname,
			email: $scope.userinput.email,
			language: $scope.userinput.language
	}

	$scope.register = function() {
		// write register function here
		if ($scope.signup_form.$valid){

			// submit
			// change route to #/dashboard
			$location.path('/dashboard');
		} else {

			$scope.signup_form.submitted = true;
		}


	}
});

webapp.controller('loginController', function($scope, $http, $location, $appData) {

	// optional: load credentials from cookie or other persistent storage?
	// $scope.userinput.username = 'alice';
	// $scope.userinput.password = 'wonderland';

	$scope.goToHome = function() {
		$location.path('/home');
	};
	
	// init other data
	$scope.userinput = {};

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

webapp.controller('dashController', function($scope, $location, $appData) {

	/* controller for dashboard */

	$scope.username = $appData.currentUser.username;

	$scope.logout = function() {

		$location.path('/home');
	}
});
