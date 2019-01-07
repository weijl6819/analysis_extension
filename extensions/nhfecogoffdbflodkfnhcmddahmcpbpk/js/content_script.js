/**
 * Created by Ali H. on 9/30/2016.
 */
var anchor_links_length = $("a").wrap("href").length;
var links_arr = [];
for (var i = 0; i < anchor_links_length; i++) {
    var link = $($("a").wrap("href")[i]).attr("href");
    //$($("a").wrap("href")[i]).addClass("anchor_link_style");
    if (link != '#' && link != undefined && link != "") {
        if (link.indexOf("http") >= 0) {
            if (url("domain", window.location.href) != url("domain", link)) {
                if (url("domain", link)) {
                    if (link.includes(url("domain", link))) {
                        links_arr.push(url("domain", link));
                    }
                }
            }
        }
    }
}


var pageInfo = {
    'title': document.title,
    'url': window.location.href,
    'summary': document.body.innerText,
    'links_array': links_arr
};


chrome.extension.sendMessage({key: "domainsData", pageInfo: pageInfo});

