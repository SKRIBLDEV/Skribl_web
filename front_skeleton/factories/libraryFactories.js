/**
 * Created by Hannah_Pinson on 10/04/15.
 */

var webApp = angular.module('webApp');

webApp.factory("libListingFac", ['$rootScope', function( $rootScope ) {


    // in this factory, a consistent model of the 'portfolio' and 'favourite' listings is kept
    // changes are directly induced by operations performed in the view, e.g., the user wants to remove a publication
    // changes are broadcasted to the controller, which in turn updates the view


    //stub
    var portfolioListing = [
        {"title": "port_pub1", "ID": 0},
        {"title": "port_pub2", "ID": 1}
    ];

    //stub
    var favouritesListing = [
        {"title": "fav_pub1", "ID": 2},
        {"title": "fav_pub2", "ID": 3}
    ];


    /*
     * higher order function to dispatch on listing type
     * @param: updateFunc: method used to update the listing (involves server request)
     * @argObject: contains the needed arguments for the different update functions
     */

    var updateListing = function(currentListingType, argObject, updateFunc){
        if (currentListingType == "portfolio"){
            portfolioListing = updateFunc(portfolioListing, argObject);
            console.log("portfolio is now: " + portfolioListing);
            //$rootScope.$broadcast( 'listing.update', portfolioListing );
        }

        else if (currentListingType == "favourites") {
            favouritesListing = updateFunc(favouritesListing, argObject);
            $rootScope.$broadcast('listing.update', favouritesListing);
        }
        else
            console.log("updateListing: currentListingType not recognised "); // TO DO : error handling



    };

    /*
     ================== update functions:
     * they communicate with the server (remote model) and keep the listings (local model) consistent
     * @param currentListing : local model to keep consistent, depending on server response
     * @param argObject : optional arguments
     */

    /*
     * fetch the publications for the current listing model
     */

    var fetchPublications = function(currentListingType){
        var noAdditionalParam = null;
        updateListing(currentListingType, noAdditionalParam, function(currentListing, noAdditionalParam){
            // request to server based on currentListingType
            // if succeeded, return result
        })
    };

    /*
     * adds a publication to the current library (server side) and updates the current listing model
     */
    var addPublication= function(currentListingType, pubToAdd){
        updateListing(currentListingType, pubToAdd, function(currentListing, pubToAdd){
            // request to server based on currentListingType and pubToAdd
            // if succeeded, we could either:
            // -fetch the publications anew, which renews the local model
            // -save a server request by adding a publication with the new ID and known title to the local listing model

            //stub:
            //currentListing.push(...)
            console.log("added a publication");
        });
    };

    /*
     * removes a publication from the current library (server side) and updates the current listing model
     */
    var removePublication= function(currentListingType, pubIdToRemove){
        updateListing(currentListingType, pubIdToRemove, function(currentListing, pubIdToRemove) {
            // request to server based on currentListingType and pubToRemove
            // if succeeded, we could either:
            // -fetch the publications anew, which renews the local model
            // -save a server request by removing the new publication from the local listing model

            console.log("before: " + currentListing);
            //stub:
            var changedArray = currentListing.filter(function (element) {
                return element.ID !== pubIdToRemove;
            });

            console.log("after: " + changedArray);

            console.log("removed a publication from the model");

            return changedArray;
        });
    };


    /*
     ================== factory config
     */


    // var portfolioListing = fetchPublications("portfolio");
    // var favouritesListing = fetchPublications("favourites");




    var factory = {
        portfolioListing: portfolioListing,
        favouritesListing: favouritesListing,
        addPublication: addPublication,
        removePublication : removePublication
    };
    return factory;

}]);