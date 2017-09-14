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

    let backgroundsElements = 6;
    let oldBackground = undefined;

    let changeBackground = function() {
      if ($state.current.name === 'login') {
        $('#backgroundLoginImageNext').hide();
        do
          var randBackground = Math.floor(Math.random()*backgroundsElements);
        while (randBackground === oldBackground);
        $('#backgroundLoginImageNext').attr('src', '/assets/backgrounds/'+randBackground+'.jpg');
        $('#backgroundLoginImageNext').fadeIn(1500);
        $('#backgroundLoginImage').fadeOut(1500, function() {
          $('#backgroundLoginImage').attr('src', '/assets/backgrounds/'+randBackground+'.jpg');
          $('#backgroundLoginImage').show();
        });
        oldBackground = randBackground;
      }
    };

    $('body').css('overflow', 'hidden');
    $('[name="content"]').css('padding', '0px');
    $('[name="content"]').css('margin-top', '0px');

    changeBackground();

    let changeBackgroundTimer = $interval(changeBackground, 7000);

    $scope.$on('$destroy', function() {
      $interval.cancel(changeBackgroundTimer);
      $('body').css('overflow', 'auto');
      $('#backgroundLoginImage').attr('src', '');
      $('#backgroundLoginImageNext').attr('src', '');
      $('#backgroundLoginImage').hide();
      $('#backgroundLoginImageNext').hide();
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
