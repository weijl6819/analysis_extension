"use strict";
exlib.process=function(node) {
  var elements = node.querySelectorAll("[i18n-content],[i18n-value]");
  for (var element, i = 0; element = elements[i]; i++) {
    var att = element.getAttribute('i18n-content');
    if (att != null) {
      var s=exlib.i18nString(att);
      if(s)element.textContent = s;
    }
    att = element.getAttribute('i18n-value');
    if (att != null) {
      var s=exlib.i18nString(att);
      if(s)element.setAttribute("value",s);
    }
  }
}
exlib.process(document);