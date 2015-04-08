webapp.directive('globalMenu',function(){
return {
		restrict: 'E',
		scope: false,
		templateUrl: 'templates/globalMenu.html'
	}

}).directive('fixedMenu',function(){
return {
		restrict: 'E',
		scope: false,
		templateUrl: 'templates/fixedMenu.html'
	}

}).directive('userCard',function(){
return {
		restrict: 'E',
		scope: false,
		templateUrl: 'templates/userCard.html'
	}

}).directive('publicationsCard',function(){
return {
		restrict: 'E',
		scope: false,
		templateUrl: 'templates/publicationsCard.html'
	}

}).directive('publicationViewerCard',function(){
	return {
		restrict: 'E',
		scope:false,
		templateUrl: 'templates/publicationViewerCard.html'
	}

}).directive('interactiveGraphCard',function(){
	return {
		restrict: 'E',
		scope:false,
		templateUrl: 'templates/interactiveGraphCard.html'
	}
});


