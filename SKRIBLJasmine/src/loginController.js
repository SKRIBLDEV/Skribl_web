
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

		//Create JSON to send in a HTTPrequest.
		var JSONToSend = {
				"username" : $scope.userinput.username,
				"password" : $scope.userinput.password
			};

		//Initialise HTTP request
		var loginRequest = $http.post(serverApi.concat('/login'),JSONToSend,config);
		
		
		loginRequest.success(function(data, status, headers, config) {

			//Save Authorization when login to do important tasks.
			$appData.Authorization = data.Authorization;
			
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
		
		loginRequest.error(function(data, status, headers, config) {
			
			if(status == 0)
			{
			//Server is not on
			document.getElementById("error").innerHTML = "SKRIBL is currently unavailable";
			}
			else{
			//Error user has given bad username or passwore
			document.getElementById("error").innerHTML = "Username or password is invalid, please try again";
			}
			
		});
	}
	
	if($appData.currentUser == 1){
		//just registered
		document.getElementById("error").innerHTML = "You have successfully registered ! Please log in";
	}
});