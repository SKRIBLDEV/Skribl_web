// this is a stub controller for implementing the GUI without depending on an external server

webapp.controller('searchCtrl', function GraphCtrl($scope, $http) {

    console.log("controller instantiated");

    $http.get('temp_json/basic_search_data.json')
        .success(function (data) {
           $scope.searchResults = data;
            console.log("****searchdata: "+ $scope.searchResults );
        }).error(function (data, status) {
                console.log('Error: ' + status);
        });

});
