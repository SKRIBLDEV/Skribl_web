
webapp.service('userService', function($location, appData, $http, metaService) {
    
    this.logout = function(){logout();};

    this.showLibrary = true;
    this.showSearch = false;
    this.showNetwork = false;
    this.showSettings = false;
    this.showRecommender = false;

    function disbaleAll(){
        this.showSearch = false;
        this.showNetwork = false;
        this.showSettings = false;
        this.showRecommender = false;
    }

    function resetMeta(){
        metaService.resetMetadata();
        metaService.toggleMeta(false);
    }

    this.toggleLibrary = function() {
        disbaleAll();
        this.showLibrary = !this.showLibrary;
        resetMeta();
    };

    this.toggleSearch = function() {
        disbaleAll();
        this.showSearch = !this.showSearch;
        resetMeta();
    };

    this.toggleNetwork = function() {
        disbaleAll();
        this.showNetwork = !this.showNetwork;
    };

    this.toggleSettings = function() {
        disbaleAll();
        this.showSettings = !this.showSettings;
    };

    this.toggleRecommender = function(){
        disbaleAll();
        this.showRecommender = !this.showRecommender;
    }

    
    function logout(){
        $location.path('/home');
        appData.currentUser = null;
        toast("succesfully logged out", 4000); // 4000 is the duration of the toast
    };

    //The delete function
    this.deleteUser = function(username){
        var path = serverApi.concat('/users/').concat(username);
        var authorization = appData.Authorization;
        console.log(authorization);
        var deleteRequest = $http.delete(path, authorization);
        
        deleteRequest.success(function(data, status, headers, authorization){
            logout();
            toast("succesfully deleted account", 4000) // 4000 is the duration of the toast
        });

        deleteRequest.error(function(data, status, headers, config) {
            //Error while deleting user
            toast("Database error, please try again later.", 4000) // 4000 is the duration of the toast
        });
    };
    
});

