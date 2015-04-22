
webapp.controller('searchCtrl', function searchCtrl($scope, $http, serverService, pdfDelegate, metaService) {
    //**** control search card

    $scope.searching = false; //for showing spinner etc.
    $scope.showExternalResults = false;///true; //for showing results from GS; default basicSearch, so results from GS collected
    $scope.basicSearchView = true; //default basic search
    $scope.showresults = false;
    $scope.showMeta = false;

    $scope.basicSearch = function(searchTerms){
        metaService.resetMetadata();
        $scope.searching = true;
        serverService.basicSearch(searchTerms)
            .success(function(data) {

                if (data.internal.length === 0) {toast("No results found in our database.", 4000)};
                if (data.external.length === 0) {toast("No results found from searching Google Scholar.", 4000)};

                $scope.internalResults = data.internal;
                $scope.externalResults = data.external;
                console.log(data.external[0]);
                $scope.searching = false;
                $scope.showResults = true;
                $scope.showExternalResults = true;

            })
            .error(function(data, status){
                $scope.searching = false;
                console.log(status);
                toast("Failed to search publications, try again later.", 4000);
            });
    };

   $scope.advancedSearch = function(searchQuery){
       metaService.resetMetadata();
       $scope.showExternalResults = false;
       $scope.searching = true;

        serverService.advancedSearch(searchQuery)
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
        metaService.resetMetadata();
        $scope.searchTerms = undefined;
        $scope.showMeta = false;
        $scope.basicSearchView = true;
        $scope.internalResults = {};
        $scope.showResults = false;
    };

    $scope.switchToAdvancedSearch = function(){
        metaService.resetMetadata();
        $scope.advancedQuery = {};
        $scope.showMeta = false;
        $scope.basicSearchView = false;
        $scope.internalResults = {};
        $scope.showResults = false;
    };

    //**** control metadata preview card

    $scope.setMetadata = function(pubId){
        function handler(succes){
            if (succes){
                $scope.showMeta = true;
            } 
        }
        metaService.setMetadata(pubId, handler);
    };

    $scope.setExternalMetadata = function(GSmetadata){
        function handler(succes){
            if (succes){
                $scope.showMeta = true;
            }
        }
        metaService.setExternalMetadata(GSmetadata, handler);
    };

    $scope.getMetadata = function(){
        return metaService.currentMeta();
    };

    $scope.requestingMetadata = function(){
        return metaService.requestingMetaData();
    }

});


