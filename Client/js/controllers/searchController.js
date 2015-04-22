
webapp.controller('searchCtrl', function searchCtrl($scope, $http, serverService, publicationsService, pdfDelegate, metaService) {
    //**** control search card

    $scope.searching = false; //for showing spinner etc.
    $scope.showExternalResults = false;
    $scope.basicSearchView = true; //default basic search
    $scope.showresults = false;

    $scope.showMeta =  metaService.showMeta;
    $scope.requestingMetadata = metaService.requestingMetaData;
    $scope.getMetadata = metaService.currentMeta;
    

    $scope.basicSearch = function(searchTerms){
        metaService.resetMetadata();
        $scope.showExternalResults = true;
        $scope.searching = true;
        serverService.basicSearch(searchTerms)
            .success(function(data) {

                if (data.internal.length === 0) {toast("No results found in our database.", 4000)};
                if (data.external.length === 0) {toast("No results found from searching Google Scholar.", 4000)};

                $scope.internalResults = data.internal;
                $scope.externalResults = data.external;
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
       metaService.resetMetadata();
       $scope.externalExternalResults = false;
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
        $scope.showMeta = false;
        $scope.basicSearchView = true;
        $scope.internalResults = {};
        $scope.externalResults = {};
        $scope.showResults = false;
    };


    $scope.switchToAdvancedSearch = function(){
        metaService.resetMetadata();
        $scope.showMeta = false;
        $scope.basicSearchView = false;
        $scope.internalResults = {};
        $scope.showResults = false;
        $scope.showExternalResults = false;
    };

    //**** control metadata preview card

    $scope.setMetadata = function(pubId){

        $scope.hasExternalUrl = false;

        function handler(succes){
            if (succes){
                metaService.toggleMeta(true);
            } 
        }

        metaService.setMetadata(pubId, handler);
    };

    $scope.setExternalMetadata = function(GSmetadata){
        $scope.hasExternalUrl = true;
        function handler(succes){
            if (succes){
                $scope.showMeta = true;
            }
        }
        metaService.setExternalMetadata(GSmetadata, handler);
    };


    $scope.addPublication = function(publicationID){
        publicationsService.addPublication("Favorites", publicationID);
    }

});


