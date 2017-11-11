'use strict';

export function routeConfig($urlRouterProvider, $locationProvider, toastrConfig, $translateProvider) {
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

  $translateProvider.useStaticFilesLoader({
    prefix: '/assets/lang/locale-',
    suffix: '.json'
  });

  $translateProvider
    .useStaticFilesLoader({
      prefix: '/assets/lang/locale-',
      suffix: '.json'
    })
    .preferredLanguage('en')
    .fallbackLanguage('en')
    .useSanitizeValueStrategy('');
}
