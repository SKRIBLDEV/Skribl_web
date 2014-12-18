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
	// only letters, numbers and underscores
	$scope.RegEx_username = /^\w+$/; 

	// common email 
	$scope.RegEx_emailAdress = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	//at least one number, at least 6 and at most 20 characters from the set [a-zA-Z0-9!@#$%^&*]
	$scope.RegEx_password = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,20}$/; 

	//one or more words in all languages, with apostrophes and hyphens 
	//excludes numbers and all the special (non-letter) characters commonly found on keyboards
	$scope.RegEx_generalName = /^[a-zA-Z\xC0-\uFFFF '-]+[a-zA-Z\xC0-\uFFFF'-]$/; 

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
		return $scope.userinput.language;
	};

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
	 * Used to add an user.
	 */

	$scope.regexControl = function(){

		if((!($scope.RegEx_generalName.test($scope.userinput.firstName))) || ($scope.userinput.firstName == undefined)){
			//Error when trying to register with a "bad" first name.
			document.getElementById("error").innerHTML = "First name not valid.";
			return false;
		}
		if((!($scope.RegEx_generalName.test($scope.userinput.lastName))) || ($scope.userinput.lastName == undefined)){
			//Error when trying to register with a "bad" last name.
			document.getElementById("error").innerHTML = "Name not valid.";
			return false;
		}
		if((!($scope.RegEx_username.test($scope.userinput.username))) || ($scope.userinput.username == undefined)){
			//Error when trying to register with a "bad" username.
			document.getElementById("error").innerHTML = "Username not valid.";
			return false;
		}
		if((!($scope.RegEx_emailAdress.test($scope.userinput.email))) || ($scope.userinput.email == undefined)){
			//Error when trying to register with a "bad" email.
			document.getElementById("error").innerHTML = "Email is not valid.";
			return false;
		}
		if((!($scope.RegEx_generalName.test($scope.userinput.institution))) || ($scope.userinput.institution == undefined)){
			//Error when trying to register with a "bad" institution.
			document.getElementById("error").innerHTML = "Institution is not valid.";
			return false;
		}
		if((!($scope.RegEx_generalName.test($scope.userinput.faculty))) || ($scope.userinput.faculty == undefined)){
			//Error when trying to register with a "bad" faculty.
			document.getElementById("error").innerHTML = "Faculty is not valid.";
			return false;
		}
		if((!($scope.RegEx_generalName.test($scope.userinput.department))) || ($scope.userinput.department == undefined)){
			//Error when trying to register with a "bad" department.
			document.getElementById("error").innerHTML = "Department is not valid.";
			return false;
		}
		if((!($scope.RegEx_generalName.test($scope.userinput.researchDomains))) || ($scope.userinput.researchDomains == undefined)){
			//Error when trying to register with "bad" research domains.
			document.getElementById("error").innerHTML = "Research domains are not valid.";
			return false;
		}
		if((!($scope.RegEx_generalName.test($scope.userinput.researchGroup))) || ($scope.userinput.researchGroup == undefined)){
			//Error when trying to register with a "bad" research group.
			document.getElementById("error").innerHTML = "Research group is not valid.";
			return false;
		}
		if((!($scope.RegEx_password.test($scope.userinput.password))) || ($scope.userinput.password == undefined)){
			//Error when trying to register with a "bad" password.
			document.getElementById("error").innerHTML = "Password is not valid.";
			return false;
		}

		return true;
	};

	$scope.register = function() {
		var test = $scope.regexControl();
		if (test){
					
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
				
				//Used in login to show message
				$appData.currentUser = 1;

				//When register worked,change route to #/login.
				$location.path('/login');

			});

			registerRequest.error(function(data, status, headers, config) {

				if((status === 501) && (data === "Error: username taken!"))
				{
					//Error when trying to register with a username that is already token.
					document.getElementById("error").innerHTML = "Username is already used please try an other.";
				}
					//Error when trying to register --> database error
				else{	document.getElementById("error").innerHTML = "Database error, please try again later.";
			}
			});
		}

	};
});
