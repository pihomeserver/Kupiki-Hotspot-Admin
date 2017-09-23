'use strict';

export default class LogoutController {
  /*@ngInject*/
  constructor(Auth, $state) {
    var referrer = $state.params.referrer || $state.current.referrer || 'system.sysdashboard';
    Auth.logout();
    $state.go(referrer);
  }
}
