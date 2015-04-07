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
    
    //-------------------------------------------------Manage Lib----------------------------------------------------// 
    $scope.ui_publications_corrupt =  function(){return managePublications.ui_publications_corrupt();};
    $scope.ui_publications_change_library =  function(name){managePublications.ui_publications_change_library(name);};
    $scope.ui_publications_addToLibrary =  function(name, publicationID){managePublications.publications_addToLibrary(name, publicationID);};
    $scope.ui_publications_deleteFromLibrary =  function(name, publicationID) {managePublications.ui_publications_deleteFromLibrary(name, publicationID);};
    $scope.ui_publications_currentLibName =  function(){return managePublications.ui_publications_currentLibName();};
    $scope.ui_publications_currentLib =  function(){return managePublications.ui_publications_currentLib();};
    $scope.ui_publications_librariesNames =  function(){return managePublications.ui_publications_librariesNames();};
    $scope.ui_publications_addLibrary =  function(name){managePublications.ui_publications_addLibrary(name);};
    $scope.ui_publications_deleteLibrary =  function(name){managePublications.ui_publications_deleteLibrary(name);};
    $scope.ui_publications_getUserLibraries = function(){managePublications.ui_publications_getUserLibraries();};
    //-------------------------------------------------Manage Lib----------------------------------------------------// 

    //-------------------------------------------------Download File----------------------------------------------------// 
    $scope.ui_downloadFile = function(publicationID){managePublications.ui_downloadFile(publicationID);};
    $scope.ui_downloadFile_getFile = function(){return managePublications.ui_downloadFile_getFile();};
    $scope.ui_downloadFile_deleteFile = function(){managePublications.ui_downloadFile_deleteFile();};
    $scope.ui_downloadFile_downloading = function(){return managePublications.ui_downloadFile_downloading();};
    $scope.ui_downloadFile_succes = function(){ return managePublications.ui_downloadFile_succes();};
    $scope.ui_downloadFile_reset = function(){managePublications.ui_downloadFile_reset();};
    //-------------------------------------------------Download File----------------------------------------------------// 
    
    //-------------------------------------------------Meta Data----------------------------------------------------// 
    $scope.ui_getMeta_metaData = function(){return managePublications.ui_getMeta_metaData;};
    $scope.ui_getMeta = function(publicationID){managePublications.ui_getMeta(publicationID);};
    $scope.ui_getMeta_initialStatus = function() {return managePublications.ui_getMeta_initialStatus();}
    $scope.ui_getMeta_getting = function(){return managePublications.ui_getMeta_getting();}
    $scope.ui_getMeta_succes = function(){return managePublications.ui_getMeta_succes();}
    $scope.ui_getMeta_reset = function(){managePublications.ui_getMeta_reset;};

    $scope.ui_modifyMeta_activate = function() {managePublications.ui_modifyMeta_activate();}
    $scope.ui_modifyMeta_deActivate = function() {managePublications.ui_modifyMeta_deActivate();}
    $scope.ui_modifyMeta_active = function() {return managePublications.ui_modifyMeta_active();}
    $scope.ui_modifyMeta_initialStatus = function() {return managePublications.ui_modifyMeta_initialStatus();}
    $scope.ui_modifyMeta_modifying = function(){return managePublications.ui_modifyMeta_modifying();}
    $scope.ui_modifyMeta_succes = function(){return managePublications.ui_modifyMeta_succes();}
    $scope.ui_modifyMeta = function(publicationID){
        var meta = 
            {
                //Pieter hier de naam van u meta veldjes juist invullen 
            }
    managePublications.modifyMeta(publicationID, meta);}
    
    $scope.ui_scrape_scrapeData = function(){return managePublications.ui_scrape_scrapeData();};
    $scope.ui_scrape = function(publicationID){managePublications.ui_scrape(publicationID);};
    $scope.ui_scraping_initialStatus = function() {return managePublications.ui_scraping_initialStatus();};
    $scope.ui_scraping_getting = function(){return managePublications.ui_scraping_getting();};
    $scope.ui_scraping_succes = function(){ return managePublications.ui_scraping_succes();};
    $scope.ui_scraping_reset = function(){managePublications.ui_scraping_reset();};
    //-------------------------------------------------Meta Data--------------------------------------------------------// 
    
    //-------------------------------------------------Search-----------------------------------------------------------//
    $scope.ui_search_activate = function() {managePublications.ui_search_activate();}
    $scope.ui_search_deActivate = function() {managePublications.ui_search_deActivate();}
    $scope.ui_search_active = function() {return managePublications.ui_search_active();}
    $scope.ui_search_initialStatus = function() {return managePublications.ui_search_initialStatus();}
    $scope.ui_search_searching = function(){return managePublications.ui_search_searching();}
    $scope.ui_search_succes = function(){return managePublications.ui_search_succes;}
    $scope.ui_search = function(keyword, external){managePublications.ui_search(keyword,external);}
    $scope.ui_searchMultiple = function(data){managePublications.ui_searchMultiple(data);};
    $scope.ui_searchResult = function(){return managePublications.ui_searchResult();};
    //-------------------------------------------------Search-----------------------------------------------------------//
    
    //------------------------------------------------Upload-----------------------------------------------//
    $scope.ui_upload_active = function() {return managePublications.ui_upload_active();};
    $scope.ui_upload_initialStatus = function() {return managePublications.ui_upload_initialStatus();};
    $scope.ui_upload_waitingScraping = function() {return managePublications.ui_upload_waitingScraping();};
    $scope.ui_upload_succesScraping = function() {return managePublications.ui_upload_succesScraping();};
    $scope.ui_upload_activate = function() {managePublications.ui_upload_activate();};
    $scope.ui_upload_deActivate = function() {managePublications.ui_upload_deActivate();};
    $scope.ui_upload_uploading = function(){return managePublications.ui_upload_uploading();}
    $scope.ui_upload_waitingEditing = function() {return managePublications.ui_upload_waitingEditing();}
    $scope.ui_upload_succesEditing = function() {return managePublications.ui_upload_succesEditing();}
    $scope.ui_upload_succesUploading = function() {return managePublications.ui_upload_succesUploading();}
    $scope.ui_upload = function(file, title, type){managePublications.ui_upload(file, title, type);};
    $scope.ui_upload_set_exists = function() {return managePublications.ui_upload_set_exists();}
    $scope.ui_upload_set_succes_editing = function() {return managePublications.ui_upload_set_succes_editing();}
    $scope.ui_upload_set_succes_uploading = function() {return managePublications.ui_upload_succesUploading();}
    //------------------------------------------------Upload-----------------------------------------------//
    
    
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