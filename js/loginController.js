
/**
 * Initialisation of the loginController (an angular controller),
 * has an symbiotic relationship with login.html
 * 
 * @param  {object} $scope    	the scope object of the controller
 * @param  {object} $http 		abstraction for making http-related calls (ex: ajax)
 * @param  {object} $location 	for switching between routes/views
 * @param  {object} $appData  	our custom service for shared data

 */
angular.module('skriblApp').controller('loginController', function($scope, $http, $location, $appData) {

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
			var Authorization = data.Authorization;
			var pad = '.../user/'.concat($scope.userinput.username);
			var loadUserInfoRequest = $http.get(pad);
			loadUserInfoRequest.success(function(data, status, headers, config) {
				$appData.currentUser = data;
				$appData.currentUser.Authorization = $scope.Authorization;
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

			//TESTING --> EVERYONE CAN LOGIN
			$appData.currentUser = {
				username: "TestUsername",
				passkey: "TestPasskey",
				name: "TestName",
				firstname: "TestFirstName",
				email: "Test@email.com",
				language: "DU"
			}
			$location.path('/dashboard');
			//TESTING END

		});
	}
});