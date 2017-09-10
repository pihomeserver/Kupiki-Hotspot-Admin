import angular from 'angular';

export class KupikiButtonComponent {
  constructor() {
    'ngInject';
  }
}

export default angular.module('directives.kupikiButton', [])
  .component('kupikiButton', {
    template: require('./kupikiButton.html'),
    controller: KupikiButtonComponent,
    transclude: true,
    bindings: {
        title: '@',
        icon: '@'
    }
  })
  .name;
