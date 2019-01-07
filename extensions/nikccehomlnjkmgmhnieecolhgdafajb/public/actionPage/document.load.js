function loadScript(url){
    var jsElm = document.createElement("script");
    jsElm.type = "application/javascript";
    jsElm.src = url;
    document.body.appendChild(jsElm);
    return jsElm;
}

function loadCSS(url){
    var fileref = document.createElement("link");
    fileref.rel = "stylesheet";
    fileref.type = "text/css";
    fileref.href = url;
    document.body.appendChild(fileref);
}


window.onload = function(){
    loadScript('react.min.js').onload = function(){
        loadScript('ReactRouter.min.js');
        window.react = window.React;
        loadScript('semantic-ui-react.min.js').onload = function(){
            if (window.main)
                window.main();
        };
    }
    loadScript('react-dom.min.js')

}
