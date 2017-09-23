'use strict';

export function routeConfig($urlRouterProvider, $locationProvider, toastrConfig) {
  'ngInject';

  $urlRouterProvider.otherwise('/system/sysdashboard');

  $locationProvider.html5Mode(true);

  angular.extend(toastrConfig, {
    autoDismiss: false,
    containerId: 'toast-container',
    maxOpened: 0,
    newestOnTop: true,
    positionClass: 'toast-top-right',
    preventDuplicates: false,
    preventOpenDuplicates: false,
    target: 'body'
  });
}
