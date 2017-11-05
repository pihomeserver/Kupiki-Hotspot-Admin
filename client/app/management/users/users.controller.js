'use strict';

export default class UsersMgmtController {
  /*@ngInject*/
  constructor($http, uiGridConstants, $scope, KupikiModal, toastr, $state) {
    this.$http = $http;
    this.uiGridConstants = uiGridConstants;
    this.$scope = $scope;
    this.KupikiModal = KupikiModal;
    this.toastr = toastr;
    this.$state = $state;

    this.showAddUser = 0;

    this.$scope.switchUser = function (user) {
      console.log(user)
    };

    this.$scope.editUser = function (user) {
      $state.go('management.user', { username: user.username });
    };

    this.$scope.deleteUser = function (user) {
      var options = {
        dismissable: true,
        title: 'Delete user',
        html: 'Please confirm that you want to delete the user '+user.username
      };

      KupikiModal.confirmModal(options, 'danger', this, function() {
        $http({
          url: '/api/freeradius/delete',
          method: "POST",
          data: { username : user.username }
        }).then(response => {
            switch (response.data.status) {
              case 'success':
                $scope.vm.users.data = $scope.vm.users.data.filter(userData => {
                  return userData.username !== user.username;
                });

                toastr.success('User ' + user.username + ' has been deleted successfully', 'Delete user');
                break;
              case 'failed':
                toastr.error('Unable to delete user.<br/>Error '+response.data.result.code+'<br/>'+response.data.result.message, 'Delete user', {
                  closeButton: true,
                  allowHtml: true,
                  timeOut: 0
                });
                break;
            }
          })
          .catch(function(error) {
            console.log(error);
            toastr.error('Unable to delete the user<br/>Error '+error.status+'<br/>'+error.statusText, 'Delete user', {
              closeButton: true,
              allowHtml: true,
              timeOut: 0
            });
          });
      });
    };
  }

  checkUser() {
    this.newUserExists = false;
    this.users.data.forEach(elt => {
      if (elt.username === this.newUser) this.newUserExists = true;
    });
  }

  createUser(username) {
    this.$http({
      url: '/api/freeradius/create',
      method: "POST",
      data: { username : username }
    }).then(response => {
      this.$state.go('management.user', { username: username });
    }).catch(error => {
      this.toastr.error('Unable to create the user<br/>Error '+error.status+'<br/>'+error.statusText, 'Users management', {
        closeButton: true,
        allowHtml: true,
        timeOut: 0
      });
    })
  };

  $onInit() {
    this.newUser = '';
    this.newUserExists = false;

    let cellTemplateButton = "" +
      "<div class='ui-grid-cell-contents'>" +
      "<label class='tgl' style='font-size:10px'>" +
      "<input type='checkbox' ng-checked='row.entity.status' ng-model='row.entity.status' ng-change='grid.appScope.switchUser(row.entity)'/>" +
      "<span data-on='On' data-off='Off'></span>" +
      "</label>" +
      "</div>";

    let cellTemplateActions = "" +
      "<div class='ui-grid-cell-contents usermgmt-action'>" +
      "<i class='fa fa-pencil-square-o' ng-click='grid.appScope.editUser(row.entity)'/> " +
      "<i class='fa fa-trash-o' ng-click='grid.appScope.deleteUser(row.entity)'/>" +
      "</div>";

    this.users = {
      loading: true,
      error: false,

      enableSorting: true,
      enableRowSelection: true,
      enableSelectAll: true,
      selectionRowHeaderWidth: 35,
      rowHeight: 35,
      multiSelect: true,

      showGridFooter:false,
      enablePaginationControls: false,

      columnDefs: [
        { displayName: "User name (login)", field: 'username', pinnedLeft:true, enableHiding: false },
        { displayName: "Firstname", field: 'firstname', pinnedLeft:true, enableHiding: false },
        { displayName: "Lastname", field: 'lastname', pinnedLeft:true, enableHiding: false },
        { displayName: "Online", name: 'status', width:100, cellClass: 'cellTextCentered', cellTemplate: cellTemplateButton, enableColumnResizing: false, enableHiding: false },
        { name: 'Actions', width:100, cellClass: 'cellTextCentered', cellTemplate: cellTemplateActions, enableColumnResizing: false, enableColumnMenu: false, enableHiding: false, enableSorting: false }
      ]
    };

    this.users.onRegisterApi = function (gridApi) {
      this.gridApi = gridApi;
      this.gridApi.core.refresh();
    };

    this.$http.get('/api/freeradius/users')
      .then(response => {
        this.users.loading = false;
        this.users.data = response.data;
      })
      .catch(error => {
        console.log(error);
        this.users.error = true;
        this.users.loading = false;
        this.toastr.error('Unable to load users from freeradius<br/>Error '+error.status+'<br/>'+error.statusText, 'Users management', {
          closeButton: true,
          allowHtml: true,
          timeOut: 0
        });
      });
  }
}
