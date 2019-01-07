/**
 * PageResize
 * http://stackoverflow.com/questions/10100540/chrome-extension-inject-sidebar-into-page
 *
 * @param width
 * @constructor
 */

var _cl_pageResize = {

  _paneWidth: '300px',

  getHtml: function() {
    var html;

    if (document.documentElement) {
      html = document.documentElement;
    } else if (document.getElementsByTagName('html') && document.getElementsByTagName('html')[0]) {
      html = document.getElementsByTagName('html')[0];
    } else return; //if no html tag found, return

    //position
    if (getComputedStyle(html).position === 'static') {
      html.style.position = 'relative';
    }

    return html;
  },
  shrinkPage: function() {
    var html = _cl_pageResize.getHtml();
    var currentWidth = getComputedStyle(html).width;
    html.style.width = parseFloat(currentWidth) - parseFloat(_cl_pageResize._paneWidth) + 'px';
  },

  expandPage: function() {
    var html = _cl_pageResize.getHtml();
    var currentWidth = getComputedStyle(html).width;
    html.style.width = parseFloat(currentWidth) + parseFloat(_cl_pageResize._paneWidth) + 'px';
  }

};