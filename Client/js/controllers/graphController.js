/**
 * Created by Hannah_Pinson on 18/04/15.
 */
webapp.controller('GraphCtrl', function GraphCtrl(appData, $scope, $http) {

    console.log("userId: " + appData.currentUser.authorId);

    var currentId = appData.currentUser.authorId;
    var url = serverApi.concat('/authors/').concat(currentId).concat('/graph?limit=6');
    var authorization = {}; // no auth necessary


    $scope.graphDataReady = false;

    $http.get(url, authorization)
        .success(function (data) {
            console.log(data);
            $scope.graphData = data;
            $scope.graphDataReady = true; //ugly fix! -> after installment of router-UI, this could be fixed with 'resolving'
            $scope.$broadcast("Graph_Ready"); // ugly fix!
        }).error(function (data, status) {
            console.log('Error: ' + status);
            toast("We are unable to display your network, please try again later.", 4000);
        });

});
