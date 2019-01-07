
    Polymer({
      is: 'app-header-layout',

      behaviors: [
        Polymer.AppLayoutBehavior
      ],

      properties: {
        /**
         * If true, the current element will have its own scrolling region.
         * Otherwise, it will use the document scroll to control the header.
         */
        hasScrollingRegion: {
          type: Boolean,
          value: false,
          reflectToAttribute: true
        }
      },

      observers: [
        'resetLayout(isAttached, hasScrollingRegion)'
      ],

      /**
       * A reference to the app-header element.
       *
       * @property header
       */
      get header() {
        return Polymer.dom(this.$.headerSlot).getDistributedNodes()[0];
      },

      _updateLayoutStates: function() {
        var header = this.header;
        if (!this.isAttached || !header) {
          return;
        }
        // Remove the initializing class, which staticly positions the header and the content
        // until the height of the header can be read.
        this.$.wrapper.classList.remove('initializing');
        // Update scroll target.
        header.scrollTarget = this.hasScrollingRegion ?
            this.$.contentContainer : this.ownerDocument.documentElement;
        // Get header height here so that style reads are batched together before style writes
        // (i.e. getBoundingClientRect() below).
        var headerHeight = header.offsetHeight;
        // Update the header position.
        if (!this.hasScrollingRegion) {
          requestAnimationFrame(function() {
            var rect = this.getBoundingClientRect();
            var rightOffset = document.documentElement.clientWidth - rect.right;
            header.style.left = rect.left + 'px';
            header.style.right = rightOffset + 'px';
          }.bind(this));
        } else {
          header.style.left = '';
          header.style.right = '';
        }
        // Update the content container position.
        var containerStyle = this.$.contentContainer.style;
        if (header.fixed && !header.condenses && this.hasScrollingRegion) {
          // If the header size does not change and we're using a scrolling region, exclude
          // the header area from the scrolling region so that the header doesn't overlap
          // the scrollbar.
          containerStyle.marginTop = headerHeight + 'px';
          containerStyle.paddingTop = '';
        } else {
          containerStyle.paddingTop = headerHeight + 'px';
          containerStyle.marginTop = '';
        }
      }

    });
  