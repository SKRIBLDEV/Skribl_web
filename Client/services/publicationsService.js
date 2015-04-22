webapp.factory('publicationsService', function($http, appData, serverService){


    //get alle the publications of a certain user in a certain library
    var getUserPublications = function(libraryName, displayToast) {
        var error_ctr_userPub = 0;

        displayToast = (typeof displayToast !== 'undefined') ? displayToast : true;
        
        serverService.getUserPublications(libraryName)
        .success(function(data, status, headers, config) {
            error_ctr_userPub = 0;
            appData.data.publications = data;

            appData.data.currentLibraryName = libraryName;
            if (displayToast){
                toast("Sucesfully Loaded \"" + libraryName + "\" library", 4000);    
            }
        })
        .error(function(data, status, headers, config) {
           if(error_ctr_userPub < 4){
            error_ctr_userPub = error_ctr_userPub + 1;
            getUserPublications();
        } else {
            toast("SKRIBL encoutered a problem please try again later.", 4000);
        }
    })
    };
    
    //add a publication to a certan library of a user
    var addPublication = function(libraryName, publicationID) {
        serverService.addPublication(libraryName, publicationID)
        .success(function(data, status, headers, config) {
            if(libraryName === appData.data.currentLibraryName) {
                getUserPublications(libraryName);
            } else {
                upToDate();
            };
            var toToast ="Publication added to library ".concat(libraryName).concat(".");
            toast(toToast, 4000);
        })
        .error(function(data, status, headers, config) {
            if(status == 500){
                toast("Publication is already in the library.", 4000);
            } else {
                toast("Failed to add to library, try again later.", 4000)
            };
        });
    }

    var service = {
        getUserPublications : getUserPublications,
        addPublication : addPublication
    };

    return service;

});