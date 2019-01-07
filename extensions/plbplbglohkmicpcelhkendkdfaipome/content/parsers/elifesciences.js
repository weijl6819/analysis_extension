
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
    parser.CONTENT_BLOCK_SELECTOR = '.article-section__body';

    parser.parseFigures = function () {
        var pageDOI = parser.getPageDOI(),
            Authors = parser.getAuthors(),
            figures = [];

        var set = Sizzle(parser.CONTENT_BLOCK_SELECTOR + ' .asset-viewer-inline--figure');

        if (!set.length) {
            set = Sizzle(parser.CONTENT_BLOCK_SELECTOR + ' .asset-viewer-inline');
        }

        set.forEach(eachFigure);

        return Promise.resolve(figures);

        /////////////////////////////

        function eachFigure(figure) {
            var figureLink = Sizzle('figure a img', figure);
            if (figureLink.length !== 1) {
                window.logError('Figure has ', figureLink.length, 'images');
            } else {
                var Legend = Sizzle('.caption-text__body p', figure);
                if (Legend.length) {
                    Legend = Legend[0].innerText.replace('see more', '');
                } else {
                    Legend = '';
                }
                figures.push({
                    ArticleURL: window.location.href,
                    URL: figureLink[0].src,
                    Caption: getFigureCaption(figure),
                    Legend: Legend,
                    Authors: Authors,
                    DOI: pageDOI,
                    DOIFigure: getFigureDOI(figure)
                });
            }
        }

        function getFigureDOI(container) {
            var selector = Sizzle('.doi--asset a', container);
            return selector.length ? selector[0].innerText.replace('http://doi.org/', '') : '';
        }

        function getFigureCaption(container) {
            var selector = Sizzle('h6', container);
            return parser.prepareContent(selector[0]);
        }
    };

})(window.parser);
