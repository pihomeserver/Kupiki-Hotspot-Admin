'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('login', {
    url: '/login',
    views: {
      content: {
        template: require('./login/login.html'),
        controller: 'LoginController',
        controllerAs: 'vm'
      }
    }
  })
    .state('logout', {
      url: '/logout?referrer',
      views: {
        content: {
          template: '',
          controller: 'LogoutController',
          controllerAs: 'vm'
        }
      }
    })
    // .state('logout', {
    //   url: '/logout?referrer',
    //   referrer: 'main',
    //   template: '',
    //   controller: function($state, Auth) {
    //     'ngInject';
    //
    //     console.log('logout 1');
    //
    //     var referrer = $state.params.referrer
    //       || $state.current.referrer
    //       || 'main';
    //
    //     console.log('logout 2');
    //
    //     Auth.logout();
    //
    //     console.log('logout 3');
    //
    //     $state.go(referrer);
    //   }
    // })
    .state('settings', {
      url: '/settings',
      authenticate: true,
      views:{
        navbar: {
          template: '<navbar></navbar>'
        },
        sidebar: {
          template: '<sidebar></sidebar>'
        },
        content: {
          template: require('./settings/settings.html'),
          controller: 'SettingsController',
          controllerAs: 'vm'
        }
      }
    });
}
