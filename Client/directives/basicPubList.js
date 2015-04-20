webapp.directive('basicPubList', function (searchService) {
    console.log("directive instantiated");
    return {
        restrict: 'E', //use this directive as an attribute of an element that has an "pubArray = ..." attribute (-> to select the array, present in the scope, that should be displayed)
        replace: true,
        link: function (scope, element, attrs) {

            scope.$on("search completed", function(){

                if (attrs.pubarray == "internal") {
                    console.log("here: " + searchService.internalResults[0].title);
                    element.html(
                        '<div ng-repeat="publicationArray in searchService.internalResults"> <p>{{publicationarray[0].title}}</p> </div>'
                    );
                }

            });

        }
    }
});




