
chrome.tabs.query(
  { active: true, currentWindow: true },
  function (tabs) {
    var tab = tabs[0];
    chrome.tabs.sendMessage(
      tab.id,
      {},
      function (url) {
        if (!url) url = tab.url;
        var blog = '';
        if (url.match(/https?:\/\/.+\.tumblr\.com.*/)) {
          var i = url.indexOf('://') + 3;
          blog = url.substr(i, url.indexOf('.') - i);
          if (blog == 'www') blog = '';
        }
        window.open('http://www.tumblviewr.com/Tumblr/Blog/' + blog);
        //$('iframe').attr('src', 'http://www.tumblviewr.com/Tumblr/Blog/' + blog);
      });
  });

  
