var artistJson = "";

function loadArtistsOffer() {
    $.getJSON('/json/movie.json', function(json) {
        artistJson = json;
        loadOffers();

    });
}


function shuffle(sourceArray) {
    for (var n = 0; n < sourceArray.length - 1; n++) {
        var k = n + Math.floor(Math.random() * (sourceArray.length - n));

        var temp = sourceArray[k];
        sourceArray[k] = sourceArray[n];
        sourceArray[n] = temp;
    }
    return sourceArray;
}
function loadOffers() {
    var artists = shuffle(artistJson.Movie);
    var artistsSize = 50;
    if(artists.length < 50){
        artistsSize = artists.length ;
    }
   $(".top_sites").empty();
    for(var i = 0; i < 8 ; i++){
        var artist = artists[i];
         var img = "";
            img = artist.Image;

        var url =  artist.Link+"?ap=1";

        var li = '<li title="Play trailer" class="li_big li_music" data-artist="' + url+ '" style="background-image: url('+img+');">'+
            '<a  class="site-url" target="_blank"   href="' + url + '" date-description ="' + artist.Title + '">' + artist.Title+
            ' </a></li>';
        $(".top_sites").append(li);
    }
	
    $('.li_music , .featured-artist-block').click(function () {
        var artist = $(this).attr('data-artist');
        gaReport("click","artist");
        loadOffer(artist);
    })

	var artist = artists[9],
		img = artist.Image;
    var url =  artist.Link+"?ap=1";

		
	$('.f-artist-image').css('background-image','url('+img+')');
	$('.f-artist-song').html(artist.Title).attr('title',artist.Title);
	$('.featured-artist-block').attr('data-artist',url)
}

function loadOffer(artist) {
    if(!(artist)) {
        gifObj = getGif();
        artist = gifObj.Link;
    }
    var w = 616;
    var h = 468;
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    artist = artist+"?ap=1";
    chrome.windows.create({
        url: artist,
        type: "panel",
        'width': w,
        'height': h,
        'left': left,
        'top': top,
    }, function(newWindow) {
    });
}

function getGifId() {

    gifId = Math.floor((Math.random() * artistJson.Movie.length - 1) + 1); //

    return gifId;
}
function getGif() {

    var r = getGifId();
    return artistJson.Movie[r];
}