'use strict';

import * as _ from 'lodash';
import angular from 'angular';
import io from 'socket.io-client';

function Socket(socketFactory) {
  'ngInject';
  // socket.io now auto-configures its connection when we ommit a connection url

  var ioSocket = io('', {
    // Send auth token on connection, you will need to DI the Auth service above
    // 'query': 'token=' + Auth.getToken()
    path: '/socket.io-client'
  });

  var socket = socketFactory({
    ioSocket
  });

  return {
    socket,

    syncUpdates(socketEvent, array, cb) {
      cb = cb || angular.noop;

      socket.on(`${socketEvent}`, function(item) {
        var event = 'deleted';
        _.remove(array, {
          _id: item._id
        });
        cb(event, item, array);
      });
    },

    unsyncUpdates() {
      socket.removeAllListeners(`${socketEvent}`);
    }
  };
}

export default angular.module('kupikiHotspotAdminApp.socket', [])
  .factory('socket', Socket)
  .name;
