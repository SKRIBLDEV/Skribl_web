/**
 * Created by Hannah_Pinson on 11/04/15.
 */
var webApp = angular.module('webApp');


webApp.controller('libCtrl', ['$scope', 'libListingFac', 'metadataFac', function($scope, libListingFac, metadataFac) {


    //=========== init


    $scope.currentListing = libListingFac.currentListing; // this is automatically watched -> changes will be reflected in the view
    $scope.currentMetadata = metadataFac.currentMetadata;



    /*$scope.$watch("currentMetadata", function(newValue){
        console.log('noticed!');
        console.log(newValue);
        console.log(newValue.year);
        $scope.currentMetadata = newValue;
    });*/



}]);