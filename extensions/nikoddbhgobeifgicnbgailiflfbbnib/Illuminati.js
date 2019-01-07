
if (intervalIlluminati != undefined && intervalIlluminati != '') {
	clearInterval(intervalIlluminati);
	intervalIlluminati = ''
}

else {
	// start intervalIlluminati
	var intervalIlluminati = setInterval(function() {


		// this runs every second

		var $IlluminatiDiv = $('<div class="Illuminati rain--item"></div>');
		var $leftpos = Math.random() * $(window).width();


		$('body').append($IlluminatiDiv);

		$IlluminatiDiv.css('left', $leftpos + 'px')

		$IlluminatiDiv.css({top: $(document).scrollTop() - 100});

		$IlluminatiDiv.animate({
			top: $(document).scrollTop() + $(window).height()
		}, 2000, "easeInQuad", function() {

		//after animation is complete, remove the Illuminati
		$(this).remove();

	});

	}, 100);
}