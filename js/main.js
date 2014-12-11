 /**
  * Initialisation of a new angular app with the name 'skribApp',
  * currently using ngRouge as a dependency. This app can be referenced in HTML
  * using < ... ng-app='skriblApp'> ... </...>
  * @type {angular module}
  */
var webapp = angular.module('skriblApp', ['ngRoute']);

var serverApi = 'http://wilma.vub.ac.be:8443';
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

/**
 * Initialisation of the appdata with the empty object
 */
webapp.service('$appData', function() {});

