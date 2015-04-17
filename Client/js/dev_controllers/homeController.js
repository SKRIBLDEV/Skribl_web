
// this is a stub controller
// load this script in the index.html file to login and go to dashboard, without use of the skribl back-end

angular.module('skriblApp').controller('homeController', function(appData, $location) {

    appData.currentUser = {
        username: "devUser",
        firstName: "Dev",
        lastName: "Elopuser"
    };


// change route to #/dashboard
    $location.path('/dashboard');
});
