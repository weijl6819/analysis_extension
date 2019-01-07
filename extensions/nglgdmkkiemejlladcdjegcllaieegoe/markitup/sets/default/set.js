
mySettings = {
	onShiftEnter:	{keepDefault:false, replaceWith:'<br />\n'},
	onCtrlEnter:	{keepDefault:false, openWith:'\n<p>', closeWith:'</p>\n'},
	onTab:			{keepDefault:false, openWith:'	 '},
	markupSet: [
		{name:'Heading 1', key:'1', openWith:'<h1(!( class="[![Class]!]")!)>', closeWith:'</h1>', placeHolder:'Your title here...' },
		{name:'Heading 2', key:'2', openWith:'<h2(!( class="[![Class]!]")!)>', closeWith:'</h2>', placeHolder:'Your title here...' },
        {separator:'---------------' },
		{name:'HTML 4', key:'4', openWith:'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"\n   "http://www.w3.org/TR/html4/strict.dtd">\n<html>\n<head>\n<TITLE>My first HTML document</TITLE>\n</head>\n<body>\n<p>', closeWith:'</p>\n</body>\n</html>', placeHolder:'Enter content here...'},
		{name:'HTML 5', key:'5', openWith:'<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset=utf-8>\n<title>A simple HTML5 page layout</title>\n<style>\nbody { margin:100px; }\n article, aside, figure, footer, header, hgroup, menu, nav, section { display:block;}\n</style>\n</head>\n<body>\n<nav>\n<a href="index.html">home</a>\n</nav>\n<header>\n<h1>A simple HTML5 document</h1>\n</header>\n<article>\n<section>\n<h2>Section 1 heading</h2>\n</section>\n</article>\n<footer>\n<p>This is the footer</p>\n</footer>\n</body>\n</html>'},
        {separator:'---------------' },
        {name:'Div Class', key:'Q', openWith:'<div class="[![Class Name:!:]!]">', closeWith:'</div>', placeHolder:'Enter content here...' },
        {name:'Div ID', key:'D', openWith:'<div id="[![ID Name:!:]!]">', closeWith:'</div>', placeHolder:'Enter content here...' },
		{name:'Paragraph', key:'P', openWith:'<p(!( class="[![Class]!]")!)>', closeWith:'</p>' },
		{separator:'---------------' },
		{name:'Bold', key:'B', openWith:'(!(<b>|!|<b>)!)', closeWith:'(!(</b>|!|</b>)!)' },
		{name:'Italic', key:'I', openWith:'(!(<i>|!|<i>)!)', closeWith:'(!(</i>|!|</i>)!)' },
		{name:'Break', key:'R', openWith:'<br/>', closeWith:'' },
		{separator:'---------------' },
		{name:'Ul', key:'8', openWith:'<ul>\n', closeWith:'</ul>\n' },
		{name:'Ol', key:'9', openWith:'<ol>\n', closeWith:'</ol>\n' },
		{name:'Li', key:'0', openWith:'<li>', closeWith:'</li>\n' },
		{separator:'---------------' },
		{name:'Picture', key:'N', replaceWith:'<img src="[![Source:!:http://]!]" alt="[![Alternative text]!]" border="0" title="[![Title text]!]" />' },
		{name:'Link', key:'L', openWith:'<a href="[![Link:!:http://]!]" target="[![Target:!:_self]!]">', closeWith:'</a>', placeHolder:'Your text to link...' },
		{name:'Email', key:'M', openWith:'<a href="[![Link:!:mailto:]!]"(!( title="[![Title]!]")!)>', closeWith:'</a>', placeHolder:'Your text to link...' },
		{separator:'---------------' },
		{name:'Flash', key:'F', openWith:'<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="[![Link:!:width]!]" height="[![Link:!:height]!]" id="div-name" align="middle">\n<param name="allowScriptAccess" value="sameDomain" />\n<param name="allowFullScreen" value="false" />\n<param name="movie" value="[![Link:!:movie.swf]!]" />\n<param name="quality" value="high" />\n<param name="bgcolor" value="[![Link:!:color]!]" />\n<embed src="[![Link:!:movie.swf]!]', closeWith:'"quality="high" bgcolor="[![Link:!:color:]!]" width="[![Link:!:width:]!]" height="[![Link:!:height:]!]" name="movie" align="middle" allowScriptAccess="sameDomain" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.adobe.com/go/getflashplayer" />\n</object>', placeHolder:'' },
		{name:'Jquery', key:'J', openWith:'<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>\n<script type="text/javascript">\n$(document).ready( function(){\n\n      $(\'[![Link:!:.divclick]!]\').click( function(){\n      $(\'[![Link:!:.divshow]!]\').show();\n      $(\'[![Link:!:.divhide]!]\').hide(); });\n\n      });', closeWith:'\n</script>', placeHolder:'' },
		{name:'Bookmark', key:'K', openWith:'<a href="[![Link:!:#bookmark]!]"(!( title="[![Title]!]")!)>', closeWith:'</a>', placeHolder:'Jump to part of page...' },
		{name:'StyleSheet', key:'S', openWith:'<style type="text/css">\nbody{[![Link:!:background:#ffffff;\n]!][![Link:!:margin:0 auto;\n]!][![Link:!:font-family:verdana;font-size:12px;\n]!]}', closeWith:'\n</style>', placeHolder:'' },
				
		{separator:'---------------' },
		{name:'Clean', className:'clean', replaceWith:function(markitup) { return markitup.selection.replace(/<(.*?)>/g, "") } },
		
	]
}