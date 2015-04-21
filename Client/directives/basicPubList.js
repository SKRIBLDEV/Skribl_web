/*webapp.directive('basicPubList', function () {
 console.log("directive instantiated");
 return {
 restrict: 'E',
 replace: false,
 template: '<div ng-repeat="publication in internalResults"> <p>{{publication.title}}</p> </div>',
 link: function (scope, element, attrs) {

 scope.$on("search completed", function(){

 if (attrs.pubarray == "internal") {
 console.log("here: " + scope.internalResults[0].title);
 /*element.html(
 '<div ng-repeat="publication in internalResults"> <p>{{internalResults[0].title}}</p> </div>'
 );
 }

 });

 }
 }
 });*/




webapp.directive('onEnter', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind("keypress", function (event) {
                if (event.keyCode === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.onEnter);
                    });
                    event.preventDefault();
                }
            });
        }
    }
});