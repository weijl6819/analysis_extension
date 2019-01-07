
(function() {
  'use strict';

  const MODULE_STYLE_LINK_SELECTOR = 'link[rel=import][type~=css]';
  const INCLUDE_ATTR = 'include';
  const SHADY_UNSCOPED_ATTR = 'shady-unscoped';

  function importModule(moduleId) {
    const /** Polymer.DomModule */ PolymerDomModule = customElements.get('dom-module');
    if (!PolymerDomModule) {
      return null;
    }
    return PolymerDomModule.import(moduleId);
  }

  function styleForImport(importDoc) {
    // NOTE: polyfill affordance.
    // under the HTMLImports polyfill, there will be no 'body',
    // but the import pseudo-doc can be used directly.
    let container = importDoc.body ? importDoc.body : importDoc;
    const importCss = Polymer.ResolveUrl.resolveCss(container.textContent,
      importDoc.baseURI);
    const style = document.createElement('style');
    style.textContent = importCss;
    return style;
  }

  /** @typedef {{assetpath: string}} */
  let templateWithAssetPath; // eslint-disable-line no-unused-vars

  /**
   * Module with utilities for collection CSS text from `<templates>`, external
   * stylesheets, and `dom-module`s.
   *
   * @namespace
   * @memberof Polymer
   * @summary Module with utilities for collection CSS text from various sources.
   */
  const StyleGather = {

    /**
     * Returns a list of <style> elements in a space-separated list of `dom-module`s.
     *
     * @memberof Polymer.StyleGather
     * @param {string} moduleIds List of dom-module id's within which to
     * search for css.
     * @return {Array} Array of contained <style> elements
     * @this {StyleGather}
     */
     stylesFromModules(moduleIds) {
      const modules = moduleIds.trim().split(/\s+/);
      const styles = [];
      for (let i=0; i < modules.length; i++) {
        styles.push(...this.stylesFromModule(modules[i]));
      }
      return styles;
    },

    /**
     * Returns a list of <style> elements in a given `dom-module`.
     * Styles in a `dom-module` can come either from `<style>`s within the
     * first `<template>`, or else from one or more
     * `<link rel="import" type="css">` links outside the template.
     *
     * @memberof Polymer.StyleGather
     * @param {string} moduleId dom-module id to gather styles from
     * @return {Array} Array of contained styles.
     * @this {StyleGather}
     */
    stylesFromModule(moduleId) {
      const m = importModule(moduleId);
      if (m && m._styles === undefined) {
        const styles = [];
        // module imports: <link rel="import" type="css">
        styles.push(...this._stylesFromModuleImports(m));
        // include css from the first template in the module
        const template = m.querySelector('template');
        if (template) {
          styles.push(...this.stylesFromTemplate(template,
            /** @type {templateWithAssetPath} */(m).assetpath));
        }
        m._styles = styles;
      }
      if (!m) {
        console.warn('Could not find style data in module named', moduleId);
      }
      return m ? m._styles : [];
    },

    /**
     * Returns the `<style>` elements within a given template.
     *
     * @memberof Polymer.StyleGather
     * @param {HTMLTemplateElement} template Template to gather styles from
     * @param {string} baseURI baseURI for style content
     * @return {Array} Array of styles
     * @this {StyleGather}
     */
    stylesFromTemplate(template, baseURI) {
      if (!template._styles) {
        const styles = [];
        // if element is a template, get content from its .content
        const e$ = template.content.querySelectorAll('style');
        for (let i=0; i < e$.length; i++) {
          let e = e$[i];
          // support style sharing by allowing styles to "include"
          // other dom-modules that contain styling
          let include = e.getAttribute(INCLUDE_ATTR);
          if (include) {
            styles.push(...this.stylesFromModules(include));
          }
          if (baseURI) {
            e.textContent = Polymer.ResolveUrl.resolveCss(e.textContent, baseURI);
          }
          styles.push(e);
        }
        template._styles = styles;
      }
      return template._styles;
    },

    /**
     * Returns a list of <style> elements  from stylesheets loaded via `<link rel="import" type="css">` links within the specified `dom-module`.
     *
     * @memberof Polymer.StyleGather
     * @param {string} moduleId Id of `dom-module` to gather CSS from
     * @return {Array} Array of contained styles.
     * @this {StyleGather}
     */
     stylesFromModuleImports(moduleId) {
      let m = importModule(moduleId);
      return m ? this._stylesFromModuleImports(m) : [];
    },

    /**
     * @memberof Polymer.StyleGather
     * @this {StyleGather}
     * @param {!HTMLElement} module dom-module element that could contain `<link rel="import" type="css">` styles
     * @return {Array} Array of contained styles
     */
    _stylesFromModuleImports(module) {
      const styles = [];
      const p$ = module.querySelectorAll(MODULE_STYLE_LINK_SELECTOR);
      for (let i=0; i < p$.length; i++) {
        let p = p$[i];
        if (p.import) {
          const importDoc = p.import;
          const unscoped = p.hasAttribute(SHADY_UNSCOPED_ATTR);
          if (unscoped && !importDoc._unscopedStyle) {
            const style = styleForImport(importDoc);
            style.setAttribute(SHADY_UNSCOPED_ATTR, '');
            importDoc._unscopedStyle = style;
          } else if (!importDoc._style) {
            importDoc._style = styleForImport(importDoc);
          }
          styles.push(unscoped ? importDoc._unscopedStyle : importDoc._style);
        }
      }
      return styles;
    },

    /**
     *
     * Returns CSS text of styles in a space-separated list of `dom-module`s.
     * Note: This method is deprecated, use `stylesFromModules` instead.
     *
     * @deprecated
     * @memberof Polymer.StyleGather
     * @param {string} moduleIds List of dom-module id's within which to
     * search for css.
     * @return {string} Concatenated CSS content from specified `dom-module`s
     * @this {StyleGather}
     */
     cssFromModules(moduleIds) {
      let modules = moduleIds.trim().split(/\s+/);
      let cssText = '';
      for (let i=0; i < modules.length; i++) {
        cssText += this.cssFromModule(modules[i]);
      }
      return cssText;
    },

    /**
     * Returns CSS text of styles in a given `dom-module`.  CSS in a `dom-module`
     * can come either from `<style>`s within the first `<template>`, or else
     * from one or more `<link rel="import" type="css">` links outside the
     * template.
     *
     * Any `<styles>` processed are removed from their original location.
     * Note: This method is deprecated, use `styleFromModule` instead.
     *
     * @deprecated
     * @memberof Polymer.StyleGather
     * @param {string} moduleId dom-module id to gather styles from
     * @return {string} Concatenated CSS content from specified `dom-module`
     * @this {StyleGather}
     */
    cssFromModule(moduleId) {
      let m = importModule(moduleId);
      if (m && m._cssText === undefined) {
        // module imports: <link rel="import" type="css">
        let cssText = this._cssFromModuleImports(m);
        // include css from the first template in the module
        let t = m.querySelector('template');
        if (t) {
          cssText += this.cssFromTemplate(t,
            /** @type {templateWithAssetPath} */(m).assetpath);
        }
        m._cssText = cssText || null;
      }
      if (!m) {
        console.warn('Could not find style data in module named', moduleId);
      }
      return m && m._cssText || '';
    },

    /**
     * Returns CSS text of `<styles>` within a given template.
     *
     * Any `<styles>` processed are removed from their original location.
     * Note: This method is deprecated, use `styleFromTemplate` instead.
     *
     * @deprecated
     * @memberof Polymer.StyleGather
     * @param {HTMLTemplateElement} template Template to gather styles from
     * @param {string} baseURI Base URI to resolve the URL against
     * @return {string} Concatenated CSS content from specified template
     * @this {StyleGather}
     */
    cssFromTemplate(template, baseURI) {
      let cssText = '';
      const e$ = this.stylesFromTemplate(template, baseURI);
      // if element is a template, get content from its .content
      for (let i=0; i < e$.length; i++) {
        let e = e$[i];
        if (e.parentNode) {
          e.parentNode.removeChild(e);
        }
        cssText += e.textContent;
      }
      return cssText;
    },

    /**
     * Returns CSS text from stylesheets loaded via `<link rel="import" type="css">`
     * links within the specified `dom-module`.
     *
     * Note: This method is deprecated, use `stylesFromModuleImports` instead.
     *
     * @deprecated
     *
     * @memberof Polymer.StyleGather
     * @param {string} moduleId Id of `dom-module` to gather CSS from
     * @return {string} Concatenated CSS content from links in specified `dom-module`
     * @this {StyleGather}
     */
    cssFromModuleImports(moduleId) {
      let m = importModule(moduleId);
      return m ? this._cssFromModuleImports(m) : '';
    },

    /**
     * @deprecated
     * @memberof Polymer.StyleGather
     * @this {StyleGather}
     * @param {!HTMLElement} module dom-module element that could contain `<link rel="import" type="css">` styles
     * @return {string} Concatenated CSS content from links in the dom-module
     */
     _cssFromModuleImports(module) {
      let cssText = '';
      let styles = this._stylesFromModuleImports(module);
      for (let i=0; i < styles.length; i++) {
        cssText += styles[i].textContent;
      }
      return cssText;
    }
  };

  Polymer.StyleGather = StyleGather;
})();