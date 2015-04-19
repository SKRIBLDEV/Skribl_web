/**
 * Created by Hannah_Pinson on 12/04/15.
 */


var webApp = angular.module('webApp');


//to be used as an attribute on a library listing item (i.e. a publication title)
webApp.directive("setMetadata", ["metadataFac", function(metadataFac){
    return {
        restrict: "A",
        scope : true,
        link: function (scope, element, attrs) {
            element.bind("click", function(){
                scope.$apply(function() {
                    console.log("ID of the needed metadata: " + scope.item.ID );
                    metadataFac.setMetadata(scope.item.ID);
                });
            })
        }
    }
}]);


//to show the metadata in the metadatapreview
webApp.directive("showMetadata", ["metadataFac", function(metadataFac){
    return {
        restrict: "E",
        scope : true,
        template : '<a> year: {{currentMetadata.year}} </a>',
        link: function (scope) {
            scope.$eval();
        }
    }
}]);