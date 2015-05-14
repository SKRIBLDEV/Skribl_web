
// this is a stub controller
// load this script in the index.html file to login and go to dashboard, without use of the skribl back-end

angular.module('skriblApp').controller('homeController', function(appData, $state) {

    appData.currentUser = {
        username: "devUser",
        authorId: "13:205",
        firstName: "Dev",
        lastName: "Elopuser"
    };


// change route to #/dashboard
    $state.go('dashboard.library');
    //$location.path('/dashboard');
});
