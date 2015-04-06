/**
 * Initialisation of the dashController (an angular controller),
 * has an symbiotic relationship with dashboard.html
 * 
 * @param  {object} $scope    	the scope object of the controller
 * @param  {object} $http 		abstraction for making http-related calls (ex: ajax)
 * @param  {object} $location 	for switching between routes/views
 * @param  {object} appData  	our custom service for shared data

 */
angular.module('skriblApp').controller('dashController', function($scope, $http, $location, appData, anchorSmoothScroll, userService, managePublications) {
    //Control if user has already loged in, or if he tries to go the dashboard without login in.
    if (!(appData.currentUser)) {
        $location.path('/home');
        return;
    }

    //Used to display loading screen when necessary
    $scope.busy = false;
    $scope.$watch('busy', function(newValue, oldValue) {
        $scope.loading();
    }, true);
    $scope.loading = function() {
            if ($scope.busy) {
                console.log("start loading screen");
            } else {
                console.log("stop loading screen");
            }
    }
//-------------------------------------------------GUI settings---------------------------------------------------------//

    //user
    $scope.ui_user_basic = false;
    $scope.ui_user_dataviz = false;
    $scope.ui_user_settings = false;

    $scope.ui_user_toggleBasic = function() {
        $scope.ui_user_basic = !$scope.ui_user_basic;
    }

    $scope.ui_user_toggleDataviz = function() {
        $scope.ui_user_dataviz = !$scope.ui_user_dataviz;
    }

    $scope.ui_user_toggleSettings = function() {
        $scope.ui_user_settings = !$scope.ui_user_settings;
    }

    //TODO MOET DIT ECHT HIER STAAN ? VERANDERD NERGENS MOMENTEEL. KAN DIT NIET IN CSS ?
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
        datasets: [{
            data: [1, 7, 15, 19, 31, 40]
        }, {
            data: [6, 12, 18, 24, 30, 36]
        }]
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
        onAnimationProgress: function() {},

        // Function - Will fire on animation completion.
        onAnimationComplete: function() {}
    }

    //-------------------------------------------------GUI settings-----------------------------------------------------//
   
    //-------------------------------------------------USER settings----------------------------------------------------//
    $scope.username = appData.currentUser.username;
    $scope.logout = function(){ userService.logout(); };
    $scope.deleteUser = function(){ userService.deleteUser($scope.username); };
    //-------------------------------------------------USER settings----------------------------------------------------//

    //------------------------------------------------MANAGE PUBLICATIONS-----------------------------------------------//
    $scope.ui_upload_active = function() {
        return managePublications.ui_upload_active;
    }
    $scope.ui_upload_initialStatus = function() {
        return managePublications.ui_delete_initialStatus;
    }
    $scope.ui_upload_waitingScraping = function() {
        return managePublications.ui_upload_waitingScraping;
    }
    $scope.ui_upload_waitingManual = function() {
        return managePublications.ui_upload_waitingManual;
    }
    $scope.ui_upload_succesManual = function() {
        return managePublications.ui_upload_succesManual;
    }
    $scope.ui_upload_succesScraping = function() {
        return managePublications.ui_upload_succesScraping;
    }
    $scope.ui_upload_success = function() {
        return managePublications.ui_upload_succesManual;
    }
    $scope.ui_upload_activate = function() {
        managePublications.ui_upload_activate;
    }
    $scope.ui_upload_deActivate = function() {
        managePublications.ui_upload_deActivate;
    }
    
    
    $scope.ui_modifyMeta_activate = function() {
        managePublications.ui_modifyMeta_activate;
    }
    $scope.ui_modifyMeta_deActivate = function() {
        managePublications.ui_modifyMeta_deActivate;
    }
    $scope.ui_modifyMeta_active = function() {
        return managePublications.ui_modifyMeta_active;
    }
    $scope.ui_modifyMeta_initialStatus = function() {
        return managePublications.ui_modifyMeta_initialStatus;
    }
    $scope.ui_modifyMeta_modifying = function(){
        return managePublications.ui_modifyMeta_modifying;
    }
    $scope.ui_modifyMeta_succes = function(){
        return managePublications.ui_modifyMeta_succes;
    }
    $scope.ui_modifyMeta = function(publicationID,){
        var meta = 
            {
               //Pieter hier de naam van u meta veldjes juist invullen 
            }
        managePublications.ui_modifyMeta(publicationID, meta);
    }
    
    
    $scope.ui_getMeta = function(publicationID){
        return managePublications.ui_getMeta(publicationID);
    }
    
    
    $scope.ui_delete_activate = function(){
        managePublications.ui_delete_activate;
    }
    $scope.ui_delete_deActivate = function(){
        managePublications.ui_delete_deActivate;   
    }
    $scope.ui_delete_active = function() {
       return managePublications.ui_delete_active;
    }
    $scope.ui_delete_initialStatus = function() {
        return managePublications.ui_delete_initialStatus;
    }
    $scope.ui_delete_deleting = function(){
        return managePublications.ui_delete_deleting;
    }
    $scope.ui_delete_succes = function(){
        return managePublications.ui_delete_succes;
    }
    $scope.ui_deletePublication = function(publicationID){
        managePublications.ui_deletePublication(publicationID);
    }
   //-------------------------------------------------------------------------------------------------------------------// 
   
    
    
    
    
    
    
    
    
    
    
    
    
    var currentPublicationID = undefined

    $scope.uploadPublication = function(file, url, authorization, withMetadata) {

        if (withMetadata) {
            ui_upload_status = ui_UPLOAD_STATUS.WAITING_MANUAL;
        } else {
            ui_upload_status = ui_UPLOAD_STATUS.WAITING_SCRAPING;
        }

        var fd = new FormData();
        fd.append('inputFile', file); //link the file to the name 'inputFile'
        $http.put(url, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    'Authorization': authorization
                }
            })
            .success(function(data, status, headers, config) {
                currentPublicationID = data.id.substring(1);
                if (withMetadata) {
                    //when publication is added to database 
                    //metadata of publication needs to be send/updated (currently empty)
                    var whenFinished = function(succes) {
                        if (succes) {
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
            .error(function() {
                ui_upload_status = ui_UPLOAD_STATUS.INITIAL;
                toast("Failed to upload file, try again later", 4000)
            });
    }

    //preparation for the uploadPublication function
    $scope.uploadFile = function(withMetadata) {
        // $scope.busy = true;
        var file = $scope.myFile;
        var url = serverApi.concat('/publications');
        var authorization = appData.Authorization;
        $scope.uploadPublication(file, url, authorization, withMetadata);
    };

    //updates the currently available metadata
    $scope.uploadMetaData = function(publicationID, whenFinished) {
        // var uploadingPaper = false;
        // if($scope.busy){uploadingPaper = true;}
        // else {$scope.busy = true;};
        var url = serverApi.concat('/publications/').concat(publicationID);
        var metaData = {
            'title': $scope.userinput.title, //get all the fields
            'authors': [{
                'firstName': $scope.userinput.authorsFirst,
                'lastName': $scope.userinput.authorsLast
            }],
            'journal': $scope.userinput.journalName,
            'volume': $scope.userinput.journalVolume,
            'number': $scope.userinput.journalNumber,
            'year': $scope.userinput.year,
            'publisher': $scope.userinput.publisher,
            'abstract': undefined,
            'citations': undefined,
            'article_url': undefined,
            'keywords': $scope.userinput.keywords.concat('+').concat($scope.userinput.keywordSecond).concat('+').concat($scope.userinput.keywordThird)
        };

        var metaDataRequest = $http.post(url, metaData, config);
        metaDataRequest.success(function(data, status, headers, config) {
            whenFinished(true);
        });
        metaDataRequest.error(function(data, status, headers, config) {
            whenFinished(false);
        });
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    //------------------------------------------------MANAGE PUBLICATIONS-----------------------------------------------//
    
    //------------------------------------------------LIBARARY WIP-------------------------------------------------//

   $scope.currentViewerPublicationID = undefined
    currentViewerPublicationIDX = undefined 
    $scope.ui_displayPublication = true;

    $scope.loadPublicationInViewer = function(newID){
        $scope.currentViewerPublicationID = newID;
        currentViewerPublicationIDX = arrayObjectIndexOf($scope.ui_currentPublications,newID, 'id');
        $scope.gotoElement("id_viewer");
        $scope.ui_displayPublication = true;        
    }

    $scope.publicationViewerEnabled = function(){
        return $scope.currentViewerPublicationID != undefined;
    }

    $scope.unloadPublicationInViewer = function(){
        $scope.currentViewerPublicationID = undefined
        currentViewerPublicationIDX = undefined 
        $scope.gotoElement("id_top");
    }

    $scope.ui_toggleDisplayPublication = function(){
        $scope.ui_displayPublication = !$scope.ui_displayPublication;
    }

    $scope.getCurrentViewerPublication = function(){
        console.log($scope.ui_currentPublications[currentViewerPublicationIDX].title)
        return $scope.ui_currentPublications[currentViewerPublicationIDX];
    }

    function arrayObjectIndexOf(myArray, searchTerm, property) {
        for(var idx = 0, alength = myArray.length; idx < alength; idx++) {
            if (myArray[idx][property] === searchTerm) return idx;
        }
    return -1; //errror
    }



    $scope.ui_publications_library = true;

    $scope.ui_publications_toggleLibrary = function(){
    $scope.ui_publications_library = !$scope.ui_publications_library;
    }

    $scope.ui_publications_loading = false;

    $scope.ui_currentPublications = [
    {title: 'title 1', id: 1, journalName: 'journalName', journalNumber: 'journalNumber', journalVolume:                       'journalVolume', year:'year', publisher:'publisher', keywords:['keyword 1', 'keyword 2', 'keyword 3'], isnew:true},
    {title: 'title 2', id: 2, journalName: 'journalName', journalNumber: 'journalNumber', journalVolume: 'journalVolume',     year:'year', publisher:'publisher', keywords:['keyword 1', 'keyword 2', 'keyword 3'], isnew:true},
    {title: 'title 3', id: 3, journalName: 'journalName', journalNumber: 'journalNumber', journalVolume: 'journalVolume',     year:'year', publisher:'publisher', keywords:['keyword 1', 'keyword 2', 'keyword 3']},
    {title: 'title 4', id: 4, journalName: 'journalName', journalNumber: 'journalNumber', journalVolume: 'journalVolume',     year:'year', publisher:'publisher', keywords:['keyword 1', 'keyword 2', 'keyword 3']},
    {title: 'title 5', id: 5, journalName: 'journalName', journalNumber: 'journalNumber', journalVolume: 'journalVolume',     year:'year', publisher:'publisher', keywords:['keyword 1', 'keyword 2', 'keyword 3']},
    {title: 'title 6', id: 6, journalName: 'journalName', journalNumber: 'journalNumber', journalVolume: 'journalVolume',     year:'year', publisher:'publisher', keywords:['keyword 1', 'keyword 2', 'keyword 3'], isnew:true},
    {title: 'title 7', id: 7, journalName: 'journalName', journalNumber: 'journalNumber', journalVolume: 'journalVolume',     year:'year', publisher:'publisher', keywords:['keyword 1', 'keyword 2', 'keyword 3']},
    {title: 'title 8', id: 8, journalName: 'journalName', journalNumber: 'journalNumber', journalVolume: 'journalVolume',     year:'year', publisher:'publisher', keywords:['keyword 1', 'keyword 2', 'keyword 3'], isnew:true}];


    
        //------------------------------------------------MANAGE PUBLICATIONS-------------------------------------------------//
        //

    $scope.searchResult;
    function replaceSpace(toReplace){
        return toReplace.replace(/ /g, "+");
    }
    $scope.searchPublication = function(keyword, external) {
        $scope.body = true;

        var url;
        if (external) {
            url = serverApi.concat('publications?q=').concat(keyword).concat('&external=true');
        } else {
            url = serverApi.concat('publications?q=').concat(keyword);
        }

        var requestSearchPublication = $http.get(url);

        requestSearchPublication.success(function(data, status, headers, config) {
            $scope.searchResult = data;
            $scope.busy = false;
        });
        requestSearchPublication.error(function(data, status, headers, config) {
            $scope.busy = false;
            toast("Failed to search publication, try again later.", 4000);
        });
    }

    $scope.searchPublicationKeywords = function(searchData) {
        $scope.busy = true;

        var url = serverApi.concat('/publications');
        var requestSearchPublication = $http.get(url, searchData);

        requestSearchPublication.success(function(data, status, headers, config) {
            $scope.searchResult = data;
            $scope.busy = false;
        });
        requestSearchPublication.error(function(data, status, headers, config) {
            $scope.busy = false;
            toast("Failed to search publication, try again later.", 4000);
        });
    }



    //------------------------------------------------INTERACTIVE GRAPH-------------------------------------------------//

    $scope.interactiveGraph = false;

    $scope.ui_interactive_graph_enable = function() {
        $scope.interactiveGraph = true;
        $scope.gotoElement("id_interactive_graph")
    }

    $scope.ui_interactive_graph_disable = function() {
        $scope.gotoElement("id_top")
        $scope.interactiveGraph = false;
    }



    $scope.gotoElement = function(eID) {
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash('middle');

        // call $anchorScroll()
        anchorSmoothScroll.scrollTo(eID);
    };


});