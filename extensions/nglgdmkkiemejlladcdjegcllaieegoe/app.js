// app.js old school

var newwindow;
function poptastic(url)
{
	newwindow=window.open(url,'name','height=400,width=200');
	if (window.focus) {newwindow.focus()}
}

function countChar(str,f){
f.Count.value = str.length
}

function mailMe(form){
    Body=document.editor.fragment.value;
    location = "mailto:email@email.com?subject=Made%20with%20Chrome%20Editor&body="+Body;
    return true;
}

function submitform()
{

	document.forms["editor"].method="post" ;
	document.forms["editor"].action="http://bryanlynn.com/create/index.php";
	document.forms["editor"].submit();
}

function validate()
{

	document.forms["editor"].method="get" ;
	document.forms["editor"].action="http://validator.w3.org/unicorn/check";
	document.forms["editor"].target="new";
	document.forms["editor"].submit();
}

function livePreview(){

var content = document['editor']['fragment'].value;
var newWin = window.open("","","");
newWin.document.open();
newWin.document.write(content);
newWin.document.close();
}


// banner rotate
$(document).ready(function() {

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



	$("#banner_container").rotate();
	
	
	// get storage
	var name = 'chrome-edit-store';
	document.forms.editor.ucn_text.value = localStorage.getItem(name);
	
	
	$('#mailme').bind('click', function() {
	    mailMe();
	});
	
	
	function livePreview(){
	
	var content = document['editor']['ucn_text'].value;
	var newWin = window.open("","","");
	newWin.document.open();
	newWin.document.write(content);
	newWin.document.close();
	}
	
	
	$('#save').bind('click', function() {
    livePreview();
});
		
	
	
	$('#validate').bind('click', function() {
	    validate();
	});
	
	$('#highlight').bind('click', function() {
	    highlight();
	});
	
	$('#tab').bind('click', function() {
	    window.open('tabless.html','_blank'); return false
	});
	
	$('#valid').bind('click', function() {
	    validate();
	});	

	$('#highlight').bind('click', function() {
	    highlight();
	});		
	
	$('#find').bind('click', function() {
		FindAndReplaceAll();
	});
	
	$("a.expand").click(function(){
		$(".box").slideToggle("slow");
		$(this).toggleClass("active"); return false;
	});
	
	$('#markItUp').bind('keyup', function() {
		var count = $("#markItUp").val().length;
		$('#counter').val(count);
	});
	
	
	var count = $("#markItUp").val().length;
	$('#counter').val(count);
	
	$('#markItUp').bind('keyup click keyenter', function() {
	       var name = 'chrome-edit-store';
	       var data = document.forms.editor.ucn_text.value;
	       localStorage.setItem(name, data);
	});
	
	
});




function FindAndReplaceAll() {
  var finda = document.editor.findThis.value;
  var replacea = document.editor.replaceWith.value;
  var fulltexta = document.editor.markItUp.value;
/* 
  var nr = new RegExp(finda, "ig");
  var tmp = fulltexta.replace(nr, replacea); 
  document.editor.fulltext.value = tmp;
*/  
// same thing as above provided by "ZeroKilled"
  document.editor.markItUp.value = fulltexta.replace(new RegExp(finda, 'gi'),replacea);
}


 function highlight() {
 
   var lineNo = 1, output = document.getElementById("output"), numbers = document.getElementById("numbers");
   output.innerHTML = numbers.innerHTML = "";

   function addLine(line) {
     numbers.appendChild(document.createTextNode(String(lineNo++)));
     numbers.appendChild(document.createElement("BR"));
     for (var i = 0; i < line.length; i++) output.appendChild(line[i]);
     output.appendChild(document.createElement("BR"));
   }
   highlightText(document.getElementById("markItUp").value, addLine);
 }
 
