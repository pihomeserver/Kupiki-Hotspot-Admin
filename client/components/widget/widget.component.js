import angular from 'angular';

export class WidgetComponentCtrl {
  constructor() {
    'ngInject';
  }

  $onChanges(changesObj) {
    if (changesObj.chartData && this.chartData) {
      this.data = JSON.parse(this.chartData);
      this.labels = JSON.parse(this.chartLabels);
    }
    if (changesObj.chartMaxY && this.chartMaxY) {
      this.options.scales.yAxes[0].ticks.max = parseInt(this.chartMaxY)
    }
  }

  $onInit() {
    let vm = this;

    vm.data = [[]];
    vm.labels = [];

    vm.colors = [{
      backgroundColor: 'rgba(255,255,255,.1)',
      borderColor: 'rgba(255,255,255,.45)',
    }];
    vm.options = {
      maintainAspectRatio: false,
      tooltips: {
        enabled: false
      },
      scales: {
        xAxes: [{
          display: false
        }],
        yAxes: [{
          display: false,
          ticks: {
            beginAtZero: true
          }
        }]
      },
      elements: {
        line: {
          borderWidth: 2
        },
        point: {
          radius: 0
        },
      },
    }
  }
}

export default angular.module('directives.widget', [])
  .component('widget', {
    template: require('./widget.html'),
    controller: WidgetComponentCtrl,
    bindings: {
      bgColor: '@',
      textColor: '@',
      icon: '@',
      title: '@',
      subtitle: '@',
      progress: '@',
      progressColor: '@',
      chartLabels: '@',
      chartData: '@',
      chartMaxY: '@'
    }
  })
  .name;
