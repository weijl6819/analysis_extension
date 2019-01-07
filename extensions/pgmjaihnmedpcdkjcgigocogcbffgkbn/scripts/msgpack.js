!function(t){function e(i){if(s[i])return s[i].exports
var r=s[i]={exports:{},id:i,loaded:!1}
return t[i].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var s={}
return e.m=t,e.c=s,e.p="",e(0)}([function(t,e,s){window.msgpack=s(1)},function(t,e,s){function i(){}function r(){}var f=s(2),n=s(5)
e.CONNECT=0,e.DISCONNECT=1,e.EVENT=2,e.ACK=3,e.ERROR=4,e.BINARY_EVENT=5,e.BINARY_ACK=6
var o={type:e.ERROR,data:"parser error"}
i.prototype.encode=function(t,s){switch(t.type){case e.CONNECT:case e.DISCONNECT:case e.ERROR:return s([JSON.stringify(t)])
default:return s([f.encode(t)])}},n(r.prototype),r.prototype.add=function(t){"string"==typeof t?this.parseJSON(t):this.parseBinary(t)},r.prototype.parseJSON=function(t){try{var e=JSON.parse(t)
this.emit("decoded",e)}catch(s){this.emit("decoded",o)}},r.prototype.parseBinary=function(t){try{var e=f.decode(t)
this.emit("decoded",e)}catch(s){this.emit("decoded",o)}},r.prototype.destroy=function(){},e.Encoder=i,e.Decoder=r},function(t,e,s){e.encode=s(3),e.decode=s(4)},function(t,e){"use strict"
function s(t,e,s){for(var i=0,r=0,f=s.length;f>r;r++)i=s.charCodeAt(r),128>i?t.setUint8(e++,i):2048>i?(t.setUint8(e++,192|i>>6),t.setUint8(e++,128|63&i)):55296>i||i>=57344?(t.setUint8(e++,224|i>>12),t.setUint8(e++,128|i>>6&63),t.setUint8(e++,128|63&i)):(r++,i=65536+((1023&i)<<10|1023&s.charCodeAt(r)),t.setUint8(e++,240|i>>18),t.setUint8(e++,128|i>>12&63),t.setUint8(e++,128|i>>6&63),t.setUint8(e++,128|63&i))}function i(t){for(var e=0,s=0,i=0,r=t.length;r>i;i++)e=t.charCodeAt(i),128>e?s+=1:2048>e?s+=2:55296>e||e>=57344?s+=3:(i++,s+=4)
return s}function r(t,e,s){var f=typeof s,n=0,o=0,h=0,a=0,u=0,c=0
if("string"===f){if(u=i(s),32>u)t.push(160|u),c=1
else if(256>u)t.push(217,u),c=2
else if(65536>u)t.push(218,u>>8,u),c=3
else{if(!(4294967296>u))throw Error("String too long")
t.push(219,u>>24,u>>16,u>>8,u),c=5}return e.push({str:s,length:u,offset:t.length}),c+u}if("number"===f)return Math.floor(s)===s&&isFinite(s)?s>=0?128>s?(t.push(s),1):256>s?(t.push(204,s),2):65536>s?(t.push(205,s>>8,s),3):4294967296>s?(t.push(206,s>>24,s>>16,s>>8,s),5):(h=s/Math.pow(2,32)>>0,a=s>>>0,t.push(207,h>>24,h>>16,h>>8,h,a>>24,a>>16,a>>8,a),9):s>=-32?(t.push(s),1):s>=-128?(t.push(208,s),2):s>=-32768?(t.push(209,s>>8,s),3):s>=-2147483648?(t.push(210,s>>24,s>>16,s>>8,s),5):(h=Math.floor(s/Math.pow(2,32)),a=s>>>0,t.push(211,h>>24,h>>16,h>>8,h,a>>24,a>>16,a>>8,a),9):(t.push(203),e.push({"float":s,length:8,offset:t.length}),9)
if("object"===f){if(null===s)return t.push(192),1
if(Array.isArray(s)){if(u=s.length,16>u)t.push(144|u),c=1
else if(65536>u)t.push(220,u>>8,u),c=3
else{if(!(4294967296>u))throw Error("Array too large")
t.push(221,u>>24,u>>16,u>>8,u),c=5}for(n=0;u>n;n++)c+=r(t,e,s[n])
return c}if(s instanceof Date){var p=s.getTime()
return h=Math.floor(p/Math.pow(2,32)),a=p>>>0,t.push(215,0,h>>24,h>>16,h>>8,h,a>>24,a>>16,a>>8,a),10}if(s instanceof ArrayBuffer){if(u=s.byteLength,256>u)t.push(196,u),c=2
else if(65536>u)t.push(197,u>>8,u),c=3
else{if(!(4294967296>u))throw Error("Buffer too large")
t.push(198,u>>24,u>>16,u>>8,u),c=5}return e.push({bin:s,length:u,offset:t.length}),c+u}if("function"==typeof s.toJSON)return r(t,e,s.toJSON())
var l=[],g="",v=Object.keys(s)
for(n=0,o=v.length;o>n;n++)g=v[n],"function"!=typeof s[g]&&l.push(g)
if(u=l.length,16>u)t.push(128|u),c=1
else if(65536>u)t.push(222,u>>8,u),c=3
else{if(!(4294967296>u))throw Error("Object too large")
t.push(223,u>>24,u>>16,u>>8,u),c=5}for(n=0;u>n;n++)g=l[n],c+=r(t,e,g),c+=r(t,e,s[g])
return c}if("boolean"===f)return t.push(s?195:194),1
if("undefined"===f)return t.push(212,0,0),3
throw Error("Could not encode")}function f(t){var e=[],i=[],f=r(e,i,t),n=new ArrayBuffer(f),o=new DataView(n),h=0,a=0,u=-1
i.length>0&&(u=i[0].offset)
for(var c,p=0,l=0,g=0,v=e.length;v>g;g++)if(o.setUint8(a+g,e[g]),g+1===u){if(c=i[h],p=c.length,l=a+u,c.bin)for(var w=new Uint8Array(c.bin),y=0;p>y;y++)o.setUint8(l+y,w[y])
else c.str?s(o,l,c.str):void 0!==c["float"]&&o.setFloat64(l,c["float"])
h++,a+=p,i[h]&&(u=i[h].offset)}return n}t.exports=f},function(t,e){"use strict"
function s(t){if(this.offset=0,t instanceof ArrayBuffer)this.buffer=t,this.view=new DataView(this.buffer)
else{if(!ArrayBuffer.isView(t))throw Error("Invalid argument")
this.buffer=t.buffer,this.view=new DataView(this.buffer,t.byteOffset,t.byteLength)}}function i(t,e,s){for(var i="",r=0,f=e,n=e+s;n>f;f++){var o=t.getUint8(f)
if(0!==(128&o))if(192!==(224&o))if(224!==(240&o)){if(240!==(248&o))throw Error("Invalid byte "+o.toString(16))
r=(7&o)<<18|(63&t.getUint8(++f))<<12|(63&t.getUint8(++f))<<6|(63&t.getUint8(++f))<<0,r>=65536?(r-=65536,i+=String.fromCharCode((r>>>10)+55296,(1023&r)+56320)):i+=String.fromCharCode(r)}else i+=String.fromCharCode((15&o)<<12|(63&t.getUint8(++f))<<6|(63&t.getUint8(++f))<<0)
else i+=String.fromCharCode((15&o)<<6|63&t.getUint8(++f))
else i+=String.fromCharCode(o)}return i}function r(t){var e=new s(t),i=e.parse()
if(e.offset!==t.byteLength)throw Error(t.byteLength-e.offset+" trailing bytes")
return i}s.prototype.array=function(t){for(var e=Array(t),s=0;t>s;s++)e[s]=this.parse()
return e},s.prototype.map=function(t){for(var e="",s={},i=0;t>i;i++)e=this.parse(),s[e]=this.parse()
return s},s.prototype.str=function(t){var e=i(this.view,this.offset,t)
return this.offset+=t,e},s.prototype.bin=function(t){var e=this.buffer.slice(this.offset,this.offset+t)
return this.offset+=t,e},s.prototype.parse=function(){var t,e=this.view.getUint8(this.offset++),s=0,i=0,r=0,f=0
if(192>e)return 128>e?e:144>e?this.map(15&e):160>e?this.array(15&e):this.str(31&e)
if(e>223)return-1*(255-e+1)
switch(e){case 192:return null
case 194:return!1
case 195:return!0
case 196:return s=this.view.getUint8(this.offset),this.offset+=1,this.bin(s)
case 197:return s=this.view.getUint16(this.offset),this.offset+=2,this.bin(s)
case 198:return s=this.view.getUint32(this.offset),this.offset+=4,this.bin(s)
case 199:return s=this.view.getUint8(this.offset),i=this.view.getInt8(this.offset+1),this.offset+=2,[i,this.bin(s)]
case 200:return s=this.view.getUint16(this.offset),i=this.view.getInt8(this.offset+2),this.offset+=3,[i,this.bin(s)]
case 201:return s=this.view.getUint32(this.offset),i=this.view.getInt8(this.offset+4),this.offset+=5,[i,this.bin(s)]
case 202:return t=this.view.getFloat32(this.offset),this.offset+=4,t
case 203:return t=this.view.getFloat64(this.offset),this.offset+=8,t
case 204:return t=this.view.getUint8(this.offset),this.offset+=1,t
case 205:return t=this.view.getUint16(this.offset),this.offset+=2,t
case 206:return t=this.view.getUint32(this.offset),this.offset+=4,t
case 207:return r=this.view.getUint32(this.offset)*Math.pow(2,32),f=this.view.getUint32(this.offset+4),this.offset+=8,r+f
case 208:return t=this.view.getInt8(this.offset),this.offset+=1,t
case 209:return t=this.view.getInt16(this.offset),this.offset+=2,t
case 210:return t=this.view.getInt32(this.offset),this.offset+=4,t
case 211:return r=this.view.getInt32(this.offset)*Math.pow(2,32),f=this.view.getUint32(this.offset+4),this.offset+=8,r+f
case 212:return i=this.view.getInt8(this.offset),this.offset+=1,0===i?void(this.offset+=1):[i,this.bin(1)]
case 213:return i=this.view.getInt8(this.offset),this.offset+=1,[i,this.bin(2)]
case 214:return i=this.view.getInt8(this.offset),this.offset+=1,[i,this.bin(4)]
case 215:return i=this.view.getInt8(this.offset),this.offset+=1,0===i?(r=this.view.getInt32(this.offset)*Math.pow(2,32),f=this.view.getUint32(this.offset+4),this.offset+=8,new Date(r+f)):[i,this.bin(8)]
case 216:return i=this.view.getInt8(this.offset),this.offset+=1,[i,this.bin(16)]
case 217:return s=this.view.getUint8(this.offset),this.offset+=1,this.str(s)
case 218:return s=this.view.getUint16(this.offset),this.offset+=2,this.str(s)
case 219:return s=this.view.getUint32(this.offset),this.offset+=4,this.str(s)
case 220:return s=this.view.getUint16(this.offset),this.offset+=2,this.array(s)
case 221:return s=this.view.getUint32(this.offset),this.offset+=4,this.array(s)
case 222:return s=this.view.getUint16(this.offset),this.offset+=2,this.map(s)
case 223:return s=this.view.getUint32(this.offset),this.offset+=4,this.map(s)}throw Error("Could not parse")},t.exports=r},function(t,e,s){function i(t){return t?r(t):void 0}function r(t){for(var e in i.prototype)t[e]=i.prototype[e]
return t}t.exports=i,i.prototype.on=i.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},i.prototype.once=function(t,e){function s(){this.off(t,s),e.apply(this,arguments)}return s.fn=e,this.on(t,s),this},i.prototype.off=i.prototype.removeListener=i.prototype.removeAllListeners=i.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this
var s=this._callbacks["$"+t]
if(!s)return this
if(1==arguments.length)return delete this._callbacks["$"+t],this
for(var i,r=0;r<s.length;r++)if(i=s[r],i===e||i.fn===e){s.splice(r,1)
break}return this},i.prototype.emit=function(t){this._callbacks=this._callbacks||{}
var e=[].slice.call(arguments,1),s=this._callbacks["$"+t]
if(s){s=s.slice(0)
for(var i=0,r=s.length;r>i;++i)s[i].apply(this,e)}return this},i.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},i.prototype.hasListeners=function(t){return!!this.listeners(t).length}}])
