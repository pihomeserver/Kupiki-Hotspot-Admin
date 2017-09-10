'use strict';

import angular from 'angular';

export function KupikiModal($rootScope, $uibModal) {
  'ngInject';

  function openModal(scope = {}, modalClass = 'kupikiModal-default') {
    var modalScope = $rootScope.$new();

    angular.extend(modalScope, scope);

    return $uibModal.open({
      templateUrl: '../../components/kupikiModal/kupikiModal.html',
      animation: false,
      size: 'md',
      windowClass: modalClass,
      scope: modalScope
    });
  }

  return {
    confirmModal: function (modalScope = {}, modalClass = 'kupikiModal-default', confirmFunc) {
      var modalOptions = $rootScope.$new();
      angular.extend(modalOptions, modalScope);

      modalOptions.buttons= [{
        classes: 'btn-danger',
        text: 'Confirm',
        click(e) {
          modalObj.close(e);
        }
      }, {
        classes: 'btn-default',
        text: 'Cancel',
        click(e) {
          modalObj.dismiss(e);
        }
      }];

      var modalObj = openModal({
        modal: modalOptions
      }, modalClass);
      modalObj.result.then(function(event) {
        Reflect.apply(confirmFunc, undefined, event);
      }).catch(function() {});
    }
  }
}

export default angular.module('kupikiHotspotAdminApp.KupikiModal', [])
  .factory('KupikiModal', KupikiModal)
  .name;
