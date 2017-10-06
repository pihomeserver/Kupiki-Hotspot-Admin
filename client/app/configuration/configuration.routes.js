'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider .state('configuration', {
    abstract: true,
    url: '/configuration',
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

  $stateProvider.state('configuration.basic', {
    url: '/basic',
    authenticate: true,
    views: {
      'content@': {
        template: require('./basic/basic.html'),
        controller: 'BasicController',
        controllerAs: 'vm'
      }
    }
  });

  $stateProvider.state('configuration.advanced', {
    url: '/advanced',
    authenticate: true,
    views: {
      'content@': {
        template: require('./advanced/advanced.html'),
        controller: 'AdvancedController',
        controllerAs: 'vm'
      }
    }
  });

  $stateProvider.state('configuration.security', {
    url: '/security',
    authenticate: true,
    views: {
      'content@': {
        template: require('./security/security.html'),
        controller: 'SecurityController',
        controllerAs: 'vm'
      }
    }
  });
}
