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

}).directive('uploadCard',function(){
	return {
		restrict: 'E',
		scope: false,
		templateUrl: 'templates/uploadCard.html'
	}

}).directive('publicationViewerCard',function(){
	return {
		restrict: 'E',
		scope:false,
		templateUrl: 'templates/publicationViewerCard.html'
	}

}).directive('publicationList',function(){
	return {
		restrict: 'E',
		scope: false,
		templateUrl: 'templates/publicationList.html'
	}

}).directive('interactiveGraphCard',function(){
	return {
		restrict: 'E',
		scope:false,
		templateUrl: 'templates/interactiveGraphCard.html'
	}

}).directive('editMetaData',function(){
	return {
		restrict: 'E',
		scope:false,
		templateUrl: 'templates/editMetaData.html'
	}

}).directive('spinner',function(){
	return {
		restrict: 'E',
		scope:false,
		templateUrl: 'templates/spinner.html'
	}
}).directive('searchCard', function(){
	return {
		restrict: 'E',
		templateUrl: 'templates/searchCard.html'
	}
}).directive('pdfviewerCard', function(){
	return {
		restrict: 'E',
		templateUrl: 'templates/pdfviewerCard.html'
	}
}).directive('metadataCard', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/metadataCard.html'
	}
});


