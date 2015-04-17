webapp.controller('GraphCtrl', function GraphCtrl($scope, $http) {

    $scope.graphDataReady = false;

    $http.get('temp_json/graph_data.json')
        .success(function (data) {
            $scope.graphData = data;
            $scope.graphDataReady = true; //ugly fix! -> after installment of router-UI, this could be fixed with 'resolving'
            $scope.$broadcast("Graph_Ready"); // ugly fix!
        }).error(function (data, status) {
            if (status === 404) { //to do: reflect error in view
                console.log('That repository does not exist');
            } else {
                console.log('Error: ' + status);
            }
        });

});
