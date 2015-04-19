/**
 * Created by Hannah_Pinson on 19/04/15.
 */

webapp.factory('networkService', function networkService($http, appData) {


    function getGraphData() {

        console.log(appData.currentUser);

        var currentId = appData.currentUser.authorId.replace('#', '');
        console.log(currentId);
        //'13:227'
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


    // interface
    var service = {
        graphData: {},
        getGraphData: getGraphData
    };

    return service;

});

