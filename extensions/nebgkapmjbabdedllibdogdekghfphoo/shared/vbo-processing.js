
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

;(function(){
"use strict";

var timingLog = FreePriceAlerts.TimingLog.getInstance();

var $ = FreePriceAlerts.libs.$;
var _ = FreePriceAlerts.libs._;

var _logInitStart = function(obj, name) { FreePriceAlerts.console.logContext('pdl-init', _getIndent(obj)+'+ init: '+( name || obj.classname )); };
var _logInitEnd = function(obj) { FreePriceAlerts.console.logContext('pdl-init', _getIndent(obj)+'- init: '+obj.toString()); };

var _propsToString = function(obj, props) {
    var m = '';
    var first = true;

    var appendProp = function(propVal) {
        if (first) { first = false; }
        else { m += ', '; }

        m += propVal;
    };

    _(props).each(function(prop){

        var val = obj[prop];
        if (val == null) return;

        if (typeof val === 'string') {
            if (val.length > 0)
                appendProp(prop+':"'+val+'"');
        }
        else if (typeof val === 'number') {
            if (!isNaN(val))
                appendProp(prop+':"'+val+'"');
        }
        else if (_(val.length).isNumber()) {
            if (val.length > 0)
                appendProp(prop+':['+val.length+']');
        }
        else {
            appendProp(prop+':`'+val+'`');
        }
    });

    return m ? '{ '+m+' }' : '{}';
};

var _getParentCount = function(obj) {

    var _get = function(obj, count) {
        if (!obj.parent) return count;
        if (obj.__getParentCount_lock) throw 'Circular reference in parents: '+obj.toString()+'; '+obj.parent.toString();
        obj.__getParentCount_lock = true;
        var count = _get(obj.parent, count+1);
        delete obj.__getParentCount_lock;
        return count;
    };

    return _get(obj, 0);
};

var _getIndent = function(obj) { return _.repeat('  ', _getParentCount(obj)) };

var _toString = function(obj) {
    if (obj == null) return 'null';
    if (typeof obj === 'string') return '"'+obj+'"';
    if (typeof obj === 'number') return ''+obj;
    if (obj.length != null) return '['+obj.length+']';
    if (obj.innerText != null) return '"'+obj.innerText+'"';
    if (typeof obj.toString === 'function') return obj.toString();
    return 'unknown';
};

FreePriceAlerts.processing = FreePriceAlerts.processing || {};

FreePriceAlerts.processing.Pod = function( podXml, path, parent )
{
    this.superclass = FreePriceAlerts.events.Dispatcher;
    this.superclass();

    this.classname = 'Pod';
    this.name = this.description = "";
    this.parsers = [];
    this.links = [];
    this.filters = [];
    this.path = path !== undefined ? path : "";
    this.includesLoading = 0;
    this.parent = parent;
    timingLog.add('pl', 'pdlLoadStart');

    _logInitStart(this);

    var i, rawDOM, self=this;

    this.getFieldsByName = function(n)
    {
        i=this.parsers.length;
        var f=[];
        while( i-- )
        {
          f = f.concat(this.parsers[i].getFieldsByName(n));
        }
        return f;
    }

    this.getFieldById = function(id)
    {
        i=this.parsers.length;
        var r;
        while( i-- )
        {
          if(r=this.parsers[i].getFieldById(id)) return r;
        }
        return null;
    }

    this.getFiltersByName = function( n )
    {
        var i=this.filters.length;
        var f=[];
        while( i-- )
        {
          if(this.filters[i].name==n) f.push(this.filters[i]);
        }

        var g;
        if ( g = FreePriceAlerts.processing.Filter.getGlobalFilter(n) )
          f.push(g);

        return f;
    }

    /// Runs some basic validity checks on the Pod and throws a string describing
    /// the issue with the Pod if one is found; otherwise returns true.
    this.validatePod = function() {
        if ( this.parsers.length == 0 ) throw "Pod must contain at least one parser";
        if ( this.getFieldsByName("price").length == 0 ) throw "Pod must contain a price field";
        if ( this.getFieldsByName("raw-query").length == 0 ) throw "Pod must contain a raw-query field";
        return true;
    };

    var triggerReady = function() {
        timingLog.add('pL', 'pdlLoadEnd');
        self.triggerEvent( new FreePriceAlerts.processing.PodReadyEvent(self) );
    }

    this.toString = function() { return 'Pod'+_propsToString(this, ['name', 'parsers', 'links', 'filters']) };

    if (!podXml)
    {
        throw "Missing POD XML";
    }
    else if (podXml.documentElement)
    {
        rawDOM = podXml;
    }
    else
    {
        if (window.DOMParser)
        {
            var xmlParser = new window.DOMParser();
            rawDOM = xmlParser.parseFromString(podXml,"text/xml");
        }
        else if (window.ActiveXObject)
        {
            rawDOM = new window.ActiveXObject("Microsoft.XMLDOM");
            rawDOM.async="false";
            rawDOM.loadXML(podXml);
        }
        else
        {
            throw "Failed to find parser to parse POD XML";
        }
    }

    this.document = rawDOM.documentElement;

    if ( !rawDOM || this.document.tagName != "pod" )
        throw "Invalid pod XML";

    i=this.document.childNodes.length;
    while ( i-- )
    {
        var t = this.document.childNodes[i],
            tn = t.tagName,
            v = t.textContent;

        if ( tn == "name" ) this.name = v;
        else if ( tn == "description" ) this.description = v;
        else if ( tn == "link" ) this.links.push( new FreePriceAlerts.processing.Link(this, t) );
        else if ( tn == "include" )
        {

          this.includesLoading++;

          var incl = new FreePriceAlerts.processing.Include(this, t);

          // Includes are asynchronous - put a placeholder in
          this.parsers.push( incl );
          this.filters.push( incl );

          FreePriceAlerts.console.log("Including Pod\nSource:  "+incl.src);

          incl.addEventListener(
            'IncludeReady',
            function(evnt)
            {
              var j;

              for(j=0; j<self.filters.length && self.filters[j] != incl; j++);
              self.filters.splice.apply( self.filters, [ j, 1 ].concat(incl.pod.filters) );

              for(j=0; j<self.parsers.length && self.parsers[j] != incl; j++);
              self.parsers.splice.apply( self.parsers, [ j, 1 ].concat(incl.pod.parsers) );

              FreePriceAlerts.console.log("Finished Including Pod\nSource:  "+incl.src+"\nParsers: "+incl.pod.parsers.length+"\nFilters: "+incl.pod.filters.length);

              if ( --self.includesLoading <= 0 ) triggerReady();
            }
          );

          incl.run();

          // this.parsers = this.parsers.concat( incl.pod.parsers );
          // this.filters = this.filters.concat( incl.pod.filters );
        }
        else if ( tn == "parser" ) this.parsers.push( new FreePriceAlerts.processing.Parser(this, t) );
        else if ( tn == "filter" ) this.filters.push( new FreePriceAlerts.processing.Filter(this, t) );
    }

    if ( this.includesLoading == 0 ) {
        timingLog.add('pw', 'pdlWaitStart');
        FreePriceAlerts.utils.callLater( function() { triggerReady(); } );
    }

    _logInitEnd(this);
}

FreePriceAlerts.processing.PodReadyEvent = function(pod)
{
    this.superclass = FreePriceAlerts.events.Event;
    this.superclass('PodReady');

    this.pod = pod;
}

FreePriceAlerts.processing.Link = function( parent, t )
{
    this.classname = 'Link';
    this.rel  = t.getAttribute("rel") || "";
    this.href = t.getAttribute("href") || "";
    this.title = t.getAttribute("title") || this.href;
    this.parent = parent;

    _logInitStart(this);
    this.toString = function() { return 'Link'+_propsToString(this, ['rel', 'href', 'title']) };
    _logInitEnd(this);
}

FreePriceAlerts.processing.Include = function( parentPod, t )
{
    this.superclass = FreePriceAlerts.events.Dispatcher;
    this.superclass();

    this.classname = 'Include';
    this.src  = t.getAttribute("src") || "";
    this.pod = null;
    this.parent = parentPod;
    var path = parentPod.path;

    _logInitStart(this);

    this.run = function()
    {
        timingLog.add('pf', 'pdlIncludeFetchStart');
        $.ajax({
          type: 'GET',
          url:  this.src,
          success: function(r,s,h){
            timingLog.add('pF', 'pdlIncludeFetchEnd');
            self.pod = new FreePriceAlerts.processing.Pod(r, undefined, this);
            self.triggerEvent( new FreePriceAlerts.processing.IncludeReadyEvent(self) );
          },
          dataType: "text"
        });

    }

    this.getFieldsByName = function(name) {
        return this.pod ? this.pod.getFieldsByName(name) : [];
    }

    this.getFieldById = function(id) {
        return this.pod ? this.pod.getFieldById(id) : null;
    }

    this.toString = function() { return 'Include'+_propsToString(this, ['src']) };

    if ( this.src )
    {
        var self = this;

        if ( path !== undefined && path )
        {
          if ( this.src[0] == '/' )
          {
            path = /^(?:[^:]+:\/\/[^\/]+)?/.exec(path)[0];
          }
          else
          {
            path = path.replace(/[^\/]+$/,'');
          }

          this.src = this.src.replace(/([^\/]+)\/\.\.\//g,function($0, $1){ return $1==".." ? $0 : '' });

          var l = this.src.length;
          this.src = this.src.replace(/^(\.\.\/)+/,'');
          var back = (l-this.src.length)/3;

          path = (new RegExp('((:?[^:]+:\/\/[^\/]+).+?)[^\/]*(?:\/[^\/]*){0,'+back+'}$')).exec(path)[1];

          this.src = path+this.src.replace(/^\.\//g,'');
        }
    }

    _logInitEnd(this);
}

FreePriceAlerts.processing.IncludeReadyEvent = function(incld)
{
    this.superclass = FreePriceAlerts.events.Event;
    this.superclass('IncludeReady');

    this.include = incld;
}

FreePriceAlerts.processing.Parser = function( parentPod, t )
{
    this.classname = 'Parser';
    this.id  = t.getAttribute("id") || "";
    this.conditions = [];
    this.fields = [];
    this.parent = parentPod;
    var thisWin;

    _logInitStart(this);

    this.testConditions = function( win )
    {
        var i=this.conditions.length;
        if ( i == 0 ) return true;

        while( i-- )
        {
          if(this.conditions[i].test( win )) return true;
        }
        return false;
    }

    this.getFieldsByName = function(n)
    {
        var i=this.fields.length;
        var f=[];
        while( i-- )
        {
          if(this.fields[i].name==n) f.push(this.fields[i]);
        }
        return f;
    }

    this.getFieldById = function(id)
    {
        var i=this.fields.length;
        while( i-- )
        {
          if(this.fields[i].id==id) return this.fields[i];
        }
        return null;
    }

    this.handleChange = function(win)
    {
        var i=this.fields.length;
        while( i-- )
        {
          this.fields[i].valueOf(win);
        }
    }

    this.toString = function() { return 'Parser'+_propsToString(this, ['id', 'conditions', 'fields']) };

    var i=t.childNodes.length;
    while ( i-- )
    {
        var c = t.childNodes[i],
            cn = c.tagName;

        if ( cn == "condition" )  this.conditions.push( new FreePriceAlerts.processing.Condition(this, c) );
        else if ( cn == "field" ) this.fields.push( new FreePriceAlerts.processing.Field(this, c) );
    }

    _logInitEnd(this);
}

FreePriceAlerts.processing.LogicContainer = function( parentObj, t )
{
    this.classname = 'LogicContainer';
    this.expressions = [];
    this.parent = parentObj;

    _logInitStart(this, 'LogicContainer('+t.tagName+')');

    this.childValueOf = function(win,context)
    {
        var r = null;
        var i=this.expressions.length;
        while ( i-- && (r=this.expressions[i].valueOf(win,context)) === null );
        return r;
    }

    this.invalidateTriggers = function()
    {
        var r;
        var i=this.expressions.length;
        while( i-- && (r=this.expressions[i].invalidateTriggers()) !== null );
    }

    this.handleChange = function(win)
    {
      this.parent.handleChange(win);
    }

    this.toString = function() { return 'LogicContainer('+t.tagName+')'+_propsToString(this, ['expressions']) };

    var i=t.childNodes.length;
    while ( i-- )
    {
        var c = t.childNodes[i],
            cn = c.tagName;

        if ( cn == "expression" )    this.expressions.push( new FreePriceAlerts.processing.Expression(this, c) );
        else if ( cn == "trigger" )  this.expressions.push( new FreePriceAlerts.processing.Trigger(this, c) );
    }
}

FreePriceAlerts.processing.Condition = function( parentExpression, t )
{
    this.superclass = FreePriceAlerts.processing.LogicContainer;
    this.superclass( parentExpression, t );

    this.classname = 'Condition';

    this.test = function( win )
    {
        var i=this.expressions.length;
        while( i-- )
        {
          if(!this.expressions[i].test( win )) return false;
        }
        return true;
    }

    this.toString = function() { return 'Condition'+_propsToString(this, ['expressions']) };

    _logInitEnd(this);
}

FreePriceAlerts.processing.Field = function( parentParser, t )
{
    this.classname = 'Field';
    this.name = t.getAttribute("name") || "";
    this.id = t.getAttribute("id") || "";
    this.limit = t.getAttribute("limit") || "unbounded";
    this.filters = [];

    this.superclass = FreePriceAlerts.events.Dispatcher;
    this.superclass();

    this.superclass = FreePriceAlerts.processing.LogicContainer;
    this.superclass( parentParser, t );

    var oldValue = null,
        firstRun = true,
        locked = false;

    this.valueOf = function( win, topLevel )
    {
        if ( locked )
        {
          throw "Circular reference";
        }
        locked = true;

        if ( topLevel === undefined ) topLevel = true;

        var i=this.expressions.length,
            v=null,
            f;

        FreePriceAlerts.console.logContext('pdl', _getIndent(this)+'+ valueOf: '+this.toString());

        while( i-- && v === null )
        {
          try {
            v = this.expressions[i].valueOf(win);
          } catch ( e ) {
            if ( topLevel ) FreePriceAlerts.console.log(e);
            else {
              locked = false;
              throw e;
            }
          }
        }

        if ( v )
        {
          var f;

          for ( i=0; i<this.filters.length; i++ )
          {
            if ( (f = this.parent.parent.getFiltersByName(this.filters[i])) && f.length > 0 )
              v = f[0].run(win,v);
          }

          if ( v )
          {
            v = FreePriceAlerts.processing.Filter.convertToString(v);
          }
        }

        var changed = oldValue != v;

        locked = false;

        FreePriceAlerts.console.logContext('pdl', _getIndent(this)+'- valueOf: '+this.toString()+
            ' => '+_toString(v)+' '+( firstRun ? '' : ( changed ? 'changed' : 'unchanged' ) ));

        if ( changed )
        {
          oldValue = v;

          if ( !firstRun )
          {
            this.triggerEvent( new FreePriceAlerts.processing.FieldChangedEvent(this) );
          }
        }

        firstRun = false;
        return v;
    };

    this.toString = function() { return 'Field'+_propsToString(this, ['name', 'id', 'limit', 'filters', 'expressions']) };

    if ( t.getAttribute("filter") )
        this.filters = t.getAttribute("filter").split(/\s+/);

    _logInitEnd(this);
}

FreePriceAlerts.processing.FieldChangedEvent = function(field)
{
    this.superclass = FreePriceAlerts.events.Event;
    this.superclass('FieldChanged');

    this.field = field;
}

FreePriceAlerts.processing.Expression = function( parentExpression, t )
{
    this.classname = 'Expression';
    this.type = t.getAttribute("type") || "constant";
    this.forContext = t.getAttribute("for") || ( t.parentNode.tagName == "expression" || t.parentNode.tagName == "filter" ? "result" : "document" );
    this.value = t.getAttribute("value") || "";
    this.index = parseInt(t.getAttribute("index"));
    this.length = parseInt(t.getAttribute("length"));
    this.markup = t.getAttribute("markup") || "none";

    this.superclass = FreePriceAlerts.processing.LogicContainer;
    this.superclass( parentExpression, t );

    var i;

    this.test = function( win )
    {
        return ( this.valueOf( win ) !== null );
    };

    this.valueOf = function( win, context )
    {
        var t=this, v, r,
            getStringTarget=function(){
              var m= t.markup == 'full';
              var o = null;

              if ( t.forContext == "uri" ) o = win.location.href;
              if ( t.forContext == "document" ) o = win.document.documentElement;
              if ( t.forContext == "result" && context !== undefined )
              {
                o = context;
              }
              if ( t.forContext == "result-document" && context !== undefined )
              {
                if ( context.tagName == "IFRAME" ) {
                  if ( context.contentDocument && context.contentDocument.documentElement )
                    o = context.contentDocument.documentElement;
                }
              }

              return o ? FreePriceAlerts.processing.Filter.convertToString(o,m) : "";
            },
            getDomTarget=function(){
              if ( t.forContext == "document" ) return win.document.documentElement;
              if ( t.forContext == "result" && context !== undefined && typeof(context) != "string" ) return context;
              if ( t.forContext == "result-document" && context !== undefined )
              {
                if ( context.tagName == "IFRAME" && context.contentDocument ) {
                  return context.contentDocument;
                }
              }

              return null;
            },
            useIndex=false;

        if (this.expressions.length > 0 || this.type == 'string')
          FreePriceAlerts.console.logContext('pdl', _getIndent(this)+'+ valueOf: '+this.toString());

        if ( this.type == "string" )
        {
          if ( !(v = getStringTarget()) ) return null;

          var self = this;
          var hasNull = false;

          r = this.value.replace(/{\$([^}]+)}/g,function(a,b)
          {
            if ( b == "result" ) return v;
            if ( b == "uri" ) return win.location.href;

            var p = self;
            var myField = null;
            while ( p = p.parent )
            {
              if ( p instanceof FreePriceAlerts.processing.Parser )
              {
                var flds = p.getFieldsByName(b);
                if ( flds.length > 0 )
                {
                  try
                  {
                    var f = flds[0].valueOf(win,false);
                    if ( f !== null ) return f;
                    else { hasNull = true; return ""; }
                  } catch ( e ) {
                    throw "Circular reference between `"+myField.name+"` and `"+flds[0].name+"`";
                  }

                }
              }
              else if ( p instanceof FreePriceAlerts.processing.Field )
              {
                myField = p;
              }
            }
            hasNull = true;
            return "";
          });

          if ( hasNull ) r = null;

        }

        else if ( this.type == "regexp" )
        {
          if ( !(v = getStringTarget()) ) return null;

          var re = FreePriceAlerts.utils.stringToRegexp(this.value);

          if ( re.replaceWith === undefined )
          {
            r = v.match(re);
            useIndex = true;
          }
          else
          {
            r = v.replace(re,re.replaceWith);
          }

          if ( r === undefined ) r = null;
        }

        else if ( this.type == "xpath" )
        {
          if ( !(v = getDomTarget()) ) return null;
          throw "Not yet implemented";
        }

        else if ( this.type == "css-selector" )
        {
          if ( !(v = getDomTarget()) ) return null;
          r = $(this.value,v);

          if ( r.length == 0 ) r=null;
          useIndex = true;
        }

        else if ( this.type == "attribute" )
        {
          if ( !(v = getDomTarget()) ) return null;
          r = $(v).attr(this.value);
        }

        else
        {
          throw "Invalid expression type";
        }

        if ( useIndex && r )
        {
          i = ( isNaN(this.index) ? 0 : this.index );
          if ( i < 0 ) r= i*-1 <= r.length ? r[r.length+i] : null;
          else r= i < r.length ? r[i] : null;
        }

        try {
          FreePriceAlerts.console.logContext('pdl', _getIndent(this)+'- valueOf: '+this.toString()+' => '+_toString(r));
        }
        catch(err) {
          FreePriceAlerts.console.logContext('error', FreePriceAlerts.utils.ErrorToString(err));
        }

        if ( r !== null )
        {
          if ( this.expressions.length > 0 )
            r = this.childValueOf(win,r);
          else
            r = FreePriceAlerts.processing.Filter.convertToString(r,this.markup == 'full');
        }

        return r;
    };

    this.toString = function() { return 'Expression'+_propsToString(this, ['type', 'value', 'forContext', 'index', 'length', 'markup', 'expressions']) };
    _logInitEnd(this);
}

FreePriceAlerts.processing.Trigger = function( parentExpression, t )
{
    this.classname = 'Trigger';
    this.type = t.getAttribute('type') || 'click';
    this.target = t.getAttribute('target') || '';
    this.independent = t.getAttribute('independent') == 'true' || false;
    this.hasTriggered = false;

    this.superclass = FreePriceAlerts.processing.LogicContainer;
    this.superclass( parentExpression, t );

    var bound = false,
        timer = null,
        self = this;

    this.invalidateTriggers = function(excludeSelf)
    {
        if ( !this.independent && (excludeSelf === undefined || !excludeSelf) )
        {
            this.hasTriggered = bound = false;
        }

        var r, i=this.expressions.length;
        while( i-- && (r=this.expressions[i].invalidateTriggers()) !== null );
    }

    this.valueOf = function( win, context )
    {
      if ( !bound )
      {
        bound = true;

        if ( this.type == "click" || this.type == "hover" )
        {
          $(this.target,win.document).click(function() {
            FreePriceAlerts.console.logContext('pdl', _getIndent(self)+'click trigger: '+self.toString());
            self.hasTriggered = true;
            self.invalidateTriggers(true);
            self.parent.handleChange(win);
          });
        }
        else if ( this.type == 'wait' )
        {
          timer = setInterval(function()
          {
            if ( !win || !win.document ) { clearInterval(timer); return; }

            var v=null;
            if ( v = self.childValueOf( win, context ) )
            {
              clearInterval(timer);
              FreePriceAlerts.console.logContext('pdl', _getIndent(self)+'wait trigger: '+self.toString());
              self.hasTriggered = true;
              self.invalidateTriggers(true);
              self.parent.handleChange(win);
            }
          }, parseInt(this.target));
        }
      }

      return ( this.hasTriggered ? this.childValueOf( win, context ) : null );
    }

    this.toString = function() { return 'Trigger'+_propsToString(this, ['type', 'target', 'expressions']) };
    _logInitEnd(this);
}

FreePriceAlerts.processing.Filter = function( parent, content )
{
    this.classname = 'Filter';
    this.name = "";
    this.parent = parent;

    _logInitStart(this);

    this.run = function( win, obj )
    {
      return this.func(win,obj);
    }

    if ( typeof(content) == 'function' )
    {
        this.func = content;
    }
    else
    {
        this.name = content.getAttribute("name") || "";

        this.superclass = FreePriceAlerts.processing.LogicContainer;
        this.superclass( parent, content );
        var self = this;

        this.func = function(win,obj)
        {
          return self.childValueOf(win,obj);
        }
    }

    this.toString = function() { return 'Filter'+_propsToString(this, ['name', 'expressions']) };
    _logInitEnd(this);
}

FreePriceAlerts.processing.Filter.filters = {};

FreePriceAlerts.processing.Filter.convertToString = function( obj, markup )
{
    if ( markup === undefined ) markup = false;

    if ( typeof(obj) == "string" )
        return obj;

    if ( obj.innerHTML )
        return obj[ markup ? 'innerHTML' : 'textContent' ];

    if ( typeof(obj.text) == "function" )
        return obj.text();

    return null;
}

FreePriceAlerts.processing.Filter.getGlobalFilter = function( name )
{
  return FreePriceAlerts.processing.Filter.filters[name];
}

FreePriceAlerts.processing.Filter.addGlobalFilter = function( name, fn )
{
    var f = new FreePriceAlerts.processing.Filter( null, fn );
    if ( name && !f.name ) f.name = name;
    FreePriceAlerts.processing.Filter.filters[f.name] = f;
}

// Add some global filters

FreePriceAlerts.processing.Filter.addGlobalFilter('trim',function(win,str) {
    if ( str = FreePriceAlerts.processing.Filter.convertToString(str) )
        return str.replace(/^\s+|\s+$/g,'');
    else
        return null
});

FreePriceAlerts.processing.Filter.addGlobalFilter('collapse-whitespace',function(win,str) {
    if( str = FreePriceAlerts.processing.Filter.convertToString(str) )
        return str.replace(/[\s]+/g,' ');
    else
        return null
});


})();

