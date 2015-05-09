/**
 * Created by Hannah_Pinson on 18/04/15.
 */


webapp.controller('GraphCtrl', function GraphCtrl($scope, networkService) {


    $scope.graphDataLoading = true; //show spinner

    this.getGraphData = function() {
        networkService.getGraphData()
            .success(function(graphData) {
                $scope.graphData = graphData;
                $scope.graphDataLoading = false; // stop showing spinner
                $scope.$broadcast("Graph_Ready"); //notify directive to display graph

            })
            .error(function() {
                $scope.graphDataLoading = false; // stop showing spinner
                $scope.$broadcast("Graph_Failed"); //notify directive to display textual replacement
                toast("We are unable to display your network, please try again later.", 4000);
            });
    };

    this.getGraphData();



});
