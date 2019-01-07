// Needs to be a function due to Chrome's security policy for extensions
function reloadPage()
{
	window.location.reload();
}

(function ()
{
	if (navigator.appVersion.indexOf("Mac") >= 0)
	{
		var url =
			'x-devonthink://clip?title=' + encodeURIComponent(document.title)
		+	'&location=' + encodeURIComponent(window.location)
		+	'&referrer=' + encodeURIComponent(document.referrer)
		+	'&width=' + window.innerWidth
		+	'&text=' + encodeURIComponent(getSelection())
		+	'&source=' + encodeURIComponent(document.documentElement.outerHTML)
		+	'&encoding=' + document.characterSet;
		
		window.document.location = url;
		setTimeout(reloadPage, 1000);
	}
	else
	{
		alert ("The Clip to DEVONthink extension only works on a Mac. Sorry :-)");
	}

})();
