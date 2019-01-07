chrome.runtime.onMessage.addListener(function(request, sender) {

  function CookieCache() {
    this.cookies_ = [];
    this.reset = function() {
      this.cookies_ = [];
    }
    this.add = function(cookie) {
      var value = cookie;
      this.cookies_.push(value);
    };
    this.remove = function(cookie) {
      var domain = cookie.domain;
      if (this.cookies_[domain]) {
        var i = 0;
        while (i < this.cookies_[domain].length) {
          if (cookieMatch(this.cookies_[domain][i], cookie)) {
            this.cookies_[domain].splice(i, 1);
          } else {
            i++;
          }
        }
        if (this.cookies_[domain].length == 0) {
          delete this.cookies_[domain];
        }
      }
    };
    this.getDomains = function() {
      var result = [];
      return this.cookies_;
    }
    this.getCookies = function() {
      return this.cookies_;
    };
  }

  function Timer() {
    this.start_ = new Date();
    this.elapsed = function() {
      return (new Date()) - this.start_;
    }
    this.reset = function() {
      this.start_ = new Date();
    }
  }

  var cache = new CookieCache();
  var timer = new Timer();
  var cookieObject = {};
  chrome.cookies.getAll({}, function(cookies) {
    for (var i = 0; i < cookies.length; i++) {
      if (cookies[i].domain.includes('smatsocial.com')) {
        cache.add(cookies[i]);
      }
    }
    console.log(cache.getDomains());
    timer.reset();
    var domains = cache.getDomains();
    domains.forEach(function(cookie) {
      if (cookie.name == "profile_id") {
        cookieObject.profile_id = cookie.value;
      }
    });
  });

  if (request.action == "source") {
    var data = request.source;
    var el = document.createElement('html');
    el.innerHTML = data;
    if (el) {
      if(el.getElementsByClassName('uiHeaderTitle')) {
        var key = false;
        for (var i = 0; i < el.getElementsByClassName('uiHeaderTitle').length; i++) {
          if(el.getElementsByClassName('uiHeaderTitle')[i].innerHTML == 'Groups') {
            key = true;
          }
        }
        if(key) {
          var list = el.getElementsByClassName('_bui _3-96');
          console.log(list);
        }
        else {
          var list = [];
        }
      }
    }
    if(list[list.length - 1]) {
      var data1 = list[list.length - 1];
    }
    else {
      var data1 = list[0];
    }
    var ul = document.createElement('html');
    ul.innerHTML = data1;
    if (data1) {
      var li = data1.getElementsByClassName('_5afe');
    }

    if (li && li.length > 0) {
      document.querySelector('#message').innerHTML = 'Getting Groups....';
      var groups = [];
      for (var i = 0; i < li.length; i++) {
        var k = li[i].href.indexOf('/groups/');
        var normalHref = li[i].href.substring(k, li[i].href.length);
        var object = {};
        object.name = li[i].title;
        object.href = 'https://www.facebook.com' + normalHref;
        object.id = JSON.parse(li[i].dataset.gt).bmid;
        groups.push(object);
      }
      setTimeout(function() {
        for (var i = 0; i < groups.length - 1; i++) {
          if (groups[i].id == groups[i + 1].id) {
            groups.splice(i, 1);
          }
        }
        if (groups && groups.length > 0) {
          if (cookieObject.profile_id) {
            var followedGroups = [];
            var xml = new XMLHttpRequest();
            xml.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                if (this.responseText && this.responseText.length > 0) {
                  var newArrayDataOfOjbect = Object.values(JSON.parse(this.responseText))
                  for (var i = 0; i < newArrayDataOfOjbect[1].length; i++) {
                    followedGroups.push(newArrayDataOfOjbect[1][i].group_id);
                  }
                }
              } else if (this.status == 400 || this.status == 500) {}
            };
            xml.open("POST", 'https://www.smatsocial.com/kya_backend/KyaComment/fb_group_utils', true);
            xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xml.send("profile_id=" + cookieObject.profile_id + '&action=read');
          } else {
            var options = {
              type: 'basic',
              iconUrl: 'icon.png',
              title: "Error - Please Login",
              message: "You have not Logged in to your SmatSocial Account."
            }
            chrome.notifications.create('Error - Please Login', options);
          }
          // document.querySelector('#message').innerHTML = '';

          setTimeout(function() {
            document.querySelector('#message').innerHTML = '';
            var matched = [];
            for (var i = 0; i < groups.length; i++) {
              if (followedGroups) {
                for (var j = 0; j < followedGroups.length; j++) {
                  if (followedGroups[j] == groups[i].id) {
                    groups[i].followed = true;
                    matched.push(groups[i]);
                  }
                }
              }
            }

            for (var i = 0; i < groups.length; i++) {
              if (groups[i].followed == true) {
                document.getElementById('group').innerHTML += '<li><a class="link" target="_blank" href="' + groups[i].href +'">' + groups[i].name + '</a><button class="unfollow" id="' + groups[i].id + '" name="' + groups[i].id + '">Unfollow</button></li>';
              } else {
                document.getElementById('group').innerHTML += '<li><a class="link" target="_blank" href="' + groups[i].href +'">' + groups[i].name + '</a><button id="' + groups[i].id + '" name="' + groups[i].id + '">Follow</button></li>';
              }
            }

            document.getElementById('myInput').style.display = 'block';

            for (var i = 0; i < groups.length; i++) {
              document.getElementById(groups[i].id).addEventListener('click', function(k) {
                var id = [];
                id = k.path[0].name;
                btnText = k.path[0].innerHTML;
                if (cookieObject.profile_id) {
                  var xhttp = new XMLHttpRequest();
                  xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                      if (this.responseText && this.responseText.length > 0) {
                        if (JSON.parse(this.responseText).status == true) {
                          if(btnText == 'Follow') {
                            document.getElementById(id).innerHTML = 'Unfollow';
                            document.getElementById(id).classList.add("unfollow");
                            var options = {
                              type: 'basic',
                              iconUrl: 'icon.png',
                              title: "Success - Followed this group",
                              message: "You have successflly followed this Group."
                            }
                          }
                          else if(btnText == 'Unfollow') {
                            document.getElementById(id).innerHTML = 'Follow';
                            document.getElementById(id).classList.remove("unfollow");
                            var options = {
                              type: 'basic',
                              iconUrl: 'icon.png',
                              title: "Success - Unfollowed this group",
                              message: "You have successflly unfollowed this Group."
                            }
                          }
                        }
                        chrome.notifications.create('Success - Followed this group', options);
                      }
                    } else if (JSON.parse(this.responseText).error_msg == "Not authorised") {
                      var options = {
                        type: 'basic',
                        iconUrl: 'icon.png',
                        title: "Error",
                        message: "LoggedIn SmatSocial & Facebook accounts mismatched OR Its a closed group where you are not admin."
                      }
                      chrome.notifications.create('Error-Already Followed', options);
                    }
                     else if (this.status == 400 || this.status == 500) {
                      var options = {
                        type: 'basic',
                        iconUrl: 'icon.png',
                        title: "Error - Already Followed",
                        message: "You are already Following this group"
                      }
                      chrome.notifications.create('Error-Already Followed', options);
                    }
                  };
                  xhttp.open("POST", 'https://www.smatsocial.com/kya_backend/KyaComment/fb_group_utils', true);
                  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                  if(btnText == 'Follow') {
                    xhttp.send("profile_id=" + cookieObject.profile_id + '&group_id=' + id + '&action=add');
                  }
                  else if(btnText == 'Unfollow') {
                    xhttp.send("profile_id=" + cookieObject.profile_id + '&group_id=' + id + '&action=delete');
                  }
                } else {
                  var options = {
                    type: 'basic',
                    iconUrl: 'icon.png',
                    title: "Error - Not Logged in",
                    message: "You are not Logged in to your SmatSocial Account"
                  }
                  chrome.notifications.create('Error-Not Logged in', options);
                }
              }, false);
            }
          }, 7500)
        } else if (groups && groups.length == 0) {
          document.querySelector('#message').innerHTML = 'You dont have any groups';
          if (document.getElementById('grps')) {
            document.getElementById('grps').style.display = '';
          }
        } else if (!groups) {
          document.querySelector('#message').innerHTML = '<a class="text-none navigate" href="https://www.facebook.com/bookmarks/groups/" target="_blank">Please navigate to Facebook Groups</a>';
          document.getElementById('myInput').style.display = 'none';
          if (document.getElementById('grps')) {
            document.getElementById('grps').style.display = 'none';
          }
        }
      }, 1000);
    } else if (li && li.length == 0) {
      document.querySelector('#message').innerHTML = 'You dont have any groups';
      if (document.getElementById('grps')) {
        document.getElementById('grps').style.display = '';
      }
    } else {
      document.querySelector('#message').innerHTML = '<a class="text-none navigate" href="https://www.facebook.com/bookmarks/groups/" target="_blank">Please navigate to Facebook Groups</a>';
      document.getElementById('myInput').style.display = 'none';
      if (document.getElementById('grps')) {
        // document.getElementById('grps').style.display = 'none';
      }
    }
  }
});

setTimeout(function() {
  document.getElementById('myInput').addEventListener('keyup', function() {
    var input, filter, ul, li, a, i;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("group");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  })
}, 200);

function onWindowLoad() {

  var message = document.querySelector('#message');
  // message.innerHTML = '<a class="text-none navigate" href="https://www.facebook.com/bookmarks/groups/" target="_blank">Please navigate to Facebook Groups</a>';
  chrome.tabs.executeScript(null, {
    file: "random.js"
  }, function() {
    if (chrome.runtime.lastError) {
      message.innerHTML = '<a class="text-none navigate" href="https://www.facebook.com/bookmarks/groups/" target="_blank">Please navigate to Facebook Groups</a>';
    }
  });
}

window.onload = onWindowLoad;
