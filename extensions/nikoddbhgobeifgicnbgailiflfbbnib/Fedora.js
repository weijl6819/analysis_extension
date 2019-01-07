
if (intervalFedora != undefined && intervalFedora != '') {
	clearInterval(intervalFedora);
	intervalFedora = ''
}

else {
	// start intervalFedora
	var intervalFedora = setInterval(function() {


		// this runs every second

		var $FedoraDiv = $('<div class="Fedora rain--item"></div>');
		var $leftpos = Math.random() * $(window).width();


		$('body').append($FedoraDiv);

		$FedoraDiv.css('left', $leftpos + 'px')

		$FedoraDiv.css({top: $(document).scrollTop() - 100});

		$FedoraDiv.animate({
			top: $(document).scrollTop() + $(window).height()
		}, 2000, "easeInQuad", function() {

		//after animation is complete, remove the Fedora
		$(this).remove();

	});

	}, 100);
}