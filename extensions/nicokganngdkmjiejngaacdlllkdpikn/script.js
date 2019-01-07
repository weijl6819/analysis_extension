if (chrome.extension.getBackgroundPage().problem_there)
{
    window.onload = function() {
        document.getElementById("notification_error_page").style.display = "block";
    };
} else
    loadMain();

function loadMain()
{
    if (chrome.extension.getBackgroundPage().isWork())
    {
        chrome.extension.getBackgroundPage().toggleVideoHide();
        return window.close();
    }
    window.onload = function() {
        document.getElementById("toggle_info").onmouseover = function() {
            document.body.classList.add("info");
        };
        document.getElementById("info").onmouseleave = document.body.onmouseleave = function() {
            document.body.classList.remove("info");
        };
        if (chrome.extension.getBackgroundPage().isFirstStart())
        {
            document.body.className = "first_run";
            return false;
        }
    	document.getElementById("url").onkeyup = function() {
    		 document.body.classList[ /(youtube\.com\/watch\?)|(youtu\.be\/)/.test(this.value) ? "add" : "remove" ]("visible");
    	};
        /*var input = document.createElement('textarea'); // Paste mechanism
        document.body.appendChild(input);
        input.focus();
        input.select();
        document.execCommand('Paste');
        if (/youtube\.com\/watch\?/.test(input.value))
        {
            document.getElementById("url").value = input.value;
            document.getElementById("url").onkeyup();
        }
        input.remove();*/
        document.getElementById("url").focus();
        document.getElementById("start").onclick = function() {
        	chrome.extension.getBackgroundPage().playVideo(document.getElementById("url").value.replace(/(youtu\.be\/.*)/gi, "$1?play_small"));
        	window.close();
        };
        setTimeout(function() {
            document.getElementById("counters").innerHTML = '<iframe src="http://sideplayer.com/"></iframe>';
        }, 1000);
    };
}

// Google Analytics:

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-68704023-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();