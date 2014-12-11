/**
 * Initialisation of the registerController (an angular controller),
 * has an symbiotic relationship with register.html
 * 
 * @param  {object} $scope    	the scope object of the controller
 * @param  {object} $http 		abstraction for making http-related calls (ex: ajax)
 * @param  {object} $location 	for switching between routes/views
 * @param  {object} $appData  	our custom service for shared data

 */
angular.module('skriblApp').controller('registerController', function($scope, $http, $location, $appData) {

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
	$scope.languages = [ 'FR', 'NL', 'EN'];


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
					
			//$appData.currentUser =
			var JSONToSend = {
				"username": $scope.userinput.username,
				"firstName": $scope.userinput.firstname,
				"lastName": $scope.userinput.name,
				"language": $scope.userinput.language,
				"password": $scope.userinput.password,
				"email": $scope.userinput.email,
				"institution": "none",
				"faculty": "none", 
				"department": "none", 
				"researchDomains": ["none"],
				"researchGroup": "none" };

			var config = {headers:  {x
		        "Content-type" : "application/json"	
		    }};

		    var to = serverApi.concat('/users');
		    var registerRequest = $http.put(to,JSONToSend,config);

		    registerRequest.success(function(data, status, headers, config) {
				$scope.currentUser = JSONToSend;
			});

			loadUserInfoRequest.error(function(data, status, headers, config) {
				//TODO melding dat er een fout is met ONZE database.
			});
				
			$location.path('/dashboard');
		} else {
			$scope.signup_form.submitted = true;
		}
	}
});
