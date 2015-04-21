// this is a stub controller for implementing the GUI without depending on an external server

webapp.controller('searchCtrl', function searchCtrl($scope, $http, searchService) {

    console.log("controller instantiated");

    //$scope.internalResults = searchService.internalResults;
    //$scope.externalResults = searchService.externalResults;

    //searchService.basicSearch();

    $scope.basicSearch = function(){
        searchService.basicSearch()
            .success(function(data) {

                if (data.internal.length === 0) {toast("No results found in our database.", 4000)};
                if (data.external.length === 0) {toast("No results found from searching Google Scholar.", 4000)};

                console.log("data.internal:" + data.internal[0].title);
                $scope.internalResults = data.internal;
                $scope.externalResults = data.external;
                console.log("****searchdata internal: " + $scope.internalResults);
                //$scope.$broadcast("search completed");
            })
            .error(function(data, status){
                console.log(status);
                toast("Failed to search publications, try again later.", 4000);
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

