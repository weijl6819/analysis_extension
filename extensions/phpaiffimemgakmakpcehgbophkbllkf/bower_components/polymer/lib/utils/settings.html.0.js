
/** @suppress {deprecated} */
(function() {
  'use strict';

  /**
   * Legacy settings.
   * @namespace
   * @memberof Polymer
   */
  const settings = Polymer.Settings || {};
  settings.useShadow = !(window.ShadyDOM);
  settings.useNativeCSSProperties =
    Boolean(!window.ShadyCSS || window.ShadyCSS.nativeCss);
  settings.useNativeCustomElements =
    !(window.customElements.polyfillWrapFlushCallback);

  /**
   * Sets the global, legacy settings.
   *
   * @deprecated
   * @memberof Polymer
   */
  Polymer.Settings = settings;

  /**
   * Globally settable property that is automatically assigned to
   * `Polymer.ElementMixin` instances, useful for binding in templates to
   * make URL's relative to an application's root.  Defaults to the main
   * document URL, but can be overridden by users.  It may be useful to set
   * `Polymer.rootPath` to provide a stable application mount path when
   * using client side routing.
   *
   * @memberof Polymer
   */
  let rootPath = Polymer.rootPath ||
    Polymer.ResolveUrl.pathFromUrl(document.baseURI || window.location.href);

  Polymer.rootPath = rootPath;

  /**
   * Sets the global rootPath property used by `Polymer.ElementMixin` and
   * available via `Polymer.rootPath`.
   *
   * @memberof Polymer
   * @param {string} path The new root path
   * @return {void}
   */
  Polymer.setRootPath = function(path) {
    Polymer.rootPath = path;
  };

  /**
   * A global callback used to sanitize any value before inserting it into the DOM. The callback signature is:
   *
   *     Polymer = {
   *       sanitizeDOMValue: function(value, name, type, node) { ... }
   *     }
   *
   * Where:
   *
   * `value` is the value to sanitize.
   * `name` is the name of an attribute or property (for example, href).
   * `type` indicates where the value is being inserted: one of property, attribute, or text.
   * `node` is the node where the value is being inserted.
   *
   * @type {(function(*,string,string,Node):*)|undefined}
   * @memberof Polymer
   */
  let sanitizeDOMValue = Polymer.sanitizeDOMValue;

  // This is needed for tooling
  Polymer.sanitizeDOMValue = sanitizeDOMValue;

  /**
   * Sets the global sanitizeDOMValue available via `Polymer.sanitizeDOMValue`.
   *
   * @memberof Polymer
   * @param {(function(*,string,string,Node):*)|undefined} newSanitizeDOMValue the global sanitizeDOMValue callback
   * @return {void}
   */
  Polymer.setSanitizeDOMValue = function(newSanitizeDOMValue) {
    Polymer.sanitizeDOMValue = newSanitizeDOMValue;
  };

  /**
   * Globally settable property to make Polymer Gestures use passive TouchEvent listeners when recognizing gestures.
   * When set to `true`, gestures made from touch will not be able to prevent scrolling, allowing for smoother
   * scrolling performance.
   * Defaults to `false` for backwards compatibility.
   *
   * @memberof Polymer
   */
  let passiveTouchGestures = false;

  Polymer.passiveTouchGestures = passiveTouchGestures;

  /**
   * Sets `passiveTouchGestures` globally for all elements using Polymer Gestures.
   *
   * @memberof Polymer
   * @param {boolean} usePassive enable or disable passive touch gestures globally
   * @return {void}
   */
  Polymer.setPassiveTouchGestures = function(usePassive) {
    Polymer.passiveTouchGestures = usePassive;
  };
})();