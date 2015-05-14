webapp.directive('appendableListing', function () {
      
    var localCtrl = ['$scope', function ($scope) {

          function init() {
              $scope.appended = [];
          }
          init();

          $scope.addItem = function () {
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
          templateUrl : 'templates/appendableListing.html'
      };
  });

webapp.directive('appendableListingAuthor', function () {
      
    var localCtrl = ['$scope', function ($scope) {

          function init() {
              $scope.appended = [];
          }
          init();

          $scope.addItem = function () {
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
          templateUrl : 'templates/appendableListingAuthor.html'
      };
  });