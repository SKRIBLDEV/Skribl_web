
// this is a stub controller
// load this script in the index.html file to login and go to dashboard, without use of the skribl back-end

angular.module('skriblApp').controller('homeController', function(appData, $state) {

    appData.currentUser = {
        username: "devUser",
        firstName: "Dev",
        lastName: "Elopuser"
    };



    console.log($state);

// change route to #/dashboard
    $state.go('dashboard');
    //$location.path('/dashboard');
});
