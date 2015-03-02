//This directive makes it possible to add the 'fileToUpload' attribute to input element in the html code. 
webapp.directive('fileToUpload', ['$parse', function ($parse) {
    return {
        restrict: 'A', //This restricts the directive to be an attribute
        link: function(scope, element, attrs) {
            var filesToUpload = $parse(attrs.fileToUpload); //make a getter of html elements with fileToUpload as attribute. 
            var filesToUploadSetter = filesToUpload.assign; //Transform filesToUpload into a setter that sets the binding of the html element to something else. 
            
            element.bind('change', function(){ //when an element with fileToUpload as argument is changing his binding(user gives a file to the input element) then -->
                scope.$apply(function(){
                    filesToUploadSetter(scope, element[0].files[0]); // --> use the before defined setter to change the binding of the html element to the file given by the user.
                });
            });
        }
    };
}]);



