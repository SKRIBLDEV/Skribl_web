/**
 * Initialisation of the dashController (an angular controller),
 * has an symbiotic relationship with dashboard.html
 * 
 * @param  {object} $scope    	the scope object of the controller
 * @param  {object} $http 		abstraction for making http-related calls (ex: ajax)
 * @param  {object} $location 	for switching between routes/views
 * @param  {object} appData  	our custom service for shared data

 */
 webapp.controller('dashController', function($scope, $http, appData, anchorSmoothScroll, userService, managePublications, chartService, pdfDelegate, routerHelperService, pdfViewerService, researchDomainService, deviceDetector) {

    //----------------------------------------------------INIT----------------------------------------------------------//
    //Control if user has already loged in, or if he tries to go the dashboard without login in.
    if (!(appData.currentUser)) {
        routerHelperService.goHome();
        return;
    }

    (function init(){
        managePublications.getUserPublications('Uploaded', false);
        managePublications.getUserLibraries();
        // little hack to make pdf viewer work
        appData.data.currentMetaData = {download: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/149125/material-design-2.pdf'};        
        appData.modifyResearchDomains();
        routerHelperService.goDashboardLibrary();
    })();

         $scope.test = "lololoo";
         $scope.notMobile = function(){
        return deviceDetector.isDesktop();
     }


    //----------------------------------------------------INIT----------------------------------------------------------//
    
    //------------------------------------------------GUI settings------------------------------------------------------//
    $scope.userService = userService;
    //------------------------------------------------GUI settings------------------------------------------------------//
    
    //-----------------------------------------------dataviz settings---------------------------------------------------//
    $scope.chartService = chartService;
    //-----------------------------------------------dataviz settings---------------------------------------------------//
    
    $scope.router = routerHelperService;

    //-------------------------------------------------USER settings----------------------------------------------------//
    $scope.username = appData.currentUser.username;
    $scope.logout = function(){ userService.logout(); };
    $scope.deleteUser = function(){ userService.deleteUser($scope.username); };
    //-------------------------------------------------USER settings----------------------------------------------------//
    
    //------------------------------------------Manage Lib&Publications etc---------------------------------------------// 

    $scope.publications = managePublications;
    $scope.data = appData.data;
    $scope.appData = appData;
    $scope.userService = userService;
    $scope.pdfViewerService = pdfViewerService;
    $scope.researchDomainService = researchDomainService;

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
                anchorSmoothScroll.scrollTo(eID);
            };


    //2D0: make independent controller for metadata
    $scope.showMeta =  managePublications.showMeta;
    $scope.requestingMetadata = managePublications.requestingMetaData;
    $scope.getMetadata = managePublications.getMetadata;
    $scope.clearMetadata = managePublications.clearMetadata;

    // temp
    $scope.getCurrentLibraryName = function(){
        return appData.data.currentLibraryName;
    }
    
    // //------------------------------------------------Upload-----------------------------------------------//
    // 
    
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