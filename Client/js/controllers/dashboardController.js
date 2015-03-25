
/**
 * Initialisation of the dashController (an angular controller),
 * has an symbiotic relationship with dashboard.html
 * 
 * @param  {object} $scope    	the scope object of the controller
 * @param  {object} $http 		abstraction for making http-related calls (ex: ajax)
 * @param  {object} $location 	for switching between routes/views
 * @param  {object} appData  	our custom service for shared data

 */
 angular.module('skriblApp').controller('dashController', function($scope, $http, $location, appData, anchorSmoothScroll) {

	//Control if user has already loged in, or if he tries to go the dashboard without login in.
	if(!(appData.currentUser))
	{
		$location.path('/home');
		return;
	}

    //Used to display loading screen when necessary
    $scope.busy = false;
    $scope.$watch('busy',function(newValue, oldValue){$scope.loading();},true);
    $scope.loading = function(){
        if($scope.busy){console.log("start loading screen");}
        else{console.log("stop loading screen");}
    }
//-------------------------------------------------GUI settings-----------------------------------------------------------//
	
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
    
//-------------------------------------------------GUI settings-----------------------------------------------------------//
    /**
	 * duplication of the username to be used in Dashboard.html
	 * @type {String}
	 */
	 $scope.username = appData.currentUser.username;

	 // The logout function
	 $scope.logout = function() {
	 	$location.path('/home');
	 	appData.currentUser = null;
	 	toast("succesfully logged out", 4000) // 4000 is the duration of the toast
	 };

	//The delete function
	$scope.deleteUser = function(){
		var path = serverApi.concat('/users/').concat($scope.username);
		var config = {headers:  {
			'Authorization': appData.Authorization
		}
	};
	var deleteRequest = $http.delete(path,config);

	deleteRequest.success(function(data, status, headers, config) {
		$scope.logout();
		toast("succesfully deleted account", 4000) // 4000 is the duration of the toast

	});
    deleteRequest.error(function(data, status, headers, config) {
			//Error while deleting user
        toast("Database error, please try again later.", 4000) // 4000 is the duration of the toast
    });
    };
     
    //------------------------------------------------MANAGE PUBLICATIONS-------------------------------------------------//

    //upload
    //upload :: gui
    ui_UPLOAD_STATUS = {
        UNACTIVE : -1,
        INITIAL  : 0,
        WAITING_SCRAPING : 1,
        WAITING_MANUAL : 2,
        SUCCES_SCRAPING : 4,
        SUCCES_MANUAL : 5
    }

    ui_upload_status = ui_UPLOAD_STATUS.INITIAL;
    currentPublicationID = undefined

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

    $scope.ui_upload_success = function(){
        return ($scope.ui_upload_succesScraping() || $scope.ui_upload_succesManual());
    }

    $scope.ui_upload_activate = function(){
        ui_upload_status = ui_UPLOAD_STATUS.INITIAL;
    }

    $scope.ui_upload_deActivate = function(){
        ui_upload_status = ui_UPLOAD_STATUS.UNACTIVE;
    }

    $scope.uploadPublication = function(file, url, authorization, withMetadata){

        if (withMetadata){
            ui_upload_status = ui_UPLOAD_STATUS.WAITING_MANUAL;
        } else {
            ui_upload_status = ui_UPLOAD_STATUS.WAITING_SCRAPING;
        }

        var fd = new FormData();
        fd.append('inputFile', file); //link the file to the name 'inputFile'
        $http.put(url, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined,
                     'Authorization': authorization}
        })
        .success(function(data, status, headers, config){
            currentPublicationID = data.id.substring(1);
            if (withMetadata){
                //when publication is added to database 
                //metadata of publication needs to be send/updated (currently empty)
                var whenFinished = function(succes){
                    if (succes){
                        ui_upload_status = ui_UPLOAD_STATUS.SUCCES_MANUAL;
                        toast("succesfully uploaded publication with Manual meta data", 4000);
                    } else {
                        ui_upload_status = ui_UPLOAD_STATUS.INITIAL;
                        toast("Failed to upload file / metadata, try again later", 4000);
                    }
                }
                $scope.uploadMetaData(currentPublicationID);
            } else {
                ui_upload_status = ui_UPLOAD_STATUS.SUCCES_SCRAPING;
                toast("succesfully uploaded publication with scraping", 4000);
            }
        })
        .error(function(){
            ui_upload_status = ui_UPLOAD_STATUS.INITIAL;
            toast("Failed to upload file, try again later", 4000) 
        });
    }
    
    //preparation for the uploadPublication function
    $scope.uploadFile = function(withMetadata){
        // $scope.busy = true;
        var file = $scope.myFile;
        var url = serverApi.concat('/publications');
        var authorization = appData.Authorization;
        $scope.uploadPublication(file, url, authorization, withMetadata);
    };
    
    //updates the currently available metadata
    $scope.uploadMetaData = function(publicationID, whenFinished){
        // var uploadingPaper = false;
        // if($scope.busy){uploadingPaper = true;}
        // else {$scope.busy = true;};
        var url = serverApi.concat('/publications/').concat(publicationID);
        var config = {headers:  {
		        'Authorization': appData.Authorization
		}};
        var metaData = {'title': $scope.userinput.title, //get all the fields
                        'authors': [{'firstName': $scope.userinput.authorsFirst, 'lastName': $scope.userinput.authorsLast}],
                        'journal': $scope.userinput.journalName, 
                        'volume': $scope.userinput.journalVolume,
                        'number': $scope.userinput.journalNumber,
                        'year': $scope.userinput.year,
                        'publisher': $scope.userinput.publisher,
                        'abstract': undefined,
                        'citations': undefined,
                        'article_url': undefined,
                        'keywords': $scope.userinput.keywords.concat('+').concat($scope.userinput.keywordSecond).concat('+').concat($scope.userinput.keywordThird)};
        
        var metaDataRequest = $http.post(url,metaData,config);
		metaDataRequest.success(function(data, status, headers, config) {
            whenFinished(true);
		});
		metaDataRequest.error(function(data, status, headers, config) {
            whenFinished(false);
		});
    }

    //delete a publication of the db
    $scope.deletePublication = function(publicationID){
        $scope.busy = true;
        var url = serverApi.concat('/publications/').concat(publicationID);
        var config = {headers:  {
		        'Authorization': appData.Authorization
		    }};
        var deletePublicationRequest = $http.delete(url,config);
        
        deletePublicationRequest.success(function(data, status, headers, config) {
            $scope.busy = false;
            toast("Publication deleted.", 4000);
            
		});
		deletePublicationRequest.error(function(data, status, headers, config) {
            $scope.busy = false;
            toast("Failed to delete publication, try again later.", 4000);
		});
    }
    
    //function to get the meta data of a specific publication.
    $scope.getMetaData = function(publicationID){
        $scope.busy = true;
        var url = serverApi.concat('/publications/').concat(publicationID);
        var getMetaDataRequest = $http.get(url, config);
        
        getMetaDataRequest.success(function(data, status, headers, config) {
        $scope.userinput.title = data.title;
        $scope.userinput.journalName = data.journal;
        $scope.userinput.journalNumber = data.number;
        $scope.userinput.journalVolume = data.volume;
        $scope.userinput.year = data.year;
        $scope.userinput.publisher = data.publisher;
        $scope.userinput.keywords = data.keywords;
        console.log(data);
        
        $scope.busy = false;
		});
		getMetaDataRequest.error(function(data, status, headers, config) {
            $scope.busy = false;
            toast("Failed to get information about publication, try again later.", 4000);
        });
    }
    
    //function to download a file
    $scope.deleteCurrentFile = function(){
        currentFile = null;
    }

    $scope.currentFile;


    $scope.getFile = function(publicationID){
        $scope.busy = true;
        var url = serverApi.concat('/publications/').concat(publicationID).concat('?download=true');
        var getFileRequest = $http.get(url, config);
        
        getFileRequest.success(function(data, status, headers, config) {
            $scope.busy = false;
            currentFile = data;
		});
		getFileRequest.error(function(data, status, headers, config) {
            $scope.busy = false;
            toast("Failed to download file, please try again later.", 4000);
        });
    }
    
    //function to get the publications of a certain user.
    $scope.getUserPublications = function(libraryName){
        $scope.busy = true;
        var url = serverApi.concat('/user/').concat($scope.username).concat('/library/').concat(libraryName);
        var config = {headers:  {
		        'Authorization': appData.Authorization
		    }};
        var getUserPublicationsRequest = $http.get(url,config);
        getUserPublicationsRequest.success(function(data, status, headers, config) {
            appData.currentUser.publications = data;
            console.log(appData.currentUser.publications);
            $scope.busy = false;
		});
		getUserPublicationsRequest.error(function(data, status, headers, config) {
            $scope.busy = false;
            toast("Failed to get publications, try again later.", 4000);
        });
    }
    
    //array that will be filled with currentPublication titles on a assynchronous way before being pushed to appData.currentUser.publicationsTitles.
    $scope.publicationTitles = [];
    //function that will control if the assynchronous filling of $scope.publicationTitles is finished.
    $scope.$watch('publicationTitles',
                  function(newValue, oldValue) {
                    if(newValue == oldValue){return;};
                    if($scope.publicationTitles.length == appData.currentUser.publications.length)
                    {appData.currentUser.publicationsTitles = $scope.publicationTitles;
                    $scope.busy = false;}},
                  true);
    
    $scope.getCurrentPublicationTitles = function(){
        $scope.busy = true;
        var publications = appData.currentUser.publications;
        for (i = 0; i < publications.length; i++) { 
            var publicationID = publications[i].substring(1);
            var url = serverApi.concat('/publications/').concat(publicationID);
            var getMetaDataRequest = $http.get(url, config);
            getMetaDataRequest.success(function(data, status, headers, config) {
                $scope.publicationTitles.push(data.title);});
            getMetaDataRequest.error(function(data, status, headers, config) {
			toast("Failed to get titles of publications, try again later.", 4000)
            });
        };
    }


    //------------------------------------------------LIBARARY WIP-------------------------------------------------//
    
    $scope.currentID = undefined

    $scope.setCurrentId = function(newID){
        $scope.currentID = newID;
        console.log($scope.currentID);
    }
    
    $scope.ui_publications_library = true;

    $scope.ui_publications_toggleLibrary = function(){
        $scope.ui_publications_library = !$scope.ui_publications_library;
    }

    $scope.ui_publications_loading = false;

    $scope.ui_currentPublications = 
    [ {title: 'titel 1', author: 'author1', id: '1', isnew:true},
    {title: 'titel 2', author: 'author 2', id: '2'},
    {title: 'titel 3', author: 'author 3', id: '3'},
    {title: 'titel 4', author: 'author 4', id: '4', isnew:true},
    {title: 'titel 5', author: 'author 5', id: '5'},
    {title: 'titel 6', author: 'author 6', id: '6'}];

    //------------------------------------------------MANAGE PUBLICATIONS-------------------------------------------------//
    //
    
     // * go to element (scrolling) function uses anchorSmoothScroll
     // * @param  {[type]} eID the tag where we want the viewport to scroll to
     // *
     // 
     
     //------------------------------------------------INTERACTIVE GRAPH-------------------------------------------------//
    
     $scope.interactiveGraph = false;

    $scope.ui_interactive_graph_enable = function(){
        $scope.interactiveGraph = true;
        $scope.gotoElement("id_interactive_graph")
    }

    $scope.ui_interactive_graph_disable = function(){
        $scope.gotoElement("id_top")
        $scope.interactiveGraph = false;
    }



    $scope.gotoElement = function (eID){
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash('middle');
 
      // call $anchorScroll()
      anchorSmoothScroll.scrollTo(eID);
    };

    
});
