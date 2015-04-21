/**
 * Created by Hannah_Pinson on 20/04/15.
 */

webapp.factory('searchService', function($http){

/*
    var basicSearch = function(searchTerms){
       return $http.get('temp_json/basic_search_data.json')
    };*/


    var basicSearch = function(searchTerms){

        var urlTerms = encodeURIComponent(searchTerms);
        var url = serverApi.concat('/publications?q=').concat(urlTerms).concat('&external=true');
        return $http.get(url,config);

    };



    var advancedSearch = function(searchQuery){
        searchQuery = {
            title: 'model refactoring',
            year: '2007'
        };
        var url = serverApi.concat('/publications');
        return $http.post(url, searchQuery, config);

    };




    var service = {
        basicSearch : basicSearch,
        advancedSearch : advancedSearch
    };

    return service;

});


