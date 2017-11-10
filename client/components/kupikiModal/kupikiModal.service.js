'use strict';

import angular from 'angular';

export function KupikiModal($rootScope, $uibModal, $compile) {
  'ngInject';

  function openModal(scope = {}, modalClass = 'default') {
    var modalScope = $rootScope.$new();

    angular.extend(modalScope, scope);

    return $uibModal.open({
      template: require('./kupikiModal.html'),
      animation: false,
      size: 'md',
      windowClass: 'modal-' + modalClass,
      scope: modalScope
    });
  }

  return {
    confirmModal: function (modalScope = {}, modalClass = 'default', parent = undefined, confirmFunc) {
      var modalOptions = $rootScope.$new();
      if (parent && parent.$scope) modalOptions = parent.$scope.$new();
      angular.extend(modalOptions, modalScope);

      modalOptions.buttons= [{
        classes: 'btn-'+modalClass,
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
      modalObj.rendered.then(function(event) {
        if (modalOptions.bindHtml) {
          let linkFunc = $compile(modalOptions.bindHtml);
          linkFunc(modalOptions, function (compElement) {
            angular.element(document.getElementById('bindHtmlElement')).html('');
            angular.element(document.getElementById('bindHtmlElement')).append(compElement);
          });
        }
      });
      modalObj.result.then(function(event) {
        Reflect.apply(confirmFunc, undefined, event);
      }).catch(function() {});
    }
  }
}

export default angular.module('kupikiHotspotAdminApp.KupikiModal', [])
  .factory('KupikiModal', KupikiModal)
  .name;
