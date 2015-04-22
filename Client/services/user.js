
webapp.service('userService', function($location, appData, $http, metaService) {
    
    this.logout = function(){logout();};


    //[H]: I admit, this is gruesome code -> TO REFACTOR.

    this.showLibrary = true;
    this.showSearch = false;
    this.showNetwork = false;
    this.showSettings = false;

    function resetMeta(){
        metaService.resetMetadata();
        metaService.toggleMeta(false);
    }


    this.toggleLibrary = function() {
        this.showLibrary = !this.showLibrary;
        this.showSearch = false;
        this.showNetwork = false;
        this.showSettings = false;
        resetMeta();
    };

    this.toggleSearch = function() {
        this.showSearch = !this.showSearch;
        this.showNetwork = false;
        this.showLibrary = false;
        this.showSettings = false;
        resetMeta();
    };

    this.toggleNetwork = function() {
        this.showNetwork = !this.showNetwork;
        this.showLibrary = false;
        this.showSearch = false;
        this.showSettings = false;
    };

    this.toggleSettings = function() {
        this.showSettings = !this.showSettings;
        this.showNetwork = false;
        this.showLibrary = false;
        this.showSearch = false;
    };
    
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

