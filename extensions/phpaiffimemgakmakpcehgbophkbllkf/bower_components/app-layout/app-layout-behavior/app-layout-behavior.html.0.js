

  /**
   * @polymerBehavior Polymer.AppLayoutBehavior
   **/
  Polymer.AppLayoutBehavior = [
    Polymer.IronResizableBehavior, {

    listeners: {
      'app-reset-layout': '_appResetLayoutHandler',
      'iron-resize': 'resetLayout'
    },

    attached: function() {
      this.fire('app-reset-layout');
    },

    _appResetLayoutHandler: function(e) {
      if (Polymer.dom(e).path[0] === this) {
        return;
      }
      this.resetLayout();
      e.stopPropagation();
    },

    _updateLayoutStates: function() {
      console.error('unimplemented');
    },

    /**
     * Resets the layout. If you changed the size of this element via CSS
     * you can notify the changes by either firing the `iron-resize` event
     * or calling `resetLayout` directly.
     *
     * @method resetLayout
     */
    resetLayout: function() {
      // Polymer v2.x
      var self = this;
      var cb = this._updateLayoutStates.bind(this);
      if (Polymer.Async && Polymer.Async.animationFrame) {
        this._layoutDebouncer = Polymer.Debouncer.debounce(
            this._layoutDebouncer,
            Polymer.Async.animationFrame,
            cb);
        Polymer.enqueueDebouncer(this._layoutDebouncer);
      }
      // Polymer v1.x
      else {
        this.debounce('resetLayout', cb);
      }
      this._notifyDescendantResize();
    },

    _notifyLayoutChanged: function() {
      var self = this;
      // TODO: the event `app-reset-layout` can be fired synchronously
      // as long as `_updateLayoutStates` waits for all the microtasks after rAF.
      // E.g. requestAnimationFrame(setTimeOut())
      requestAnimationFrame(function() {
        self.fire('app-reset-layout');
      });
    },

    _notifyDescendantResize: function() {
      if (!this.isAttached) {
        return;
      }
      this._interestedResizables.forEach(function(resizable) {
        if (this.resizerShouldNotify(resizable)) {
          this._notifyDescendant(resizable);
        }
      }, this);
    }
  }];

