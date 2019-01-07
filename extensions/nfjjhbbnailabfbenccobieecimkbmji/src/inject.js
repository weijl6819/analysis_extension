
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
var user,pass,bid,offset1,offset2;
var bidButton = document.getElementById( "bidBtn_btn" ); if( bidButton != null) { 
chrome.storage.local.get(null,function(result)
{
if(result.user == undefined){user = '';}else{user = result.user;}
if(result.pass == undefined){pass = '';}else{pass = result.pass;}
if(result.bid == undefined){bid = '';}else{bid = result.bid;}
if(result.offset1 == undefined){offset1 = '';}else{offset1 = result.offset1;}
if(result.offset2 == undefined){offset2 = '';}else{offset2 = result.offset2;}
var id = location.pathname.match(/\/(\d{10,15})/);
	var href= 'https://www.gixen.com/autosnipe.php?username='+user+'&password='+pass+'&itemid='+id[1]+'&maxbid='+bid+'&bidoffset='+offset1+'&bidoffsetmirror='+offset2;
	var snipeButton = document.createElement('a');
snipeButton.setAttribute('class', bidButton.className );
snipeButton.setAttribute('href', "javascript:void(win=window.open('"+href+"','Gixen','width=800,height=380,left='+((screen.width/2)-(500/2))+',top='+((screen.height-500)/3)+',resizable=1,scrollbars=1,menubar=0,toolbar=0,status=0,directories=0,copyhistory=0'))");
snipeButton.setAttribute('style', 'margin-top: 5px;' );
snipeButton.innerHTML = ' Add to Gixen <img src="data:image/gif,GIF89a%10%00%10%00w%00%00!%F9%04%01%00%00%00%00%2C%00%00%00%00%10%00%10%00%87%01%00%00%00%00%00%D8L%10)0%18%00xA%13%F4%F63%26%26%0B%23%1E%05%20%1C%00%23%20%002%2F%00)%25%00%17%13%9D%08%08%C4%04%08%18%00%00%C8I%13%22%12%0D%164%1E%1BHB)%15%10s%09%05%A3%04%05%9B%05%06%5D%0E%0D%1F%1E%1D%1C*(%3C%0E%0D%CC%02%08%A8%08%08O!%10%2B%22%15%1D%25%186%0A%03%B8%05%03%FF%00%03%FF%00%00%FF%00%01%CD%02%05%5CON%B9%05%06%CB%02%08%20%13%113%17%0E%25%1A%122%17%11%AC%0D%0B%F5%00%00%B8%01%12%AA%00%19%E3%00%00%DC%00%02%D3%03%03%B1%06%07%AA%07%07%00%FF%FFZ%23%14%2F*%1C%26%17%10k%1F%15%F7%00%02%E9%00%02I%00S%00%01%92%00%02%92%1A%00t%9F%00%1D%BA%04%06%F1%01%01%E6%02%02%00%0F%16%2B%14%10\'%15%10%3C%24%17%AE%13%0EV%00H%00%00%A3%04%00%9B%00%00%A0%00%00%A2%00%01%8F%A7%00%1D%FD%00%00%9D%09%0B%DA%03%03%AD%07%07%23%13%0D%25%12%0FU)%1C%E5%07%03%CD%00%0F%03%00%8D%00%00%9C%09%05%831*b%09%03%83%00%00%A4%10%00%7C%E3%00%05%D2%04%05%FB%00%00%D9%02%02I.%1E1%1E%14q*%1D%FD%01%00%7F%016%00%00%A5%18%11z%BE%9E%0E%F4%D1%00%BE%9F%0F%1E%17o%00%00%A7v%017%9A%06%0F%91%07%09aE%2C%3F%25%1A%84)%1DK%02X%00%00%A6%88q*%FF%DE%00%FD%C8%03%FF%DF%00%BA%9A%0D%03%02%97%1B%01%7C%E9%00%01%AE%07%08%B8%06%06tO8K)%1C%8F\'%1D%F6%00%00%2C%00n%00%02%91%CF%A9%07%FB%CD%00%B5%A2%00%D4%B0%03%FF%D8%00J9U%B8%02%16%EF%01%00~N8R-%20%94\'%1B%F0%00%00%1D%00t%0B%10%83%F0%BD%00%CA%B1%00y%B0%00%86%A1%01%F3%CA%00%9C%80%25%83%017%ED%02%00%89%10%12%81O6T-%20%91%2B%1E%F4%00%00\'%00p%0A%11%85%F0%BF%00%BA%AE%00%92%CA%00%8B%BD%00%D2%B7%00%CE%A6%0C%00%00%99%5B%00S%EC%02%00O%0D%1A%7FJ3Q%2C%20%860%22F%00_%DB%B0%05%CD%B1%00%89%C0%00%8C%C3%00%CA%B3%00%E2%B3%05%00%03%92%3F%00a%F1%01%00%83%06%18v8%25J\'%1C%7C7\'%EB%03%00t%00%3F%A0%82%20%F8%CF%00%8F%9E%01%83%A3%00%EA%C5%00%D4%AB%07%00%01%96%3A%00e%88%00%0DX\'%1A%3A%1B%12s%3C*%D3%0E%04%B6%00%19D6Y%FB%D4%00%EB%BC%02%DC%B4%01%FF%D7%00%A5%87%1CO%00W%84%01%0E%22%0A%08_MKk9(%AF%1C%12%ED%00%00%14%01%7D%B8%98%0D%F7%C7%02%FD%D3%00%5BGI%00%00%ACr%01%3E%F0%05%00T%1F%2C%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%08%E8%00%01%08%1CH%B0%A0A%0A%15%2C%5C%C0%60%90%60%08%11%23H%90(a%A2!%80%16.J%BC%80%11C%06%89%19%06u%EC%E0%D1%C3%C7%0F%20A%84%90%18R0%89%12%12K%984q%F2%04J%14)S%06%5E%C1%92E%CB%16.%5D%BC%7C%01%13F%CC%98%81g%D0%A4Q%B3%86M%1B7o%E0%C4%91Cf%A0%9D%3BR%F0%E4%D1%B3%87O%1F%3F%7F%00%05%12%24%B0%90%A1C%88%12)Z%C4%A8%91%A3GL%20E%128%89R%25K%970e%D2%B4%89S%A78%9E%3E%09%145%8AT)S%A7P%A5R%B5%8AU%2BW%AF%04%CA%9A%F5%82%16%90Z%B6n%E1%CA%A5k%17%AF%5E%02%81%05%136%0C%0C%B1b%C6%8E!K%A6lY%25%81%CE%9EA%8B%E6D%DA4j%D5%AC%5Dc%82%ED%C5%40n%DD%BC%7Dk%05%CEZ8q%E3%C8%953%07%20%20%00%3B" style="padding: 0px 0px 1px 5px; margin: 1px; vertical-align:middle; width: 16px; height: 16px;" border="0">';
bidButton.insertAdjacentElement( 'afterend', snipeButton );
})
bidButton.insertAdjacentHTML( 'afterend', '<br>' ); }