/**
 * Created by Hannah_Pinson on 11/04/15.
 */
var webApp = angular.module('webApp');



webApp.directive("switchLib", ["libListingFac", function(libListingFac){
    return {
        restrict: "A",
        scope : true,
        link: function (scope, element, attrs) {
            element.bind("click", function(){
                scope.$apply(function() {
                    libListingFac.switchTo(attrs.libName);
                });
            })
        }
    }
}]);



webApp.directive("removeFromLib", ["libListingFac", function(libListingFac){
    return {
        restrict: "E",
        scope : true,
        template : '<a class="btn btn-primary"> remove</a>',
        replace: true,
        link: function (scope, element, attrs) {
            element.bind("click", function(){
                scope.$apply(function() {
                    var pubIdToRemove = scope.item.ID;
                    console.log("id to remove " + pubIdToRemove);
                    console.log("from: " + scope.currentListing.type);
                    libListingFac.removePublication(pubIdToRemove);
                });
            })
        }
    }
}]);

