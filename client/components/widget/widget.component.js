import angular from 'angular';

export class WidgetComponent {
  constructor() {
    'ngInject';
  }
}

export default angular.module('directives.widget', [])
  .component('widget', {
    template: require('./widget.html'),
    controller: WidgetComponent,
    bindings: {
      bgColor: '@',
      textColor: '@',
      icon: '@',
      title: '@',
      subtitle: '@',
      progress: '@',
      progressColor: '@'
    }
  })
  .name;
