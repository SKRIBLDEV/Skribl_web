/**
 * Created by Hannah_Pinson on 11/04/15.
 */
var webApp = angular.module('webApp');


webApp.controller('libListingCtrl', ['$scope', 'libListingFac', function($scope, libListingFac) {


    //=========== init

    $scope.currentListing = libListingFac.currentListing;
    // changes in currentListing will automatically be watched by the controller -> view update upon change


}]);