
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

    var oldSrcTransformer = parser.srcTransformer;

    parser.parseFigures = function () {
        if (window.location.pathname.indexOf('/collections') === 0) {
            return collectionParser();
        } else {
            return commonParser();
        }
    };

    function collectionParser() {
        parser.srcTransformer = function (src) {
            var imageID = src.replace(/^.*\/(\d+)\/thumb\.png$/, '$1');
            return 'https://ndownloader.figshare.com/files/' + imageID + '/preview/' + imageID + '/preview.jpg';
        };

        return new Promise(function (resolve, reject) {
            var interval,
                maxIterations = 20,
                iterations = 0;
            interval = setInterval(function () {
                var elements = Sizzle('.listing-wrap .portal-item-thumb-wrap');
                if (elements.length) {
                    var figures = [],
                        pageDOI = document.querySelector('meta[name="DC.identifier"]').content.replace(/doi:/, '');

                    elements.forEach(function (block) {
                        figures.push({
                            ArticleURL: window.location.href,
                            URL: parser.srcTransformer(Sizzle('img', block)[0].src),
                            Caption: Sizzle('.item-title', block)[0].innerText,
                            Authors: getAuthors(block),
                            DOI: pageDOI
                        });
                    });
                    clearInterval(interval);
                    resolve(figures);
                } else if (iterations >= maxIterations) {
                    clearInterval(interval);
                    reject('Maximum iteration counter exceeded. Website is too slow!');
                }
                iterations++;
            }, 200);
        });

        function getAuthors (block) {
            return Sizzle('.authors-trigger', block).map(function (authorBlock) {
                return authorBlock.innerHTML;
            }).join('; ');
        }
    }

    function commonParser() {
        parser.srcTransformer = oldSrcTransformer;
        return new Promise(function (resolve, reject) {
            var interval,
                maxIterations = 50,
                iterations = 0;
            interval = setInterval(function () {
                var image = document.querySelector('div.fs-display.fs-image-display img');
                if (image) {
                    var figures = [];
                    var figure = {
                        ArticleURL: window.location.href,
                        Authors: parser.getAuthors()
                    };
                    var doi, caption, legend;

                    doi = document.querySelector('meta[name="DC.identifier"]');
                    caption = document.querySelector('div.item-wrap div.item-left h2.title');
                    legend = document.querySelector('div.item-wrap div.item-left > div.description.section');

                    if (doi && doi.content) {
                        figure.DOIFigure = doi.content.replace(/doi:/, '');
                    }
                    if (caption) {
                        figure.Caption = caption.innerText;
                    }
                    if (legend) {
                        figure.Legend = legend.innerText;
                    }

                    figure.URL = image.getAttribute('src');
                    figures.push(figure);

                    clearInterval(interval);
                    resolve(figures);
                } else if (iterations >= maxIterations) {
                    clearInterval(interval);
                    reject('Maximum iteration counter exceeded. Website is too slow!');
                }
                iterations++;
            }, 200);
        });
    }

})(window.parser);
