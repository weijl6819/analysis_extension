define(function(){var f={text:"textContent",data:function(c,a){for(var b in a)c.dataset[b]=a[b]},class:function(c,a){Array.isArray(a)||(a=[a]);for(var b=0,e=a.length;b<e;b++)c.classList.add(a[b])},attr:function(c,a){for(var b in a)c.setAttribute(b,a[b])},style:function(c,a){for(var b in a){var e=a[b];"float"===b&&(b="cssFloat");c.style[b]=e}},append:function(c,a){Array.isArray(a)||(a=[a]);for(var b=0,e=a.length;b<e;b++){var d=a[b];if("string"!==typeof d||d)"object"!==typeof d&&(d=document.createTextNode(d)),
c.appendChild(d)}},on:function(c,a){"object"!==typeof a[0]&&(a=[a]);for(var b=0,e=a.length;b<e;b++){var d=a[b];Array.isArray(d)&&c.addEventListener(d[0],d[1],d[2])}}};return{closestNode:function(c,a){if(c===a||!c.contains(a))return null;for(var b;b=a.parentNode;)if(b!==c)a=b;else return a},closest:function(c,a){if(a.matches(c))return a;if(!a.matches(c+" "+a.tagName))return null;for(;a=a.parentNode;)if(a.matches(c))return a},el:function(c,a){c="object"!==typeof c?document.createElement(c):c;var b;
for(b in a){var e=a[b];var d=f[b];"function"===typeof d?d(c,e):void 0!==d?c[d]=e:c[b]=e}return c}}});
