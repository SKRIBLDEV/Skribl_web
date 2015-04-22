webapp.factory('serverService', function($http, appData){




    var basicSearch = function(searchTerms){
        var urlTerms = encodeURIComponent(searchTerms);
        var url = serverApi.concat('/publications?q=').concat(urlTerms);//.concat('&external=true');
        return $http.get(url,config);
    };

    var advancedSearch = function(searchQuery){
        var url = serverApi.concat('/publications');
        return $http.post(url, searchQuery, config);
    };

    var setMetadata = function(pubId){
        if (pubId.charAt(0) === '#'){
            pubId = pubId.substr(1);
        }
        console.log(pubId);
        var url = serverApi.concat('/publications/').concat(pubId);
        var authorization = {headers:
        {'Content-type' : 'application/json',
            'Authorization': appData.Authorization}};

        return getMetaDataRequest = $http.get(url, authorization);
    };

    var service = {
        basicSearch : basicSearch,
        advancedSearch : advancedSearch,
        setMetadata : setMetadata
    };

    return service;

});