describe('dashboardController', function() {
  beforeEach(module('skriblApp'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('$scope.logout', function() {
    it('Tries to logout', function() {
      var $scope = {};
      var controller = $controller('dashboardController', { $scope: $scope, $location, $appData });

      $scope.login();

      waitsFor(function(){
        return $appData.currentUser == null;
      }, "The logout method has failed",5000);
    });
  });
});




