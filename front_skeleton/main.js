/**
 * Created by Hannah_Pinson on 10/04/15.
 */
var webApp = angular.module('webApp', ['ui.router']);

// configure our ui-routes
webApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    /*
     * changes views of application based on the state of the application, not just based on the routes
     * you can defined states and multiple/nested views belonging to that state, each with an own template, controller, etc.
     * -> clean design for a single page application
     */


    $stateProvider

        // HOME STATE =============================================

        .state('home', {
            url: '/home',
            templateUrl: 'views/home.html'
        })


        // DASHBOARD STATE ========================================
        .state('dashboard', {
            url: '/dashboard',
            templateUrl : 'views/dashboard.html'
        })

        .state('dashboard.profile', {
            url: '/profile',
            template: 'Here comes the profile info.'
        })

        .state('dashboard.network', {
            url: '/network',
            template: 'Here comes the network.'
        })

        //library has multiple views
        .state('dashboard.library', {
            url: '/library',
            views:{

                //main view
                '': {
                    controller: 'libCtrl',
                    templateUrl: 'views/library.html'
                },

                // child view (absolutely named)
                'columnOne@dashboard.library': { template: 'Look I am a column' },

                // child view (absolutely named)
                'columnTwo@dashboard.library': {
                    template: 'Look I am the second column'
                }

            }

        });


});


