/*
$(document).ready(function(){

    $('signupform').on('submit', function(){
      var name = $('name');
      var username = $('username');
      var password = $('password');
      var signup = {
          name: name.val(),
          username: username.val(),
          password: password.val()
                };

      $.ajax({
        type: 'POST',
        url: '/api//signup',
        data: signup,
        success: function(data){
          //do something with the data via front-end framework
          console.log(data.message);
          location.reload();
        }
      });

      return false;

  });


  $('loginform1').on('submit', function(){

      var username = $('username1');
      var password = $('password1');
      var login = {
          username: username.val(),
          password: password.val()
                };

      $.ajax({
        type: 'POST',
        url: '/login/student',
        data: login,
        success: function(data){
          //do something with the data via front-end framework
         // location.reload();
         location.pathname('/student');
        }
      });

      return false;

  });

  $('loginform2').on('submit', function(){

      var username = $('username2');
      var password = $('password2');
      var login = {
          username: username.val(),
          password: password.val()
                };

      $.ajax({
        type: 'POST',
        url: '/login/faculty',
        data: login,
        success: function(data){
          //do something with the data via front-end framework
         // location.reload();
         location.pathname('/faculty');
        }
      });

      return false;

  });
});
*/
