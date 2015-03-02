
/**
 * Initialisation of the dashController (an angular controller),
 * has an symbiotic relationship with dashboard.html
 * 
 * @param  {object} $scope    	the scope object of the controller
 * @param  {object} $http 		abstraction for making http-related calls (ex: ajax)
 * @param  {object} $location 	for switching between routes/views
 * @param  {object} appData  	our custom service for shared data

 */

webapp.controller('dashController', function($scope, $http, $location, appData) {

//------------------------------------------------INITIALIZATION--------------------------------------------------//
	//Control if user has already loged in, or if he tries to go the dashboard without login in.
	if(!(appData.currentUser))
	{
		$location.path('/home');
		return;
	}
    else {appData.currentUser.publications = null;
	      $scope.userinput = {};};

	/**
	 * duplication of the username to be used in Dashboard.html
	 * @type {String}
	 */
	$scope.username = appData.currentUser.username;
    
    //Used to display loading screen when necessary
    $scope.busy = false;
    $scope.$watch('busy',function(newValue, oldValue){console.log("loading screen on/off");},true);
//------------------------------------------------INITIALIZATION--------------------------------------------------//
    
//------------------------------------------------MANAGE USER/SESSION-------------------------------------------------//
	 // The logout function
	$scope.logout = function() {
		$location.path('/home');
		appData.currentUser = null;
	};
	//The delete function
	$scope.deleteUser = function(){
		var path = serverApi.concat('/users/').concat($scope.username);
		var config = {headers:  {
		        'Authorization': appData.Authorization
		    }
		};
		var deleteRequest = $http.delete(path,config);

		deleteRequest.success(function(data, status, headers, config) {
			$scope.logout();

		});
		deleteRequest.error(function(data, status, headers, config) {
			//Error while deleting user
			console.log('delete user failed');
			});
	};
//------------------------------------------------MANAGE USER/SESSION-------------------------------------------------//
    
//------------------------------------------------MANAGE PUBLICATIONS-------------------------------------------------//
    //the function sending the given file to an url with the authorization
    $scope.uploadPublication = function(file, url, authorization){
        var fd = new FormData();
        fd.append('inputFile', file); //link the file to the name 'inputFile'
        $http.put(url, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined,
                     'Authorization': authorization}
        })
        .success(function(data, status, headers, config){
            publicationID = data.id.substring(1);
            $scope.uploadMetaData(publicationID);//when publication is added to database metadata of publication needs to be send/updated (currently empty)
            console.log('file uploaded');
            //TODO Publication added to db message
        })
        .error(function(){
            //TODO error melding -->try again
            console.log('failed to upload file !')
            $scope.busy = false;
        });
    }
    
    //preparation for the uploadPublication function
    $scope.uploadFile = function(){
        $scope.busy = true;
        var file = $scope.myFile;
        var url = serverApi.concat('/publications');
        var authorization = appData.Authorization;
        $scope.uploadPublication(file, url, authorization);
    };
    
    //updates the currently available metadata
    $scope.uploadMetaData = function(publicationID){
        var uploadingPaper = false;
        if($scope.busy){uploadingPaper = true;}
        else {$scope.busy = true;};
        var url = serverApi.concat('/publications/').concat(publicationID);
        var config = {headers:  {
		        'Authorization': appData.Authorization
		}};
        var metaData = {'title': $scope.userinput.title, //get all the fields
                        'authors': [{'firstName': $scope.userinput.authorsFirst, 'lastName': $scope.userinput.authorsLast}],
                        'journal': $scope.userinput.journalName, 
                        'volume': $scope.userinput.journalVolume,
                        'number': $scope.userinput.journalNumber,
                        'year': $scope.userinput.year,
                        'publisher': $scope.userinput.publisher,
                        'abstract': undefined,
                        'citations': undefined,
                        'article_url': undefined,
                        'keywords': $scope.userinput.keywordFirst.concat('+').concat($scope.userinput.keywordSecond).concat('+').concat($scope.userinput.keywordThird)};
        
        var metaDataRequest = $http.post(url,metaData,config);
		metaDataRequest.success(function(data, status, headers, config) {
            //TODO if uploadingPaper = true adding papper succes, if uploadingPaper = false updating metaData succes.
            $scope.busy = false;
            console.log('metdata uploaded');
		});
		metaDataRequest.error(function(data, status, headers, config) {
			//TODO if uploadingPaper = true adding meta data of papper failed but paper is uploaded, if uploadingPaper = false updating metaData failed.
            console.log('failed to send metadata');
            $scope.busy = false;
			});
    }
    
    //delete a publication of the db
    $scope.deletePublication = function(publicationID){
        $scope.busy = true;
        var url = serverApi.concat('/publications/').concat(publicationID);
        var config = {headers:  {
		        'Authorization': appData.Authorization
		    }};
        var deletePublicationRequest = $http.delete(url,config);
        
        deletePublicationRequest.success(function(data, status, headers, config) {
            //TODO deleting publication success message
            $scope.busy = false;
            console.log('file deleted');
		});
		deletePublicationRequest.error(function(data, status, headers, config) {
			//TODO deleting publication failed --> try again
            $scope.busy = false;
			});
    }
    
    //function to get the meta data of a specific publication.
    $scope.getMetaData = function(publicationID){
        $scope.busy = true;
        var url = serverApi.concat('/publications/').concat(publicationID);
        var getMetaDataRequest = $http.get(url, config);
        
        getMetaDataRequest.success(function(data, status, headers, config) {
            //TODO get metaData success --> show meta data
            $scope.currentMetaData = data;
            $scope.busy = false;
            console.log(data);
		});
		getMetaDataRequest.error(function(data, status, headers, config) {
			//TODO get metaData failed --> try again
            $scope.busy = false;
        });
    }
    
    //function to download a file
     $scope.getFile = function(publicationID){
        $scope.busy = true;
        var url = serverApi.concat('/publications/').concat(publicationID).concat('?download=true');
        var getFileRequest = $http.get(url, config);
        
        getFileRequest.success(function(data, status, headers, config) {
            //TODO get file success --> preview
            console.log(data);
            $scope.busy = false;
		});
		getFileRequest.error(function(data, status, headers, config) {
			//TODO get file failed --> try again
            $scope.busy = false;
        });
    }
    
    //function to get the publications of a certain user.
    $scope.getUserPublications = function(libraryName){
        $scope.busy = true;
        var url = serverApi.concat('/user/').concat($scope.username).concat('/library/').concat(libraryName);
        var config = {headers:  {
		        'Authorization': appData.Authorization
		    }};
        var getUserPublicationsRequest = $http.get(url,config);
        getUserPublicationsRequest.success(function(data, status, headers, config) {
            //TODO show users publications.
            appData.currentUser.publications = data;
            console.log(appData.currentUser.publications);
            $scope.busy = false;
		});
		getUserPublicationsRequest.error(function(data, status, headers, config) {
			//TODO get publications failed --> try again
            $scope.busy = false;
        });
    }
    
    //array that will be filled with currentPublication titles on a assynchronous way before being pushed to appData.currentUser.publicationsTitles.
    $scope.publicationTitles = [];
    //function that will control if the assynchronous filling of $scope.publicationTitles is finished.
    $scope.$watch('publicationTitles',
                  function(newValue, oldValue) {
                    if(newValue == oldValue){return;};
                    if($scope.publicationTitles.length == appData.currentUser.publications.length)
                    {appData.currentUser.publicationsTitles = $scope.publicationTitles;
                    $scope.busy = false;
                    console.log(appData.currentUser.publicationsTitles  );}},
                  true);
    
    $scope.getCurrentPublicationTitles = function(){
        $scope.busy = true;
        var publications = appData.currentUser.publications;
        for (i = 0; i < publications.length; i++) { 
            var publicationID = publications[i].substring(1);
            var url = serverApi.concat('/publications/').concat(publicationID);
            var getMetaDataRequest = $http.get(url, config);
            getMetaDataRequest.success(function(data, status, headers, config) {
                $scope.publicationTitles.push(data.title);});
            getMetaDataRequest.error(function(data, status, headers, config) {
			//TODO get metaData failed --> try again later
            });
        };
    }
    
});
//------------------------------------------------MANAGE PUBLICATIONS-------------------------------------------------//