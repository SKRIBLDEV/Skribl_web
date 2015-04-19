/**
 * Created by Hannah_Pinson on 10/04/15.
 */

var webApp = angular.module('webApp');

webApp.factory("libListingFac", function( ) {


    // in this factory, a consistent model of the 'portfolio' and 'favourite' listings is kept
    //together with a current listing for display in the view
    // changes are directly induced by operations performed in the view, e.g., by a remove-from-lib directive
    // changes in the currentListing are watched by the controller



    /*
     ================== init
     */

    /*
     * fetch the publications for the current listing model
     */

    var fetchPublications = function(libType){
            // request to server based on currentListingType
            // if succeeded, return result
    };

    // var portfolioListing = fetchPublications("portfolio");
    // var favouritesListing = fetchPublications("favourites");


    //stub
    var portfolioListing = [
        {"title": "port_pub1", "ID": 0},
        {"title": "port_pub2", "ID": 1}
    ];

    //stub
    var favouritesListing = [
        {"title": "fav_pub1", "ID": 2},
        {"title": "fav_pub2", "ID": 3},
        {"title": "fav_pub3", "ID": 4},
        {"title": "fav_pub4", "ID": 5}
    ];

    //default initial
    var currentListing = {
        "type" : "portfolio",
        "items" : portfolioListing
    };


    /*
    ================== switching libraries (='listings')
     */

    var switchTo = function(listingName){
        if (listingName == "portfolio"){
            currentListing.type = "portfolio";
            currentListing.items = portfolioListing;
        }
        else if (listingName == "favourites") {
            currentListing.type = "favourites";
            currentListing.items = favouritesListing;
        }
    };



    /*
     ================== updating the models
     */


    /*
     * higher order function to dispatch on listing type
     * @param: updateFunc: method used to update the listing (involves server request)
     * @argObject: contains the needed arguments for the different update functions
     */

    var updateListing = function(argObject, updateFunc){
        if (currentListing.type == "portfolio"){
            portfolioListing = updateFunc(argObject); //update the local model
            currentListing.items = portfolioListing; // update the current listing, which is watched by the controller
            console.log("changed the model");
        }

        else if (currentListing.type == "favourites") {
            favouritesListing = updateFunc(argObject); //update the local model
            currentListing.items = favouritesListing; // update the current listing, which is watched by the controller
            console.log("changed the model");
        }
        else
            console.log("updateListing: currentListing type not recognised "); // TO DO : error handling



    };

    /*
     update functions:
     * they communicate with the server (remote model) and keep the local models consistent
     * @param argObject : optional arguments
     * @return the resulting listing array
     */


    /*
     * adds a publication to the current library (server side) and updates the current listing model
     */
    var addPublication= function(pubToAdd){
        updateListing(pubToAdd, function(pubToAdd){
            // request to server based on currentListingType and pubToAdd
            // if succeeded, we could either:
            // -fetch the publications anew, which renews the local model
            // -save a server request by adding a publication with the new ID and known title to the local listing model

            //stub:
            currentListing.items.push(pubToAdd); //returns an index, not an array!
            return currentListing.items;

        });
    };

    /*
     * removes a publication from the current library (server side) and updates the current listing model
     */
    var removePublication= function(pubIdToRemove){
        updateListing(pubIdToRemove, function(pubIdToRemove) {
            // request to server based on currentListingType and pubToRemove
            // if succeeded, we could either:
            // -fetch the publications anew, which renews the local model
            // -save a server request by removing the new publication from the local listing model


            //stub:
            var changedArray = currentListing.items.filter(function (element) {
                return element.ID !== pubIdToRemove;
            });


            return changedArray;
        });
    };


    /*
     ================== factory config
     */


    var factory = {
        switchTo : switchTo,
        currentListing : currentListing,  // only an export of currentListing is needed, the local model of 'favourites' and 'portfolio' is kept 'private'
        addPublication: addPublication,
        removePublication : removePublication
    };
    return factory;

});