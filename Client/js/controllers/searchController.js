
webapp.controller('searchCtrl', function searchCtrl($scope, $http, serverService, publicationsService, pdfDelegate, metaService) {
   

    //************** control search card

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
                if (data.external.length === 0) {toast("No results found from searching with Google Scholar.", 4000)};

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

    //reset advanced search model (not a persistent model, only needed for temp bindings in view)
    resetAdvancedQuery = function(){
        $scope.advancedQuery = {
            title : undefined,
            /*authors : [
                {firstName: 'Jens',
                lastName : 'Nicolay'}
            ],*/
            //keywords : ['VUB', 'Software'],
            authors: [],
            keywords: [],
            researchDomains : [],
            year : undefined,
            journal : undefined,
            booktitle : undefined
        }
    }

    $scope.arrayPlaceholders = ["author", "keyword", "research domain"]

    resetAdvancedQuery();

    // little ugly fix to bridge angular model vs. back-end demands
    transformedForRequest = function(){

        //copy
        transQuery = {
            title : $scope.advancedQuery.title,
            authors : $scope.advancedQuery.authors,
            keywords : $scope.advancedQuery.keywords,
            researchDomains : $scope.advancedQuery.researchDomains,
            year : $scope.advancedQuery.year,
            journal : $scope.advancedQuery.journal,
            booktitle :$scope.advancedQuery.booktitle
        }

        //set properties with empty arrays to undefined
        if (transQuery.authors.length == 0)
            transQuery.authors = undefined;
        if (transQuery.keywords.length == 0)
            transQuery.keywords = undefined;
        if (transQuery.researchDomains.length == 0)
            transQuery.researchDomains = undefined; 
        return transQuery;
    }

   $scope.advancedSearch = function(){
       metaService.resetMetadata();
       $scope.showExternalResults = false;
       $scope.internalResults = undefined;
       $scope.searching = true;

       console.log(transformedForRequest);


        serverService.advancedSearch(transformedForRequest())
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
        metaService.resetMetadata();
        resetAdvancedQuery();
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


