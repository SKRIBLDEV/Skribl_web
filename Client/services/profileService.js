webapp.factory('profileService', function($http, appData, serverService){
	var currentProfileData = {};

	var resetData = function(){
		currentProfileData = {};
	}

	var service = {
		getProfile : function()		{return currentProfileData;},
		setProfile : function(data)	{currentProfileData = data;}
		resetData : resetData
	};
	
	return service;
});