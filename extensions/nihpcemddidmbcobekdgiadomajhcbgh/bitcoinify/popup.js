document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.getSelected(null, function(tab) {
    var url = tab.url;
    d = document;
    if (url.indexOf("youtube")!=-1) {
      d.getElementById("post").style.display = "block";
      d.getElementById("yt").value = url;
    }
    else if (url.indexOf("aliexpress")!=-1) {
      var re = /([0-9]{3,})\.html/;
      var itemid = re.exec(url)[1];
      if (itemid.length) d.getElementById("itemid").innerHTML = "<div class=\"alert alert-success\" role=\"alert\"><span class=\"glyphicon glyphicon-barcode\"></span>Item ID: <strong>"+itemid+"</strong></div><div class=\"btn-group full\"><a href=\"https://bitcoinify.io/link/go/1/aliexpress/"+itemid+"\" class=\"btn btn-success btn-lg full\" title=\"Click here to activate cashback for buying this item\"><span class=\"glyphicon glyphicon-credit-card\"></span>Get cashback</a></div>";
    }
  });
}, false);