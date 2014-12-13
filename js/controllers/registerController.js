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

			//Prepare url to add user.
		    var to = serverApi.concat('/users/').concat($scope.userinput.username);
		    
		    //Register http request.
		    var registerRequest = $http.put(to,JSONToSend,config);

		    registerRequest.success(function(data, status, headers, config) {
				
				//When register worked, het the users information for later use.
				
				//Prepare url to get userInformation for later use.
				var pad = serverApi.concat('/users/').concat($scope.userinput.username);
			
				//Get userInformation request
				var loadUserInfoRequest = $http.get(pad,config);
				loadUserInfoRequest.success(function(data, status, headers, config) {
				//save userInformation in appData.
				$appData.currentUser = data;

				// change route to #/dashboard
				$location.path('/dashboard');
				});
				loadUserInfoRequest.error(function(data, status, headers, config) {
				//Error when getting user info --> database error
				document.getElementById("error").innerHTML = "Database error, please try again later.";
				});

			});

			registerRequest.error(function(data, status, headers, config) {

				if((status == 501) && (data == "Error: username taken!"))
				{
					//Error when trying to register with a username that is already token.
					document.getElementById("error").innerHTML = "Username is already used please try an other.";
				}
					//Error when trying to register --> database error
				else{	document.getElementById("error").innerHTML = "Database error, please try again later.";
			}
			});
		/*} else {
			$scope.signup_form.submitted = true;
		}*/
	}
});
