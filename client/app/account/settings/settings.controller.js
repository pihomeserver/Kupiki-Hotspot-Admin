'use strict';

export default class SettingsController {
  user = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  errors = {
    other: undefined
  };
  message = '';
  submitted = false;

  /*@ngInject*/
  constructor(Auth) {
    this.Auth = Auth;
  }

  changePassword(form) {
    this.submitted = true;
    if(form.$valid) {
      console.log('form.$valid')
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          this.message = 'Password successfully changed.';
          this.errors.other = undefined;
          this.user = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
          };
        })
        .catch(() => {
          this.errors.other = 'Incorrect password';
          this.message = '';
        });
    }
  }
}
