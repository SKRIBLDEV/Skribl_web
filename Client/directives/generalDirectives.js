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


webapp.directive('appendableListing', function () {
      
    var localCtrl = ['$scope', function ($scope) {

          function init() {
              $scope.appended = [];
          }

          init();

          $scope.addItem = function () {
              //$scope.add();

              //Add new input field to directive scope
              $scope.appended.push("");
          };
      }];
        
      return {
          restrict: 'EA', //use as element or attribute 
          scope: {
              datasource: '=',
              newPlaceholder: '='
          },
          controller: localCtrl,
          //template: template
          templateUrl : 'templates/appendableListing.html'
      };
  });