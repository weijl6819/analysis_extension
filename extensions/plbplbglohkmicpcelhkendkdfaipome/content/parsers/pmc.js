
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
(function (parser) {
    parser.CONTENT_BLOCK_SELECTOR = '.jig-ncbiinpagenav';

    parser.parseFigures = function () {
        var figures = [];
        //noinspection UnnecessaryLocalVariableJS
        var Authors = parser.getAuthors();
        var pageDOI = parser.getPageDOI();
        var src, descriptionBlock, caption, legend, figureBlock, figure;

        for (var i = 0; i < document.images.length; i++) {
            src = document.images[i].src;
            //src = document.images[i].getAttribute("src-large");
            if (src && src.match(/articles\//) /* && document.images[i].hasAttribute('src-large')*/) {
                figure = {
                    ArticleURL: window.location.href,
                    URL: src
                };
                figureBlock  = document.images[i].parentNode.parentNode.parentNode;
                if (!figureBlock.classList.contains('fig')) {
                    figureBlock = document.images[i].parentNode.parentNode;
                }
                descriptionBlock = figureBlock.querySelector('div.icnblk_cntnt');
                if (descriptionBlock) {
                    caption = descriptionBlock.querySelector('* > div:nth-child(1) > a');
                    caption = caption ? caption.innerText : null;
                    legend = descriptionBlock.querySelector('* > div:nth-child(2) > span');
                    if (!legend) {
                        // 18.04.2018 markup update
                        legend = descriptionBlock.querySelector('* > div.caption > p');
                    }
                    legend = legend ? legend.innerText : null;
                    if (caption) {
                        figure.Caption = caption;
                    }
                    if (legend) {
                        figure.Legend = legend;
                    }
                }
                figure.Authors = Authors;
                figure.DOI = pageDOI;
                figures.push(figure);
            }
        }

        return Promise.resolve(figures);
    };

})(window.parser);
