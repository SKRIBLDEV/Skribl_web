describe('loginController', function() {
  beforeEach(module('skriblApp'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('$scope.login', function() {
    it('Tries to login with a testUser', function() {
      var $scope = {};
      var controller = $controller('loginController', { $scope: $scope, $http, $location, $appData });
      $scope.userinput.username = "username";
      $scope.userinput.password = "testPassword123";

      $scope.login();

      waitsFor(function(){
        return $appData.currentUser != null;
      }, "The login method has failed",5000);

      expect($appData.currentUser.username).toEqual($scope.userinput.username);
      expect($appData.currentUser.password).toEqual($scope.userinput.password);
    });
  });
});




