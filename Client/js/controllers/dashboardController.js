/**
 * Initialisation of the dashController (an angular controller),
 * has an symbiotic relationship with dashboard.html
 * 
 * @param  {object} $scope    	the scope object of the controller
 * @param  {object} $http 		abstraction for making http-related calls (ex: ajax)
 * @param  {object} $location 	for switching between routes/views
 * @param  {object} appData  	our custom service for shared data

 */
webapp.controller('dashController', function($scope, $http, $location, appData, anchorSmoothScroll, userService, managePublications, chartService) {
    
    //----------------------------------------------------INIT----------------------------------------------------------//
    //Control if user has already loged in, or if he tries to go the dashboard without login in.
    if (!(appData.currentUser)) {
        $location.path('/home');
        return;
    }

    (function init(){
        managePublications.getUserPublications('Uploaded', false);
        managePublications.getUserLibraries();
    })();

    

    $scope.ddSelectSelected = {}; // Must be an object


    
    //----------------------------------------------------INIT----------------------------------------------------------//
    
    //------------------------------------------------GUI settings------------------------------------------------------//
    $scope.userService = userService;
    //------------------------------------------------GUI settings------------------------------------------------------//
    
    //-----------------------------------------------dataviz settings---------------------------------------------------//
    $scope.chartService = chartService;
    //-----------------------------------------------dataviz settings---------------------------------------------------//
   
    //-------------------------------------------------USER settings----------------------------------------------------//
    $scope.username = appData.currentUser.username;
    $scope.logout = function(){ userService.logout(); };
    $scope.deleteUser = function(){ userService.deleteUser($scope.username); };
    //-------------------------------------------------USER settings----------------------------------------------------//
    
    //------------------------------------------Manage Lib&Publications etc---------------------------------------------// 
    $scope.publications = managePublications;
    $scope.data = appData.data;
    $scope.appData = appData;

    //------------------------------------------Manage Lib&Publications etc---------------------------------------------// 

    //------------------------------------------------INTERACTIVE GRAPH-------------------------------------------------//
    $scope.interactiveGraph = false;

    $scope.ui_interactive_graph_enable = function() {
        $scope.interactiveGraph = true;
        $scope.gotoElement("id_interactive_graph")};
    $scope.ui_interactive_graph_disable = function() {
        $scope.gotoElement("id_top")
        $scope.interactiveGraph = false;};
    $scope.gotoElement = function(eID) {
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash('middle');

        // call $anchorScroll()
        anchorSmoothScroll.scrollTo(eID);};
    //------------------------------------------------INTERACTIVE GRAPH-------------------------------------------------//

    //-------------------------------------------------GUI settings-----------------------------------------------------//
    $scope.ui_currentPublications = [
        {title: 'title 1', id: 1, journalName: 'journalName', journalNumber: 'journalNumber', journalVolume:                       'journalVolume', year:'year', publisher:'publisher', keywords:['keyword 1', 'keyword 2', 'keyword 3'], isnew:true},
        {title: 'title 2', id: 2, journalName: 'journalName', journalNumber: 'journalNumber', journalVolume: 'journalVolume',     year:'year', publisher:'publisher', keywords:['keyword 1', 'keyword 2', 'keyword 3'], isnew:true},
        {title: 'title 3', id: 3, journalName: 'journalName', journalNumber: 'journalNumber', journalVolume: 'journalVolume',     year:'year', publisher:'publisher', keywords:['keyword 1', 'keyword 2', 'keyword 3']},
        {title: 'title 4', id: 4, journalName: 'journalName', journalNumber: 'journalNumber', journalVolume: 'journalVolume',     year:'year', publisher:'publisher', keywords:['keyword 1', 'keyword 2', 'keyword 3']},
        {title: 'title 5', id: 5, journalName: 'journalName', journalNumber: 'journalNumber', journalVolume: 'journalVolume',     year:'year', publisher:'publisher', keywords:['keyword 1', 'keyword 2', 'keyword 3']},
        {title: 'title 6', id: 6, journalName: 'journalName', journalNumber: 'journalNumber', journalVolume: 'journalVolume',     year:'year', publisher:'publisher', keywords:['keyword 1', 'keyword 2', 'keyword 3'], isnew:true},
        {title: 'title 7', id: 7, journalName: 'journalName', journalNumber: 'journalNumber', journalVolume: 'journalVolume',     year:'year', publisher:'publisher', keywords:['keyword 1', 'keyword 2', 'keyword 3']},
        {title: 'title 8', id: 8, journalName: 'journalName', journalNumber: 'journalNumber', journalVolume: 'journalVolume',     year:'year', publisher:'publisher', keywords:['keyword 1', 'keyword 2', 'keyword 3'], isnew:true}];
    
    //-------------------------------------------------GUI settings-----------------------------------------------------//
    
    
    
    //---------------------------------------!!@PIETER MOET ALLEMAAL WEG!!----------------------------------------------//
    //------------------------------------------------------------------------------------------------------------------//
    
    //-------------------------------------------------Manage Lib----------------------------------------------------// 
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
    

    //------------------------------------------------------------------------------------------------------------------//
    //---------------------------------------!!@PIETER MOET ALLEMAAL WEG!!----------------------------------------------//

});