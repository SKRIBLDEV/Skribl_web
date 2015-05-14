webapp.factory('routerHelperService', function($http, $state){

	 var goHome = function() {
	 	$state.go('home');
     };

     var goAbout = function(){
     	$state.go('about');
     }

     var goDashboard = function(){
     	$state.go('dashboard');
     }

     var goDashboardLibrary = function(){
     	$state.go('dashboard.library')
     }

     var goDashboardNetwork = function(){
     	$state.go('dashboard.network');
     }

     var goDashboardSearch = function(){
     	$state.go('dashboard.search');
     }

     var goRecommender = function(){
        $state.go('dashboard.recommender');  
     }

	  var service = {
        goHome : goHome,
        goAbout : goAbout,
        goDashboard : goDashboard,
        goDashboardLibrary : goDashboardLibrary,
        goDashboardNetwork : goDashboardNetwork,
        goDashboardSearch : goDashboardSearch,
        goRecommender : goRecommender
    };

    return service;

});