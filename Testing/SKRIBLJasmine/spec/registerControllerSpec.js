describe('registerController', function() {
  beforeEach(module('skriblApp'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('$scope.register', function() {
    it('Tries to register an user', function() {
      var $scope = {};
      var controller = $controller('registerController', { $scope: $scope, $http, $location, $appData });
      $scope.userinput.username = "username";
      $scope.userinput.firstName = "firstName";
      $scope.userinput.lastName = "lastName";
      $scope.userinput.language = "english";
      $scope.userinput.password = "testPassword123";
      $scope.userinput.email = "testEmail@vub.ac.be";
      $scope.userinput.institution = "testInstitution";
      $scope.userinput.faculty = "testFaculty";
      $scope.userinput.department = "testDepartment";
      $scope.userinput.researchDomains = "tesetResearchDomains";
      $scope.userinput.researchGroup = ["testResearchGroup"];

      $scope.register();

      waitsFor(function(){
      	return $appData.currentUser != null;
      }, "The register method has failed",5000);

      expect($appData.currentUser.username).toEqual($scope.userinput.username);
      expect($appData.currentUser.firstName).toEqual($scope.userinput.firstName);
      expect($appData.currentUser.lastName).toEqual($scope.userinput.lastName);
      expect($appData.currentUser.language).toEqual($scope.userinput.language);
      expect($appData.currentUser.password).toEqual($scope.userinput.password);
      expect($appData.currentUser.email).toEqual($scope.userinput.email);
      expect($appData.currentUser.institution).toEqual($scope.userinput.institution);
      expect($appData.currentUser.faculty).toEqual($scope.userinput.faculty);
      expect($appData.currentUser.department).toEqual($scope.userinput.department);
      expect($appData.currentUser.researchDomains).toEqual($scope.userinput.researchDomains);
      expect($appData.currentUser.researchGroup).toEqual($scope.userinput.researchGroup);
    });
  });
});




