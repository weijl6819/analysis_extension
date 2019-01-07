var Options = (function (my) {

  var bg = chrome.extension.getBackgroundPage();

  var defaultCalling = '';

  my.init = function(){
    render();
    initUI();

    chrome.extension.onRequest.addListener(function(request) {
      if (request.ssoLoggedIn || request.loggedOut) {
        initUI();
      }
      if (request.isAuthorizing) {
        loadingState();
      }
    }.bind(my));
  };

  var render = function() {
    var template = $('#options-tpl').html();
    var mustacheLoc = {
      "loc": function() {
        return function(text, render) {
          return chrome.i18n.getMessage(text) || text.substr(1);
        }
      }
    };
    var resHtml = Mustache.to_html(template,mustacheLoc);
    $('body').html(resHtml);
    addEventListeners();
  };

  var initUI = function(){
    HTML.display('#loader', false);
    HTML.display('#login-btn', false);
    HTML.display('#logout-btn', false);
    $('select').chosen();
    getSettings(true);
  };

  var loadSettings = function(cb) {
    chrome.storage.local.get(null, function(data){
      if (data.login) {
        $('#login').val(data.login);
      }
      if (data.defaultInvitation) {
        $('#defaultInvitation').val(data.defaultInvitation);
      }
      if (data.defaultCalling) {
        defaultCalling = data.defaultCalling;
        if ($('#lifesizeSelect') && $('#lifesizeSelect').chosen()) {
          $('#lifesizeSelect').val(defaultCalling);
          $('#lifesizeSelect').trigger('chosen:updated');
        }
      }
      if (cb) {
        cb(data);
      }
    });
  };

  var getSettings = function(retrieveOnLoad){
    loadSettings(function(data){
      handleAuthState();
      if (!data.authorized) {
        return;
      }
      if (retrieveOnLoad) {
        meetingList = [];
        getRoomList();
        HTML.display('#loader', false);
      }
    });
  };

  var getRoomList = function() {
    HTML.display('#loader', true);
    chrome.runtime.sendMessage({cmd: 'getRoomList'}, function (response) {
      var select = HTML.generateSelect(response, defaultCalling, function(){});
      var $selectBox = $('#select-box');
      $selectBox.html(select);
      $('select').chosen({search_contains: true});
      HTML.display('#loader', false);
      handleAuthState();
    });
  };

  var addEventListeners = function(){
    var grabFormValues = function() {
      var res = {};
      $.each(['login', 'password'], function(i, key){
        var val = $('#' + key).val();
        if (val) {
          res[key] = val;
        }
      });
      chrome.storage.local.set({login: res.login}, function(){
      });
      return res;
    }.bind(this);

    $('#email-check-btn').on('click', function(e) {

      var res = grabFormValues();

      loadingState();
      bg.API.ssoEmailCheck(res.login).then(function(result) {
        $('#loader').hide();
        $('#status').hide();
        if (result.sso) {
          $('#email-check-btn').hide();
          document.getElementById('password').setAttribute('required', 'false');
        }
        if (!result.sso) {
          $('#email-check-btn').hide().prop('disabled', true);
          $('#passwordDiv').show();
          document.getElementById('password').setAttribute('required', 'true');
          $('#password').focus();
          $('#login-btn').show().prop('disabled', false);
          var oninputFunc = function() {
            $('#email-check-btn').show().prop('disabled', false);
            $('#passwordDiv').hide();
            $('#login-btn').hide().prop('disabled', true);
            $('#login').prop('disabled', false)[0].oninput = null;
          }
          $('#login').prop('disabled', false)[0].oninput = oninputFunc;
        }
      }).catch(function(err) {
        if (err && err.errorDescription) err = err.errorDescription;
        onError(err);
      });
    });

    $('#password').keypress(function (e) {
      if (e.which == 13) {
        $('#loginForm').submit();
        return false;
      }
    });

    $('#loginForm').on('submit', function(e){
      var res = grabFormValues();

      $('#loader').show();
      $('#status').hide();
      bg.API.login(res.login, res.password, {
        success: function(){
          $('#loader').hide();
          $('#password').val('');
          loadingState();
          meetingList = [];
          $('select').chosen();
          $('#status').hide().html(HTML.span(''));
          loadSettings();
          setTimeout(function() {
            getRoomList();
          }, 500);
      },
        error: onError
      });
      return false;
    });


    $('#save').click(function(e){
      res = {
        defaultInvitation: $('#defaultInvitation').val().trim(),
        defaultCalling: $('#lifesizeSelect').val()
      };
      chrome.storage.local.set(res, function(){
        onSuccess('Saved');
      });
    });

    $('#cancel').click(function(e){
      getSettings();
    });


    $('#logout-btn').click(function(e){
      chrome.storage.local.get(null, function(data){
        bg.API.logout({
          success: function() {
            $('#status').hide().html(HTML.span(''));
            handleAuthState();
          }
        });
      });
    });
  };

  var handleError = function(error) {
    handleAuthState();
    document.querySelector('#status').innerHTML = error;
    HTML.display('#status', true);
    HTML.display('#loader', false);
  };

  var loadingState = function() {
    HTML.display('#loader', true);
    $('#passwordDiv').hide();
    $('#login-btn').hide();
    $('#email-check-btn').hide();
    $('#login').prop('disabled', true);
  };

  var handleAuthState = function(){
    chrome.storage.local.get(null, function(data){
      if (data.authorized && (data.login || (data.user && data.user.userName))) {
        $('.current-user').html(data.login || (data.user && data.user.userName)).show();
        $('#loginDiv').hide();
        $('#email-check-btn').hide();
        $('#login-btn').hide();
        $('#passwordDiv').hide();
        $('#logout-btn').show();
      }
      else{
        $('.current-user').html('').hide();
        $('#defaultInvitation').val('');
        $('#loginDiv').show();
        $('#login').prop('disabled', false);
        $('#login-btn').hide().prop('disabled', true);
        $('#email-check-btn').show().prop('disabled', false);
        $('#logout-btn').hide();
        var select = HTML.generateSelect([], defaultCalling, function(){});
        var $selectBox = $('#select-box');
        $selectBox.html(select);
        $(select).chosen();
      }
    });
  };

  /**
   * Success/Error Handlers
   */

  var onSuccess = function(response){
    var text = typeof response === 'string' ? response : response.statusText;
    $('#status')
      .hide()
      .html( HTML.span(text) )
      .removeClass()
      .addClass('alert alert-success')
      .slideDown();
    $('#loader').hide();
    handleAuthState();
  };

  var onError = function(response){
    var text = typeof response === 'string' ? response : response.statusText;
    $('#status')
      .hide()
      .html( HTML.span(text) )
      .removeClass()
      .addClass('alert alert-danger')
      .slideDown();
    $('#loader').hide();
    handleAuthState();
  };

  return my;

})(Options || {});



Options.init();
