import angular from 'angular';

export class CardComponent {
  constructor($scope) {
    'ngInject';
    this.$scope = $scope;
  }
}

export default angular.module('directives.card', [])
  .component('card', {
    template: require('./card.html'),
    controller: CardComponent,
    transclude: true,
    bindings: {
      title: '@',
      subtitle: '@',
      switch: '=',
      switchFunction: '=',
      spinner: '@',
      loading: '='
    }
  })
  .name;
