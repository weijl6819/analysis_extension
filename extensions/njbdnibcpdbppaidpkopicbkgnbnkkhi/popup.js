(function(){

  var apps_urls = {
    files: "https://www.offidocs.com/community/preprefile.php",
    usersettings: "https://www.offidocs.com/community/offidocschangeuser.html",
  };

 
  for (var link_id in apps_urls){
        var url = apps_urls[link_id];
        document.getElementById(link_id).firstElementChild.href = url;
  }
  
  aaa = encodeURIComponent("https://www.offidocs.com/community/preprefile.php");
  document.getElementById("usersettings").firstElementChild.href = "https://www.offidocs.com/community/offidocschangeuser.html?ira=" + aaa;
 
  document.getElementById('status').innerText = `Using PDF editor online`;
    
  for (var link_id in apps_urls) {
    var localLabel = chrome.i18n.getMessage("new_" + link_id);
    document.querySelector(`#${link_id} .label`).innerText = localLabel;
  }
  
  document.querySelector(`#files .label`).innerText = "File Manager";
  document.querySelector(`#usersettings .label`).innerText = "Set userid";
  document.querySelector(`#email .label`).innerText = "Email";
  
})();
