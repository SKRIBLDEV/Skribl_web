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