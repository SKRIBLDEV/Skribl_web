/**
 * Initialisation of the homeController (an angular controller),
 * has an symbiotic relationship with home.html
 * 
 * @param  {object} $scope    the scope object of the controller
 * @param  {object} $location for switching between routes/views
 * @param  {object} appData  our custom service for shared data
 * @param  {object} $anchorSmoothScroll  custom service for smooth scrolling functionality

 */
angular.module('skriblApp').controller('homeController', function($scope, $http, $location, appData, anchorSmoothScroll) {
    // only letters, numbers and underscores
	$scope.RegEx_username = /^\w+$/; 

	// common email 
	$scope.RegEx_emailAdress = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	//at least one number, at least 6 and at most 20 characters from the set [a-zA-Z0-9!@#$%^&*]
	$scope.RegEx_password = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,20}$/; 

	//one or more words in all languages, with apostrophes and hyphens 
	//excludes numbers and all the special (non-letter) characters commonly found on keyboards
	$scope.RegEx_generalName = /^[a-zA-Z\xC0-\uFFFF '-]+[a-zA-Z\xC0-\uFFFF'-]$/; 
    
    
	//Used to control if user has already logged-in.
	appData.currentUser = null;

	//determines wether the head menu should be showed.
	$scope.showMenu = true;
	$scope.showLogin = false;
	$scope.showRegister = false;

	$scope.dummyInputs = {};


	// refactor this into the variable
	$scope.getMotivationalQuote = function(){
		var motivationalQuotes = [
		"It does not matter how slowly you go as long as you do not stop. -Confucius",
		"If you can dream it, you can do it. -Walt Disney",
		"The octopus is like the internet, whereas we are stuck with individual CPU's - Wired (2013)",
		"The future is already here — it's just not very evenly distributed. - Gibson",
		"Être désespéré, mais avec élégance - Jacques Brel",
		"If you're doing something without passion you're going to kill it - John Conomos",
		"Strive to add function by deleting code. - John Bently",
		"Vigorous writing is concise. Omit needless words. -Strunk and White",
		"The cheapest, fastest, and most reliable components of a computer system are those that are not there. -Bell",
		"Endeavor to do more and more with less and less - John Bently",
		"If I had more time, I would have written you a shorter letter. -Pascal",
		"The Inventor’s Paradox: The more ambitious plan may have more chance of success. -Pólya",
		"Simplicity does not precede complexity, but follows it. -Perlis",
		"Less is more. -Browning",
		"Make everything as simple as possible, but no simpler. -Einstein",
		"Software should sometimes be seen as a soap bubble. -Perlis",
		"Seek beauty through simplicity. - John Bently"];

		var item = motivationalQuotes[Math.floor(Math.random()*motivationalQuotes.length)];

		return item;
	}

	$scope.quote = $scope.getMotivationalQuote();


	/**
	 * The copy text for the home page, might be dynamic in futre iterations
	 * @type {String}
	 */
	$scope.copy = "LET YOUR PUBLICATIONS DO THE NETWORKING"

	/**
	 * login routing function
	 */
	$scope.enableLogin = function() {
		$scope.showLogin 	= true;
		$scope.showRegister = false;
	};

	/**
	 * register routing function
	 */
	$scope.enableRegister = function() {
		$scope.showLogin 	= false;
		$scope.showRegister = true;
	};

    //regex control for all input fields to register
    $scope.regexControl = function(){
        
        function notifyRegisterError(message){
			 toast(message, 4000) // 4000 is the duration of the toast
			document.getElementById("register_error").innerHTML = message;
		}

		if((!($scope.RegEx_generalName.test($scope.userinput.firstName))) || ($scope.userinput.firstName == undefined)){
			//Error when trying to register with a "bad" first name.
			notifyRegisterError("First name not valid.");
			return false;
		}
		if((!($scope.RegEx_generalName.test($scope.userinput.lastName))) || ($scope.userinput.lastName == undefined)){
			//Error when trying to register with a "bad" last name.
			notifyRegisterError("Name not valid.");
			return false;
		}
		if((!($scope.RegEx_username.test($scope.userinput.username))) || ($scope.userinput.username == undefined)){
			//Error when trying to register with a "bad" username.
			notifyRegisterError("Username not valid.");
			return false;
		}
		if((!($scope.RegEx_emailAdress.test($scope.userinput.email))) || ($scope.userinput.email == undefined)){
			//Error when trying to register with a "bad" email.
			notifyRegisterError("Email is not valid.");
			return false;
		}
		if((!($scope.RegEx_generalName.test($scope.userinput.institution))) || ($scope.userinput.institution == undefined)){
			//Error when trying to register with a "bad" institution.
			notifyRegisterError("Institution is not valid.");
			return false;
		}
		if((!($scope.RegEx_generalName.test($scope.userinput.faculty))) || ($scope.userinput.faculty == undefined)){
			//Error when trying to register with a "bad" faculty.
			notifyRegisterError("Faculty is not valid.");
			return false;
		}
		if((!($scope.RegEx_generalName.test($scope.userinput.department))) || ($scope.userinput.department == undefined)){
			//Error when trying to register with a "bad" department.
			notifyRegisterError("Department is not valid.");
			return false;
		}
		if((!($scope.RegEx_generalName.test($scope.userinput.researchDomains))) || ($scope.userinput.researchDomains == undefined)){
			//Error when trying to register with "bad" research domains.
			notifyRegisterError("Research domains are not valid.");
			return false;
		}
		if((!($scope.RegEx_generalName.test($scope.userinput.researchGroup))) || ($scope.userinput.researchGroup == undefined)){
			//Error when trying to register with a "bad" research group.
			notifyRegisterError("Research group is not valid.");
			return false;
		}
		if((!($scope.RegEx_password.test($scope.userinput.password))) || ($scope.userinput.password == undefined)){
			//Error when trying to register with a "bad" password.
			notifyRegisterError("Password is not valid.");
			return false;
		}

		return true;
	};
    
	$scope.doRegister = function(){
		
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
				
				//When register worked,change route to #/login.
				$scope.enableLogin;
                toast("successfully registered please log in", 4000) // 4000 is the duration of the toast

			});

			registerRequest.error(function(data, status, headers, config) {

				if((status === 501) && (data === "Error: username taken!"))
				{
					//Error when trying to register with a username that is already token.
					notifyRegisterError("Username is already used please try an other.");
				}
					//Error when trying to register --> database error
				else{	notifyRegisterError("Database error, please try again later.");
			}
			});
		}
	}

	/**
	 * The actual login function
	 */
	$scope.doLogin = function() {

		//Create JSON to send in a HTTPrequest.
		var JSONToSend = {
				"username" : $scope.userinputLogin.username,
				"password" : $scope.userinputLogin.password
			};

		//Initialise HTTP request
		var loginRequest = $http.post(serverApi.concat('/login'),JSONToSend,config);
		
		
		loginRequest.success(function(data, status, headers, config) {

			//Save Authorization when login to do important tasks.
			appData.Authorization = 
                {headers: 
                    {'Content-type' : 'application/json',
                     'Authorization': data.Authorization}};
                
			//Prepare url to get userInformation for later use.
			var pad = serverApi.concat('/users/').concat($scope.userinputLogin.username);
			
			//Get userInformation request
			var loadUserInfoRequest = $http.get(pad,config);
			loadUserInfoRequest.success(function(data, status, headers, config) {
				//save userInformation in appData.
				appData.currentUser = data;

				// change route to #/dashboard
				$location.path('/dashboard');
			});
			loadUserInfoRequest.error(function(data, status, headers, config) {
			//Error when getting user info --> database error
				notifyLoginError("Database error, please try again later");
			});
		});
		
		loginRequest.error(function(data, status, headers, config) {
			
			if(status === 0) {
				//Server is not online
				notifyLoginError("SKRIBL is currently unavailable");
			} else {
				//Error user has given bad username or passwore
				notifyLoginError("Username or password is invalid, please try again");
			}
			
		});

		function notifyLoginError(message){
			 toast(message, 4000) // 4000 is the duration of the toast
			document.getElementById("login_error").innerHTML = message;
		}
	};

	/**
	 * Collection of the input values upon login
	 * @type {Object}
	 */
	$scope.userinputLogin = {};

	if(appData.currentUser === 1){
		//just registered
		document.getElementById("error").innerHTML = "You have successfully registered! Please log in";
	}

	/**
	 * go to element (scrolling) function uses anchorSmoothScroll
	 * @param  {[type]} eID the tag where we want the viewport to scroll to
	 */
	$scope.gotoElement = function (eID){
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash('middle');
 
      // call $anchorScroll()
      anchorSmoothScroll.scrollTo(eID);
    };

    	// temp fix for going to dashboard //FIXME
    /*(function developLogin() {
		$scope.userinputLogin.username = "brol";
		$scope.userinputLogin.password = "Brol123!";
		$scope.doLogin();
	})();*/
});


