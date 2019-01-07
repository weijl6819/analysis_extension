var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote'], ['link'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];

var advancedEditor = new Quill('#bubble-container', {
	modules: {
	    toolbar: toolbarOptions
	},
    placeholder: 'Start writing...',
    theme: 'bubble'
});


$('body').on('click', '#content-container a', function(e) {
	window.location.href = $(this).attr("href");
});

var firstClick = false;

$('#content-container').on('click', function() {
	if(firstClick == false) {
		firstClick = true;
		var labelInterface = "white-sheet";
		handleInterfaceClicks(labelInterface);
	}	
	if($('.ql-tooltip').hasClass('.ql-hidden') == true) {
		advancedEditor.focus();
	}
});

function renderSaveToDrive() {      
	var source = $(".ql-editor").html();
	content = [];
	ParseHtml(content, source);
	pdfMake.createPdf({
		pageMargins: [ 100, 100, 100, 100 ],
		content: content
	}).open();
	
}

$('#render-link').click(function(e) {
	renderSaveToDrive();
	var labelInterface = "transform-pdf";
	handleInterfaceClicks(labelInterface);
});



chrome.storage.largeSync.get(["tabText"], function(tabText){
	if(tabText["tabText"] != undefined) {
    	advancedEditor.setContents(tabText["tabText"]);
    } else {
		advancedEditor.pasteHTML(0, 'Hey there ✌️<br><br>I\'m your new <b>notepad</b>!<br>Every time you\'ll open a new tab, I\'ll be there.<br><br>All <b>the links you see above ☝️ are customizable</b>, so do whatever you want, the world is yours 🌐<br><br>Plus, you can check the <b>weather forecast</b> there 👉<br>And of course, you can change the <b>background color</b> by clicking on the little 💻<br><br>Oh and, I almost forgot: Your notes will be <b>synchronized on all your devices</b> using Chrome.<br><br>Enjoy 👍');
    }
});

document.addEventListener('visibilitychange', function(){
    chrome.storage.largeSync.get(["tabText"], function(items){
	    advancedEditor.setContents(items["tabText"]);
	});
});

window.addEventListener('focus', function() {
    chrome.storage.largeSync.get(["tabText"], function(items){
	    advancedEditor.setContents(items["tabText"]);
	});
});

var timer;
var ms = 200; // milliseconds

advancedEditor.on('text-change', function(delta, source) {
  clearTimeout(timer);
  timer = setTimeout(function() {
	  var sourceDelta;
	  if (source === 'api') {
	    return;
	  }
	  sourceDelta = advancedEditor.getContents();
	  chrome.storage.largeSync.set({ "tabText": sourceDelta }, function(){});
  }, ms);   
});

var color=['almost','passion','blue','reef','inbox','dirtyfog','seablizz','littleleaf','clearsky','violet','deeppurple','black','deepspace','shrimpy','haikus','orange','pink'];

$('.change-background').mousedown(function() {
	chrome.storage.sync.get(["tabTextColorId5"], function(colorId){
		if(colorId["tabTextColorId5"] != undefined) {
			var colorNum = colorId["tabTextColorId5"] + 1;
			var lengthColorArray = color.length - 1;
			if(colorNum > lengthColorArray) {
				colorNum = 0;
			}
			$('html').attr('id', color[colorNum]);
			chrome.storage.sync.set({ "tabTextColorId5": colorNum }, function(){});
		} else {
			var colorNum = 0;
			$('html').attr('id', color[colorNum]);
			chrome.storage.sync.set({ "tabTextColorId5": colorNum }, function(){});
		}
	});
	var labelInterface = "change-background";
	handleInterfaceClicks(labelInterface);
});

	


// WEATHER

/* Does your browser support geolocation? */
if ("geolocation" in navigator) {
  $('.weather-container').show(); 
} else {
  $('.weather-container').hide();
}

$(document).ready(function() {
	
	$('.tracklink').click(function(e) {
		e.preventDefault();
		var urlredirect = $(this).attr("href");
		handleOutboundLinkClicks(urlredirect);
	});
	
	$('.tip').tipr();	
	
	$('body').on('click', '.local', function(e) {
		e.preventDefault();
		chrome.tabs.update({ url: $(this).attr("href") });
	});
	
	chrome.storage.sync.get(["minimalist"], function(minimalist){
		if(minimalist["minimalist"] != undefined) {
			if(minimalist["minimalist"] == true) {
				$('html').attr('id', 'minimalist');
				$('.deactivate-minimalism').show();
				$('.activate-minimalism').hide();
				$('.change-background').hide();
			}
			else {
				chrome.storage.sync.get(["tabTextColorId5"], function(colorId){			
					if(colorId["tabTextColorId5"] != undefined) {
						var colorNum = colorId["tabTextColorId5"];
						$('html').attr('id', color[colorNum]);
					} else {
						chrome.storage.sync.set({ "tabTextColorId5": 16 }, function(){});
						$('html').attr('id', color[16]);
					}
				});
			}
		} else {
			chrome.storage.sync.set({ "minimalist": false }, function(){});
			chrome.storage.sync.get(["tabTextColorId5"], function(colorId){
				if(colorId["tabTextColorId5"] != undefined) {
					var colorNum = colorId["tabTextColorId5"];
					$('html').attr('id', color[colorNum]);
				} else {
					chrome.storage.sync.set({ "tabTextColorId5": 16 }, function(){});
					$('html').attr('id', color[16]);
				}
			});
		}
	});

	$('.deactivate-minimalism').on('click', function(e) {
		$(this).hide();
		$('.activate-minimalism').show();
		$('.change-background').show();
		chrome.storage.sync.set({ "minimalist": false }, function(){});
		var labelInterface = "deactivate-minimalism";
		handleInterfaceClicks(labelInterface);
		
		chrome.storage.sync.get(["tabTextColorId5"], function(colorId){
			if(colorId["tabTextColorId5"] != undefined) {
				var colorNum = colorId["tabTextColorId5"];
				$('html').attr('id', color[colorNum]);
			} else {
				var colorNum = 0;
				$('html').attr('id', color[colorNum]);
			}
		});
	});
	
	$('.activate-minimalism').on('click', function(e) {
		$(this).hide();
		$('html').attr('id', 'minimalist');
		$('.deactivate-minimalism').show();
		$('.change-background').hide();
		chrome.storage.sync.set({ "minimalist": true }, function(){});
		var labelInterface = "activate-minimalism";
		handleInterfaceClicks(labelInterface);
	});
	
	chrome.storage.sync.get(["showLinks"], function(showLinks){
		if(showLinks["showLinks"] != undefined) {
			if(showLinks["showLinks"] == false) {
				$('.hide-links').hide();
				$('.links-href').hide();
				$('.show-links').show();
			}
			if(showLinks["showLinks"] == true) {
				$('.show-links').hide();
				$('.links-href').show();
				$('.hide-links').show();
			}
		} else {
			chrome.storage.sync.set({ "showLinks": true }, function(){});
			$('.show-links').hide();
			$('.links-href').show();
			$('.hide-links').show();
		}
	});
	
	
	chrome.storage.sync.get(["customLinks"], function(customLinks){
		if(customLinks["customLinks"] != undefined) {
			$.each( customLinks["customLinks"], function( key, urlname ) {
				urlnamearr = urlname.split('##');
				$('.prepend-link').before('<div class="link-span custom" data-linkid="'+key+'"><a href="'+urlnamearr[0]+'" class="local tracklink">'+urlnamearr[1]+'</a>  <span class="remove" style="display:none">x</span><br><span class="input-link" style="display:none"><input type="text" class="URL" value="'+urlnamearr[0]+'" placeholder="URL"><br><input type="text"  class="Name" value="'+urlnamearr[1]+'" placeholder="Name"></span></div>');
			});
		} else {
			var obj = { 
				1: "chrome-search://local-ntp/local-ntp.html##Chrome New Tab", 
				2: "chrome://apps/##Chrome Apps", 
				3: "http://mail.google.com/##Gmail", 
				4: "https://www.youtube.com/##Youtube", 
				5: "https://www.facebook.com/##Facebook",
				6: "https://www.wikipedia.org/##Wikipedia" 
			};
			chrome.storage.sync.set({ "customLinks": obj }, function(){});
			$.each( obj, function( key, urlname ) {
				urlnamearr = urlname.split('##');
				$('.prepend-link').before('<div class="link-span custom" data-linkid="'+key+'"><a href="'+urlnamearr[0]+'" class="local tracklink">'+urlnamearr[1]+'</a>  <span class="remove" style="display:none">x</span><br><span class="input-link" style="display:none"><input type="text" class="URL" value="'+urlnamearr[0]+'" placeholder="URL"><br><input type="text"  class="Name" value="'+urlnamearr[1]+'" placeholder="Name"></span></div>');
			});
		}
	});
	
	$('.hide-links').on('click', function(e) {
		$(this).hide();
		$('.links-href').hide();
		$('.show-links').show();
		chrome.storage.sync.set({ "showLinks": false }, function(){});
		var labelInterface = "hide-links";
		handleInterfaceClicks(labelInterface);
	});
	
	$('.show-links').on('click', function(e) {
		$(this).hide();
		$('.links-href').show();
		$('.hide-links').show();
		chrome.storage.sync.set({ "showLinks": true }, function(){});
		var labelInterface = "show-links";
		handleInterfaceClicks(labelInterface);
	});
	
	$('.configure-links').on('click', function(e) {
		$(this).hide();
		$('.end-configure-links').show(200);
		$('.link-span .add-link').show(200);
		$('.link-span .remove').show(200);
		$('.link-span .input-link').show(200);
		var labelInterface = "configure-links";
		handleInterfaceClicks(labelInterface);
	});
	
	$('.end-configure-links').on('click', function(e) {
		$(this).hide();
		$('.configure-links').show(200);
		$('.link-span .add-link').hide(200);
		$('.link-span .remove').hide(200);
		$('.link-span .input-link').hide(200);
		var labelInterface = "end-configure-links";
		handleInterfaceClicks(labelInterface);
	});
	
	$('body').on('click', '.link-span .remove', function() {
		var linkid = $(this).parent().attr("data-linkid");
		$(this).parent().remove();		
		chrome.storage.sync.get(["customLinks"], function(customLinks){
			if(customLinks["customLinks"] != undefined) {
				var obj = customLinks["customLinks"];
				delete obj[linkid];
				chrome.storage.sync.set({ "customLinks": obj }, function(){});
			}
		});		
		var labelInterface = "remove-link";
		handleInterfaceClicks(labelInterface);
	});
	
	$('.link-span .add-link').on('click', function() {
		var numLink = Math.floor(Math.random() * 26) + Date.now();
		$('.prepend-link').before('<div class="link-span custom" data-linkid="'+numLink+'"><a href="" class="local tracklink"></a>  <span class="remove">x</span><br><span class="input-link"><input type="text" class="URL" value="" placeholder="URL"><br><input type="text"  class="Name" value="" placeholder="Name"></span></div>');
		var labelInterface = "add-link";
		handleInterfaceClicks(labelInterface);
	});
	
	$('body').on('keyup', '.link-span input', function() {
		var linkid = $(this).parent().parent().attr("data-linkid");
		var newName = $(this).parent().find('.Name').val();
		var newURL = $(this).parent().find('.URL').val();
		if ($(this).hasClass('Name')) {
			$(this).parent().parent().find('a').text($(this).val());
		} else if ($(this).hasClass('URL')) {
			$(this).parent().parent().find('a').attr("href", $(this).val());
		}
		chrome.storage.sync.get(["customLinks"], function(customLinks){
			if(customLinks["customLinks"] != undefined) {
				var obj = customLinks["customLinks"];
				obj[linkid] = newURL+"##"+newName;
				chrome.storage.sync.set({ "customLinks": obj }, function(){});
			}
		});
	});
	
	chrome.storage.sync.get(["tabTextTemp"], function(items){
		chrome.storage.sync.get(["tabTextUnit"], function(units){
			if(units["tabTextUnit"] != undefined) {
		    	if(units["tabTextUnit"] == 'celsius') {
					html = '<h2 title="click to change unit"><span class="celsius"><i class="icon-'+items["tabTextTemp"].code+'"></i> '+items["tabTextTemp"].temp+'&deg;'+items["tabTextTemp"].units.temp+'</span><span class="farenheit" style="display:none"><i class="icon-'+items["tabTextTemp"].code+'"></i> '+items["tabTextTemp"].alt.temp+'&deg;'+items["tabTextTemp"].alt.unit+'</span></h2>';
				} else {
					html = '<h2 title="click to change unit"><span class="farenheit"><i class="icon-'+items["tabTextTemp"].code+'"></i> '+items["tabTextTemp"].temp+'&deg;'+items["tabTextTemp"].units.temp+'</span><span class="celsius" style="display:none"><i class="icon-'+items["tabTextTemp"].code+'"></i> '+items["tabTextTemp"].alt.temp+'&deg;'+items["tabTextTemp"].alt.unit+'</span></h2>';
				}
				$("#weather").html(html);
			}
		});
	});
  
  var geoOptions = {
  	maximumAge: 100 * 60 * 1000,
  }
  navigator.geolocation.getCurrentPosition(function(position) {
    loadWeather(position.coords.latitude+','+position.coords.longitude); //load weather using your lat/lng coordinates
  }, function(position) {
	$('.weather-container').hide();
  }, geoOptions);
  
  $("#weather").on('click', function(event) {
	  chrome.storage.sync.get(["tabTextUnit"], function(items){
		  if(items["tabTextUnit"] == 'celsius') {
			  $("#weather").find('.celsius').hide();
			  $("#weather").find('.farenheit').show();
			  chrome.storage.sync.set({ "tabTextUnit": 'farenheit' }, function(){});
	      } else {
		      $("#weather").find('.celsius').show();
			  $("#weather").find('.farenheit').hide();
			  chrome.storage.sync.set({ "tabTextUnit": 'celsius' }, function(){});
	      }
	  });
	  var labelInterface = "weather";
	  handleInterfaceClicks(labelInterface);
  });
});

function loadWeather(location, woeid) {
    chrome.storage.sync.get(["tabTextUnit"], function(items){
	    if(items["tabTextUnit"] != undefined) {
		    if(items["tabTextUnit"] == 'celsius') {
			  	$.simpleWeather({
				    location: location,
				    woeid: woeid,
				    unit: 'c',
				    success: function(weather) {
					  chrome.storage.sync.set({ "tabTextTemp": weather }, function(){});   
				      html = '<h2 title="click to change unit"><span class="celsius"><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</span><span class="farenheit" style="display:none"><i class="icon-'+weather.code+'"></i> '+weather.alt.temp+'&deg;'+weather.alt.unit+'</span></h2>';
				      $("#weather").html(html);
				    },
				    error: function(error) {
				      $("#weather").html('<p>'+error+'</p>');
				    }
				});
			} else {
				$.simpleWeather({
				    location: location,
				    woeid: woeid,
				    unit: 'f',
				    success: function(weather) {
					  chrome.storage.sync.set({ "tabTextTemp": weather }, function(){});   
				      html = '<h2 title="click to change unit"><span class="farenheit"><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</span><span class="celsius" style="display:none"><i class="icon-'+weather.code+'"></i> '+weather.alt.temp+'&deg;'+weather.alt.unit+'</span></h2>';
				      $("#weather").html(html);
				    },
				    error: function(error) {
				      $("#weather").html('<p>'+error+'</p>');
				    }
				});
			}
		} else {
			chrome.storage.sync.set({ "tabTextUnit": 'celsius' }, function(){});
			$.simpleWeather({
			    location: location,
			    woeid: woeid,
			    unit: 'c',
			    success: function(weather) {
				  chrome.storage.sync.set({ "tabTextTemp": weather }, function(){});   
			      html = '<h2 title="click to change unit"><span class="celsius"><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</span><span class="farenheit" style="display:none"><i class="icon-'+weather.code+'"></i> '+weather.alt.temp+'&deg;'+weather.alt.unit+'</span></h2>';
			      $("#weather").html(html);
			    },
			    error: function(error) {
			      $("#weather").html('<p>'+error+'</p>');
			    }
			});
		}
    });
}