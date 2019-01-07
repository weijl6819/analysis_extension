
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

// todo need to not be able to write group posts until we know the group has been posted
function decodeItem(html, rule, insertVariable) {
    let returnValue = null;
    let regex;
    const strategy = rule.strategy;
    switch (strategy) {

        case "simple_regex":
            for (let rawRegex of rule.regex) {
                if (insertVariable) {
                    rawRegex = rawRegex.replace('$$var$$', insertVariable);
                }
                regex = new RegExp(rawRegex, "g");
                if (returnValue == null) {
                    returnValue = getValueByRegex(html, regex);
                }
            }
            if (returnValue != null) {
                if (rule.replace) {
                    for (let replaceRule of rule.replace) {
                        returnValue = returnValue.replace(replaceRule.find, replaceRule.replace);
                    }
                }
                if (rule.regex_replace) {
                    for (let replaceRule of rule.regex_replace) {
                        regex = new RegExp(replaceRule.find, "g");
                        returnValue = returnValue.replace(regex, replaceRule.replace);
                    }
                }
            } else {
                if (typeof rule.fallback === 'string' || typeof rule.fallback === 'number') {
                    returnValue = rule.fallback;
                }
            }
            break;
        case "list_regex":
            regex = new RegExp(rule.list_regex, "g");
            returnValue = getListByRegex(html, regex);
            break;
        case "first_match":
            const cases = rule.cases;
            for (let ruleCase of cases) {
                regex = new RegExp(ruleCase.regex);
                if (returnValue == null) {
                    if (getValueByRegex(html, regex) != null) {
                        returnValue = ruleCase.value;
                    }
                }
            }
            if (returnValue == null) {
                if (typeof rule.fallback === 'string' || typeof rule.fallback === 'number') {
                    returnValue = rule.fallback;
                }
            }
            break;
        default:
    }
    return returnValue;
}

function getValueByRegex(pageSource, regex) {
    try {
        let matches = regex.exec(pageSource);
        return matches[matches.length - 1];
    } catch (e) {
        return null;
    }
}

function getListByRegex(pageSource, regex) {
    try {
        return pageSource.match(regex);
    } catch (e) {
        return null;
    }
}


function getBetween(pageSource, firstData, secondData) {
    try {
        var resSplit = pageSource.split(firstData);
        var indexSec = resSplit[1].indexOf(secondData);
        var finalData = resSplit[1].substring(0, indexSec);
        return finalData;
    } catch (e) {
        return "";
    }
}
