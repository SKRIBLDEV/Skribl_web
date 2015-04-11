/**
 * Created by Hannah_Pinson on 11/04/15.
 */
var webApp = angular.module('webApp');


webApp.controller('libListingCtrl', ['$scope', 'libListingFac', function($scope, libListingFac) {


    $scope.currentListingType = "portfolio"; //default

    $scope.$watch("currentListingType", function(newValue, oldValue){
        if (newValue == oldValue){ // first run
            //default type, thus 'portfolio'
            $scope.currentListing = libListingFac.portfolioListing;
        }
        else if (newValue == "favourites")
            $scope.currentListing = libListingFac.favouritesListing;
        else
            $scope.currentListing = libListingFac.portfolioListing;
    });


}]);