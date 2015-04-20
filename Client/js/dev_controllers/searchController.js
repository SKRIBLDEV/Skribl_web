// this is a stub controller for implementing the GUI without depending on an external server

webapp.controller('searchCtrl', function searchCtrl($scope, $http, searchService) {

    console.log("controller instantiated");

    searchService.basicSearch();

    $scope.searchService = searchService;

    /*$http.get('temp_json/basic_search_data.json')
        .success(function (data) {
           $scope.searchResults = data;
            console.log("****searchdata: "+ $scope.searchResults );
        }).error(function (data, status) {
                console.log('Error: ' + status);
        });*/

});
