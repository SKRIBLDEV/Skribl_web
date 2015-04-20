webapp.directive('basicPubList', function (searchService) {
    console.log("directive instantiated");
    return {
        restrict: 'E', //use this directive as an attribute of an element that has an "pubArray = ..." attribute (-> to select the array, present in the scope, that should be displayed)
        replace: true,
        link: function (scope, element, attrs) {

            if (attrs.pubarray == "internal"){
                console.log("here: " + searchService.internalResults);

                element.html(
                    '<div ng-repeat="publicationArray in searchService.internalResults"> <p>{{publicationArray[0].title}}</p> </div>'

                );
            }
            console.log(scope.searchResults);
            console.log(attrs);
            console.log(attrs.pubarray);
            console.log(searchService.internalResults);
        }
    }
});




