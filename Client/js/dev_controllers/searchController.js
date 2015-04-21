// this is a stub controller for implementing the GUI without depending on an external server

webapp.controller('searchCtrl', function searchCtrl($scope, $http, searchService) {

    console.log("controller instantiated");

    //$scope.internalResults = searchService.internalResults;
    //$scope.externalResults = searchService.externalResults;

    //searchService.basicSearch();

    $scope.basicSearch = function(){
        searchService.basicSearch()
            .success(function(data) {
                console.log("data.internal:" + data.internal[0].title);
                $scope.internalResults = data.internal;
                $scope.externalResults = data.external;
                console.log("****searchdata internal: " + $scope.internalResults);
                $scope.$broadcast("search completed");

            });
    };



});


/*$http.get('temp_json/basic_search_data.json')
 .success(function (data) {
 $scope.searchResults = data;
 console.log("****searchdata: "+ $scope.searchResults );
 }).error(function (data, status) {
 console.log('Error: ' + status);
 });*/


