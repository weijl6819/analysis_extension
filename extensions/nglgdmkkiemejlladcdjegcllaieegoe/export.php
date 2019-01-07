<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title>myEditor - Version 2.0</title>
<link rel="stylesheet" type="text/css" href="images/style.css" />
<!-- jQuery -->
<script type="text/javascript" src="jquery.pack.js"></script>
<!-- markItUp! -->
<script type="text/javascript" src="markitup/jquery.markitup.pack.js"></script>
<!-- markItUp! toolbar settings -->
<script type="text/javascript" src="markitup/sets/default/set.js"></script>
<!-- markItUp! skin -->
<link rel="stylesheet" type="text/css" href="markitup/skins/markitup/style.css" />
<!--  markItUp! toolbar skin -->
<link rel="stylesheet" type="text/css" href="markitup/sets/default/style.css" />
</head>
<body>
<script type="text/javascript">
<!--
$(document).ready(function()	{
	// Add markItUp! to your textarea in one line
	// $('textarea').markItUp( { Settings }, { OptionalExtraSettings } );
	$('#markItUp').markItUp(mySettings);
	
	// You can add content from anywhere in your page
	// $.markItUp( { Settings } );	
	$('.add').click(function() {
 		$.markItUp( { 	openWith:'<opening tag>',
						closeWith:'<\/closing tag>',
						placeHolder:"New content"
					}
				);
 		return false;
	});
	
	// And you can add/remove markItUp! whenever you want
	// $(textarea).markItUpRemove();
	$('.toggle').click(function() {
		if ($("#markItUp.markItUpEditor").length === 1) {
 			$("#markItUp").markItUpRemove();
			$("span", this).text("get markItUp! back");
		} else {
			$('#markItUp').markItUp(mySettings);
			$("span", this).text("remove markItUp!");
		}
 		return false;
	});
});
-->
</script>



<p>
<form method="post" action="createFile.php">
<textarea id="markItUp" cols="80" rows="20" name="markItUp" >
</textarea>
</p>
<p class="rightbox"><a href="#" class="toggle">View Plain Text</span></a></p>

<br /><br />
<label>File Name:<input name="pageName" type="text" /></label>
<br /><br />
<label>Page Title:<input name="pageTitle" type="text" /></label>
<bR /><br />
<input name="" type="submit" value="Submit"  />

</form>

</body>
</html>
