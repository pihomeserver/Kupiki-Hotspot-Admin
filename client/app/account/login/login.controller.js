'use strict';

export default class LoginController {
  user = {
    name: '',
    username: '',
    password: ''
  };
  errors = {
    login: undefined
  };
  submitted = false;

  /*@ngInject*/
  constructor(Auth, $state, $interval, $scope) {
    this.Auth = Auth;
    this.$state = $state;

    var backgrounds = 6;
    var oldBackground = undefined;

    var changeBackground = function() {
      if ($state.current.name === 'login') {
        $('#backgroundLoginImageNext').hide();
        do
          var randBackground = Math.floor(Math.random()*backgrounds);
        while (randBackground === oldBackground);
        $('#backgroundLoginImageNext').attr('src', '/assets/images/backgrounds/'+randBackground+'.jpg')
        $('#backgroundLoginImageNext').fadeIn(1200);
        $('#backgroundLoginImage').fadeOut(1200, function() {
          $('#backgroundLoginImage').attr('src', '/assets/images/backgrounds/'+randBackground+'.jpg');
          $('#backgroundLoginImage').show();
        });
        oldBackground = randBackground;
      }
    }

    $('body').css('overflow', 'hidden');

    changeBackground();

    var changeBackgroundTimer = $interval(changeBackground, 5000);

    $scope.$on('$destroy', function() {
      $interval.cancel(changeBackgroundTimer);
      $('body').css('overflow', 'auto');
      $('#backgroundLoginImage').hide();
      $('#backgroundLoginImageNext').hide();
      $('#backgroundLoginImage').attr('src', '');
      $('#backgroundLoginImageNext').attr('src', '');
    });
  }

  login(form) {
    this.submitted = true;

    if(form.$valid) {
      this.Auth.login({
        username: this.user.username,
        password: this.user.password
      })
        .then(() => {
          // Logged in, redirect to home
          this.$state.go('main');
        })
        .catch(err => {
          this.errors.login = err.message;
        });
    }
  }
}
