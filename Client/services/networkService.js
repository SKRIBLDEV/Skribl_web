/**
 * Created by Hannah_Pinson on 19/04/15.
 */

webapp.factory('networkService', function networkService($http, appData) {


    function getGraphData() {
        var currentId = appData.currentUser.authorId.replace('#', '');
        var url = serverApi.concat('/authors/').concat(currentId).concat('/graph?limit=6');
        var authorization = {}; // no auth necessary

        return $http.get(url, authorization)
            .success(function (data) {
                service.graphData = data;
            })
            .error(function (http, status) {
                console.log("failed", http, status);
            })
    }

    var currentPubInCommon = [{title: "test"}]; // publications two authors have in common, used when a link in the graph is clicked
    //not needed outside of network, therefore stored here instead of in the appdata service


    // interface
    var service = {
        currentPubInCommon: currentPubInCommon,
        graphData: {},
        getGraphData: getGraphData
    };

    return service;

});

