 /**
  * Initialisation of a new angular app with the name 'skribApp',
  * Uses ng-route to start the a controller dependent on the url.
  * @type {angular module}
  */
var webapp = angular.module('skriblApp', ['ngRoute']);

//Adres of server API to send http requests (used in multiple controllers).
var serverApi = 'http://wilma.vub.ac.be:8443';

//Configures an header for all the 'normal' requests to the server. (not 'normal' request = specific request that needs special authorization)
var config = {headers:  {
		        "Content-type" : "application/json"
		    }};

/**
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