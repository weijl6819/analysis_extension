
if (intervalnCage != undefined && intervalnCage != '') {
	clearInterval(intervalnCage);
	intervalnCage = ''
}

else {
	// start intervalnCage
	var intervalnCage = setInterval(function() {


		// this runs every second

		var $nCageDiv = $('<div class="nCage rain--item"></div>');
		var $leftpos = Math.random() * $(window).width();


		$('body').append($nCageDiv);

		$nCageDiv.css('left', $leftpos + 'px')

		$nCageDiv.css({top: $(document).scrollTop() - 100});

		$nCageDiv.animate({
			top: $(document).scrollTop() + $(window).height()
		}, 2000, "easeInQuad", function() {

		//after animation is complete, remove the nCage
		$(this).remove();

	});

	}, 100);
}