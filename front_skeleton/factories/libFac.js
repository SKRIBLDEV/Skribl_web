/**
 * Created by Hannah_Pinson on 10/04/15.
 */

var webApp = angular.module('webApp');

webApp.factory("libListingFac", ['$rootScope', function($rootScope) {

    var portfolioListing = [
        {"title": "port_pub1", "ID": 0},
        {"title": "port_pub2", "ID": 1}
    ];

    var favouritesListing = [
        {"title": "fav_pub1", "ID": 2},
        {"title": "fav_pub2", "ID": 3}

    ]

    var factory = {
        portfolioListing: portfolioListing,
        favouritesListing: favouritesListing
    };
    return factory;

}]);