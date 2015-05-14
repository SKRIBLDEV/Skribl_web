webapp.factory('serverService', function($http, appData){


    /******** utilities *******/


    function stripHashtag(publicationID){
        if (!publicationID){
            return 0;
        }

        if (publicationID.charAt(0) === '#'){
            publicationID = publicationID.substr(1);
        }
        return publicationID;        
    }


    /******** search requests *******/

    var basicSearch = function(searchTerms){
        var urlTerms = encodeURIComponent(searchTerms);
        var url = serverApi.concat('/publications?q=').concat(urlTerms).concat('&external=true');
        return $http.get(url,config);
    };

    var advancedSearch = function(searchQuery){
        var url = serverApi.concat('/publications');
        return $http.post(url, searchQuery, config);
    };



    /******** publication metadata requests *******/

    var setMetadata = function(pubId){

        pubId = stripHashtag(pubId);

        var url = serverApi.concat('/publications/').concat(pubId);
        var authorization = {headers:
            {'Content-type' : 'application/json',
            'Authorization': appData.Authorization}};

            return getMetaDataRequest = $http.get(url, authorization);
        };



     /******** library requests *******/

    //add a publication to a certain library of a user
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


     /******** author profile requests *******/
     var getAuthorPublications = function(authorId){
        authorId = stripHashtag(authorId); 
        var url = serverApi.concat('/author/').concat(authorId).concat('/publications/');
        var authorization = {headers: 
         {'Content-type' : 'application/json',
         'Authorization': appData.Authorization}};
         return getAuthorPublicationsRequest = $http.get(url, authorization);
     }

     /******** recommender requests *******/
     var getRecommendations = function(amnt){
        var url = serverApi.concat('/user/').concat(appData.currentUser.username).concat('/recommendations?depth=').concat(amnt);
        var authorization = {headers: 
         {'Content-type' : 'application/json',
         'Authorization': appData.Authorization}};
         return getRecommendations = $http.get(url, authorization);
     }

     var likeRecommendation = function(like, pubId){
        pubId = stripHashtag(pubId);
        var url = serverApi.concat('/user/').concat(appData.currentUser.username).concat('/publication/').concat(pubId);
        var authorization = {headers: 
         {'Content-type' : 'application/json',
         'Authorization': appData.Authorization}};
         return likeRecommendation = $http.post(url, {'like':like}, authorization);
     }

     var test = function(){
        console.log("succes test");
     }


     var service = {
        basicSearch : basicSearch,
        advancedSearch : advancedSearch,
        setMetadata : setMetadata,
        addPublication: addPublication,
        getUserPublications : getUserPublications,
        getAuthorPublications : getAuthorPublications,
        getRecommendations : getRecommendations,
        likeRecommendation : likeRecommendation
    };

    return service;

});


