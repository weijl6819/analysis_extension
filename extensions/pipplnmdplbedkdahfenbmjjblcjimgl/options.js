function get(e){var t=localStorage[e];if(!t||t=="false"){return false}return t}function set(e,t){localStorage[e]=t}function renderItems(){var e=JSON.parse(get("items"));var t=$("#gallery");for(var n=e.length-1;n>=0;n--){var r=e[n];var i=$('<a href="'+r+'" class="item" data-lightbox="imgs" data-rel="'+n+'"></a>');t.append(i);var s=$('<img class="image" src="'+r+'" alt="" />');i.append(s);var o=$('<img src="img/delete.png" alt="" class="delete" />');o.click(function(e){e.preventDefault();var t=$(this).parent(".item").attr("data-rel");if(confirm("Really do you want delete this image?")){bgPage.deleteImg(t)}reloadItems()});i.append(o)}t.append($('<span class="clear"></span>'))}function reloadItems(){$("#gallery").html("");renderItems()}function shareInit(){var e=get("share");if(!e){e="https://chrome.google.com/webstore/detail/"+chrome.app.getDetails().id}var t=e;var n=chrome.app.getDetails().name;$("#main #share").html('<div class="item gplus_share"><a href="https://plus.google.com/share?url='+t+'" title="Share on G+" target="_blank"><img src="img/gplus.png" alt=""></a></div><div class="item fb_share"><a href="http://www.facebook.com/share.php?u='+t+'" title="Share on Facebook" target="_blank"><img src="img/facebook.png" alt=""></a></div><div class="item twt"><iframe allowtransparency="true" frameborder="0" scrolling="no" src="https://platform.twitter.com/widgets/tweet_button.html?text='+n+"%20"+t+'" style="width:70px; height:20px;"></iframe></div>')}var bgPage=chrome.extension.getBackgroundPage();$(document).ready(function(){setTimeout(function(){renderItems()},50);setTimeout(function(){shareInit()},100);if(get("special")){$("#special").css("display","block")}if(get("special_disable")){$("#checkbox_special_disable").attr("checked","checked")}$("#checkbox_special_disable").change(function(){if(get("special_disable")){set("special_disable",false);$("#checkbox_special_disable").removeAttr("checked")}else{set("special_disable",true);$("#checkbox_special_disable").attr("checked","checked")}})})