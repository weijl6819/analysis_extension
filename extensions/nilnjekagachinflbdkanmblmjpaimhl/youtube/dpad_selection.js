
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
const selectables = [
	"ytd-thumbnail",
	"paper-button",
	"a.ytd-shelf-renderer",
	"paper-tab.ytd-c4-tabbed-header-renderer",
	"#top-level-buttons > ytd-toggle-button-renderer"
];

window.addEventListener( "dpadrightreleased", dpadHoriz );
window.addEventListener( "dpadleftreleased", dpadHoriz );
window.addEventListener( "dpadupreleased", dpadVert );
window.addEventListener( "dpaddownreleased", dpadVert );

$( function loader() {
	if ( !buttons.loaded ) {
		setTimeout( loader, 100 );
	}

	buttons.updateCurrentScheme();
} );

function isSelectable( elem ) {
	return !elem ? false : selectables.find( e => elem.is( e ) ) != null;
}

function getClickable( x, y ) {
	const elems = document.elementsFromPoint( x, y );
	for ( let $elem in elems ) {
		$elem = $( elems[$elem] );
		if ( isSelectable( $elem ) ) {
			return $elem;
		}
	}
}

function dpadHoriz( e ) {
	if ( actions.map.dpad !== "autoCursorSelect" ) {
		return;
	}

	if ( $( "#ccosk-container" )[0] ) {
		return;
	}

	if ( !cursor.isCentered ) {
		if ( selectElement( getClickable( cursor.x, cursor.y ) ) ) {
			return;
		}
	}

	const rect = cursor.$centered ? cursor.$centered[0].getBoundingClientRect() : {
		x: cursor.x,
		y: cursor.y,
		width: cursor.radius,
		height: cursor.radius
	};

	if ( e.type == "dpadrightreleased" ) {
		selectElement( getClickableToSide( rect, "right" ) );
	} else {
		selectElement( getClickableToSide( rect, "left" ) );
	}
}

function dpadVert( e ) {
	if ( actions.map.dpad !== "autoCursorSelect" ) {
		return;
	}

	if ( $( "#ccosk-container" )[0] ) {
		return;
	}
		
	if ( !cursor.isCentered ) {
		if ( selectElement( getClickable( cursor.x, cursor.y ) ) ) {
			return;
		}
	}

	const rect = cursor.$centered ? cursor.$centered[0].getBoundingClientRect() : {
		x: cursor.x,
		y: cursor.y,
		width: cursor.radius,
		height: cursor.radius
	};

	if ( e.type == "dpadupreleased" ) {
		selectElement( getClickableToSide( rect, "top" ) );
	} else {
		selectElement( getClickableToSide( rect, "bottom" ) );
	}
}

function selectElement( e ) {
	if ( e ) {
		cursor.centerOverElement( e );
		return true;
	}

	return false;
}

function getClickableToSide( rect, side ) {
	if ( side !== "left" && side !== "right" && side !== "top" && side !== "bottom" ) {
		console.error( "Side must be left, right, top, or bottom." );
		return;
	}

	const mod = { x: 60, y: 10 };
	const center = { x: rect.x + ( rect.width / 2 ), y: rect.y + ( rect.height / 2 ) };

	const scanX = function( y ) {
		if ( side === "left" ) {
			for ( let x = center.x - ( rect.width * 0.6 ); x >= 0; x -= mod.x ) {
				let potn = getClickable( x, y );

				if ( potn ) {
					return potn;
				}
			}
		} else if ( side === "right" ) {
			for ( let x = center.x + ( rect.width * 0.6 ); x <= window.innerWidth; x += mod.x ) {
				let potn = getClickable( x, y );

				if ( potn ) {
					return potn;
				}
			}
		}

		return null;
	}

	const scanY = function( x ) {
		if ( side === "top" ) {
			for ( let y = center.y - ( rect.height * 0.6 ); y >= 0; y -= mod.y ) {
				let potn = getClickable( x, y );

				if ( potn ) {
					return potn;
				}
			}
		} else if ( side === "bottom" ) {
			for ( let y = center.y + ( rect.height * 0.6 ); y <= window.innerHeight; y += mod.y ) {
				let potn = getClickable( x, y );

				if ( potn ) {
					return potn;
				}
			}
		}
	}

	if ( side === "right" || side === "left" ) {
		for ( let y = center.y; y >= 0; y -= mod.y ) {
			let potn = scanX( y );

			if ( potn ) {
				return potn;
			}
		}

		for ( let y = center.y + ( rect.height * 0.6 ); y <= window.innerHeight; y += mod.y ) {
			let potn = scanX( y );

			if ( potn ) {
				return potn;
			}
		}
	} else {
		for ( let x = center.x - 50; x >= 0; x -= mod.x ) {
			let potn = scanY( x );

			if ( potn ) {
				return potn;
			}
		}

		for ( let x = center.x + 50; x <= window.innerWidth; x += mod.x ) {
			let potn = scanY( x );

			if ( potn ) {
				return potn;
			}
		}
	}

	if ( side === "right" || side === "left" ) {
		return null;
	}

	return null;
}