
webapp.controller('searchCtrl', function searchCtrl($scope, $http, searchService) {


    //**** control search card

    $scope.searching = false; //for showing spinner etc.
    $scope.externalSearch = false;///true; //for showing results from GS; default basicSearch, so results from GS collected
    $scope.basicSearchView = true; //default basic search
    $scope.showresults = false;
    $scope.showMeta = false;

    $scope.basicSearch = function(searchTerms){
        $scope.resetMeta();
        $scope.externalSearch = false;
        $scope.searching = true;
        searchService.basicSearch(searchTerms)
            .success(function(data) {

                if (data.internal.length === 0) {toast("No results found in our database.", 4000)};
                //if (data.external.length === 0) {toast("No results found from searching Google Scholar.", 4000)};

                $scope.internalResults = data.internal;
                //$scope.externalResults = data.external;
                $scope.searching = false;
                $scope.showResults = true;

            })
            .error(function(data, status){
                $scope.searching = false;
                console.log(status);
                toast("Failed to search publications, try again later.", 4000);
            });
    };

   $scope.advancedSearch = function(searchQuery){
       $scope.resetMeta();
       $scope.externalSearch = false;
       $scope.searching = true;

        searchService.advancedSearch(searchQuery)
            .success(function(data) {
                $scope.searching = false;
                $scope.internalResults = data;
                $scope.showResults = true;

            })
            .error(function(data, status){
                $scope.searching = false;
                toast("Failed to search publications, try again later.", 4000);
            });

    };

    $scope.switchToBasicSearch = function(){
        $scope.resetMeta();
        $scope.basicSearchView = true;
        $scope.internalResults = {};
        $scope.showResults = false;
    };

    $scope.switchToAdvancedSearch = function(){
        $scope.resetMeta();
        $scope.basicSearchView = false;
        $scope.internalResults = {};
        $scope.showResults = false;
    };

    $scope.resetMeta = function(){
        $scope.currentMeta = {};
        $scope.showMeta = false;
    };

    //**** control metadata preview card

    $scope.setMetadata = function(pubId){
        $scope.requestingMetadata = true;
        searchService.setMetadata(pubId)
            .success(function (data){
                $scope.requestingMetadata = false;
                 $scope.currentMeta = data;
                $scope.showMeta = true;
                console.log("***current meta: " + data);
            })
            .error(function(){
                $scope.requestingMetadata = false;
                toast("Failed to find metadata, try again later", 4000);
        });



    }



});


