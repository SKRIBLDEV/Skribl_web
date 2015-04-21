/**
 * Created by Hannah_Pinson on 20/04/15.
 */

webapp.factory('searchService', function($http, $rootScope){

    console.log("factory instantiated");

    /*var internalResults = [];
    var externalResults = [];*/

    var basicSearch = function(){
       return $http.get('temp_json/basic_search_data.json')
            /*.success(function (data) {
                internalResults = data.internal;
                externalResults = data.external;
            }).error(function (data, status) {
                console.log('Error: ' + status);
            });*/
    };

    //basicSearch();

    var service = {
        basicSearch : basicSearch
        //internalResults : internalResults,
        //externalResults : externalResults
    };

    return service;

});
