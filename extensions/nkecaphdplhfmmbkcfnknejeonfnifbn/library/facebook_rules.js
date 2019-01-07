
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
let rules_facebook = {
    userInfo: {
        user_id: {
            item: "user_id",
            strategy: "simple_regex",
            regex: [
                'USER_ID":"(.+?)(?=")',
                'ACCOUNT_ID":"(.+?)(?=")'
            ],
            replace: [],
            comments: "Its works for facebook main page"
        },
        user_name: {
            item: "user_name",
            strategy: "simple_regex",
            regex: [
                'NAME":"(.+?)(?=")',
                'profileName:"(.+?)(?=")'
            ],
            replace: [],
            comments: "Its works for facebook main page"
        },
        fb_dtsg: {
            item: "fb_dtsg",
            strategy: "simple_regex",
            regex: [
                'fb_dtsg"\\svalue="(.+?)(?=")',
            ],
            replace: [],
            comments: "Its works for facebook main page"
        },
        composer_id: {
            item: "composer_id",
            strategy: "simple_regex",
            regex: [
                'composerID":"(.+?)(?=")',
                'composerID:"(.+?)(?=")',
                'xhpc_composerid"\\svalue="(.+?)(?=")'
            ],
            replace: [],
            comments: "Its works for facebook main page"
        },
        user_email: {
            item: "user_email",
            strategy: "simple_regex",
            regex: [
                'Primary: <strong>(.+?)(?=<)'
            ],
            replace: [
                {
                    find: "&#064;",
                    replace: "@"
                }
            ]
        }
    },
    posts: {
        likes: {
            item: "postLikes",
            strategy: "simple_regex",
            regex: [
                'UFI2ReactionsCount\/root[^>]*>(.+?)(?=<\/span>)',
                'UFI2ReactionsCount\\/root[^>]*>(.+?)(?=<\\/span>)'
            ],
            replace: []
        },
        comments: {
            item: "postComments",
            strategy: "simple_regex",
            regex: [
                'comment_tracking[^>]*>(.+?)(?=<\/a>)',
                'comment_tracking[^>]*>(.+?)(?=<\\/a>)'
            ],
            replace: []
        },
        shares: {
            item: "postShares",
            strategy: "simple_regex",
            regex: [
                'shares\/view[^>]*>(.+?)(?=<\/a>)',
                'shares\\/view[^>]*>(.+?)(?=<\\/a>)'
            ],
            replace: []
        },
        postOwnerImage:{           
            item: "postOwnderImage",
            strategy: "simple_regex",
            regex: [
                '_5xib((?!src).)*src="(.+?)(?=")',             
            ],
            replace: []
        }
    }
};