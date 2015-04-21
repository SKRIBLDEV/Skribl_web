 /**
  * Initialisation of a new angular app with the name 'skriblApp',
  * Uses ng-route to start the a controller dependent on the url.
  * @type {angular module}
  */
var webapp = angular.module('skriblApp', ['ngRoute', 'ui.router', 'ui.materialize', 'chartjs', 'pdf']);

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
webapp.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {


	$urlRouterProvider.otherwise('/home');


	$stateProvider

		//=========== HOME STATE ====================================

		.state('home', {
			url: '/home',
			controller: 'homeController',
			templateUrl: 'templates/home.html'
		})


		// =========== DASHBOARD STATE ==============================
		.state('dashboard', {
			url: '/dashboard',
			controller: 'dashController',
			templateUrl: 'templates/dashboard.html'
		})

		// states nested in dashboard ==============================
		// accessed in 'userCard' directive

		.state('dashboard.network', {
			url: '/network',
			controller: 'GraphCtrl',
			templateUrl : 'templates/dash-network.html'
		})


		.state('dashboard.library', {
			// library hasn't got a separate controller at the moment -> use of parent controller
			url: '/library',
			templateUrl: "templates/dash-library.html"
		})

		// temp fix for quick development
		.state('search', {
			url: '/search',
			controller: 'searchCtrl',
			templateUrl: "templates/searchCard.html"
		})




}]);

/**
 * Initialisation of the appdata with the empty object
 */
webapp.service('$appData', function() {});





        
