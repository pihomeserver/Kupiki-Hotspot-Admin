'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider .state('management', {
    abstract: true,
    url: '/management',
    authenticate: true,
    views: {
      'navbar': {
        template: '<navbar></navbar>'
      },
      'sidebar': {
        template: '<sidebar></sidebar>'
      }
    }
  });

  $stateProvider.state('management.users', {
    url: '/mgmtusers',
    authenticate: true,
    views: {
      'content@': {
        template: require('./users/users.html'),
        controller: 'UsersMgmtController',
        controllerAs: 'vm'
      }
    }
  });

  $stateProvider.state('management.user', {
    url: '/mgmtuser/:username',
    authenticate: true,
    views: {
      'content@': {
        template: require('./user/user.html'),
        controller: 'UserMgmtController',
        controllerAs: 'vm'
      }
    }
  });
}
