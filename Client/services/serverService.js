webapp.factory('serverService', function($http, appData){


    function stripHashtag(publicationID){

        if (publicationID.charAt(0) === '#'){
            publicationID = publicationID.substr(1);
        }
        return publicationID;        
    }

    var basicSearch = function(searchTerms){
        var urlTerms = encodeURIComponent(searchTerms);
        var url = serverApi.concat('/publications?q=').concat(urlTerms).concat('&external=true');
        return $http.get(url,config);
    };

    var advancedSearch = function(searchQuery){
        var url = serverApi.concat('/publications');
        return $http.post(url, searchQuery, config);
    };

    var setMetadata = function(pubId){

        pubId = stripHashtag(pubId);

        console.log(pubId);
        var url = serverApi.concat('/publications/').concat(pubId);
        var authorization = {headers:
            {'Content-type' : 'application/json',
            'Authorization': appData.Authorization}};

            return getMetaDataRequest = $http.get(url, authorization);
        };



    //add a publication to a certan library of a user
    var addPublication = function(libraryName, publicationID) {
        publicationID = stripHashtag(publicationID);

        var url =  serverApi.concat('/user/').concat(appData.currentUser.username).concat('/library/').concat(libraryName).concat('/').concat(publicationID);
        var authorization = {headers: 
         {'Content-type' : 'application/json',
         'Authorization': appData.Authorization}};
         return addPublicationsRequest = $http.put(url, {}, authorization);
     };


     var getUserPublications = function(libraryName) {
        var url = serverApi.concat('/user/').concat(appData.currentUser.username).concat('/library/').concat(libraryName);
        var authorization = {headers: 
         {'Content-type' : 'application/json',
         'Authorization': appData.Authorization}};
         return getUserPublicationsRequest = $http.get(url, authorization);

     };

     var service = {
        basicSearch : basicSearch,
        advancedSearch : advancedSearch,
        setMetadata : setMetadata,
        addPublication: addPublication,
        getUserPublications : getUserPublications
    };

    return service;

});