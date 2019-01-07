
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
$( () => {
	for ( let event in actions.eventToControlMap ) {
		window.addEventListener( event, e => {
			let control = actions.eventToControlMap[event];
			let action = actions[actions.map[control]];
			let kb_action = actions[actions.map["kb_" + control]];

			// If is a keyboard supported event
			if ( kb_action ) {
				// And if keyboard is open
				if ( cursor && cursor.keyboard ) {
					// Change the action to the keyboard's.
					action = kb_action === "none" ? null : kb_action;
				}
			}

			if ( action ) {
				action.run( e );
			}
		} );
	}
} );
