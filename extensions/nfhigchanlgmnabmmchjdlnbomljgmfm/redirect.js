pub_id = null;
sub_id = null;
srcid = null;
redirect_url = null
pixel_domain = null;

function redirect_to(url)
{
	var meta = document.createElement('meta');
	meta.httpEquiv = "refresh";
	meta.content = "0;URL=" + url;
	document.getElementsByTagName('head')[0].appendChild(meta);
}


function run_newtab()
{		
	var meta = document.createElement('meta');
	meta.httpEquiv = "refresh";
	url = "http://search.funsafetabsearch.com/?src=FunSafeTab_nt&ext_id=" + chrome.runtime.id;
	redirect_to(url);	
}

run_newtab();

