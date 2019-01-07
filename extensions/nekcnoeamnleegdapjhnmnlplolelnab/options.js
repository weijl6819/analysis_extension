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
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(8);


/***/ },

/***/ 8:
/***/ function(module, exports) {

	var OptionsView, localize;
	
	localize = function(key) {
	  return chrome.i18n.getMessage(key);
	};
	
	OptionsView = (function() {
	  function OptionsView() {
	    $((function(_this) {
	      return function() {
	        return _this.initialize();
	      };
	    })(this));
	  }
	
	  OptionsView.prototype.initialize = function() {
	    this.ui = {
	      dropdowns: $(".js_dropdown"),
	      togglers: $(".js_toggler"),
	      addTag: $(".js_add_tag"),
	      tag: $(".js_tag"),
	      sort: $(".js_sort"),
	      order: $(".js_order")
	    };
	    this.i18n = {
	      texts: $("[data-text]"),
	      placeholders: $("[data-placeholder]"),
	      titles: $("[data-title]")
	    };
	    this.localize();
	    this.bindEvents();
	    return this.getSettings();
	  };
	
	  OptionsView.prototype.localize = function() {
	    this.i18n.texts.each(function() {
	      return this.innerText = localize(this.dataset.text);
	    });
	    this.i18n.placeholders.each(function() {
	      return this.placeholder = localize(this.dataset.placeholder);
	    });
	    return this.i18n.titles.each(function() {
	      return this.title = localize(this.dataset.title);
	    });
	  };
	
	  OptionsView.prototype.bindEvents = function() {
	    $(document).on("click", ".js_save_btn", this.setSettings.bind(this)).on("click", ".js_cancel_btn", this.closeWindow).on("change", ".js_add_tag", this.disableTag.bind(this)).on("click", ".js_toggler", this.togglerToggle.bind(this));
	    return $(".js_dropdown").on("click", ".js_dropdown_toggle", this.dropdownToggle.bind(this)).on("click", "[data-value]", this.dropdownSet.bind(this));
	  };
	
	  OptionsView.prototype.get = function(property, defaults) {
	    return localStorage[property] || defaults;
	  };
	
	  OptionsView.prototype.set = function(property, value) {
	    return localStorage[property] = value;
	  };
	
	  OptionsView.prototype.closeWindow = function() {
	    return setTimeout(function() {
	      return window.close();
	    }, 150);
	  };
	
	  OptionsView.prototype.dropdownToggle = function(event) {
	    var $dropdown, isOpen;
	    $dropdown = $(event.delegateTarget);
	    $dropdown.toggleClass("dropdown_open");
	    isOpen = $dropdown.hasClass("dropdown_open");
	    if (isOpen) {
	      return $(document).one("mousedown", function(event) {
	        if (!$(event.target).closest($dropdown).length) {
	          return $dropdown.removeClass("dropdown_open");
	        }
	      });
	    }
	  };
	
	  OptionsView.prototype.togglersInit = function() {
	    var self;
	    self = this;
	    return this.ui.togglers.each(function() {
	      this.dataset.state = this.dataset.value === this.dataset.on;
	      return self.togglerUpdate(this);
	    });
	  };
	
	  OptionsView.prototype.togglerToggle = function(event) {
	    var data, toggler;
	    toggler = event.currentTarget;
	    data = toggler.dataset;
	    data.state = data.state !== "true";
	    return this.togglerUpdate(toggler);
	  };
	
	  OptionsView.prototype.togglerUpdate = function(toggler) {
	    var data, isOn, state;
	    data = toggler.dataset;
	    isOn = data.state === "true";
	    state = isOn ? "on" : "off";
	    data.value = data[state];
	    toggler.title = localize(data[state + "Title"]);
	    toggler.classList.toggle("toggler_on", isOn);
	    return toggler.classList.toggle("toggler_off", !isOn);
	  };
	
	  OptionsView.prototype.dropdownsInit = function() {
	    return this.ui.dropdowns.each(function() {
	      var $dropdown, $item, $toggle, value;
	      $dropdown = $(this);
	      $toggle = $dropdown.find(".js_dropdown_toggle");
	      value = $dropdown.data('value');
	      $item = $dropdown.find("[data-value=" + value + "]");
	      $item.addClass("dropdown__item_active").siblings().removeClass("dropdown__item_active");
	      return $toggle.text($item.text());
	    });
	  };
	
	  OptionsView.prototype.dropdownSet = function(event) {
	    var $dropdown, $item, $toggle;
	    $dropdown = $(event.delegateTarget);
	    $toggle = $dropdown.find(".js_dropdown_toggle");
	    $item = $(event.currentTarget);
	    $item.addClass("dropdown__item_active").siblings().removeClass("dropdown__item_active");
	    $toggle.text($item.text());
	    return $dropdown.data('value', $item.data('value')).removeClass("dropdown_open");
	  };
	
	  OptionsView.prototype.setSettings = function() {
	    this.set("AddTag", this.ui.addTag[0].checked);
	    this.set("Tag", this.ui.tag.val());
	    this.set("Sort", this.ui.sort.data('value'));
	    this.set("Order", this.ui.order[0].dataset.value);
	    return this.closeWindow();
	  };
	
	  OptionsView.prototype.getSettings = function() {
	    var settings;
	    settings = {
	      addTag: this.get("AddTag") === "true",
	      tag: this.get("Tag", 'DVDRip'),
	      sort: this.get("Sort", 4),
	      order: this.get("Order", 2)
	    };
	    this.ui.addTag[0].checked = settings.addTag;
	    this.ui.tag.val(settings.tag);
	    this.ui.sort.data('value', settings.sort);
	    this.ui.order[0].dataset.value = settings.order;
	    this.disableTag();
	    this.dropdownsInit();
	    return this.togglersInit();
	  };
	
	  OptionsView.prototype.disableTag = function() {
	    return this.ui.tag[0].disabled = !this.ui.addTag[0].checked;
	  };
	
	  return OptionsView;
	
	})();
	
	module.exports = new OptionsView();


/***/ }

/******/ });
//# sourceMappingURL=options.js.map