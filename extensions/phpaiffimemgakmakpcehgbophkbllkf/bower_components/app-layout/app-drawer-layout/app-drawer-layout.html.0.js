
    Polymer({
      is: 'app-drawer-layout',

      behaviors: [
        Polymer.AppLayoutBehavior
      ],

      properties: {
        /**
         * If true, ignore `responsiveWidth` setting and force the narrow layout.
         */
        forceNarrow: {
          type: Boolean,
          value: false
        },

        /**
         * If the viewport's width is smaller than this value, the panel will change to narrow
         * layout. In the mode the drawer will be closed.
         */
        responsiveWidth: {
          type: String,
          value: '640px'
        },

        /**
         * Returns true if it is in narrow layout. This is useful if you need to show/hide
         * elements based on the layout.
         */
        narrow: {
          type: Boolean,
          reflectToAttribute: true,
          readOnly: true,
          notify: true
        },

        /**
         * If true, the drawer will initially be opened when in narrow layout mode.
         */
        openedWhenNarrow: {
          type: Boolean,
          value: false
        },

        _drawerPosition: {
          type: String
        }
      },

      listeners: {
        'click': '_clickHandler'
      },

      observers: [
        '_narrowChanged(narrow)'
      ],

      /**
       * A reference to the app-drawer element.
       *
       * @property drawer
       */
      get drawer() {
        return Polymer.dom(this.$.drawerSlot).getDistributedNodes()[0];
      },

      attached: function() {
        // Disable drawer transitions until after app-drawer-layout sets the initial opened state.
        var drawer = this.drawer;
        if (drawer) {
          drawer.setAttribute('no-transition', '');
        }
      },

      _clickHandler: function(e) {
        var target = Polymer.dom(e).localTarget;
        if (target && target.hasAttribute('drawer-toggle')) {
          var drawer = this.drawer;
          if (drawer && !drawer.persistent) {
            drawer.toggle();
          }
        }
      },

      _updateLayoutStates: function() {
        var drawer = this.drawer;
        if (!this.isAttached || !drawer) {
          return;
        }

        this._drawerPosition = this.narrow ? null : drawer.position;
        if (this._drawerNeedsReset) {
          if (this.narrow) {
            drawer.opened = this.openedWhenNarrow;
            drawer.persistent = false;
          } else {
            drawer.opened = drawer.persistent = true;
          }
          if (drawer.hasAttribute('no-transition')) {
            // Enable drawer transitions after app-drawer-layout sets the initial opened state.
            Polymer.RenderStatus.afterNextRender(this, function() {
              drawer.removeAttribute('no-transition');
            });
          }
          this._drawerNeedsReset = false;
        }
      },

      _narrowChanged: function() {
        this._drawerNeedsReset = true;
        this.resetLayout();
      },

      _onQueryMatchesChanged: function(event) {
        this._setNarrow(event.detail.value);
      },

      _computeMediaQuery: function(forceNarrow, responsiveWidth) {
        return forceNarrow ? '(min-width: 0px)' : '(max-width: ' + responsiveWidth + ')';
      }
    });
  