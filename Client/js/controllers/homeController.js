/**
 * Initialisation of the homeController (an angular controller),
 * has an symbiotic relationship with home.html
 * 
 * @param  {object} $scope    the scope object of the controller
 * @param  {object} $location for switching between routes/views
 * @param  {object} $appData  our custom service for shared data
 * @param  {object} $anchorSmoothScroll  custom service for smooth scrolling functionality

 */
angular.module('skriblApp').controller('homeController', function($scope, $location, $appData, anchorSmoothScroll) {

	//Used to control if user has already logged-in.
	$appData.currentUser = null;

	//determines wether the head menu should be showed.
	$scope.showMenu = true;
	$scope.showLogin = false;
	$scope.showRegister = false;

	
		
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


	/**
	 * The copy text for the home page, might be dynamic in futre iterations
	 * @type {String}
	 */
	$scope.copy = "LET YOUR PUBLICATIONS DO THE NETWORKING"

	/**
	 * login routing function
	 */
	$scope.login = function() {
		$scope.showLogin 	= true;
		$scope.showRegister = false;
		// $location.path('/login');
	};

	/**
	 * register routing function
	 */
	$scope.register = function() {
		$scope.showLogin 	= false;
		$scope.showRegister = true;
		// $location.path('/register');
	};

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
});


