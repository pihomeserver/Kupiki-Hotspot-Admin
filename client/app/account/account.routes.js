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
      },
      onEnter: function(){
        $("body.app").toggleClass('sidebar-fixed').toggleClass('header-fixed');
        $("div[name=content]").toggleClass('margin-top-15px');
      },
      onExit: function(){
        $("body.app").toggleClass('sidebar-fixed').toggleClass('header-fixed');
        $("div[name=content]").toggleClass('margin-top-15px');
        // $(document.body).css('background', '');
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
