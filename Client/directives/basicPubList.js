webapp.directive('basicPubList', function (searchService) {
    console.log("directive instantiated");
    return {
        restrict: 'E', //use this directive as an attribute of an element that has an "pubArray = ..." attribute (-> to select the array, present in the scope, that should be displayed)
        replace: true,
        link: function (scope, element, attrs) {
            console.log(scope.searchResults);
            console.log(attrs);
            console.log(attrs.pubArray);
            console.log(searchService.internalResults);
        }
    }
});




