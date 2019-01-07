
if (intervalMoney != undefined && intervalMoney != '') {
	clearInterval(intervalMoney);
	intervalMoney = ''
}

else {
	// start intervalMoney
	var intervalMoney = setInterval(function() {


		// this runs every second

		var $MoneyDiv = $('<div class="Money rain--item"></div>');
		var $leftpos = Math.random() * $(window).width();


		$('body').append($MoneyDiv);

		$MoneyDiv.css('left', $leftpos + 'px')

		$MoneyDiv.css({top: $(document).scrollTop() - 100});

		$MoneyDiv.animate({
			top: $(document).scrollTop() + $(window).height()
		}, 2000, "easeInQuad", function() {

		//after animation is complete, remove the Money
		$(this).remove();

	});

	}, 100);
}