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

    this.$scope.switchUser = function (user) {
      console.log(user)
    };

    this.$scope.editUser = function (user) {
      $state.go('management.user', { action: 'edit', username: user.username });
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
          data: { 'user' : user }
        }).then(response => {
            switch (response.data.status) {
              case 'success':
                toastr.success('User has been deleted successfully', 'Delete user');
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

  createUser() {
    this.$state.go('management.user', { action: 'create', username: '' });
  }

  $onInit() {
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
      showGridFooter:true,
      multiSelect: true,

      enablePaginationControls: false,
      paginationPageSize: 2,

      columnDefs: [
        { displayName: "#", field: 'id', width:50, enableColumnResizing: false, enableHiding: false },
        { displayName: "User name (login)", field: 'username', pinnedLeft:true, enableHiding: false },
        { displayName: "Group", name: 'groupname', enableHiding: false },
        { displayName: "Status", name: 'status', width:100, cellClass: 'cellTextCentered', cellTemplate: cellTemplateButton, enableColumnResizing: false, enableHiding: false },
        { name: 'Actions', width:100, cellClass: 'cellTextCentered', cellTemplate: cellTemplateActions, enableColumnResizing: false, enableColumnMenu: false, enableHiding: false }
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
