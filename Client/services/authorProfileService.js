// controller : dashController
// view(s) : profileCard


webapp.factory('authorProfileService', function authorProfileService(serverService, appData) {

	var getAuthorPublications = function(authorId){
		serverService.getAuthorPublications(authorId)
			.success(function(pubs){
				console.log(pubs);
			})
			.error(function(err){
				console.log(err);
			})
	}

	getAuthorPublications("#13:329");

}); 