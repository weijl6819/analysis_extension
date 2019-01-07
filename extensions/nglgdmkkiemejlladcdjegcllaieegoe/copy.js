
  Clipboard = {};
  Clipboard.utilities = {};

  Clipboard.utilities.createTextArea = function(value) {
      var txt = document.createElement('textarea');
      txt.style.position = "absolute";
      txt.style.left = "-100%";

      if (value !== null)
          txt.value = value;

      document.body.appendChild(txt);
      return txt;
  };

  Clipboard.copy = function(data) {
      if (data === null) return;
      
      var txt = Clipboard.utilities.createTextArea(data);
      txt.select();
      document.execCommand('Copy');
      document.body.removeChild(txt);
  };

  // Can't get this to work. See the problem?
  Clipboard.paste = function() {
      var txt = Clipboard.utilities.createTextArea();
      txt.focus();
      document.execCommand('Paste');
      var value = txt.value;
      document.body.removeChild(txt);
      return value;
  };

  window.onload = function() {
      var textArea = $('textArea');
      $('copy').onclick = function() {
          Clipboard.copy(textArea.value);
      };
      $('paste').onclick = function() {
          $('content').innerHTML = Clipboard.paste();
      };
  };

  var $ = function(id) {
      return document.getElementById(id);
  };
