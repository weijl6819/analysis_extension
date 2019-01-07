
const EXPIRE = 7 * 24 * 3600;   // 7 суток по умолчанию - храним куки
const PATH="/";

const _DEBUG = true;

// ------------------------------------------
function _b( v ){
	if( typeof v == "boolean" ){
		return v;
	}
	
	if( v == "true" ){
		return true;
	}

	return false;
}

//-------------------------- SET COOKIE
function set_cookie(c_name, c_value, c_expire, c_path, c_domain, c_secure) 
{
	c_expire = (typeof c_expire === 'undefined') ? EXPIRE : c_expire;
	c_path   = (typeof c_path === 'undefined')   ? PATH   : c_path;

	var cookie_string = c_name + "=" + c_value;

	// Срок годности
	if (c_expire)  {
		var expire_date = new Date()
		var ms_from_now = c_expire * 1000;
		expire_date.setTime(expire_date.getTime() + ms_from_now);
		var expire_string = expire_date.toGMTString();
		cookie_string += "; expires=" + expire_string;
	}
   
	// Добавлени пути 
	if (c_path)  {
		cookie_string += "; path=" + c_path;
	}

	// Добавлени домена
	if (c_domain) {
		cookie_string += "; domain=" + c_domain;
    }

	// Добавлени параметра secure
	if (c_secure)  {
		cookie_string += "; true";
    }
	
	// Добавление cookie
	document.cookie = cookie_string;
}
//-------------------------- GET COOKIE
function get_cookie(c_name)  {
	
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	
	if (c_start == -1)	{
		c_start = c_value.indexOf(c_name + "=");
	}
	
	if (c_start == -1)	{
		c_value = null;
	}
	else	{
		c_start = c_value.indexOf("=", c_start) + 1;
		var c_end = c_value.indexOf(";", c_start);
		if (c_end == -1)	{
			c_end = c_value.length;
		}
		c_value = unescape(c_value.substring(c_start,c_end));
	}
	
	return c_value;
}
// ----------------------------------------------------------------
function get_format_time( date, shrt ) {

    if (typeof shrt == 'undefined') shrt = false;
	if (typeof date == 'number' )  date = new Date(date*1000);

	var yr = date.getFullYear();	
	var mon = date.getMonth()+1;
	var day = date.getDate();
	
	if ( shrt ) {
		var str = yr+"-"+(mon>9 ? mon : "0"+mon) +"-"+(day>9 ? day : "0"+day);
	}
	else {
		var hour = date.getHours();
		var min = date.getMinutes();
		var str = yr+"-"+(mon>9 ? mon : "0"+mon) +"-"+(day>9 ? day : "0"+day) +"  "+ (hour>9 ? hour : "0"+hour) +":"+(min>9 ? min : "0"+min);
	}
	
	return str;
}

const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// ----------------------------------------------------------------
function get_time( date )  {
	if ( date == null) return "";
	var md = new Date(date*1000);
	
	var year = md.getFullYear();
	var month = md.getMonth();
	var day = md.getDate().toString();
	day = day.length > 1 ? day : '0' + day;	
	
	var hour = md.getHours();
	var min = md.getMinutes();

	return day + ' ' + MONTH[month] + ' ' + year.toString().substring(2,4)+"  "+ (hour>9 ? hour : "0"+hour) +":"+(min>9 ? min : "0"+min);
}

// ----------------------------------------------------------------
function dateFormat( date, format ) {

	if ( date == null) return "";
	if ( typeof format == 'undefined' || format == null) format = 'Y.m.d H:i';
	
	try {
		if (typeof date == 'number') date = new Date(date*1000);
		
		var yr =  	date.getFullYear();	
		var mon = 	date.getMonth()+1;
		var day = 	date.getDate();
		
		var hour = 	date.getHours();
		var min = 	date.getMinutes();

		var str = format.replace( /Y/g, yr)
						.replace( /m/g, (mon>9 ? mon : "0"+mon))
						.replace( /d/g, (day>9 ? day : "0"+day))
						.replace( /H/g, (hour>9 ? hour : "0"+hour))
						.replace( /i/g, (min>9 ? min : "0"+min));
						
		return str;
	}
	catch(e) {
		console.log('ERROR: UTIL.dateFormat: ', date, format, '\n', e);
		return '2012.12.12 20:12';
	}	

}

// ----------------------------------------------------------------
function set_interval_time(  )  {

	var elems = document.querySelectorAll("[datetime]");
    for (var i=0; i<elems.length; i++) {
        var date = elems[i].getAttribute("datetime");
		
		var current_dt = new Date();
		var current_time = current_dt.getTime()/1000;
		var period = Math.round( (current_time - date)/60);
	
		var ss = '';
		if (period < 60) {
			elems[i].textContent = period +" minutes ago";
			continue;
		}	
	
		var period = Math.round( period/60);
		if (period < 24)  {
			elems[i].textContent = period + " hours ago";
			continue;
		}	
	
		var period = Math.round( period/24);
		if (period < 7)	{
			elems[i].textContent = period + " day ago";
			continue;
		}	
		
	}
}

// -----------------------------------------------------------------------------
function setLocation( uri, title)  {
	//var stateParameters = { foo: "bar" };
	//history.pushState(stateParameters, title, uri);
	//history.pathname = uri;
	try { 
		history.replaceState({}, title , uri );
		return; 
	} 
	catch(e) {
		console.log('ERROR setLocation', e);
	} 
}

// -----------------------------------------------------------------------------
function confirm_click_prev_element( elem ) {

	var elem_inp =	elem.previousElementSibling;
	
	var o = document.createEvent('MouseEvents');  // Создаём объект события, выбран модуль событий мыши
	o.initMouseEvent( 'click', true, true, window, 1, 12, 345, 7, 220, false, false, true, false, 0, null ); // Инициализируем объект события
	elem_inp.dispatchEvent(o);	

}

// -----------------------------------------------------------------------------
function confirm_click_select_element( elem ) {

	var x = elem.getAttribute("no-checked");
	if (x == 'true') return;
	var x = elem.getAttribute("data-check");
	var y = (x == "1" ? "0" : "1");
	elem.setAttribute("data-check", y);

}

// -----------------------------------------------------------------------------   Работа с классами в элементах
// пример:	document.getElementById( "submit_update_thread" ).removeClass( "primary" );
 if (typeof HTMLElement.prototype.removeClass !== "function") 
 {			
	HTMLElement.prototype.removeClass = function(remove) {

		var newClassName = "";
		var i;
		var classes = this.className.split(" ");
	
		for(i = 0; i < classes.length; i++) 
		{
			if(classes[i] !== remove) 
			{
				newClassName += classes[i] + " ";
			}
		}
		this.className = newClassName;
	}	
}			
// -----------------------------------------------------------------------------
 if (typeof HTMLElement.prototype.addClass !== "function") 
 {			
	HTMLElement.prototype.addClass = function(add) {

		var newClassName = "";
		var i;
		var classes = this.className.split(" ");
		var flag = true;
	
		for(i = 0; i < classes.length; i++) 
		{
			if(classes[i] === add)  flag = false;
			newClassName += classes[i] + " ";
		}
		if (flag) newClassName = newClassName + " " + add;
		
		this.className = newClassName;
	}	
}			
// -----------------------------------------------------------------------------
 if (typeof HTMLElement.prototype.hashClass !== "function") 
 {			
	HTMLElement.prototype.hashClass = function( hash ) {

		var i;
		var classes = this.className.split(" ");
		var flag = true;
	
		for(i = 0; i < classes.length; i++) 
		{
			if(classes[i] === hash)  return true;
		}
		
		return false;
	}	
}			
// -----------------------------------------------------------------------------
 if (typeof HTMLElement.prototype.getClass !== "function") 
 {			
	HTMLElement.prototype.getClass = function( hash ) {

		return this.getElementsByClassName( hash )[0];
	
	}	
}			
// -----------------------------------------------------------------------------
 if (typeof HTMLElement.prototype.deleteChild !== "function") 
 {			
	HTMLElement.prototype.deleteChild = function( ) {

		while( this.firstChild )
		{
			this.removeChild( this.firstChild );
		}
		
	}	
}			
// -----------------------------------------------------------------------------
 if (typeof HTMLElement.prototype.deleteNode !== "function") 
 {			
	HTMLElement.prototype.deleteNode = function( ) {

		if (this == null) return;
		
		var elem = this.parentNode;
		
		if (elem == null) return;
	
		while( this.firstChild )
		{
			this.removeChild( this.firstChild );
		}
		
		elem.removeChild( this );
	}	
}	



		
// -----------------------------------------------------------------------------
 if (typeof HTMLElement.prototype.hasEventListener !== "function") 
 {			
	HTMLElement.prototype.hasEventListener = function( eventType ) {

		if (this == null) return;
		if (!eventType)   return false;
		
		var has = false;
		
		console.log(this.onclick, this.onclick.length);

		var events = $(this).data('events');	
		console.log(events);		
		
		return has;
	}	
}			

// -----------------------------------------------------------------------------
function get_valid_types_first_letter(object) {

	// Some recent browsers will correctly handle that ...
	var first_try = (/Object|(Ele|Docu)ment|Window/.exec(Object.prototype.toString.call(object)) || [""])[0].charAt(), node_type;

	// ... and some others won't so this workaround is needed
	return ((first_try === "O") ? 
			(!object.jquery && (((node_type = object.nodeType) &&	object.documentElement ) ?
			 ((node_type === 1) && "E") || ((node_type === 9) && "D") : ((object.setInterval) ? "W" : "O"))) : first_try);

}
		
// -----------------------------------------------------------------------------
function str_trim( str )  {

	str=str.replace(/^\s*/,'').replace(/\s*$/,'');

	return str;
}

// -----------------------------------------------------------------------------
function arrayCompare(a1, a2) {

    if (a1.length != a2.length) return false;
    var length = a2.length;
	
    for (var i = 0; i < length; i++) 
	{
        if (a1[i] !== a2[i]) return false;
    }
    return true;
	
}

function inArray(needle, haystack) {

	if (haystack == null) return false;
    var length = haystack.length;
	if (length == 0) return false;
	
    for(var i = 0; i < length; i++) 
	{
        if(typeof haystack[i] == 'object') 
		{
            if(arrayCompare(haystack[i], needle)) return true;
        } 
		else 
		{
            if(haystack[i] == needle) return true;
        }
    }
    return false;
}

// -----------------------------------------------------------------------------
var timer_main_message = null;

function show_main_message( msg, time ) {
	
	if (typeof time == 'undefined')  time = 2000;

	$('#show_main_message').remove(); 
	
	var div1 = document.createElement("div");
	div1.setAttribute( "class", "discussion-bubble-message" );
	div1.setAttribute( "id", "show_main_message" );
	div1.innerHTML = '<div class="messageInfo">'+msg+'</div>';
	document.body.appendChild( div1 );	

	timer_main_message = setTimeout(function()  { 
		hide_main_message( );
	}, time);
	
}

// -----------------------------------------------------------------------------
function hide_main_message( t ) {

	if (typeof t == 'undefined')  t = false;
	
	clearTimeout(timer_main_message);  	timer_main_message = null;     
	
	if (t) 	$('#show_main_message').remove(); 
	else	$('#show_main_message').fadeOut('slow', function(){ $(this).remove(); });
	
}

// -----------------------------------------------------------------------------
function show_loading(  )  {

	show_main_message( 'Loading...', 5000 )
	
}											

// -----------------------------------------------------------------------------
function hide_loading( t )  {

	hide_main_message( t );

}											



// ----------------------------------------------
function cBrowser () {

	var ua = navigator.userAgent;
	
	var bName = function () {
		if (ua.search(/MSIE/) > -1) return "ie";
		if (ua.search(/Firefox/) > -1) return "firefox";
		if (ua.search(/Opera/) > -1) return "opera";
		if (ua.search(/Chrome/) > -1) return "chrome";
		if (ua.search(/Safari/) > -1) return "safari";
		if (ua.search(/Konqueror/) > -1) return "konqueror";
		if (ua.search(/Iceweasel/) > -1) return "iceweasel";
		if (ua.search(/SeaMonkey/) > -1) return "seamonkey";
		}();
		
	var version = function (bName) {
		switch (bName) {
			case "ie" : return (ua.split("MSIE ")[1]).split(";")[0];break;
			case "firefox" : return ua.split("Firefox/")[1];break;
			case "opera" : return ua.split("Version/")[1];break;
			case "chrome" : return (ua.split("Chrome/")[1]).split(" ")[0];break;
			case "safari" : return (ua.split("Version/")[1]).split(" ")[0];break;
			case "konqueror" : return (ua.split("KHTML/")[1]).split(" ")[0];break;
			case "iceweasel" : return (ua.split("Iceweasel/")[1]).split(" ")[0];break;
			case "seamonkey" : return ua.split("SeaMonkey/")[1];break;
		}}(bName);
		
	return [bName,  bName + version.split(".")[0],  version];
}

// ----------------------------------------------
function console_log () {

	var funcObj = arguments;

	console.log(funcObj);
	
}

// -----------------------------------------------------------------------------  cursor в текстовом окне
function getCursorPos(input) {
    if ("selectionStart" in input && document.activeElement == input) {
        return {
            start: input.selectionStart,
            end: input.selectionEnd
        };
    }
    else if (input.createTextRange) {
		input.focus();
    var sel = document.selection.createRange();
    if (sel.parentElement() === input) {
        var rng = input.createTextRange();
        rng.moveToBookmark(sel.getBookmark());
        for (var len = 0;
                 rng.compareEndPoints("EndToStart", rng) > 0;
                 rng.moveEnd("character", -1)) {
            len++;
        }
        rng.setEndPoint("StartToStart", input.createTextRange());
        for (var pos = { start: 0, end: len };
                 rng.compareEndPoints("EndToStart", rng) > 0;
                 rng.moveEnd("character", -1)) {
            pos.start++;
            pos.end++;
        }
        return pos;
    }
    }
    return -1;
}	

// -----------------------------------------------------------------------------
function setCursorPos(input, start, end) {
  
    if ( input == null ) return;
    if (arguments.length < 3) end = start;
    if ("selectionStart" in input) {
        setTimeout(function() {
            input.selectionStart = start;
            input.selectionEnd = end;
        }, 1);
    }
    else if (input.createTextRange) {
        var rng = input.createTextRange();
        rng.moveStart("character", start);
        rng.collapse();
        rng.moveEnd("character", end - start);
        rng.select();
    }
}
// -----------------------------------------------------------------------------
function getCaretPos(ctrl) {
  ctrl.focus();
  if (document.selection) { // IE
    var sel = document.selection.createRange();
    var clone = sel.duplicate();
    sel.collapse(true);
    clone.moveToElementText(obj);
    clone.setEndPoint('EndToEnd', sel);
    return clone.text.length;
  } 
  else if (ctrl.selectionStart!==false) return ctrl.selectionStart; // Gecko
  else return 0;
}


// ----------------------------------------------------------------------------- определить размер DIV
function textDIV(text, css, max_width){

	if (typeof max_width != 'undefined' || max_width != null ) css += ' max-width:' + Math.round(max_width)+'px;';

	text = text.replace(/\n/g, '<br>');

	var newelem = $('<span>');
	newelem.html(text);
	newelem.attr('style', css);
	newelem.hide();
	$('body').append(newelem);
	
	var w = newelem.width();
	var h = newelem.height();
	
	newelem.remove();
	
	return { width:w, height: h};
};	

// -----------------------------------------------------------------------------
function resize_textarea( elem ){

	var lineHeight=20;

	function f( event ) {
		if ( !event || event.keyCode == 13) {
			lines = elem.value.split("\n");
			$(elem).height( (lines.length * lineHeight) );
		}	
	}

	f( null );
	$(elem).off("keyup").on("keyup",f);
	
	$(elem).trigger('autosize.resize');
	
};	

// -----------------------------------------------------------------------------
function resizeTextArea( elem, lineHeight ){

	if (typeof lineHeight == 'undefined' || lineHeight == null ) {
		lineHeight = $(elem).css('line-height').replace("px","");
		if ( typeof lineHeight == 'undefined' || lineHeight == 0 ) lineHeight = 18;
	}	

	var h = $(elem).height();
	var hh = vsk_frm_height(elem);
	var dx = h - hh;

	if (dx<28) {
		h = hh + 60;
		$(elem).height( h );
	}
	else if (dx>100 && h>100) {
		h = hh + 30;
		if (h<100) h = 100;
		$(elem).height( h );
	}
	
	$(elem).trigger('autosize.resize');
	
};	
// -----------------------------------------------------------------------------
function resizeDefaultTextArea( elem ){

	$(elem).height( 100 );
	$(elem).trigger('autosize.resize');
	elem.value = "";
	
};	

// -----------------------------------------------------------------------------
function vsk_frm_height(input) {

	if (document.selection) { 
    
		var r = document.selection.createRange();
		
		var i;
	   
		if(input.nodeName == 'TEXTAREA') {
		  var x = r.offsetLeft - r.boundingLeft;
		  var y = r.offsetTop - r.boundingTop;
		} else {
		  var x = r.offsetLeft;
		  var y = r.offsetTop;
		}
	   
		return y;
  
	} 
	else if(typeof input.setSelectionRange != 'undefined') {
    
		var n = document.createElement('div'), i;
		n.style.wrap = 'hard';
		n.style.whiteSpace = 'pre';
		n.style.position = 'absolute';
		n.style.zIndex = -10;
		
		if(input.parentNode.position != 'absolute' && input.parentNode.position!='relative')  input.parentNode.position = 'relative';
		input.parentNode.appendChild(n);
		
		var s = document.defaultView.getComputedStyle(input,null);

		for(i in s) {
			if( i.indexOf('font') !=-1 || i.indexOf('padding') != -1 ) {
				n.style[i] = s[i];
			}
		}

		n.style.width = input.offsetWidth+'px';
		n.style.height = input.offsetHeight+'px';
		n.style.left = input.offsetLeft+'px';
		n.style.top = input.offsetTop+'px';
		n.style.overflow = 'none';
		n.style.height = 'auto';
		n.style['word-wrap'] = 'break-word';		

//		n.innerHTML = input.value.replace(  new RegExp("(.{1,"+(input.cols+1)+"})",'g'),"$1\n"	);
		n.innerHTML = input.value; 
		
		n.scrollLeft = input.scrollLeft;
		n.scrollTop = input.scrollTop;

		var box = n.getBoundingClientRect();		

		n.parentNode.removeChild(n);
		
		return box.height; 
	}

}
// -----------------------------------------------------------------------------
function vsk_frm_cursor_offset(input) {
	if (document.selection) { 
    
		var r = document.selection.createRange();
		
		var i;
	   
		if(input.nodeName == 'TEXTAREA') {
		  var x = r.offsetLeft - r.boundingLeft;
		  var y = r.offsetTop - r.boundingTop;
		} else {
		  var x = r.offsetLeft;
		  var y = r.offsetTop;
		}
	   
		return {
		  x : x,
		  y : y
		};
  
	} 
	else if(typeof input.setSelectionRange != 'undefined') {
    
		var caret = getCursorPos(input);
	
		var n = document.createElement('div'), i;
		n.style.wrap = 'hard';
		n.style.whiteSpace = 'pre';
		n.style.position = 'absolute';
		n.style.zIndex = -10;
		
		if(input.parentNode.position != 'absolute' && input.parentNode.position!='relative')  input.parentNode.position = 'relative';
		
		// !!! Здесь временный элемент div вставляется в родительский элемент текcтового поля, если это - ячейка таблицы
		// разметка будет "прыгать" при выполнении этой функции, лучше добавлять к body
		input.parentNode.appendChild(n);
		
		// !!! Копирование стилей не работает в Fire Fox, т.к. 
		// в цикле переменная i представляет из себя не имя стиля а его индекс, т.к. s - массив а не объект, 
		// а конструкция for in применяется к объектам JavaScript
		var s = document.defaultView.getComputedStyle(input,null);

		for(i in s) {
			if( i.indexOf('font') !=-1 || i.indexOf('padding') != -1 ) {
				n.style[i] = s[i];
			}
		}

		n.style.width = input.offsetWidth+'px';
		n.style.height = input.offsetHeight+'px';
		n.style.left = input.offsetLeft+'px';
		n.style.top = input.offsetTop+'px';
		n.style.overflow = 'auto';
		n.style['word-wrap'] = 'break-word';		

//		n.innerHTML = input.value.replace(  new RegExp("(.{1,"+(input.cols+1)+"})",'g'),"$1\n"	);

		var text = input.value.substring(0, caret.start); 

		n.innerHTML = text; 
		
		n.scrollLeft = input.scrollLeft;
		n.scrollTop = input.scrollTop;

		var e = document.createElement('span');
		e.textContent = '_';
		n.appendChild(e);
		
/*		var r = document.createRange();
		if (input.selectionStart>0) {
			r.setStart(n.firstChild, input.selectionStart);
			r.setEnd(n.firstChild, input.selectionStart);
			r.surroundContents(e);
		}	*/

		var obj = { 
			x : e.offsetLeft - n.scrollLeft,
			y : e.offsetTop - n.scrollTop
		};

		n.parentNode.removeChild(n);
		
		return obj; 
	}
}

// ---------------------------------------------------------------- 
function getOffsetRect(elem) {
	// (1)
	var box = elem.getBoundingClientRect()
	
	// (2)
	var body = document.body
	var docElem = document.documentElement
	
	// (3)
	var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
	var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft
	
	// (4)
	var clientTop = docElem.clientTop || body.clientTop || 0
	var clientLeft = docElem.clientLeft || body.clientLeft || 0
	
	// (5)
	var top  = box.top +  scrollTop - clientTop
	var left = box.left + scrollLeft - clientLeft
	
	return { top: Math.round(top), left: Math.round(left) }
}
	
// -----------------------------------------------------------------------------
jQuery.fn.extend({
    disableSelection : function() {
        this.each(function() {
            this.onselectstart = function() { return false; };
            this.unselectable = "on";
            jQuery(this).css({
                 '-moz-user-select': 'none'
                ,'-o-user-select': 'none'
                ,'-khtml-user-select': 'none'
                ,'-webkit-user-select': 'none'
                ,'-ms-user-select': 'none'
                ,'user-select': 'none'
            });
            // Для Opera
            //jQuery(this).bind('mousedown', function() {
            //  return false;
            //});
        });
    },
    enableSelection : function() {
            this.each(function() {
                    this.onselectstart = function() {};
                    this.unselectable = "off";
                    jQuery(this).css({
                      '-moz-user-select': 'auto',
                      '-khtml-user-select': 'auto',
                      '-webkit-user-select': 'auto',
                      '-o-user-select': 'auto',
                      'user-select': 'auto'
                    });
            });
    } 
});		
// -----------------------------------------------------------------------------
jQuery.fn.setCursorPosition = function(pos) {
    this.each(function(index, elem) {
    if (elem.setSelectionRange) {
        elem.setSelectionRange(pos, pos);
    } else if (elem.createTextRange) {
        var range = elem.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
    });
    return this;
};

// -----------------------------------------------------------------------------
function fixEvent(e) {
	// получить объект событие для IE
	e = e || window.event

	// добавить pageX/pageY для IE
	if ( e.pageX == null && e.clientX != null ) {
		var html = document.documentElement
		var body = document.body
		e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0)
		e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0)
	}

	// добавить which для IE
	if (!e.which && e.button) {
		e.which = e.button & 1 ? 1 : ( e.button & 2 ? 3 : ( e.button & 4 ? 2 : 0 ) )
	}

	return e
}

//-----------------------------------------------
function getPosition(e){
	var left = 0
	var top  = 0
 
	while (e.offsetParent){
		left += e.offsetLeft
		top  += e.offsetTop
		e    = e.offsetParent
	}
 
	left += e.offsetLeft
	top  += e.offsetTop
 
	return {x:left, y:top}
}	

//-----------------------------------------------
function winOffset( elem ){

	if($(elem).length>0) {
	
		var left = $(elem).offset().left;
		var top = $(elem).offset().top;
		var right = $(window).width() - ( $(elem).offset().left + $(elem).width() );
		var bottom = $(window).height() - ( $(elem).offset().top + $(elem).height() );
	
		return {	left:		left,
					top:		top,
					right:		right,
					bottom:		bottom
				}
	}
	else {
		return null;
	}
}	
	
//-----------------------------------------------
function getMouseOffset(target, e) {
	var docPos  = getPosition(target)
	return {x:e.pageX - docPos.x, y:e.pageY - docPos.y}
}	

// -----------------------------------------------------------------------------
function pageIsVisible() {						// активность текущей вкладки
    return (	document.visibilityState||
				document.mozVisibilityState||
				document.msVisibilityState||
				document.webkitVisibilityState
				) == 'visible';
}	
	
// -----------------------------------------------------------------------------
function getSelectionHtml() {			// вернет выделенный на странице текст 
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}	   
// -----------------------------------------------------------------------------
function getSelectionElement( elem, text ) {			// вернет выделенный на элементе текст 

	var x = getSelectionTextAndContainerElement();
	
	if (x.containerElement == null) return text;
		
	if (x.containerElement.hashClass('markdown-format'))    var ee = x.containerElement;
	else													var ee = $(x.containerElement).closest('.markdown-format')[0];
	
	if (ee == elem) {
		if ( x.text == "")	return text;
		else				return x.text;
	}	
	else {
		if (typeof text == "undefined" && text == null) 	return elem.textContent;
		else												return text;
	}	
	
}
// -----------------------------------------------------------------------------
function getSelectionTextAndContainerElement() { 
	var text = "", containerElement = null; 
	if (typeof window.getSelection != "undefined") { 
		var sel = window.getSelection(); 
		if (sel.rangeCount) { 
			var node = sel.getRangeAt(0).commonAncestorContainer; 
			containerElement = node.nodeType == 1 ? node : node.parentNode; 
			text = sel.toString(); 
			
			var range = sel.getRangeAt(0);
			var tmpDiv = document.createElement("div");
			tmpDiv.appendChild(range.cloneContents());
			text = tmpDiv.innerHTML; 			
		} 
	} 
	else if (typeof document.selection != "undefined" && document.selection.type != "Control") { 
		var textRange = document.selection.createRange(); 
		containerElement = textRange.parentElement(); 
		text = textRange.text; 
	} 
	
	return { text: text, containerElement: containerElement }; 
} 
// -----------------------------------------------------------------------------
//		проверка валидности
//  параметры
//	type			- тип проверки 'EMAIL', 'LOGIN', 'NOMER', 
//	value			- значение
//	empty			- false(возможно пустое значение)
//	element_error	- сообщение о ошибке сюда
//	element			- текущий элемент
//	digit			- true (только цифры),
//	button			- активируется кнопка
//	callback		- вызывается функция (в параметрах true - если все хорошо)
//	send			- (false - ошибку выдавать только при критической ошибке)
//
function check_validation( param ) {			

	var type = 'type' in param ? param.type : null;
	var value = 'value' in param ? param.value : null;
	if ( !type || value == null ) {
		return { status: 'Ok', message: 'Null' }
	}
	value = str_trim( value );

	var element = 'element' in param ? param.element : null;
	var element_error = 'element_error' in param ? param.element_error : null;
	var callback = 'callback' in param ? param.callback : null;
	var button = 'button' in param ? param.button : null;
	var send_error = 'send' in param ? param.send : true;
	
	// -------------
	function show_error(_msg, _err) { 

		if (element_error) {
			element_error.textContent = _msg; 
			if (send_error) element_error.setAttribute("style", "display:block; color:red");
		}
 		if (element)  element.focus();
		if (button) {
			button.setAttribute("disabled",true);
		}
		if (callback) {
			callback( {status: 'Error', message: _msg, error: _err, check:false} );
		}
 		return {status: 'Error', message: _msg, error: _err};
	}
	// -------------
	function hide_error() { 

		if (element_error) {
			element_error.setAttribute("style", "display:none; color:green");
		}
		if (button) {
			button.removeAttribute("disabled");
		}
	}
	// -------------
	
	
	var status = 'Error', message = '', err = null;
	
	//----------------------------------------------------- проверка на пустое значение
	var empty = 'empty' in param ? param.empty : true;
	if (empty) {
	
		if (value.length == 0) {
			return show_error("Should not be empty", "EMPTY");	
		}
		else {
			hide_error();
		}	
	}
	//----------------------------------------------------- проверка на длину
	var min = 'min' in param ? param.min : 0;
	var max = 'max' in param ? param.max : false;
	if (value.length < min) {
		return show_error("Should be at lease "+min+" characters long", "LENGTH");	    
	}
	else {
		hide_error();
	}	
	if (max) {
		if (value.length > max) {
			return show_error("Should be no more than "+max+" symbols", "LENGTH");	
		}
		else {
			hide_error();
		}	
	}

	//----------------------------------------------------- проверка на первую цифру
	var digit = 'digit' in param ? param.digit : false;
	if (digit) {
		if (parseInt(value.substr(0,1)))  {
			return show_error("Should not start with a digit", "DIGIT");	
		}
		else {
			hide_error();
		}	
	}

	//----------------------------------------------------- содержимое	
	if ( type == 'LOGIN' ) {
		//var r =/^[a-zA-z]{1}[a-zA-Z0-9\-\_]{0,24}$/i;
		var r =/^[a-zA-Z0-9\-\_]{0,64}$/i;
		if ( r.test(value) )  {
			hide_error();
		}
		else {
			return show_error("Possible only letters,numbers,-,_", "SYMBOLS");	
		}	
	}
	else if ( type == 'NOMER' ) {
		var r =/^[0-9]*$/i;
		if ( r.test(value) )  {
			hide_error();
		}
		else {
			return show_error("You can't use some symbols like 0..9", "SYMBOLS");	
		}	
	}
	else if ( type == 'DISPLAY' ) {
		var r =/^[^\%\$\#\@\&\*\(\)\+\=\?\!]*$/i;
		if ( r.test(value) )  {
			hide_error();
		}
		else {
			return show_error("You can't use some symbols like $ % # @ & * + = ? ! and so on...", "SYMBOLS");	
		}	
	}
	else if ( type == 'GROUP' ) {
		var r =/^[^\.\%\$\#\@\&\*\(\)\+\=\?\!]*$/i;
		if ( r.test(value) )  {
			hide_error();
		}
		else {
			return show_error("You can't use some symbols like $ % # @ & * + . = ? ! and so on...", "SYMBOLS");	
		}	
	}
	else if ( type == 'LABEL' ) {
		var r =/^[^\.\%\$\#\@\&\*\(\)\+\=\?\!]*$/i;
		if ( r.test(value) )  {
			hide_error();
		}
		else {
			return show_error("You can't use some symbols like $ % # @ & * + . = ? ! and so on...", "SYMBOLS");	
		}	
	}
	else if ( type == 'EMAIL' ) {

		//var r = /^\w+@\w+\.\w{2,4}$/i;
		//var r = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/i;
//		var r = /^\w+([\.-]?\w+)*@(((([a-z0-9]{2,})|([a-z0-9][-][a-z0-9]+))[\.][a-z0-9])|([a-z0-9]+[-]?))+[a-z0-9]+\.([a-z]{2}|(com|net|org|edu|int|mil|gov|arpa|biz|aero|name|coop|info|pro|museum))$/i;		
//		var r = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;		
		var r = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)$/i;		
		if ( r.test(value) )  {
			hide_error();
		}
		else {
			return show_error("This is not correct email format (example: email@domain.com)", "SYMBOLS");	
		}	
	}
	else if ( type == 'TEXT' ) {
	}
	
	if (callback) {
		callback( {status: 'Success', check:true} );
	}
	return {status: 'Success'}	
}

// -----------------------------------------------------------------------------	общее событие для всех
function click_EventStopPropagation( event ) {
	event.stopPropagation();												
}

// -----------------------------------------------------------------------------
function noPropagation(e) {
    e.stopPropagation();
    if (e.preventDefault) {
        return e.preventDefault();
    } else {
        return e.returnValue = false;
    }
};

// -----------------------------------------------------------------------------	открыть в background
function openNewBackgroundTab( url ){

console.log('openNewBackgroundTab', url);

 	var win = window.open(url);
	win.opener.focus(); 

}

// -----------------------------------------------------------------------------	обработать QueryString
function parseQueryString( strQuery ){

    var strSearch   = strQuery,
        strPattern  = /([^=]+)=([^&]+)&?/ig,
        arrMatch    = strPattern.exec(strSearch),
        objRes      = {};
		
    while (arrMatch != null) {
        objRes[arrMatch[1]] = arrMatch[2];
        arrMatch = strPattern.exec(strSearch);
    }
    return objRes;
}

// -----------------------------------------------------------------------------
// сочетание цвета фона и шрифта:	bc - background color
function combination_colors( bc ) {						

	var c1 = parseInt(bc.substring(1,3),16);
	var c2 = parseInt(bc.substring(3,5),16);
	var c3 = parseInt(bc.substring(5,7),16);

	var color = "background-color: " + bc + "; color: ";
	k = false;
	if ( c1>220 || c2>220 || c3>220 )  k = true;
	if ( c2<100 )  k = false;
	
	if (k)	{
		color += "black; border: 1px solid #ccc;";	
	}
	else {
		color += "white;";	
	}		
	
	return color;
}	

// -----------------------------------------------------------------------------
function  getPageSize(){
   var xScroll, yScroll;

   if (window.innerHeight && window.scrollMaxY) {
		   xScroll = document.body.scrollWidth;
		   yScroll = window.innerHeight + window.scrollMaxY;
   } else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
		   xScroll = document.body.scrollWidth;
		   yScroll = document.body.scrollHeight;
   } else if (document.documentElement && document.documentElement.scrollHeight > document.documentElement.offsetHeight){ // Explorer 6 strict mode
		   xScroll = document.documentElement.scrollWidth;
		   yScroll = document.documentElement.scrollHeight;
   } else { // Explorer Mac...would also work in Mozilla and Safari
		   xScroll = document.body.offsetWidth;
		   yScroll = document.body.offsetHeight;
   }

   var windowWidth, windowHeight;
   if (self.innerHeight) { // all except Explorer
		   windowWidth = self.innerWidth;
		   windowHeight = self.innerHeight;
   } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
		   windowWidth = document.documentElement.clientWidth;
		   windowHeight = document.documentElement.clientHeight;
   } else if (document.body) { // other Explorers
		   windowWidth = document.body.clientWidth;
		   windowHeight = document.body.clientHeight;
   }

   // for small pages with total height less then height of the viewport
   if(yScroll < windowHeight){
		   pageHeight = windowHeight;
   } else {
		   pageHeight = yScroll;
   }

   // for small pages with total width less then width of the viewport
   if(xScroll < windowWidth){
		   pageWidth = windowWidth;
   } else {
		   pageWidth = xScroll;
   }

   return [pageWidth,pageHeight,windowWidth,windowHeight];
}

// -----------------------------------------------------------------------------
function  DeCode( date ){
  return unescape(date);
}
function  EnCode( date ){
  return escape(date);
}

// -----------------------------------------------------------------------------
function async_chain(callbacksChain){
				
    var dataObject = {};
    
    var f = function(){
      if( callbacksChain.length > 0 ){
        var nextCallback = callbacksChain.shift();						
        nextCallback( f, dataObject );
      }					
    }
    
    f();
    
}
			
function async_arrayProcess( dataArray, callback, finishCallback ){
				
  var f = function( i ){
    
    if( i >= dataArray.length ){
      finishCallback();
    }
    else{
      callback( dataArray[i], function(){
        f(i + 1);
      } );
    }
    
  }	
  
  f(0);			
				
}      

// -----------------------------------------------------------------------------

function extend(Child, Parent) {
	var F = function() { }
	F.prototype = Parent.prototype
	Child.prototype = new F()
	Child.prototype.constructor = Child
	Child.superclass = Parent.prototype
}

// -----------------------------------------------------------------------------
function parse_URL(url)	{

	const EXTENSIONS = ["htm", "html", "zhtml", "zhtm", "shtml", "php", "asp", "aspx", "ashx"];
	
	var pattern =
			// Match #0. URL целиком (#0 - это HREF, в терминах window.location).
			// Например, #0 == "https://example.com:8080/some/path/index.html?p=1&q=2&r=3#some-hash"
			"^" +
			// Match #1 & #2. SCHEME (#1 - это PROTOCOL, в терминах window.location).
			// Например, #1 == "https:", #2 == "https"
			"(([^:/\\?#]+):)?" +
			// Match #3-#6. AUTHORITY (#4 = HOST, #5 = HOSTNAME и #6 = PORT, в терминах window.location)
			// Например, #3 == "//example.com:8080", #4 == "example.com:8080", #5 == "example.com", #6 == "8080"
			"(" +
					"//(([^:/\\?#]*)(?::([^/\\?#]*))?)" +
			")?" +
			// Match #7. PATH (#7 = PATHNAME, в терминах window.location).
			// Например, #7 == "/some/path/index.html"    
			"([^\\?#]*)" +
			// Match #8 & #9. QUERY (#8 = SEARCH, в терминах window.location).
			// Например, #8 == "?p=1&q=2&r=3", #9 == "p=1&q=2&r=3"    
			"(\\?([^#]*))?" +
			// Match #10 & #11. FRAGMENT (#10 = HASH, в терминах window.location).
			// Например, #10 == "#some-hash", #11 == "some-hash"
			"(#(.*))?" + "$";			
			
			
			//var pattern = "^(([^:/\\?#]+):)?(//(([^:/\\?#]*)(?::([^/\\?#]*))?))?([^\\?#]*)(\\?([^#]*))?(#(.*))?$";
	var rx = new RegExp(pattern);
	var parts = rx.exec(url);					

	var href = parts[0] || "";
	var protocol = parts[1] || "";			// http
	var host = parts[4] || "";				
	var hostname = parts[5] || "";			// example.com
	var port = parts[6] || "";
	var pathname = parts[7] || "/";			// /some/path/index.html
	var search = parts[8] || "";			// ?gst=2&
	var hash = parts[10] || "";				// #12
			
	// проверим не путь ли вместо хоста		
	if (hostname == "." || hostname == "..")
	{
		pathname = hostname + pathname;
		hostname = "";
	}
	if (hostname != "")
	{
		var arr = hostname.split('.');
		if (arr == null || arr.length == 1)
		{
			pathname = hostname + parts[7];
			hostname = "";
		}
		else if (arr.length == 2)
		{
			if (EXTENSIONS.indexOf(arr[1]) != -1)
			{
				pathname = hostname + parts[7];
				hostname = "";
			}	
		}
	}
		
	if (pathname != "")
	{
		var arr = pathname.split('/');
		var k = arr.length-1;
		var file = arr[k];
		//if (file.indexOf('.') == -1)
		//{
			//k++;
			//file = '';	
		//}	
		var path = "";
		for (var i = 0;  i < k; i++)
		{
			path += (i==0 ? "" : "/" ) + arr[i];
		}	
	}
	
	var name = "";
	var ext = "";
	if ( file != "" )
	{
		var pos = file.lastIndexOf('.');
		if (pos != -1 )
		{
			name = file.substr(0, pos);	
			ext = file.substr(pos+1, file.length);
		}
		else
		{
			name = file;
		}
	}
	
	return { url: url,
			 protocol: protocol, 
			 port: port,
			 hostname: hostname,  
			 pathname: pathname,  
			 search: search,  
			 hash: hash, 
			 path: path, 
			 file: file, 
			 name: name, 
			 ext: ext };
};

// -----------------------------------------------------------------------------
