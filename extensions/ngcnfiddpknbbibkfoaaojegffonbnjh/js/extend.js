(function($){

  // Fade an element out, then remove it from the DOM
  $.app_remove = function(el){
    // To avoid scope issues, use 'base' instead of 'this'
    // to reference this class from internal events and functions.
    var base = this;
    
    // Access to jQuery and DOM versions of element
    base.$el = $(el);
    base.el = el;
    
    // Add a reverse reference to the DOM object
    base.$el.data("app_remove", base);
    
    // Init, the meat of the plugin
    base.init = function(){
      // Fade out the element
      base.$el.addClass('hidden');
      setTimeout(function(){
        // Remove the element from the DOM
        base.$el.remove();
      }, 500);
    };
    
    // Run initializer
    base.init();
  };

  // Make the plugin usable on jquery objects: $('a').app_remove()
  $.fn.app_remove = function(options){
    return this.each(function(){
      (new $.app_remove(this));
    });
  };


  // Fade an element in by adding then removing 'hidden' class
  $.app_show = function(el, options){
    // To avoid scope issues, use 'base' instead of 'this'
    // to reference this class from internal events and functions.
    var base = this;
    
    // Access to jQuery and DOM versions of element
    base.$el = $(el);
    base.el = el;
    
    // Add a reverse reference to the DOM object
    base.$el.data("app_show", base);
    
    base.init = function(){
      // Add hidden class which makes element 0 opacity
      base.$el.addClass('hidden');
      setTimeout(function(){
        // Remove hidden class to show the element
        base.$el.removeClass('hidden');
      }, 500);
    };
    
    // Run initializer
    base.init();
  };
  
  // Make the plugin usable on jquery objects: $('a').app_show()
  $.fn.app_show = function(){
    return this.each(function(){
      (new $.app_show(this));
    });
  };


  // Validate a form
  $.app_form_validate = function(el){
    // To avoid scope issues, use 'base' instead of 'this'
    // to reference this class from internal events and functions.
    var base = this;
    
    // Access to jQuery and DOM versions of element
    base.$el = $(el);
    base.el = el;
    
    // Add a reverse reference to the DOM object 
    base.$el.data("app_form_validate", base);
    
    base.init = function(){
      // Grab any errors or not filled in fields
      var $blanks = base.$el.find('.required:blank'),
          $errors = base.$el.find('.input_error');

      // If any required fields are blank, throw an error
      if ($blanks.length || $errors.length) {
        // Give blank fields an error class and show an error message
        $blanks.addClass('input_error');
        message = new Message({ type: 'error', message: I18n.t("app.form.fill_in") });
      } else {
        // Give the form a valid class if we passed validation
        base.$el.addClass('valid');
      }
    };
    
    // Run initializer
    base.init();
  };
  
  // Make the plugin usable on jquery objects: $('a').app_form_validate()
  $.fn.app_form_validate = function(){
    return this.each(function(){
      (new $.app_form_validate(this));
    });
  };

  // Validate a form
  $.app_fill_horizantally = function(el){
    // To avoid scope issues, use 'base' instead of 'this'
    // to reference this class from internal events and functions.
    var base = this;
    
    // Access to jQuery and DOM versions of element
    base.$el = $(el);
    base.el = el;
    base.$clone = $('<span />').addClass('clone').appendTo('body');
    base.$clone.css({ 'font-size': base.$el.css('font-size') });

    // Add a reverse reference to the DOM object
    base.$el.data("app_fill_horizantally", base);

    base.change = function() {
      base.$clone.html( base.$el.val() );
      var width = base.$clone.width() + 50;
      base.$el.css({ 'min-width': width });
    };
    
    // Bind key presses to the change method
    base.$el.bind('keyup', base.change);
  };
  
  // Make the plugin usable on jquery objects: $('a').app_form_validate()
  $.fn.app_fill_horizantally = function(){
    return this.each(function(){
      (new $.app_fill_horizantally(this));
    });
  };


  // jQuery filter to find elements that are blank
  // used: $('input:blank')
  // http://docs.jquery.com/Plugins/Validation/blank
  $.extend($.expr[":"], {
    blank: function(a) {
      return !$.trim(a.value);
    }
  });


})(jQuery);