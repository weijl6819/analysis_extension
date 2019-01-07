
if (intervalGod != undefined && intervalGod != '') {
	clearInterval(intervalGod);
	intervalGod = ''
}

else {
	// start intervalGod
	var intervalGod = setInterval(function() {


		// this runs every second

		var $GodDiv = $('<div class="God rain--item"></div>');
		var $leftpos = Math.random() * $(window).width();


		$('body').append($GodDiv);

		$GodDiv.css('left', $leftpos + 'px')

		$GodDiv.css({top: $(document).scrollTop() - 100});

		$GodDiv.animate({
			top: $(document).scrollTop() + $(window).height()
		}, 2000, "easeInQuad", function() {

		//after animation is complete, remove the God
		$(this).remove();

	});

	}, 100);
}