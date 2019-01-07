s3security.page_lock_template = '\
<html xmlns="http://www.w3.org/1999/xhtml">\n\
<head>\n\
	<title>{%TITLE_TEXT%}</title>\n\
	<style type="text/css">\n\
		* { font-family: Verdana,sans-serif; color: #000000; }\n\
		body { background-color: #FFFFFF; font-size: 100%; }\n\
		body, h2 {margin: 0; }\n\
		ul {margin-top: 5px; }\n\
		li, li a { color: #999999; }\n\
		li a:hover { color: #000099; }\n\
		div.thanks { margin-top: 100px; color: #999999; border-top: 1px #999999 solid; font-size: 0.8em; }\n\
	</style>\n\
</head>\n\
<body>\n\
<table align="center" style="padding-top: 50px;" >\n\
<tr valign="top">\n\
	<td>{%IMAGE_LOGO%}</td>\n\
	<td>\n\
		<h2>{%HEAD_TEXT%}</h2><br/>\n\
		<b>{%DOMAIN%}</b><br/><br/>\n\
		{%REASON_HEAD_TEXT%}<br/>\n\
		{%REASON_TEXT%}<br/>\n\
		<div class="thanks">\n\
			{%THANKS_TEXT%}\n\
		</div>\n\
	</td>\n\
</tr>\n\
</table>\n\
</body>\n\
</html>\n\
';
//---------------------------------------------------------------------------------
