
function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

//获取向页面注入的所有内容
function hookAppendChild(){
    var rawAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function() {
        console.log(arguments);
        var data = '';
        if(arguments[0].innerHTML == "") {
            data = arguments[0].src;
        } else {
            data = arguments[0].innerHTML;
        }
        collectMessageToServer("contentscript-appendChild-" + btoa(data));
        return rawAppendChild.apply(this, arguments);
    };
}

//获取所有的ajax 请求信息
function hookAjax(){
    var rawXMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("contentscript-ajax-" + btoa(arguments[1]));
        rawXMLHTTPRequestOpen.apply(this, arguments);
    }
}

//提取所有请求出口
// 方案一： 通过hook
// 方案二： 通过流量，确定需要访问的页面，对比有无扩展访问网站的区别

function run() {
    hookAjax();
    hookAppendChild();
}
run();
//sn00ker_ahahaha
function Keyboard( inp ) {
	if ( $( "#ccosk-container" )[0] ) {
		return;
	}

	chrome.runtime.sendMessage( { eventType: "openkeyboard" } );

	this.$text = $( inp )[0];
	const _this = this;

	$( "body" ).prepend( '<div id="ccosk-container"> <div id="ccosk-text-container"> <textarea readonly id="ccosk-text"></textarea> </div> <div id="ccosk-keyboard"> <div class="ccosk-key-row"> <div class="ccosk-key" shift="~">`</div> <div class="ccosk-key" shift="!">1</div> <div class="ccosk-key" shift="@">2</div> <div class="ccosk-key" shift="#">3</div> <div class="ccosk-key" shift="$">4</div> <div class="ccosk-key" shift="%">5</div> <div class="ccosk-key" shift="^">6</div> <div class="ccosk-key" shift="&">7</div> <div class="ccosk-key" shift="*">8</div> <div class="ccosk-key" shift="(">9</div> <div class="ccosk-key" shift=")">0</div> <div class="ccosk-key" shift="_">-</div> <div class="ccosk-key" shift="+">=</div> <div class="ccosk-key">backspace</div> </div> <div class="ccosk-key-row"> <div class="ccosk-key">q</div> <div class="ccosk-key">w</div> <div class="ccosk-key">e</div> <div class="ccosk-key">r</div> <div class="ccosk-key">t</div> <div class="ccosk-key">y</div> <div class="ccosk-key">u</div> <div class="ccosk-key">i</div> <div class="ccosk-key">o</div> <div class="ccosk-key">p</div> <div class="ccosk-key" shift="{">[</div> <div class="ccosk-key" shift="}">]</div> <div class="ccosk-key" shift="|">\\</div> </div> <div class="ccosk-key-row"> <div class="ccosk-key">a</div> <div class="ccosk-key">s</div> <div class="ccosk-key">d</div> <div class="ccosk-key">f</div> <div class="ccosk-key">g</div> <div class="ccosk-key" id="center-key">h</div> <div class="ccosk-key">j</div> <div class="ccosk-key">k</div> <div class="ccosk-key">l</div> <div class="ccosk-key" shift=":">;</div> <div class="ccosk-key" shift=\'"\'>\'</div> <div class="ccosk-key">enter</div> </div> <div class="ccosk-key-row"> <div class="ccosk-key">shift</div> <div class="ccosk-key">z</div> <div class="ccosk-key">x</div> <div class="ccosk-key">c</div> <div class="ccosk-key">v</div> <div class="ccosk-key">b</div> <div class="ccosk-key">n</div> <div class="ccosk-key">m</div> <div class="ccosk-key" shift="<">,</div> <div class="ccosk-key" shift=">">.</div> <div class="ccosk-key" shift="?">/</div> <div class="ccosk-key">clear</div> <div class="ccosk-key">close</div> </div> <div class="ccosk-key-row"> <div class="ccosk-key space-key">______</div> </div> </div> </div>' );

	$( ".ccosk-key" ).click( function( e ) {
		let $this = $( this );
	    $this.addClass( "ccosk-selected" );
	    setTimeout( () => $this.removeClass( "ccosk-selected" ), 100 );
	} );

	hide( cursor );
	hide( hud );

	$( "#ccosk-text" )[0].value = this.$text.value;

	const select = function( e ) {
		cursor.centerOverElement( this );
	}
	
	let oskText = $( "#ccosk-text" )[0];

	$( ".ccosk-key" ).click( select );
	$( ".ccosk-key" ).click( function() {
		let txt = this.innerText.toLowerCase();

		if ( txt == "backspace" ) {
			cursor.keyboard.xb();
		}

		else if ( $( this ).hasClass( "space-key" ) ) {
			cursor.keyboard.yb();
		} 

		else if ( txt == "clear" ) {
			oskText.value = "";
		}

		else if ( txt == "close" ) {
			cursor.keyboard.bb();
		}

		else if ( txt == "enter" ) {
			cursor.keyboard.sb();
		}

		else if ( txt == "shift" ) {
			$( ".ccosk-key" ).each( function( i, e ) {
				let shift = $( e ).attr( "shift" );

				if ( shift ) {
					$( e ).attr( "shift", e.innerText );
					e.innerText = shift;
				} else {
					if ( e.innerText[0] == e.innerText[0].toLowerCase() ) {
						e.innerText = e.innerText.toUpperCase();
					} else {
						e.innerText = e.innerText.toLowerCase();
					}
				}
			} );
		}

		else {
			oskText.value = oskText.value + this.innerText;
		}
	} );

	this.xb = function() {
		oskText.value = oskText.value.substring( 0, oskText.value.length - 1 );
	}

	this.yb = function() {
		oskText.value = oskText.value + " ";
	}

	this.bb = function() {
		_this.$text.value = oskText.value;
		_this.close();
	}

	this.sb = function( e ) {
		this.bb();
		$( _this.$text ).closest( "form" ).submit();
		if ( e ) {
			return false;
		}
	}

	// Dpad Controls
	const dph = function( searchMax, searchStep, searchMove ) {
		// Left / Right
		let x = cursor.x;

		if ( cursor.isCentered && cursor.$centered[0] ) {
			x = searchMove < 0 ? cursor.$centered[0].getBoundingClientRect().left + searchMove : cursor.$centered[0].getBoundingClientRect().right + searchMove;
		}

		let key;

		for ( let i = x; ( searchMax > 0 ? i < x + searchMax : i > x + searchMax ) && i > 0; i += searchStep ) {
			key = keyAt( i, cursor.y );

			if ( key !== null ) {
				cursor.centerOverElement( key );
				break;
			}
		}
	}

	const dpv = function( searchMax, searchStep, searchMove ) {
		// Up / Down
		let y = cursor.y;

		if ( cursor.isCentered && cursor.$centered[0] ) {
			y = searchMove < 0 ? cursor.$centered[0].getBoundingClientRect().top + searchMove : cursor.$centered[0].getBoundingClientRect().bottom + searchMove;
		}

		let key;

		for ( let i = y; ( searchMax > 0 ? i < y + searchMax : i > y + searchMax ) && i > 0; i += searchStep ) {
			key = keyAt( cursor.x, i );

			if ( key !== null ) {
				cursor.centerOverElement( key );
				break;
			} 

			for ( let x = cursor.x; x < cursor.x - 500; x -= Math.abs( searchMove ) ) {
				key = keyAt( x, i );

				if ( key !== null ) {
					cursor.centerOverElement( key );
					break;
				}
			}

			if ( key !== null ) {
				break;
			} else {
				for ( let x = cursor.x; x < cursor.x + 500; x += Math.abs( searchMove ) ) {
					key = keyAt( x, i );

					if ( key !== null ) {
						cursor.centerOverElement( key );
						break;
					}
				}

				if ( key !== null ) {
					break;
				}
			}
		}
	}

	this.dpl = function() {
		dph( -200, -10, -10 );
	}

	this.dpr = function() {
		dph( 200, 10, 10 );
	}

	this.dpu = function() {
		dpv( -200, -10, -10 );
	}

	this.dpd = function() {
		dpv( 200, 10, 10 );
	}
	// Horiz Dpad
	window.addEventListener( "dpadleftreleased", this.dpl );
	window.addEventListener( "dpadrightreleased", this.dpr );

	// Vert Dpad
	window.addEventListener( "dpadupreleased", this.dpu );
	window.addEventListener( "dpaddownreleased", this.dpd );

	/*window.addEventListener( "selectbuttonreleased", () => oskText.value = "" );
	window.addEventListener( "startbuttonreleased", sb );
	window.addEventListener( "xbuttonreleased", xb );
	window.addEventListener( "ybuttonreleased", yb );
	window.addEventListener( "bbuttonreleased", bb );*/

	cursor.centerOverElement( $( "#center-key" ) );
}

Keyboard.prototype.close = function() {
	$( "#ccosk-container" ).remove();
	cursor.keyboard = null;
	chrome.runtime.sendMessage( { eventType: "closekeyboard" } );
	buttons.updateCurrentScheme();

	window.removeEventListener( "dpadleftreleased", this.dpl );
	window.removeEventListener( "dpadrightreleased", this.dpr );
	window.removeEventListener( "dpadupreleased", this.dpu );
	window.removeEventListener( "dpaddownreleased", this.dpd );
}

function keyAt( x, y ) {
	let potn = $( document.elementFromPoint( x, y ) );
	return potn.hasClass( "ccosk-key" ) ? potn : null;
}

window.addEventListener( "unload", () => chrome.runtime.sendMessage( { eventType: "closekeyboard" } ) );