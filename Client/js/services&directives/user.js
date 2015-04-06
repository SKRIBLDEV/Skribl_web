/**
 * Initialisation of the appdata with the empty object
 */
webapp.service('userService', function($location, appData, $http) {
    
    this.logout = function(){logout();};
    
    function logout(){
        $location.path('/home');
        appData.currentUser = null;
        toast("succesfully logged out", 4000) // 4000 is the duration of the toast
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

