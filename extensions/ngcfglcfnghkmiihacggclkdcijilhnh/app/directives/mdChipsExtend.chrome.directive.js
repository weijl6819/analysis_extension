
/** @see https://github.com/angular/material/issues/3364 */
(function () {

  /* @ngInject */
  function mdChips()
  {
    return {
      restrict: 'E',
      require: 'mdChips', // Extends the original mdChips directive
      link: function ( scope, element, attributes, mdChipsCtrl )
      {
        mdChipsCtrl.onInputBlur = function ( event )
        {
          this.inputHasFocus = false;

          var chipBuffer = this.getChipBuffer();

          // If we have an autocomplete, and it handled the event, we have nothing to do
          if( this.hasAutocomplete && event.isDefaultPrevented && event.isDefaultPrevented() )
          {
            return;
          }
          event.preventDefault();

          if( (this.hasAutocomplete && this.requireMatch) || !chipBuffer ) return;

          // Only append the chip and reset the chip buffer if the max chips limit isn't reached.
          if( this.hasMaxChipsReached() ) return;

          this.appendChip( chipBuffer.trim() );
          this.resetChipBuffer();
        };
      }
    };
  }

  angular.module('clipto')
    .directive( 'mdChips', mdChips );

}());


