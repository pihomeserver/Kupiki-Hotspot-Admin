import angular from 'angular';

export class CardComponent {
  constructor() {
    'ngInject';
  }
}

export default angular.module('directives.card', [])
  .component('card', {
    template: require('./card.html'),
    controller: CardComponent,
    transclude: true,
    bindings: {
      title: '@'
    }
  })
  .name;
