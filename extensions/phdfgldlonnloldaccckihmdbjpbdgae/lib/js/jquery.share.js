!function(t){"use strict";function r(r,e,n,i){var o=t(n,e);o.addData(r),o.make(),i=i||0;var a=o.getModuleCount(),u=o.getModuleCount()+2*i;this.text=r,this.level=e,this.version=n,this.moduleCount=u,this.isDark=function(t,r){return t-=i,r-=i,!(0>t||t>=a||0>r||r>=a)&&o.isDark(t,r)},this.addBlank=function(t,r,e,n){var i=this.isDark,o=1/u;this.isDark=function(a,u){var c=u*o,f=a*o,s=c+o,l=f+o;return i(a,u)&&(t>s||c>e||r>l||f>n)}}}function e(t,e,n,i,o){n=Math.max(1,n||1),i=Math.min(40,i||40);for(var a=n;i>=a;a+=1)try{return new r(t,e,a,o)}catch(t){}}function n(t,r,e){var n=e.size,i="bold "+e.mSize*n+"px "+e.fontname,o=p("<canvas/>")[0].getContext("2d");o.font=i;var a=o.measureText(e.label).width,u=e.mSize,c=a/n,f=(1-c)*e.mPosX,s=(1-u)*e.mPosY,l=f+c,h=s+u,g=.01;1===e.mode?t.addBlank(0,s-g,n,h+g):t.addBlank(f-g,s-g,l+g,h+g),r.fillStyle=e.fontcolor,r.font=i,r.fillText(e.label,f*n,s*n+.75*e.mSize*n)}function i(t,r,e){var n=e.size,i=e.image.naturalWidth||1,o=e.image.naturalHeight||1,a=e.mSize,u=a*i/o,c=(1-u)*e.mPosX,f=(1-a)*e.mPosY,s=c+u,l=f+a,h=.01;3===e.mode?t.addBlank(0,f-h,n,l+h):t.addBlank(c-h,f-h,s+h,l+h),r.drawImage(e.image,c*n,f*n,u*n,a*n)}function o(t,r,e){p(e.background).is("img")?r.drawImage(e.background,0,0,e.size,e.size):e.background&&(r.fillStyle=e.background,r.fillRect(e.left,e.top,e.size,e.size));var o=e.mode;1===o||2===o?n(t,r,e):(3===o||4===o)&&i(t,r,e)}function a(t,r,e,n,i,o,a,u){t.isDark(a,u)&&r.rect(n,i,o,o)}function u(t,r,e,n,i,o,a,u,c,f){a?t.moveTo(r+o,e):t.moveTo(r,e),u?(t.lineTo(n-o,e),t.arcTo(n,e,n,i,o)):t.lineTo(n,e),c?(t.lineTo(n,i-o),t.arcTo(n,i,r,i,o)):t.lineTo(n,i),f?(t.lineTo(r+o,i),t.arcTo(r,i,r,e,o)):t.lineTo(r,i),a?(t.lineTo(r,e+o),t.arcTo(r,e,n,e,o)):t.lineTo(r,e)}function c(t,r,e,n,i,o,a,u,c,f){a&&(t.moveTo(r+o,e),t.lineTo(r,e),t.lineTo(r,e+o),t.arcTo(r,e,r+o,e,o)),u&&(t.moveTo(n-o,e),t.lineTo(n,e),t.lineTo(n,e+o),t.arcTo(n,e,n-o,e,o)),c&&(t.moveTo(n-o,i),t.lineTo(n,i),t.lineTo(n,i-o),t.arcTo(n,i,n-o,i,o)),f&&(t.moveTo(r+o,i),t.lineTo(r,i),t.lineTo(r,i-o),t.arcTo(r,i,r+o,i,o))}function f(t,r,e,n,i,o,a,f){var s=t.isDark,l=n+o,h=i+o,g=e.radius*o,d=a-1,v=a+1,p=f-1,w=f+1,m=s(a,f),T=s(d,p),y=s(d,f),E=s(d,w),b=s(a,w),A=s(v,w),k=s(v,f),B=s(v,p),S=s(a,p);m?u(r,n,i,l,h,g,!y&&!S,!y&&!b,!k&&!b,!k&&!S):c(r,n,i,l,h,g,y&&S&&T,y&&b&&E,k&&b&&A,k&&S&&B)}function s(t,r,e){var n,i,o=t.moduleCount,u=e.size/o,c=a;for(m&&e.radius>0&&e.radius<=.5&&(c=f),r.beginPath(),n=0;o>n;n+=1)for(i=0;o>i;i+=1)c(t,r,e,e.left+i*u,e.top+n*u,u,n,i);if(p(e.fill).is("img")){r.strokeStyle="rgba(0,0,0,0.5)",r.lineWidth=2,r.stroke();var s=r.globalCompositeOperation;r.globalCompositeOperation="destination-out",r.fill(),r.globalCompositeOperation=s,r.clip(),r.drawImage(e.fill,0,0,e.size,e.size),r.restore()}else r.fillStyle=e.fill,r.fill()}function l(t,r){var n=e(r.text,r.ecLevel,r.minVersion,r.maxVersion,r.quiet);if(!n)return null;var i=p(t).data("qrcode",n),a=i[0].getContext("2d");return o(n,a,r),s(n,a,r),i}function h(t){return l(p("<canvas/>").attr("width",t.size).attr("height",t.size),t)}function g(t){return p("<img/>").attr("src",h(t)[0].toDataURL("image/png"))}function d(t){var r=e(t.text,t.ecLevel,t.minVersion,t.maxVersion,t.quiet);if(!r)return null;var n,i,o=t.size,a=t.background,u=Math.floor,c=r.moduleCount,f=u(o/c),s=u(.5*(o-f*c)),l={position:"relative",left:0,top:0,padding:0,margin:0,width:o,height:o},h={position:"absolute",padding:0,margin:0,width:f,height:f,"background-color":t.fill},g=p("<div/>").data("qrcode",r).css(l);for(a&&g.css("background-color",a),n=0;c>n;n+=1)for(i=0;c>i;i+=1)r.isDark(n,i)&&p("<div/>").css(h).css({left:s+i*f,top:s+n*f}).appendTo(g);return g}function v(t){return w&&"canvas"===t.render?h(t):w&&"image"===t.render?g(t):d(t)}var p=jQuery,w=function(){var t=document.createElement("canvas");return Boolean(t.getContext&&t.getContext("2d"))}(),m="[object Opera]"!==Object.prototype.toString.call(window.opera),T={render:"canvas",minVersion:1,maxVersion:40,ecLevel:"L",left:0,top:0,size:200,fill:"#000",background:null,text:"no text",radius:0,quiet:0,mode:0,mSize:.1,mPosX:.5,mPosY:.5,label:"no label",fontname:"sans",fontcolor:"#000",image:null};p.fn.qrcode=function(t){var r=p.extend({},T,t);return this.each(function(){"canvas"===this.nodeName.toLowerCase()?l(this,r):p(this).append(v(r))})}}(function(){var t=function(){function t(r,e){if(void 0===r.length)throw new Error(r.length+"/"+e);var n=function(){for(var t=0;t<r.length&&0==r[t];)t+=1;for(var n=new Array(r.length-t+e),i=0;i<r.length-t;i+=1)n[i]=r[i+t];return n}(),i={};return i.getAt=function(t){return n[t]},i.getLength=function(){return n.length},i.multiply=function(r){for(var e=new Array(i.getLength()+r.getLength()-1),n=0;n<i.getLength();n+=1)for(var o=0;o<r.getLength();o+=1)e[n+o]^=a.gexp(a.glog(i.getAt(n))+a.glog(r.getAt(o)));return t(e,0)},i.mod=function(r){if(i.getLength()-r.getLength()<0)return i;for(var e=a.glog(i.getAt(0))-a.glog(r.getAt(0)),n=new Array(i.getLength()),o=0;o<i.getLength();o+=1)n[o]=i.getAt(o);for(o=0;o<r.getLength();o+=1)n[o]^=a.gexp(a.glog(r.getAt(o))+e);return t(n,0).mod(r)},i}var r=function(r,e){var i=r,a=n[e],s=null,l=0,h=null,g=new Array,v={},p=function(t,r){s=function(t){for(var r=new Array(t),e=0;t>e;e+=1){r[e]=new Array(t);for(var n=0;t>n;n+=1)r[e][n]=null}return r}(l=4*i+17),w(0,0),w(l-7,0),w(0,l-7),y(),T(),b(t,r),i>=7&&E(t),null==h&&(h=B(i,a,g)),A(h,r)},w=function(t,r){for(var e=-1;7>=e;e+=1)if(!(-1>=t+e||t+e>=l))for(var n=-1;7>=n;n+=1)-1>=r+n||r+n>=l||(s[t+e][r+n]=e>=0&&6>=e&&(0==n||6==n)||n>=0&&6>=n&&(0==e||6==e)||e>=2&&4>=e&&n>=2&&4>=n)},m=function(){for(var t=0,r=0,e=0;8>e;e+=1){p(!0,e);var n=o.getLostPoint(v);(0==e||t>n)&&(t=n,r=e)}return r},T=function(){for(var t=8;l-8>t;t+=1)null==s[t][6]&&(s[t][6]=t%2==0);for(var r=8;l-8>r;r+=1)null==s[6][r]&&(s[6][r]=r%2==0)},y=function(){for(var t=o.getPatternPosition(i),r=0;r<t.length;r+=1)for(var e=0;e<t.length;e+=1){var n=t[r],a=t[e];if(null==s[n][a])for(var u=-2;2>=u;u+=1)for(var c=-2;2>=c;c+=1)s[n+u][a+c]=-2==u||2==u||-2==c||2==c||0==u&&0==c}},E=function(t){for(var r=o.getBCHTypeNumber(i),e=0;18>e;e+=1){n=!t&&1==(r>>e&1);s[Math.floor(e/3)][e%3+l-8-3]=n}for(e=0;18>e;e+=1){var n=!t&&1==(r>>e&1);s[e%3+l-8-3][Math.floor(e/3)]=n}},b=function(t,r){for(var e=a<<3|r,n=o.getBCHTypeInfo(e),i=0;15>i;i+=1){u=!t&&1==(n>>i&1);6>i?s[i][8]=u:8>i?s[i+1][8]=u:s[l-15+i][8]=u}for(i=0;15>i;i+=1){var u=!t&&1==(n>>i&1);8>i?s[8][l-i-1]=u:9>i?s[8][15-i-1+1]=u:s[8][15-i-1]=u}s[l-8][8]=!t},A=function(t,r){for(var e=-1,n=l-1,i=7,a=0,u=o.getMaskFunction(r),c=l-1;c>0;c-=2)for(6==c&&(c-=1);;){for(var f=0;2>f;f+=1)if(null==s[n][c-f]){var h=!1;a<t.length&&(h=1==(t[a]>>>i&1)),u(n,c-f)&&(h=!h),s[n][c-f]=h,-1==(i-=1)&&(a+=1,i=7)}if(0>(n+=e)||n>=l){n-=e,e=-e;break}}},k=function(r,e){for(var n=0,i=0,a=0,u=new Array(e.length),c=new Array(e.length),f=0;f<e.length;f+=1){var s=e[f].dataCount,l=e[f].totalCount-s;i=Math.max(i,s),a=Math.max(a,l),u[f]=new Array(s);for(p=0;p<u[f].length;p+=1)u[f][p]=255&r.getBuffer()[p+n];n+=s;var h=o.getErrorCorrectPolynomial(l),g=t(u[f],h.getLength()-1).mod(h);c[f]=new Array(h.getLength()-1);for(p=0;p<c[f].length;p+=1){var d=p+g.getLength()-c[f].length;c[f][p]=d>=0?g.getAt(d):0}}for(var v=0,p=0;p<e.length;p+=1)v+=e[p].totalCount;for(var w=new Array(v),m=0,p=0;i>p;p+=1)for(f=0;f<e.length;f+=1)p<u[f].length&&(w[m]=u[f][p],m+=1);for(p=0;a>p;p+=1)for(f=0;f<e.length;f+=1)p<c[f].length&&(w[m]=c[f][p],m+=1);return w},B=function(t,r,e){for(var n=u.getRSBlocks(t,r),i=c(),a=0;a<e.length;a+=1){var f=e[a];i.put(f.getMode(),4),i.put(f.getLength(),o.getLengthInBits(f.getMode(),t)),f.write(i)}for(var s=0,a=0;a<n.length;a+=1)s+=n[a].dataCount;if(i.getLengthInBits()>8*s)throw new Error("code length overflow. ("+i.getLengthInBits()+">"+8*s+")");for(i.getLengthInBits()+4<=8*s&&i.put(0,4);i.getLengthInBits()%8!=0;)i.putBit(!1);for(;!(i.getLengthInBits()>=8*s||(i.put(236,8),i.getLengthInBits()>=8*s));)i.put(17,8);return k(i,n)};return v.addData=function(t){var r=f(t);g.push(r),h=null},v.isDark=function(t,r){if(0>t||t>=l||0>r||r>=l)throw new Error(t+","+r);return s[t][r]},v.getModuleCount=function(){return l},v.make=function(){p(!1,m())},v.createTableTag=function(t,r){t=t||2;var e="";e+='<table style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: "+(r=void 0===r?4*t:r)+"px;",e+='">',e+="<tbody>";for(var n=0;n<v.getModuleCount();n+=1){e+="<tr>";for(var i=0;i<v.getModuleCount();i+=1)e+='<td style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: 0px;",e+=" width: "+t+"px;",e+=" height: "+t+"px;",e+=" background-color: ",e+=v.isDark(n,i)?"#000000":"#ffffff",e+=";",e+='"/>';e+="</tr>"}return e+="</tbody>",e+="</table>"},v.createImgTag=function(t,r){t=t||2,r=void 0===r?4*t:r;var e=v.getModuleCount()*t+2*r,n=r,i=e-r;return d(e,e,function(r,e){if(r>=n&&i>r&&e>=n&&i>e){var o=Math.floor((r-n)/t),a=Math.floor((e-n)/t);return v.isDark(a,o)?0:1}return 1})},v};r.stringToBytes=function(t){for(var r=new Array,e=0;e<t.length;e+=1){var n=t.charCodeAt(e);r.push(255&n)}return r},r.createStringToBytes=function(t,r){var e=function(){for(var e=h(t),n=function(){var t=e.read();if(-1==t)throw new Error;return t},i=0,o={};;){var a=e.read();if(-1==a)break;var u=n(),c=n()<<8|n();o[String.fromCharCode(a<<8|u)]=c,i+=1}if(i!=r)throw new Error(i+" != "+r);return o}(),n="?".charCodeAt(0);return function(t){for(var r=new Array,i=0;i<t.length;i+=1){var o=t.charCodeAt(i);if(128>o)r.push(o);else{var a=e[t.charAt(i)];"number"==typeof a?(255&a)==a?r.push(a):(r.push(a>>>8),r.push(255&a)):r.push(n)}}return r}};var e={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},n={L:1,M:0,Q:3,H:2},i={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},o=function(){var r=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],n=1335,o=7973,u={},c=function(t){for(var r=0;0!=t;)r+=1,t>>>=1;return r};return u.getBCHTypeInfo=function(t){for(var r=t<<10;c(r)-c(n)>=0;)r^=n<<c(r)-c(n);return 21522^(t<<10|r)},u.getBCHTypeNumber=function(t){for(var r=t<<12;c(r)-c(o)>=0;)r^=o<<c(r)-c(o);return t<<12|r},u.getPatternPosition=function(t){return r[t-1]},u.getMaskFunction=function(t){switch(t){case i.PATTERN000:return function(t,r){return(t+r)%2==0};case i.PATTERN001:return function(t,r){return t%2==0};case i.PATTERN010:return function(t,r){return r%3==0};case i.PATTERN011:return function(t,r){return(t+r)%3==0};case i.PATTERN100:return function(t,r){return(Math.floor(t/2)+Math.floor(r/3))%2==0};case i.PATTERN101:return function(t,r){return t*r%2+t*r%3==0};case i.PATTERN110:return function(t,r){return(t*r%2+t*r%3)%2==0};case i.PATTERN111:return function(t,r){return(t*r%3+(t+r)%2)%2==0};default:throw new Error("bad maskPattern:"+t)}},u.getErrorCorrectPolynomial=function(r){for(var e=t([1],0),n=0;r>n;n+=1)e=e.multiply(t([1,a.gexp(n)],0));return e},u.getLengthInBits=function(t,r){if(r>=1&&10>r)switch(t){case e.MODE_NUMBER:return 10;case e.MODE_ALPHA_NUM:return 9;case e.MODE_8BIT_BYTE:case e.MODE_KANJI:return 8;default:throw new Error("mode:"+t)}else if(27>r)switch(t){case e.MODE_NUMBER:return 12;case e.MODE_ALPHA_NUM:return 11;case e.MODE_8BIT_BYTE:return 16;case e.MODE_KANJI:return 10;default:throw new Error("mode:"+t)}else{if(!(41>r))throw new Error("type:"+r);switch(t){case e.MODE_NUMBER:return 14;case e.MODE_ALPHA_NUM:return 13;case e.MODE_8BIT_BYTE:return 16;case e.MODE_KANJI:return 12;default:throw new Error("mode:"+t)}}},u.getLostPoint=function(t){for(var r=t.getModuleCount(),e=0,n=0;r>n;n+=1)for(s=0;r>s;s+=1){for(var i=0,o=t.isDark(n,s),a=-1;1>=a;a+=1)if(!(0>n+a||n+a>=r))for(var u=-1;1>=u;u+=1)0>s+u||s+u>=r||(0!=a||0!=u)&&o==t.isDark(n+a,s+u)&&(i+=1);i>5&&(e+=3+i-5)}for(n=0;r-1>n;n+=1)for(s=0;r-1>s;s+=1){var c=0;t.isDark(n,s)&&(c+=1),t.isDark(n+1,s)&&(c+=1),t.isDark(n,s+1)&&(c+=1),t.isDark(n+1,s+1)&&(c+=1),(0==c||4==c)&&(e+=3)}for(n=0;r>n;n+=1)for(s=0;r-6>s;s+=1)t.isDark(n,s)&&!t.isDark(n,s+1)&&t.isDark(n,s+2)&&t.isDark(n,s+3)&&t.isDark(n,s+4)&&!t.isDark(n,s+5)&&t.isDark(n,s+6)&&(e+=40);for(s=0;r>s;s+=1)for(n=0;r-6>n;n+=1)t.isDark(n,s)&&!t.isDark(n+1,s)&&t.isDark(n+2,s)&&t.isDark(n+3,s)&&t.isDark(n+4,s)&&!t.isDark(n+5,s)&&t.isDark(n+6,s)&&(e+=40);for(var f=0,s=0;r>s;s+=1)for(n=0;r>n;n+=1)t.isDark(n,s)&&(f+=1);return e+=10*(Math.abs(100*f/r/r-50)/5)},u}(),a=function(){for(var t=new Array(256),r=new Array(256),e=0;8>e;e+=1)t[e]=1<<e;for(e=8;256>e;e+=1)t[e]=t[e-4]^t[e-5]^t[e-6]^t[e-8];for(e=0;255>e;e+=1)r[t[e]]=e;var n={};return n.glog=function(t){if(1>t)throw new Error("glog("+t+")");return r[t]},n.gexp=function(r){for(;0>r;)r+=255;for(;r>=256;)r-=255;return t[r]},n}(),u=function(){var t=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],r=function(t,r){var e={};return e.totalCount=t,e.dataCount=r,e},e={},i=function(r,e){switch(e){case n.L:return t[4*(r-1)+0];case n.M:return t[4*(r-1)+1];case n.Q:return t[4*(r-1)+2];case n.H:return t[4*(r-1)+3];default:return}};return e.getRSBlocks=function(t,e){var n=i(t,e);if(void 0===n)throw new Error("bad rs block @ typeNumber:"+t+"/errorCorrectLevel:"+e);for(var o=n.length/3,a=new Array,u=0;o>u;u+=1)for(var c=n[3*u+0],f=n[3*u+1],s=n[3*u+2],l=0;c>l;l+=1)a.push(r(f,s));return a},e}(),c=function(){var t=new Array,r=0,e={};return e.getBuffer=function(){return t},e.getAt=function(r){var e=Math.floor(r/8);return 1==(t[e]>>>7-r%8&1)},e.put=function(t,r){for(var n=0;r>n;n+=1)e.putBit(1==(t>>>r-n-1&1))},e.getLengthInBits=function(){return r},e.putBit=function(e){var n=Math.floor(r/8);t.length<=n&&t.push(0),e&&(t[n]|=128>>>r%8),r+=1},e},f=function(t){var n=e.MODE_8BIT_BYTE,i=r.stringToBytes(t),o={};return o.getMode=function(){return n},o.getLength=function(t){return i.length},o.write=function(t){for(var r=0;r<i.length;r+=1)t.put(i[r],8)},o},s=function(){var t=new Array,r={};return r.writeByte=function(r){t.push(255&r)},r.writeShort=function(t){r.writeByte(t),r.writeByte(t>>>8)},r.writeBytes=function(t,e,n){e=e||0,n=n||t.length;for(var i=0;n>i;i+=1)r.writeByte(t[i+e])},r.writeString=function(t){for(var e=0;e<t.length;e+=1)r.writeByte(t.charCodeAt(e))},r.toByteArray=function(){return t},r.toString=function(){var r="";r+="[";for(var e=0;e<t.length;e+=1)e>0&&(r+=","),r+=t[e];return r+="]"},r},l=function(){var t=0,r=0,e=0,n="",i={},o=function(t){n+=String.fromCharCode(a(63&t))},a=function(t){if(0>t);else{if(26>t)return 65+t;if(52>t)return t-26+97;if(62>t)return t-52+48;if(62==t)return 43;if(63==t)return 47}throw new Error("n:"+t)};return i.writeByte=function(n){for(t=t<<8|255&n,r+=8,e+=1;r>=6;)o(t>>>r-6),r-=6},i.flush=function(){if(r>0&&(o(t<<6-r),t=0,r=0),e%3!=0)for(var i=3-e%3,a=0;i>a;a+=1)n+="="},i.toString=function(){return n},i},h=function(t){var r=t,e=0,n=0,i=0,o={};o.read=function(){for(;8>i;){if(e>=r.length){if(0==i)return-1;throw new Error("unexpected end of file./"+i)}var t=r.charAt(e);if(e+=1,"="==t)return i=0,-1;t.match(/^\s$/)||(n=n<<6|a(t.charCodeAt(0)),i+=6)}var o=n>>>i-8&255;return i-=8,o};var a=function(t){if(t>=65&&90>=t)return t-65;if(t>=97&&122>=t)return t-97+26;if(t>=48&&57>=t)return t-48+52;if(43==t)return 62;if(47==t)return 63;throw new Error("c:"+t)};return o},g=function(t,r){var e=t,n=r,i=new Array(t*r),o={};o.setPixel=function(t,r,n){i[r*e+t]=n},o.write=function(t){t.writeString("GIF87a"),t.writeShort(e),t.writeShort(n),t.writeByte(128),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(255),t.writeByte(255),t.writeByte(255),t.writeString(","),t.writeShort(0),t.writeShort(0),t.writeShort(e),t.writeShort(n),t.writeByte(0);var r=u(2);t.writeByte(2);for(var i=0;r.length-i>255;)t.writeByte(255),t.writeBytes(r,i,255),i+=255;t.writeByte(r.length-i),t.writeBytes(r,i,r.length-i),t.writeByte(0),t.writeString(";")};var a=function(t){var r=t,e=0,n=0,i={};return i.write=function(t,i){if(t>>>i!=0)throw new Error("length over");for(;e+i>=8;)r.writeByte(255&(t<<e|n)),i-=8-e,t>>>=8-e,n=0,e=0;n|=t<<e,e+=i},i.flush=function(){e>0&&r.writeByte(n)},i},u=function(t){for(var r=1<<t,e=1+(1<<t),n=t+1,o=c(),u=0;r>u;u+=1)o.add(String.fromCharCode(u));o.add(String.fromCharCode(r)),o.add(String.fromCharCode(e));var f=s(),l=a(f);l.write(r,n);var h=0,g=String.fromCharCode(i[h]);for(h+=1;h<i.length;){var d=String.fromCharCode(i[h]);h+=1,o.contains(g+d)?g+=d:(l.write(o.indexOf(g),n),o.size()<4095&&(o.size()==1<<n&&(n+=1),o.add(g+d)),g=d)}return l.write(o.indexOf(g),n),l.write(e,n),l.flush(),f.toByteArray()},c=function(){var t={},r=0,e={};return e.add=function(n){if(e.contains(n))throw new Error("dup key:"+n);t[n]=r,r+=1},e.size=function(){return r},e.indexOf=function(r){return t[r]},e.contains=function(r){return void 0!==t[r]},e};return o},d=function(t,r,e,n){for(var i=g(t,r),o=0;r>o;o+=1)for(var a=0;t>a;a+=1)i.setPixel(a,o,e(a,o));var u=s();i.write(u);for(var c=l(),f=u.toByteArray(),h=0;h<f.length;h+=1)c.writeByte(f[h]);c.flush();var d="";return d+="<img",d+=' src="',d+="data:image/gif;base64,",d+=c,d+='"',d+=' width="',d+=t,d+='"',d+=' height="',d+=r,d+='"',n&&(d+=' alt="',d+=n,d+='"'),d+="/>"};return r}();return function(t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports&&(module.exports=t())}(function(){return t}),function(t){t.stringToBytes=function(t){return function(t){for(var r=[],e=0;e<t.length;e++){var n=t.charCodeAt(e);128>n?r.push(n):2048>n?r.push(192|n>>6,128|63&n):55296>n||n>=57344?r.push(224|n>>12,128|n>>6&63,128|63&n):(e++,n=65536+((1023&n)<<10|1023&t.charCodeAt(e)),r.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|63&n))}return r}(t)}}(t),t}()),function(t){t.fn.share=function(r){function e(r,e){var n=i(e);"prepend"==e.mode&&n.reverse(),n.length&&t.each(n,function(n,i){var a=o(i,e),u=e.initialized?r.find(".icon-"+i):t('<a class="social-share-icon icon-'+i+'"></a>');return!u.length||(u.prop("aria-label","分享到 "+h[i]),u.prop("href",a),"wechat"===i?u.prop("tabindex",-1):u.prop("target","_blank"),void(e.initialized||("prepend"==e.mode?r.prepend(u):r.append(u))))})}function n(t,r){var e=t.find("a.icon-wechat");e.length&&(e.append('<div class="wechat-qrcode"><h4>'+r.wechatQrcodeTitle+'</h4><div class="qrcode"></div><div class="help">'+r.wechatQrcodeHelper+"</div></div>"),e.find(".qrcode").qrcode({render:"image",size:r.wechatQrcodeSize,text:r.url}),e.offset().top<100&&e.find(".wechat-qrcode").addClass("bottom"))}function i(r){0===r.mobileSites.length&&r.sites.length&&(r.mobileSites=r.sites);var e=(u()?r.mobileSites:r.sites.length?r.sites:[]).slice(0),n=r.disabled;return"string"==typeof e&&(e=e.split(/\s*,\s*/)),"string"==typeof n&&(n=n.split(/\s*,\s*/)),a()&&n.push("wechat"),n.length&&t.each(n,function(r,n){var i=t.inArray(n,e);-1!==i&&e.splice(i,1)}),e}function o(t,r){var e=l[t];r.summary=r.description;for(var n in r)if(r.hasOwnProperty(n)){var i=t+n.replace(/^[a-z]/,function(t){return t.toUpperCase()}),o=encodeURIComponent(void 0===r[i]?r[n]:r[i]);e=e.replace(new RegExp("{{"+n.toUpperCase()+"}}","g"),o)}return e}function a(){return/MicroMessenger/i.test(navigator.userAgent)}function u(){return t(window).width()<=768}var c=t(document.head),f={url:location.href,site_url:location.origin,source:c.find("[name=site], [name=Site]").attr("content")||document.title,title:c.find("[name=title], [name=Title]").attr("content")||document.title,description:c.find("[name=description], [name=Description]").attr("content")||"",image:t("img:first").prop("src")||"",imageSelector:void 0,weiboKey:"",wechatQrcodeTitle:"微信扫一扫：分享",wechatQrcodeHelper:"<p>微信里点“发现”，扫一下</p><p>二维码便可将本文分享至朋友圈。</p>",wechatQrcodeSize:100,mobileSites:[],sites:["weibo","qq","wechat","tencent","douban","qzone","linkedin","diandian","facebook","twitter","google"],disabled:[],initialized:!1},s=t.extend({},f,r),l={qzone:"http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={{URL}}&title={{TITLE}}&desc={{DESCRIPTION}}&summary={{SUMMARY}}&site={{SOURCE}}",qq:"http://connect.qq.com/widget/shareqq/index.html?url={{URL}}&title={{TITLE}}&source={{SOURCE}}&desc={{DESCRIPTION}}&pics={{IMAGE}}",tencent:"http://share.v.t.qq.com/index.php?c=share&a=index&title={{TITLE}}&url={{URL}}&pic={{https://infinity-permanent.infinitynewtab.com/infinity/share/home.jpg}}",weibo:"http://service.weibo.com/share/share.php?url={{URL}}&title={{TITLE}}&pic={{IMAGE}}&appkey={{WEIBOKEY}}",wechat:"javascript:;",douban:"http://shuo.douban.com/!service/share?href={{URL}}&name={{TITLE}}&text={{DESCRIPTION}}&image={{IMAGE}}&starid=0&aid=0&style=11",diandian:"http://www.diandian.com/share?lo={{URL}}&ti={{TITLE}}&type=link",linkedin:"http://www.linkedin.com/shareArticle?mini=true&ro=true&title={{TITLE}}&url={{URL}}&summary={{SUMMARY}}&source={{SOURCE}}&armin=armin",facebook:"https://www.facebook.com/sharer/sharer.php?u={{URL}}&title={{TITLE}}&description={{DESCRIPTION}}&caption={{SUBHEAD}}&link={{URL}}&picture={{IMAGE}}",twitter:"https://twitter.com/intent/tweet?text={{TITLE}}&url={{URL}}&via=infinitynewtab",google:"https://plus.google.com/share?url={{URL}}"},h={qzone:"QQ空间",qq:"QQ",tencent:"腾讯微博",weibo:"微博",wechat:"微信",douban:"豆瓣",diandian:"点点",linkedin:"LinkedIn",facebook:"Facebook",twitter:"Twitter",google:"Google"};this.each(function(){if(t(this).data("initialized"))return!0;var r=t.extend({},s,t(this).data());r.imageSelector&&(r.image=t(r.imageSelector).map(function(){return t(this).prop("src")}).get().join("||"));var i=t(this).addClass("share-component social-share");e(i,r),n(i,r),t(this).data("initialized",!0)})},t(function(){t(".share-component,.social-share").share()})}(jQuery);var configShareSocialTitle=infinity.i18n("share_title"),configShareSocialDescription=infinity.i18n("share_descript"),$configShareSocial={url:"https://infinitynewtab.com",source:"infinitynewtab",image:"https://infinity-permanent.infinitynewtab.com/infinity/share/home.jpg",title:configShareSocialTitle,description:configShareSocialDescription,sites:["twitter","facebook","google","linkedin","qzone","qq","douban"],via:"haohuo"};$(".social-share").share($configShareSocial),$(".social-share .social-share-icon").click(function(){var t=$(this);infinity.sendMessage("sendGa",{category:"shareBtn",event:"click",label:infinity.getHost(t.prop("href"))})});