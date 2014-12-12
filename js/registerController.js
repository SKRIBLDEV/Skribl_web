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

	/**
	 * The actual register function, registers the "currentUser" in appData and handles the routing
	 */
	$scope.register = function() {

		//if ($scope.signup_form.$valid){
					
			//JSON file to send when registering.
			var JSONToSend = {
				"firstName": $scope.userinput.firstName,
				"lastName": $scope.userinput.lastName,
				"language": "NL",
				"password": $scope.userinput.password,
				"email": $scope.userinput.email,
				"institution": $scope.userinput.institution,
				"faculty": $scope.userinput.faculty, 
				"department": $scope.userinput.department, 
				"researchDomains": [$scope.userinput.researchDomains],
				"researchGroup": $scope.userinput.researchGroup };

				console.log(JSONToSend);

			//Prepare url to add user.
		    var to = serverApi.concat('/users/').concat($scope.userinput.username);
		    
		    //Register http request.
		    var registerRequest = $http.put(to,JSONToSend,config);

		    registerRequest.success(function(data, status, headers, config) {
				
				//When register worked, sava the users information for later use.
				$scope.currentUser = JSONToSend;
			});

			loadUserInfoRequest.error(function(data, status, headers, config) {
			//Error when trying to register --> database error
			document.getElementById("error").innerHTML = "Database error, please try again later.";
			});
				
			$location.path('/dashboard');
		/*} else {
			$scope.signup_form.submitted = true;
		}*/
	}
});
