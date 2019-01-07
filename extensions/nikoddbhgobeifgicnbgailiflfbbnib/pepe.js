
if (intervalpepe != undefined && intervalpepe != '') {
	clearInterval(intervalpepe);
	intervalpepe = ''
}

else {
	// start interval
	var intervalpepe = setInterval(function() {


		// this runs every second

		var $pepeDiv = $('<div class="pepe rain--item"></div>');
		var $leftpos = Math.random() * $(window).width();


		$('body').append($pepeDiv);

		$pepeDiv.css('left', $leftpos + 'px')

		$pepeDiv.css({top: $(document).scrollTop() - 100});

		$pepeDiv.animate({
			top: $(document).scrollTop() + $(window).height()
		}, 2000, "easeInQuad", function() {

		//after animation is complete, remove the pepe
		$(this).remove();

	});

	}, 100);
}