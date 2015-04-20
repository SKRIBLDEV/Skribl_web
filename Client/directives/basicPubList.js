webapp.directive('basicPubList', 'searchService', function (searchService) {
    return {
        restrict: 'E', //use this directive as an attribute of an element that has an "pubArray = ..." attribute (-> to select the array, present in the scope, that should be displayed)
        replace: true,
        link: function (scope, element, attr) {
            console.log(scope.searchResults);
            console.log(attr);
            console.log(searchService.internalResults);
        }
    }
});




