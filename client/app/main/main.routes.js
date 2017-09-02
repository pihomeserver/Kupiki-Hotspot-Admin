'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('main', {
    url: '/',
    authenticate: true,
    views: {
      navbar: {
        template: '<navbar></navbar>'
      },
      sidebar: {
        template: '<sidebar></sidebar>'
      },
      content: {
        template: '<main></main>'
      }
    }
  });
}
