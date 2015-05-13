// controller : dashController
// view(s) : profileCard


webapp.factory('authorProfileService', function authorProfileService(serverService, appData) {

	var getAuthorPublications = function(authorId){
		serverService.getAuthorPublications(authorId)
			.success(function(pubs){
				console.log(pubs);
				appData.data.authorPublications = data;
			})
			.error(function(err){
				console.log(err);
				appData.data.authorPublications = {};
			})
	}

	var service = {
        getAuthorPublications: getAuthorPublications
    };

    return service;

}); 