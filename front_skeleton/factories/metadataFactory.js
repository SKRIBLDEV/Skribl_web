/**
 * Created by Hannah_Pinson on 12/04/15.
 */


var webApp = angular.module('webApp');

webApp.factory("metadataFac", function( ) {

    //this factory is for keeping a currentMetadata model to show in the standalone metadata-preview

    //default init
    var currentMetadata = { //changed by custom directives
        "year" : 0
    };

    var setMetadata = function(pubId){
        //server communication needed

        console.log("previous metadata year:" + currentMetadata.year);

        console.log("looking for the correct metadata");

        //stub:
        var metadata = [
            {"ID": 0, "year": 2001},
            {"ID": 1, "year": 2011},
            {"ID": 2, "year": 2014},
            {"ID": 3, "year": 2009},
            {"ID": 4, "year": 2011},
            {"ID": 100, "year": 1987}
        ];

        var filtered = metadata.filter(function(element) { return element.ID == pubId; });

        if (filtered[0])
            currentMetadata = filtered[0];
        else
            console.log("Id doesn't match!");


        console.log("current metadata year: " + currentMetadata.year )



    };


    var factory = {
        currentMetadata : currentMetadata, //watched by the controller
        setMetadata : setMetadata
    };
    return factory;



});