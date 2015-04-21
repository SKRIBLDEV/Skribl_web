/**
 * Created by Hannah_Pinson on 20/04/15.
 */

webapp.factory('searchService', function($http){

    /*
    var basicSearch = function(){
       return $http.get('temp_json/basic_search_data.json')
    };
    */

    var basicSearch = function(searchTerms){

        searchTerms = 'refactoring';

        var urlTerms = searchTerms.replace("\s","+");
        var url = serverApi.concat('/publications?q=').concat(urlTerms).concat('&external=true');
        return $http.get(url,config);

    };


    var service = {
        basicSearch : basicSearch

    };

    return service;

});


