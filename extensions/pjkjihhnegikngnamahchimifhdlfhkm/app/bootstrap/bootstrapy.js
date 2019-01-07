(function (){
  var m = /([^\/]*)\.htm/.exec(location.pathname);
  var js = m[1] + '.js';
  var v = '9.0.13.1912';
  var j=document.createElement('script');j.async=true;j.src = js + '?v=' + v;
  document.head.appendChild(j);
})();