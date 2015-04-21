// this is a stub controller for implementing the GUI without depending on an external server

webapp.controller('searchCtrl', function searchCtrl($scope, $http, searchService) {

    $scope.searching = false; //for showing spinner etc.
    $scope.externalSearch = true; //for showing results from GS; default basicSearch, so results from GS collected

    $scope.basicSearch = function(searchTerms){
        $scope.externalSearch = true;
        $scope.searching = true;
        searchService.basicSearch(searchTerms)
            .success(function(data) {

                if (data.internal.length === 0) {toast("No results found in our database.", 4000)};
                if (data.external.length === 0) {toast("No results found from searching Google Scholar.", 4000)};

                $scope.internalResults = data.internal;
                $scope.externalResults = data.external;
                $scope.searching = false;

            })
            .error(function(data, status){
                $scope.searching = false;
                console.log(status);
                toast("Failed to search publications, try again later.", 4000);
            });
    };

   $scope.advancedSearch = function(searchQuery){
        $scope.externalSearch = false;
        $scope.searching = true;

        searchService.advancedSearch(searchQuery)
            .success(function(data) {
                $scope.searching = false;
                console.log(data);

            })
            .error(function(data, status){
                $scope.searching = false;
                toast("Failed to search publications, try again later.", 4000);
            });

    }


});


