/**
 * Created by Hannah_Pinson on 10/04/15.
 */

var webApp = angular.module('webApp');

webApp.factory("libFac", ['$rootScope', function($rootScope) {

    var libItems = [
        {"title": "port_pub1", "ID": 0},
        {"title": "port_pub2", "ID": 1}
    ];

    var factory = {
        libItems: libItems
    };
    return factory;

}]);