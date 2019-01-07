
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
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Kinotracker;
	
	Kinotracker = (function() {
	  Kinotracker.prototype.properties = {
	    AddTag: false,
	    Tag: 'DVDRip',
	    Sort: 4,
	    SortOrder: 2
	  };
	
	  Kinotracker.prototype.links = __webpack_require__(2);
	
	  Kinotracker.prototype.template = __webpack_require__(3);
	
	  Kinotracker.prototype.markerTemplate = __webpack_require__(6);
	
	  function Kinotracker() {
	    this.el = $('h1[itemprop=name]');
	    this.initialize();
	  }
	
	  Kinotracker.prototype.initialize = function() {
	    this.loadProperties(this.properties);
	    return this.highlightMarkers();
	  };
	
	  Kinotracker.prototype.render = function(data) {
	    return this.el.append(this.template(data));
	  };
	
	  Kinotracker.prototype.addLinks = function(dyn_url, options, filmname) {
	    var data;
	    data = {
	      links: this.links,
	      clue: dyn_url,
	      options: options,
	      marker: filmname
	    };
	    return this.render(data);
	  };
	
	  Kinotracker.prototype.loadProperties = function(options) {
	    return chrome.extension.sendRequest(options, (function(_this) {
	      return function(response) {
	        return _this.getInfo(response);
	      };
	    })(this));
	  };
	
	  Kinotracker.prototype.getInfo = function(opt) {
	    var banned_chars, dyn_url, filmname, marker, mov, mov_orig_name, year;
	    banned_chars = /"|«|»|\(ТВ\)|&|:|!|·|\(сериал\)/g;
	    mov_orig_name = $('span[itemprop=alternativeHeadline]').text();
	    year = $('table.info tr:first-of-type a:first-of-type').text();
	    filmname = mov_orig_name || this.el.text();
	    mov = filmname.replace(banned_chars, '');
	    marker = [this.el.text(), mov_orig_name].join("&");
	    dyn_url = '?o=' + opt.Sort + '&s=' + opt.SortOrder + '&nm=' + mov + ' ' + year;
	    opt.Tag = opt.AddTag === "true" ? opt.Tag : "";
	    return this.addLinks(dyn_url, opt.Tag, marker);
	  };
	
	  Kinotracker.prototype.highlightMarkers = function() {
	    var $scopeElements, markerTemplate, markers;
	    markerTemplate = this.markerTemplate;
	    if (this.links[location.hostname]) {
	      markers = location.hash.replace("#marker=", "").split("&");
	      $scopeElements = $(this.links[location.hostname].link_selector);
	      return $scopeElements.each(function() {
	        var $this, html;
	        $this = $(this);
	        html = $this.html();
	        markers.forEach(function(element) {
	          var marker, regexp;
	          regexp = new RegExp(element, "i");
	          marker = markerTemplate({
	            data: {
	              marker: element
	            }
	          });
	          return html = html.replace(regexp, marker);
	        });
	        return $this.html(html);
	      });
	    }
	  };
	
	  return Kinotracker;
	
	})();
	
	module.exports = new Kinotracker();


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = {
	  "rutracker.org": {
	    title: "RuTracker.Org",
	    static_url: "http://rutracker.org/forum/tracker.php",
	    favicon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAADAFBMVEUAAAAICAEAAAAAAABkjYoVEgEGDAf//v8FBQH9/P8AAAD/+/8ZFwmQlMKIi3yOkZGurLfev8OAfYQDCgW6s7P7/Ojp/v77//////39//94c1QAAAAAAAD////////////TfoZax2yUtKmrqIne2snmwtiZt5VciIaosaSlipGCpX2ur7ian9z/+v++rKSdvpcOCwCunaGjss1CaWZycE4nOjdsaUTY6tOhm2XZ1+orGy50eHT//f7J2dt5qadhc3LMzNFOSSoIJSE+V1hHQhrw///v7e/q2vDd0+P+7P/j8/N9dlfg39NDREP/9/+Wn54RDRG+4+G/v795dnJ+fXZNSi0cDR4QKuDpGStPwDYFH+IRLOAPK+kCA+PrGizwDyH0BxoAE+QSLeIBFd0ADN0AAt38FivqDB46vRvyARTsABG2AQykrPoCGukLJt8ABs6M7V1PyTRBuyc+uiLZAAzrAAV8iv9yg/9GX/82WPwxQfoIJe0QPesACOopO+S5vt5+iNmSlNjY1dcABcvGxsn/rruCg7tpcbqio67RoaywsZ79hZSd05F5hJCA5mxsjGdsqmG4VmD/Ljr5JjpTxjn+HTLyHTBIvy62Gys7nSnpEyfMFSY2tCE/wCAutxg0whArqBAipQblAAZ/pP+Tov+Snf9RfP9gc/8mPv8QLP3D5fRkdPPP0PFjj/CMme8OIexWUemRsuiiweSHkuRfceQMINYWLdRyftIACtLJzNAABdADFMTM4cPG1MN6d7+8tLrNsbqYqrpMU7resrnLyraGjLXtubPO87IUHLIqO7CTma8AAK+wza6nta7/nqv5mabpkJ3LfJyXspnF95Wd3JOp+JKPjo+RlIzjeYi6nITNYYOmc3mj/3jIanW6/3SF83Fi0nD/Z27/gm1uyGeX9FyieVpnvFn3S1Nk01BWgU/sJ0xUkEh15UfSQUXQMECxMT5W0DpRTTJf2i3hCCuWRCdGzib/GBzjABGWJRD/AA3PAAOoAwIjsgASlgCZBQDGAADpkVMCAAAAV3RSTlMACgQ2uol/e2xqTj4W+/bl4N/ampSJfWJJODcvKiEdCP7+/fz5+Pj49/T08Ozr6+fm5eTg4NfQzMzBwby4t7Szsq6uraempKObkpKOgoBcXFhSTks+KyiB+q3iAAACL0lEQVR4AWNABXL+jAx4AWeTPX4FXjPOsTDhU2Cb/bMVnwp5w+yETIgKWU4bX0yVkrd/TUvPPG8X6Cao8O6wKaaDxScuiotIT7gxcXbJooe9XJhWiL1PiIiImJWVFR+fdsAJ0wJXzey0CCCIi4sr7VZnRshwi4QxyIoJ3p1dEh8BAemT9gsjaZU4o2WpOqOkND4+IS0OrCDzgrEMsu/0Fz7mu/UqK3Py298JU0EGTG5hQ7HdY+b8OYpKFz8/X3X9x/+0aRERWd3ODCFIjvCbkFGYMefBpWPtlZue/vs+dVbpJBWjeiRXyKktmBJZOHfe1X3NKxef/ZL97VHnlgqUcHCYWRgZGZlR0LYjKrZy483OtTWpZSY8yNE8IQOooLigLT8mOmX9sprUqNycj9JICtxfzwUqKCo4mh8THp2XHJUUVdVhgKTA8+WCKSAT3pxqjgkPD48Oj04p50PyBHv/wg8gA+bf4wWaAAa56xyR4rD/79ei6dPnfbrcuDUKIp9XXe+C0N/07H5f34viJ3s3pEYlhUNAckULK0xBkLWQED+/xp7tsbExSdFQBdGpy48ghTYjD1Ow7qG6quSURLgZseVdHKjJQeR4z8GG1duigH6ISklMTKxdiq7C/M8dPW+B3dXRyXVLNjc08upos6GmSu6eK1YMoidz82pzLKSkQnkYMVI1ewcrA3f7rtgyZWYc+SIAmIwETq/YyYovc4meyDHDm4Ml1lzjwp+BfVA8BwCESNe4x56sjAAAAABJRU5ErkJggg==",
	    link_selector: ".tLink",
	    options: true
	  },
	  "tapochek.net": {
	    title: "Tapochek.net",
	    static_url: "http://tapochek.net/tracker.php",
	    favicon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABiVBMVEVQb5wqR3HM1eNthqoJIUMLI0UAAADs8Pbr7/Zuhqvr8PUgPGICCBTO1+RVdZxMa5lAX4oHFDMDDyHv9Pvo7PPk6fDf5u/X4OnH0uDCz+O+zuSzwtiovNmdtNN0jrNde6Q4U4n///8+bqs8batWhLtPgLhWhrxAcK0rX6JEdbE3aaegt9VLfLZCc69olshikMSiudaKqs9gjsJaiL5Yh71Tg7s+b6xrmctkk8ZdjMFSgrk6bKnr8fdbir9Id7HU4e/T4O5diLxLe7RIebNFdK48bKk6a6goXJ/9/v7v9Pru8/nY5PJnlcf1+PyGps0/ca41Z6bs8viKqc2Boslbi8FUgLb7/P3y9vru9Prm7fXg6fTW4/HR3u29z+Wyx99um8xeir4xY6MkWZ3d5/LO2+vK2erD0+arwt6gutmYtdedtdSRsNSPrNB2oM98ncZrlcV4mcRxlcJskcD6/P3i6/TC1Oe6z+awx+K2yd+Hq9N7o85zmshjjcBiirxahLdPfbWct9eKrNNmkMLwfu7EAAAAIXRSTlNWM8ltFhgA6+pu6ikIy1tSRw8L8Obi3tbEwL+wqqB2YT5IUh+cAAACn0lEQVQ4y3WSd3uaUBSHaato1WZ1715ZgQAGFQcYRFGjiUZjTExcjWbvvUfHJ++9oHnM86QvfwDnvPy4nAuGe+xD2NMMuodxHPP8+JAF/+Htt2Ecc78Hl9tjJuM9rNvt8SUw4MG+g+1OZxIy+ghY6HTus59t2EtwNFniOC6jqmmC4EqlNJFW1UyG40ptb+yVDXsBDkdhG3W9XmL++C7khec0Utqp2HM7TDhsZ1QCVkMMQ1wuxObh2XQyJSiYCe004Q0RKYIhUnGQPeYYQoC6N811E/ZL8GH1aLocSparALQSxN3qOIrhtFkzYZ9jmNB9DID1FYAoNOH1LiEwarInCIKgrYN+qsdMSvB2hTk1xWpCYqmvn90tamyK+TVrrmGOYDWDTcRQp9FaL1iCobFQsBJCGlssjsH6wm/K4G9QlM6HBE2Yn7KEInu70ZyC5TOekhVDQupaa4ZlkYBeIRQlYLLFkyRJ/c0BhC4gwQ4TZgShbAmbVDAYlA8KALHKamRXYJMJafMU1uIBORCkNtEsWjtHvPEgUBTP7gBI88Dv20IBa3ySopL0ornIGYNSSOXWnENOr5lzkChSVvhET1BkWrmu9g9qQ6bJB6GcVEjSXwP9LEgyLVOJXFeQSfpgBRQu1k5Qs7YxDU52YIQlvAQST9IB+ubsquL7A8d1IVbE861gIEhSyzn0FVCggxPRSsUfiYhww698eV+0Ep0I0I8Fvy+SF/PnsdqemI/4/D3B1i+IYnjvei8cFruCsrxobrdkyHRgIooSwggrAa0hUIW//QBokiRKMIWfEDPBjxIk8GUEs38Cp6sNXY/H4/X6NKJeh9e63mjo4PUQjuHur+8cTpfT4XI5nU6HwwkPhwtWXI43Hwc9UMBH3M+exm3z4Pg/yWC/FZg/ZwkAAAAASUVORK5CYII=",
	    link_selector: ".genmed",
	    options: false
	  }
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(4);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (clue, links, marker, options, undefined) {
	var opts = "";
	buf.push((jade.escape(null == (jade_interp = " ") ? "" : jade_interp)) + "<div class=\"kinotracker\"><span class=\"kinotracker__label\">Скачать:</span>");
	// iterate links
	;(function(){
	  var $$obj = links;
	  if ('number' == typeof $$obj.length) {
	
	    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
	      var link = $$obj[$index];
	
	if ( link.options && options)
	{
	opts = " " + options
	}
	buf.push("<a target=\"_blank\"" + (jade.attr("href", "" + (link.static_url) + "" + (clue) + "" + (opts) + "#marker=" + (marker) + "", true, true)) + (jade.attr("title", "Искать на " + (link.title) + "", true, true)) + " class=\"kinotracker__link\"><img" + (jade.attr("src", "" + (link.favicon) + "", true, true)) + " class=\"kinotracker__img\"></a>");
	    }
	
	  } else {
	    var $$l = 0;
	    for (var $index in $$obj) {
	      $$l++;      var link = $$obj[$index];
	
	if ( link.options && options)
	{
	opts = " " + options
	}
	buf.push("<a target=\"_blank\"" + (jade.attr("href", "" + (link.static_url) + "" + (clue) + "" + (opts) + "#marker=" + (marker) + "", true, true)) + (jade.attr("title", "Искать на " + (link.title) + "", true, true)) + " class=\"kinotracker__link\"><img" + (jade.attr("src", "" + (link.favicon) + "", true, true)) + " class=\"kinotracker__img\"></a>");
	    }
	
	  }
	}).call(this);
	
	buf.push("</div>");}.call(this,"clue" in locals_for_with?locals_for_with.clue:typeof clue!=="undefined"?clue:undefined,"links" in locals_for_with?locals_for_with.links:typeof links!=="undefined"?links:undefined,"marker" in locals_for_with?locals_for_with.marker:typeof marker!=="undefined"?marker:undefined,"options" in locals_for_with?locals_for_with.options:typeof options!=="undefined"?options:undefined,"undefined" in locals_for_with?locals_for_with.undefined: false?undefined:undefined));;return buf.join("");
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Merge two attribute objects giving precedence
	 * to values in object `b`. Classes are special-cased
	 * allowing for arrays and merging/joining appropriately
	 * resulting in a string.
	 *
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Object} a
	 * @api private
	 */
	
	exports.merge = function merge(a, b) {
	  if (arguments.length === 1) {
	    var attrs = a[0];
	    for (var i = 1; i < a.length; i++) {
	      attrs = merge(attrs, a[i]);
	    }
	    return attrs;
	  }
	  var ac = a['class'];
	  var bc = b['class'];
	
	  if (ac || bc) {
	    ac = ac || [];
	    bc = bc || [];
	    if (!Array.isArray(ac)) ac = [ac];
	    if (!Array.isArray(bc)) bc = [bc];
	    a['class'] = ac.concat(bc).filter(nulls);
	  }
	
	  for (var key in b) {
	    if (key != 'class') {
	      a[key] = b[key];
	    }
	  }
	
	  return a;
	};
	
	/**
	 * Filter null `val`s.
	 *
	 * @param {*} val
	 * @return {Boolean}
	 * @api private
	 */
	
	function nulls(val) {
	  return val != null && val !== '';
	}
	
	/**
	 * join array as classes.
	 *
	 * @param {*} val
	 * @return {String}
	 */
	exports.joinClasses = joinClasses;
	function joinClasses(val) {
	  return (Array.isArray(val) ? val.map(joinClasses) :
	    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
	    [val]).filter(nulls).join(' ');
	}
	
	/**
	 * Render the given classes.
	 *
	 * @param {Array} classes
	 * @param {Array.<Boolean>} escaped
	 * @return {String}
	 */
	exports.cls = function cls(classes, escaped) {
	  var buf = [];
	  for (var i = 0; i < classes.length; i++) {
	    if (escaped && escaped[i]) {
	      buf.push(exports.escape(joinClasses([classes[i]])));
	    } else {
	      buf.push(joinClasses(classes[i]));
	    }
	  }
	  var text = joinClasses(buf);
	  if (text.length) {
	    return ' class="' + text + '"';
	  } else {
	    return '';
	  }
	};
	
	
	exports.style = function (val) {
	  if (val && typeof val === 'object') {
	    return Object.keys(val).map(function (style) {
	      return style + ':' + val[style];
	    }).join(';');
	  } else {
	    return val;
	  }
	};
	/**
	 * Render the given attribute.
	 *
	 * @param {String} key
	 * @param {String} val
	 * @param {Boolean} escaped
	 * @param {Boolean} terse
	 * @return {String}
	 */
	exports.attr = function attr(key, val, escaped, terse) {
	  if (key === 'style') {
	    val = exports.style(val);
	  }
	  if ('boolean' == typeof val || null == val) {
	    if (val) {
	      return ' ' + (terse ? key : key + '="' + key + '"');
	    } else {
	      return '';
	    }
	  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
	    if (JSON.stringify(val).indexOf('&') !== -1) {
	      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
	                   'will be escaped to `&amp;`');
	    };
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will eliminate the double quotes around dates in ' +
	                   'ISO form after 2.0.0');
	    }
	    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
	  } else if (escaped) {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + exports.escape(val) + '"';
	  } else {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + val + '"';
	  }
	};
	
	/**
	 * Render the given attributes object.
	 *
	 * @param {Object} obj
	 * @param {Object} escaped
	 * @return {String}
	 */
	exports.attrs = function attrs(obj, terse){
	  var buf = [];
	
	  var keys = Object.keys(obj);
	
	  if (keys.length) {
	    for (var i = 0; i < keys.length; ++i) {
	      var key = keys[i]
	        , val = obj[key];
	
	      if ('class' == key) {
	        if (val = joinClasses(val)) {
	          buf.push(' ' + key + '="' + val + '"');
	        }
	      } else {
	        buf.push(exports.attr(key, val, false, terse));
	      }
	    }
	  }
	
	  return buf.join('');
	};
	
	/**
	 * Escape the given string of `html`.
	 *
	 * @param {String} html
	 * @return {String}
	 * @api private
	 */
	
	var jade_encode_html_rules = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;'
	};
	var jade_match_html = /[&<>"]/g;
	
	function jade_encode_char(c) {
	  return jade_encode_html_rules[c] || c;
	}
	
	exports.escape = jade_escape;
	function jade_escape(html){
	  var result = String(html).replace(jade_match_html, jade_encode_char);
	  if (result === '' + html) return html;
	  else return result;
	};
	
	/**
	 * Re-throw the given `err` in context to the
	 * the jade in `filename` at the given `lineno`.
	 *
	 * @param {Error} err
	 * @param {String} filename
	 * @param {String} lineno
	 * @api private
	 */
	
	exports.rethrow = function rethrow(err, filename, lineno, str){
	  if (!(err instanceof Error)) throw err;
	  if ((typeof window != 'undefined' || !filename) && !str) {
	    err.message += ' on line ' + lineno;
	    throw err;
	  }
	  try {
	    str = str || __webpack_require__(5).readFileSync(filename, 'utf8')
	  } catch (ex) {
	    rethrow(err, null, lineno)
	  }
	  var context = 3
	    , lines = str.split('\n')
	    , start = Math.max(lineno - context, 0)
	    , end = Math.min(lines.length, lineno + context);
	
	  // Error context
	  var context = lines.slice(start, end).map(function(line, i){
	    var curr = i + start + 1;
	    return (curr == lineno ? '  > ' : '    ')
	      + curr
	      + '| '
	      + line;
	  }).join('\n');
	
	  // Alter exception message
	  err.path = filename;
	  err.message = (filename || 'Jade') + ':' + lineno
	    + '\n' + context + '\n\n' + err.message;
	  throw err;
	};
	
	exports.DebugItem = function DebugItem(lineno, filename) {
	  this.lineno = lineno;
	  this.filename = filename;
	}


/***/ },
/* 5 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(4);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (data) {
	buf.push("<span class=\"kinotracker__marker\">" + (jade.escape(null == (jade_interp = data.marker) ? "" : jade_interp)) + "</span>");}.call(this,"data" in locals_for_with?locals_for_with.data:typeof data!=="undefined"?data:undefined));;return buf.join("");
	}

/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map