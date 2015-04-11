/**
 * Created by Hannah_Pinson on 10/04/15.
 */


var webApp = angular.module('webApp');


webApp.controller('libCtrl', ['$scope', 'libFac', function($scope, libFac) {

    console.log('libCtrl created');


    $scope.libItems = libFac.libItems;

}]);

