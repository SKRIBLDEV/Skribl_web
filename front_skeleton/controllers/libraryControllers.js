/**
 * Created by Hannah_Pinson on 11/04/15.
 */
var webApp = angular.module('webApp');


webApp.controller('libListingCtrl', ['$scope', 'libListingFac', function($scope, libListingFac) {


    //init
    $scope.portfolioListing = libListingFac.portfolioListing;
    $scope.favouritesListing = libListingFac.favouritesListing;
    $scope.currentListingType = "portfolio";
    $scope.currentListing = $scope.portfolioListing;

    /*var changeTo = function(listingType){
        if (listingType == "portfolio"){
            $scope.currentListingType = "portfolio";
            $scope.currentListing = $scope.portfolioListing;
        }

    }*/

    // to switch between listings
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


    // to keep track of changes to the model kept in the factory
    $scope.$watch("portfolioListing", function(newValue, oldValue){
        console.log("noticed a change in the portfolio!");
        $scope.portfolioListing = libListingFac.portfolioListing;
        $scope.currentListing = $scope.portfolioListing;
        console.log($scope.portfolioListing);
    });

    $scope.$watch("favouritesListing", function(newValue, oldValue){
        $scope.favouritesListing = libListingFac.favouritesListing;
    });

    //TO DO: make sure the view updates! (doesn't work yet)
    $scope.$watch("currentListing", function(newValue, oldValue){
        console.log("noticed a change in the current listing!");
        console.log("the current listing is:"  + $scope.currentListing );

    });


    // to reflect changes in a listing in the view
    /*$scope.$on("listing.update", function(event, listing){

        //system check
        if (listingType != $scope.currentListingType)
            console.log("something's wrong: " + listingType + " should equal " + $scope.currentListingType  );

        console.log("controller got the message to update " + listingType + " view");

        console.log("and the view gets updated with: " + listing );

        $scope.currentListing = listing;


        //bind to the updated model
        if ($listingType == "portfolio"){
            $scope.currentListing = libListingFac.portfolioListing;
        }
        else if( listingType == "favourites" )
            $scope.currentListing = libListingFac.favouritesListing;


    })*/


}]);