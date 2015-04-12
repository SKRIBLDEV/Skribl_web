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

        //library has nested views =======
        .state('dashboard.library', {
            url: '/library',
            templateUrl: 'views/library-main.html'
        })

        //listing part has multiple views
        .state('dashboard.library.listing', {
            url: '/listing',
            views: {
                //main view (relatively named)
                '': {
                    templateUrl: 'views/library-listing-main.html'
                },

                // child view (absolutely named)
                'library-listing@dashboard.library.listing': {
                    controller: 'libListingCtrl',
                    templateUrl: 'views/library-listing.html' },

                // child view (absolutely named)
                'metadata-preview@dashboard.library.listing': {
                    template: 'I am a standalone metadata preview'
                }

            }
        })

        //search part has multiple views
        .state('dashboard.library.search', {
            url: '/search',
            views: {
                //main view (relatively named)
                '': {
                    templateUrl: 'views/library-search-main.html'
                },

                // child view (absolutely named)
                'library-search@dashboard.library.search': {
                    template: 'I am the search window' },

                // child view (absolutely named)
                'metadata-preview@dashboard.library.search': {
                    template: 'I am a standalone metadata preview'
                }

            }
        })

        //upload
        .state('dashboard.library.upload', {
            url: '/upload',
            templateUrl: 'views/library-upload.html'
        });

});


