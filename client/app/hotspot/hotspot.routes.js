'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider .state('hotspot', {
    abstract: true,
    url: '/hotspot',
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

  $stateProvider.state('hotspot.configuration', {
    url: '/hotspotadmin',
    authenticate: true,
    views: {
      'content@': {
        template: require('./hotspotadmin/hotspotadmin.html'),
        controller: 'HotspotadminController',
        controllerAs: 'vm'
      }
    }
  });
}
