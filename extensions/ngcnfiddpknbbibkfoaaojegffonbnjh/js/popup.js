
// Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-35008392-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();



// When document is ready do the init
$(document).ready( function() {
  Extension.init();
});


// Aww shit, object literals FTW
Extension = {
  url: null,

  // Init = boss
  init: function() {
    this.cacheElements();
    this.bindEvents();
    this.checkUser();
  },


  // Cache all the jQuery elements we will need
  cacheElements: function() {
    this.$popup      = $('#popup');
    this.$signInForm = $('#new_user');
  },


  // Bind all events here
  bindEvents: function() {
    $(document).on('submit', '#new_user', this, this.login);
    $(document).on('click', '#save_article_btn', this, this.saveArticle);
  },


  // Send a request to the server to see if the user is logged in
  checkUser: function() {
    _this = this;

    // Hit the app and see if we have a user session
    $.ajax({
      url: 'http://blogmate.is/extension',
      data: {format:'json'},
      dataType: 'json',
      success: function(response) {
        if (response.signed_in) {
          // Signed in = show save article form
          _this.showArticle();
        } else {
          // Not signed in = show sign in form
          _this.showLogin();
        }
      },
      error: function(response) {
        var message = new Message({ type: 'error', message: response.responseText });
      }
    });
  },


  // Show the save article form
  showArticle: function() {
    _this = this;
    
    // Get the info of the selected tab
    chrome.tabs.getSelected(null, function(tab) {
      
      // Set the URL for easy access
      _this.url = tab.url;

      // Set up data object we will send to rails
      var data = {format:'json'};

      // If we are on a blogmate article, send back that id rather than the whole url
      if (_this.url.indexOf('blogmate.is') > 0) {
        var page = _this.url.split("articles/")[1];
        if (page) {
          data['users_article_id'] = parseInt(page,10);
          _this['users_article_id'] = data['users_article_id'];
        }
      } else {
        data['url'] = _this.url;
      }
      
      // If we have url or users_article_id check it
      if (data.url || data.users_article_id) {
        // Check if the current url is ok to save before showing the form
        $.ajax({
          type: 'GET',
          url: 'http://blogmate.is/extension/show_article',
          data: data,
          dataType: 'json',
          success: function(response) {
            var title = tab.title,
                url = tab.url;
            if (response.title)
              title = response.title;
            if (response.url)
              url = response.url;
            _this.$popup.html( saveForm({ title: title, url: url }) );
          },
          error: function(response) {
            var html = "<p class='center'><em>" + response.responseText + "</em></p>";
            _this.$popup.html( html );
          }
        });
      } else {
        var html = "<p class='center'><em>You can't save this</em></p>";
        _this.$popup.html( html );
      }
    });
  },


  // Save the article
  // called from user pressing a button
  saveArticle: function(e) {
    e.preventDefault();
    var _this = e.data;

    // Set the object to send to the server
    var data = {format:'json'};
    if (_this.users_article_id) {
      data['users_article_id'] = _this.users_article_id;
    } else {
      data['url'] = _this.url;
    }

    // Post the article to the server and await a response
    $.ajax({
      type: 'POST',
      url: 'http://blogmate.is/articles',
      data: data,
      dataType: 'json',
      success: function(response) {
        // Change the tab url to the app waiting page
        chrome.tabs.update({ url: 'http://blogmate.is' + response.redirect }, function(tab) {});
        // Close the extension popup
        window.close();
      },
      error: function(response) {
        var message = new Message({ type: 'error', message: response.responseText });
      }
    });
  },


  // Show the login form
  showLogin: function() {
    _this = this;
    this.$popup.html( $('#log_in_form').html() );
  },


  // Log a user in
  login: function(e) {
    e.preventDefault();
    var _this = e.data;
    
    // Grab inputs and get them ready to be sent off
    var inputs = $(this).serializeArray();
    var data = {format:'json'};
    _.each(inputs, function(input) {
      data[input.name] = input.value;
    });

    // Try to login on the server
    $.ajax({
      type: 'POST',
      url: 'http://blogmate.is/users/sign_in',
      data: data,
      dataType: 'json',
      success: function(response) {
        _this.showArticle();
      },
      error: function(response) {
        var message = new Message({ type: 'error', message: response.responseText });
      }
    });
  }

};
// End of the Extension object


// Simple template to display save article form
var saveForm = function(attrs) {
  var to_ret;
  to_ret  = "<h3 class='popup_title'>" + attrs['title'] + "</h3>";
  to_ret += "<a href='#' class='btn large_btn wide_btn success_btn' id='save_article_btn'>Save This Article</a>";
  return to_ret;
};


var Message = function(attrs) {
  this.message = attrs['message'];
  this.type = attrs['type'];

  this.render = function() {
    var $message = $('<div />').addClass('message ' + this.type).text( this.message );
    $('body').append( $message );
    console.log($message);
    $message.app_show();
    _.delay(function(){
      $message.app_remove();
    }, 4000);
  };

  this.render();
};
