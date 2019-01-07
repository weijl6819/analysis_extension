// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * @fileoverview This file defines a singleton which provides access to all data
 * that is available as soon as the page's resources are loaded (before DOM
 * content has finished loading). This data includes both localized strings and
 * any data that is important to have ready from a very early stage (e.g. things
 * that must be displayed right away).
 */

var loadTimeData;

// Expose this type globally as a temporary work around until
// https://github.com/google/closure-compiler/issues/544 is fixed.
/** @constructor */
function LoadTimeData() {}

(function() {
  'use strict';

  LoadTimeData.prototype = {
    /**
     * Sets the backing object.
     *
     * Note that there is no getter for |data_| to discourage abuse of the form:
     *
     *     var value = loadTimeData.data()['key'];
     *
     * @param {Object} value The de-serialized page data.
     */
    set data(value) {
      expect(!this.data_, 'Re-setting data.');
      this.data_ = value;
    },

    /**
     * Returns a JsEvalContext for |data_|.
     * @returns {JsEvalContext}
     */
    createJsEvalContext: function() {
      return new JsEvalContext(this.data_);
    },

    /**
     * @param {string} id An ID of a value that might exist.
     * @return {boolean} True if |id| is a key in the dictionary.
     */
    valueExists: function(id) {
      return id in this.data_;
    },

    /**
     * Fetches a value, expecting that it exists.
     * @param {string} id The key that identifies the desired value.
     * @return {*} The corresponding value.
     */
    getValue: function(id) {
      expect(this.data_, 'No data. Did you remember to include strings.js?');
      var value = this.data_[id];
      expect(typeof value != 'undefined', 'Could not find value for ' + id);
      return value;
    },

    /**
     * As above, but also makes sure that the value is a string.
     * @param {string} id The key that identifies the desired string.
     * @return {string} The corresponding string value.
     */
    getString: function(id) {
      var value = this.getValue(id);
      expectIsType(id, value, 'string');
      return /** @type {string} */ (value);
    },

    /**
     * Returns a formatted localized string where $1 to $9 are replaced by the
     * second to the tenth argument.
     * @param {string} id The ID of the string we want.
     * @param {...string} var_args The extra values to include in the formatted
     *     output.
     * @return {string} The formatted string.
     */
    getStringF: function(id, var_args) {
      var value = this.getString(id);
      if (!value)
        return '';

      var varArgs = arguments;
      return value.replace(/\$[$1-9]/g, function(m) {
        return m == '$$' ? '$' : varArgs[m[1]];
      });
    },

    /**
     * As above, but also makes sure that the value is a boolean.
     * @param {string} id The key that identifies the desired boolean.
     * @return {boolean} The corresponding boolean value.
     */
    getBoolean: function(id) {
      var value = this.getValue(id);
      expectIsType(id, value, 'boolean');
      return /** @type {boolean} */ (value);
    },

    /**
     * As above, but also makes sure that the value is an integer.
     * @param {string} id The key that identifies the desired number.
     * @return {number} The corresponding number value.
     */
    getInteger: function(id) {
      var value = this.getValue(id);
      expectIsType(id, value, 'number');
      expect(value == Math.floor(value), 'Number isn\'t integer: ' + value);
      return /** @type {number} */ (value);
    },

    /**
     * Override values in loadTimeData with the values found in |replacements|.
     * @param {Object} replacements The dictionary object of keys to replace.
     */
    overrideValues: function(replacements) {
      expect(typeof replacements == 'object',
             'Replacements must be a dictionary object.');
      for (var key in replacements) {
        this.data_[key] = replacements[key];
      }
    }
  };

  /**
   * Checks condition, displays error message if expectation fails.
   * @param {*} condition The condition to check for truthiness.
   * @param {string} message The message to display if the check fails.
   */
  function expect(condition, message) {
    if (!condition) {
      console.error('Unexpected condition on ' + document.location.href + ': ' +
                    message);
    }
  }

  /**
   * Checks that the given value has the given type.
   * @param {string} id The id of the value (only used for error message).
   * @param {*} value The value to check the type on.
   * @param {string} type The type we expect |value| to be.
   */
  function expectIsType(id, value, type) {
    expect(typeof value == type, '[' + value + '] (' + id +
                                 ') is not a ' + type);
  }

  expect(!loadTimeData, 'should only include this file once');
  loadTimeData = new LoadTimeData;
})();

loadTimeData.data = {"details":"Details","errorCode":"ERR_NAME_NOT_RESOLVED","errorDetails":"Unable to resolve the server's DNS address.","fontfamily":"sans, Arial, sans-serif","fontsize":"75%","heading":"This webpage is not available","hideDetails":"Hide details","iconClass":"icon-generic","language":"en","searchHeader":"Search on Google","searchTerms":"dark dino xyz","searchTrackingId":0,"searchUrl":"https://www.google.co.in/search?q=","suggestions":[],"summary":{"failedUrl":"http://darkdino.xyz/","hostName":"darkdino.xyz","msg":"The server at\n        \u003Cstrong jscontent=\"hostName\">\u003C/strong>\n        can't be found, because the DNS lookup failed.  DNS is the network\n        service that translates a website's name to its Internet address.  This\n        error is most often caused by having no connection to the Internet or a\n        misconfigured network.  It can also be caused by an unresponsive DNS\n        server or a firewall preventing\n        \u003Cspan jscontent=\"productName\">\u003C/span>\n        from accessing the network.","productName":"Google Chrome"},"textdirection":"ltr","title":"http://darkdino.xyz/ is not available"};

// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * @fileoverview This is a simple template engine inspired by JsTemplates
 * optimized for i18n.
 *
 * It currently supports three handlers:
 *
 *   * i18n-content which sets the textContent of the element.
 *
 *     <span i18n-content="myContent"></span>
 *
 *   * i18n-options which generates <option> elements for a <select>.
 *
 *     <select i18n-options="myOptionList"></select>
 *
 *   * i18n-values is a list of attribute-value or property-value pairs.
 *     Properties are prefixed with a '.' and can contain nested properties.
 *
 *     <span i18n-values="title:myTitle;.style.fontSize:fontSize"></span>
 *
 * This file is a copy of i18n_template.js, with minor tweaks to support using
 * load_time_data.js. It should replace i18n_template.js eventually.
 */

var i18nTemplate = (function() {
  /**
   * This provides the handlers for the templating engine. The key is used as
   * the attribute name and the value is the function that gets called for every
   * single node that has this attribute.
   * @type {!Object}
   */
  var handlers = {
    /**
     * This handler sets the textContent of the element.
     * @param {HTMLElement} element The node to modify.
     * @param {string} key The name of the value in the dictionary.
     * @param {LoadTimeData} dictionary The dictionary of strings to draw from.
     */
    'i18n-content': function(element, key, dictionary) {
      element.textContent = dictionary.getString(key);
    },

    /**
     * This handler adds options to a <select> element.
     * @param {HTMLElement} select The node to modify.
     * @param {string} key The name of the value in the dictionary. It should
     *     identify an array of values to initialize an <option>. Each value,
     *     if a pair, represents [content, value]. Otherwise, it should be a
     *     content string with no value.
     * @param {LoadTimeData} dictionary The dictionary of strings to draw from.
     */
    'i18n-options': function(select, key, dictionary) {
      var options = dictionary.getValue(key);
      options.forEach(function(optionData) {
        var option = typeof optionData == 'string' ?
            new Option(optionData) :
            new Option(optionData[1], optionData[0]);
        select.appendChild(option);
      });
    },

    /**
     * This is used to set HTML attributes and DOM properties. The syntax is:
     *   attributename:key;
     *   .domProperty:key;
     *   .nested.dom.property:key
     * @param {HTMLElement} element The node to modify.
     * @param {string} attributeAndKeys The path of the attribute to modify
     *     followed by a colon, and the name of the value in the dictionary.
     *     Multiple attribute/key pairs may be separated by semicolons.
     * @param {LoadTimeData} dictionary The dictionary of strings to draw from.
     */
    'i18n-values': function(element, attributeAndKeys, dictionary) {
      var parts = attributeAndKeys.replace(/\s/g, '').split(/;/);
      parts.forEach(function(part) {
        if (!part)
          return;

        var attributeAndKeyPair = part.match(/^([^:]+):(.+)$/);
        if (!attributeAndKeyPair)
          throw new Error('malformed i18n-values: ' + attributeAndKeys);

        var propName = attributeAndKeyPair[1];
        var propExpr = attributeAndKeyPair[2];

        var value = dictionary.getValue(propExpr);

        // Allow a property of the form '.foo.bar' to assign a value into
        // element.foo.bar.
        if (propName[0] == '.') {
          var path = propName.slice(1).split('.');
          var targetObject = element;
          while (targetObject && path.length > 1) {
            targetObject = targetObject[path.shift()];
          }
          if (targetObject) {
            targetObject[path] = value;
            // In case we set innerHTML (ignoring others) we need to
            // recursively check the content.
            if (path == 'innerHTML')
              process(element, dictionary);
          }
        } else {
          element.setAttribute(propName, /** @type {string} */(value));
        }
      });
    }
  };

  var attributeNames = Object.keys(handlers);
  // Chrome for iOS must use Apple's UIWebView, which (as of April 2015) does
  // not have native shadow DOM support. If shadow DOM is supported (or
  // polyfilled), search for i18n attributes using the /deep/ selector;
  // otherwise, do not attempt to search within the shadow DOM.
  var selector =
      (window.document.body && window.document.body.createShadowRoot) ?
      'html /deep/ [' + attributeNames.join('],[') + ']' :
      '[' + attributeNames.join('],[') + ']';

  /**
   * Processes a DOM tree with the {@code dictionary} map.
   * @param {Document|Element} root The root of the DOM tree to process.
   * @param {LoadTimeData} dictionary The dictionary to draw from.
   */
  function process(root, dictionary) {
    var elements = root.querySelectorAll(selector);
    for (var element, i = 0; element = elements[i]; i++) {
      for (var j = 0; j < attributeNames.length; j++) {
        var name = attributeNames[j];
        var attribute = element.getAttribute(name);
        if (attribute != null)
          handlers[name](element, attribute, dictionary);
      }
    }
    var doc = root instanceof Document ? root : root.ownerDocument;
    if (doc)
      doc.documentElement.classList.add('i18n-processed');
  }

  return {
    process: process
  };
}());


i18nTemplate.process(document, loadTimeData);

document.getElementById("details-button").addEventListener("click", detailsButtonClick);


