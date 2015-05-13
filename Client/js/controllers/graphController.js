/**
 * Created by Hannah_Pinson on 18/04/15.
 */

// see also: graph directive, dash-network.html

webapp.controller('GraphCtrl', function GraphCtrl($scope, networkService, appData) {


    getGraphData = function() {
        $scope.graphDataLoading = true; //show spinner
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
    

    $scope.changeNetwork = function(currentProfileData){ //somehow this additional step is needed to make this scope notice the change
        appData.setCurrentNetworkAuthor(currentProfileData);
        $scope.currentNetworkAuthor = appData.currentNetworkAuthor;
    }

    $scope.$watch('currentNetworkAuthor', function(){
        //clear "canvas"
        d3.select(".svg-network").remove();
        getGraphData();
    })

    $scope.linkClicked = false;
        
    


});