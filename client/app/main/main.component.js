'use strict';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
  /*@ngInject*/
  // constructor($http, $scope, socket) {
  constructor($http) {
    this.$http = $http;
    // this.socket = socket;

    // $scope.$on('$destroy', function() {
    //   socket.unsyncUpdates('thing');
    // });
  }

  $onInit() {
    this.$http.get('/api/cpu')
      .then(response => {
        this.cpu = response.data;
        this.cpu.class = "bg-info";
        if (this.cpu.percent > 60) this.cpu.class = "bg-warning";
        if (this.cpu.percent > 90) this.cpu.class = "bg-danger";
      });
    this.$http.get('/api/disk')
      .then(response => {
        this.disk = response.data;
        this.disk.class = "bg-info";
        if (this.disk.percent > 60) this.disk.class = "bg-warning";
        if (this.disk.percent > 90) this.disk.class = "bg-danger";
      });
    this.$http.get('/api/information')
      .then(response => {
        this.information = response.data;
      });
    this.$http.get('/api/memory')
      .then(response => {
        this.memory = response.data;
        this.memory.class = "bg-info";
        if (this.memory.percent > 60) this.memory.class = "bg-warning";
        if (this.memory.percent > 90) this.memory.class = "bg-danger";
      });
    this.$http.get('/api/services')
      .then(response => {
        this.services = response.data;
      });
    this.$http.get('/api/uptime')
      .then(response => {
        this.uptime = response.data;
        this.uptime.class = "bg-info";
        if (this.uptime.percent > 60) this.uptime.class = "bg-warning";
        if (this.uptime.percent > 90) this.uptime.class = "bg-danger";
      });
  }

  // addThing() {
  //   if(this.newThing) {
  //     this.$http.post('/api/things', {
  //       name: this.newThing
  //     });
  //     this.newThing = '';
  //   }
  // }

  // deleteThing(thing) {
  //   this.$http.delete(`/api/things/${thing._id}`);
  // }
}

export default angular.module('kupikiHotspotAdminApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
