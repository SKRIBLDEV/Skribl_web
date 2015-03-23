
/**
 * Initialisation of the dashController (an angular controller),
 * has an symbiotic relationship with dashboard.html
 * 
 * @param  {object} $scope    	the scope object of the controller
 * @param  {object} $http 		abstraction for making http-related calls (ex: ajax)
 * @param  {object} $location 	for switching between routes/views
 * @param  {object} $appData  	our custom service for shared data

 */
 angular.module('skriblApp').controller('dashController', function($scope, $http, $location, $appData, $timeout) {

	//Control if user has already loged in, or if he tries to go the dashboard without login in.
	if(!($appData.currentUser))
	{
		$location.path('/home');
		return;
	}

	//GUI settings
	
	//user
	$scope.ui_user_basic = false;
	$scope.ui_user_dataviz = false;
	$scope.ui_user_settings = false;

	$scope.ui_user_toggleBasic = function(){
		$scope.ui_user_basic = ! $scope.ui_user_basic;
	}

	$scope.ui_user_toggleDataviz = function(){
		$scope.ui_user_dataviz = !$scope.ui_user_dataviz;
	}

	$scope.ui_user_toggleSettings = function(){
		$scope.ui_user_settings = !$scope.ui_user_settings;
	}

	//upload

	ui_UPLOAD_STATUS = {
		UNACTIVE : -1,
		INITIAL  : 0,
		WAITING_SCRAPING : 1,
		WAITING_MANUAL : 2,
		SUCCES_SCRAPING : 4,
		SUCCES_MANUAL : 5
	}

	ui_upload_status = ui_UPLOAD_STATUS.INITIAL;

	$scope.ui_upload_active = function(){
		return ui_upload_status != -1;
	}

	$scope.ui_upload_initialStatus = function(){
		return ui_upload_status == ui_UPLOAD_STATUS.INITIAL;
	}

	$scope.ui_upload_waitingScraping = function(){
		return ui_upload_status == ui_UPLOAD_STATUS.WAITING_SCRAPING;
	}

	$scope.ui_upload_waitingManual = function(){
		return ui_upload_status == ui_UPLOAD_STATUS.WAITING_MANUAL;
	}

	$scope.ui_upload_succesManual = function(){
		return ui_upload_status == ui_UPLOAD_STATUS.SUCCES_MANUAL;
	}

	$scope.ui_upload_succesScraping = function(){
		return ui_upload_status == ui_UPLOAD_STATUS.SUCCES_SCRAPING;
	}

	$scope.ui_upload_activate = function(){
		ui_upload_status = ui_UPLOAD_STATUS.INITIAL;
	}

	$scope.ui_upload_deActivate = function(){
		ui_upload_status = ui_UPLOAD_STATUS.UNACTIVE;
	}


	//@Douglas : upload should be here
	$scope.upload = function(manual){
		if (manual){
			ui_upload_status = ui_UPLOAD_STATUS.WAITING_MANUAL;
			
			//timeout is only to test the async mode, delete this for real functionality
			$timeout(function() {
				var succes = true;
				if (succes){
					ui_upload_status = ui_UPLOAD_STATUS.SUCCES_MANUAL;
					toast("succesfully uploaded publication with manual meta-data", 4000) // 4000 is the duration of the toast
				} else {
				// fill in error content 
				ui_upload_status = ui_UPLOAD_STATUS.INITIAL;
					toast("failed to upload publication with meta-data", 4000) // 4000 is the duration of the toast
					document.getElementById("upload_error").innerHTML = "ERROR MESSAGE";
				}
			}, 3000);
		} else {
			ui_upload_status = ui_UPLOAD_STATUS.WAITING_SCRAPING;
			
			$timeout(function() {
				var succes = true;
				if (succes){
					ui_upload_status = ui_UPLOAD_STATUS.SUCCES_SCRAPING;
				toast("succesfully uploaded publication with scraping", 4000) // 4000 is the duration of the toast
			} else {
				ui_upload_status = ui_UPLOAD_STATUS.INITIAL;
				toast("failed to upload publication with scraping", 4000) // 4000 is the duration of the toast
				document.getElementById("upload_error").innerHTML = "ERROR MESSAGE";
			}
		}, 3000);
		}
	}

	// Dataviz
	$scope.someOptions = {
		segementStrokeWidth: 40,
        segmentStrokeColor: 'pink' //make global angular params
    };

    $scope.someData = {
    	labels: [
    	'Apr', 
    	'May', 
    	'Jun',
    	'jul',
    	'aug',
    	'sept'
    	],
    	datasets: [
    	{
    		data: [1, 7, 15, 19, 31, 40]
    	},
    	{
    		data: [6, 12, 18, 24, 30, 36]
    	}
    	]
    };

	/**
	 * duplication of the username to be used in Dashboard.html
	 * @type {String}
	 */
	 $scope.username = $appData.currentUser.username;

	 // The logout function
	 $scope.logout = function() {
	 	$location.path('/home');
	 	$appData.currentUser = null;
	 	toast("succesfully logged out", 4000) // 4000 is the duration of the toast
	 };

	// TODO DELETE USER WEKRT NIET OP SERVER
	//The delete function
	$scope.deleteUser = function(){
		var path = serverApi.concat('/users/').concat($scope.username);
		var config = {headers:  {
			'Authorization': $appData.Authorization
		}
	};
	var deleteRequest = $http.delete(path,config);

	deleteRequest.success(function(data, status, headers, config) {
		$scope.logout();
		toast("succesfully deleted account", 4000) // 4000 is the duration of the toast

	});
		/*deleteRequest.error(function(data, status, headers, config) {
			//Error while deleting user
			document.getElementById("error").innerHTML = "Database error, please try again later.";
		});*/
};

	//---chart stuff
	//
	Chart.defaults.global = {
	  // Boolean - Whether to animate the chart
	  animation: true,

    // Number - Number of animation steps
    animationSteps: 300,

    // Boolean - If we should show the scale at all
    showScale: true,

    // Boolean - If we want to override with a hard coded scale
    scaleOverride: false,

    // ** Required if scaleOverride is true **
    // Number - The number of steps in a hard coded scale
    scaleSteps: null,
    // Number - The value jump in the hard coded scale
    scaleStepWidth: null,
    // Number - The scale starting value
    scaleStartValue: null,

    // String - Colour of the scale line
    scaleLineColor: "rgba(0,0,0,.1)",

    // Number - Pixel width of the scale line
    scaleLineWidth: 1,

    // Boolean - Whether to show labels on the scale
    scaleShowLabels: true,

    // Interpolated JS string - can access value
    scaleLabel: "<%=value%>",

    // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
    scaleIntegersOnly: true,

    // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
    scaleBeginAtZero: false,

    // String - Scale label font declaration for the scale label
    scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

    // Number - Scale label font size in pixels
    scaleFontSize: 12,

    // String - Scale label font weight style
    scaleFontStyle: "normal",

    // String - Scale label font colour
    scaleFontColor: "#3149A1",

    // Boolean - whether or not the chart should be responsive and resize when the browser does.
    responsive: true,

    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: true,

    // Boolean - Determines whether to draw tooltips on the canvas or not
    showTooltips: true,

    // Function - Determines whether to execute the customTooltips function instead of drawing the built in tooltips (See [Advanced - External Tooltips](#advanced-usage-custom-tooltips))
    customTooltips: false,

    // Array - Array of string names to attach tooltip events
    tooltipEvents: ["mousemove", "touchstart", "touchmove"],

    // String - Tooltip background colour
    tooltipFillColor: "#5572D4", //skribl-light

    // String - Tooltip label font declaration for the scale label
    tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

    // Number - Tooltip label font size in pixels
    tooltipFontSize: 14,

    // String - Tooltip font weight style
    tooltipFontStyle: "normal",

    // String - Tooltip label font colour
    tooltipFontColor: "#light-grey",

    // String - Tooltip title font declaration for the scale label
    tooltipTitleFontFamily: "'Roboto', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

    // Number - Tooltip title font size in pixels
    tooltipTitleFontSize: 14,

    // String - Tooltip title font weight style
    tooltipTitleFontStyle: "bold",

    // String - Tooltip title font colour
    tooltipTitleFontColor: "white",

    // Number - pixel width of padding around tooltip text
    tooltipYPadding: 6,

    // Number - pixel width of padding around tooltip text
    tooltipXPadding: 6,

    // Number - Size of the caret on the tooltip
    tooltipCaretSize: 8,

    // Number - Pixel radius of the tooltip border
    tooltipCornerRadius: 6,

    // Number - Pixel offset from point x to tooltip edge
    tooltipXOffset: 10,

    // String - Template string for single tooltips
    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",

    // String - Template string for multiple tooltips
    multiTooltipTemplate: "<%= value %>",

    // Function - Will fire on animation progression.
    onAnimationProgress: function(){},

    // Function - Will fire on animation completion.
    onAnimationComplete: function(){}
}

});
