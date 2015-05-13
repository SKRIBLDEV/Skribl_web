
webapp.controller('searchCtrl', function searchCtrl($scope, $http, serverService, publicationsService, pdfDelegate, metaService, researchDomainService) {
   

    //************** control search card

    $scope.searching = false; //for showing spinner etc.
    $scope.basicSearchView = true; //default basic search
    $scope.showresults = false;
    $scope.showExternalResults = false;

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
                if (data.external.length === 0) {toast("No results found from searching with Google Scholar.", 4000)};

                $scope.internalResults = data.internal;
                $scope.externalResults = data.external;
                $scope.searching = false;
                $scope.showResults = true;

            })
            .error(function(data, status){
                $scope.searching = false;
                toast("Failed to search publications, try again later.", 4000);
            });
    };

    //reset advanced search model (not a persistent model, only needed for temp bindings in view)
    resetAdvanced = function(){
        $scope.advancedQuery = {
            title : undefined,
            authors: [],
            keywords: [],
            researchDomains : [],
            year : undefined,
            journal : undefined,
            booktitle : undefined
        }
    }

    $scope.arrayPlaceholders = ["author", "keyword", "research domain"]

    $scope.search_showGeneral = true;
    $scope.search_showResearchDomains = false; 
    $scope.search_showAuthors = false;

    $scope.getSelectedDomains = researchDomainService.getSelectedDomains;
    resetAdvanced();

   $scope.advancedSearch = function(){
       metaService.resetMetadata();
       $scope.showExternalResults = false;
       $scope.internalResults = undefined;
       $scope.searching = true;

       $scope.advancedQuery.researchDomains = $scope.getSelectedDomains();


        serverService.advancedSearch($scope.advancedQuery)
            .success(function(data) {
                $scope.searching = false;
                if (data.length == 0 ) {
                    toast("No results found in our database.", 4000)}
                else {
                    $scope.internalResults = data;
                    $scope.showResults = true;
                }
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
        researchDomainService.resetSelected();
        metaService.resetMetadata();
        resetAdvanced();
        $scope.showMeta = false;
        $scope.basicSearchView = false;
        $scope.internalResults = {};
        $scope.showResults = false;
        $scope.showExternalResults = false;
    };



    //************** control metadata preview card

    $scope.setMetadata = function(pubId){

        $scope.hasExternalUrl = false;

        function handler(succes, data){
            if (succes){
                metaService.toggleMeta(true);
            } 
        }

        metaService.setMetadata(pubId, handler);
    };

    $scope.setExternalMetadata = function(GSmetadata){
        $scope.hasExternalUrl = true;
        function handler(succes){
            if (succes, data){
                $scope.showMeta = true;
                data.external=true;
            }
        }
        metaService.setExternalMetadata(GSmetadata, handler);
    };


    $scope.addPublication = function(publicationID){
        publicationsService.addPublication("Favorites", publicationID);
    }

});


