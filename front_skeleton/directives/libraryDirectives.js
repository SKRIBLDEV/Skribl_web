/**
 * Created by Hannah_Pinson on 11/04/15.
 */
var webApp = angular.module('webApp');

//clickable publication title that is connected to the metadata-preview functionality
webApp.directive("pubItem", ['pubListFac', function (pubListFac){
    return {
        restrict: 'E',
        template: '<p> a publication title here </p>'
    }

}]);

