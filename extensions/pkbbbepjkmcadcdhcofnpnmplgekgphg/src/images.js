const _ = require('lodash');
const ImageResize = require('./image_resize');
const theme_config = require('../theme_config.json');

const image_resize = new ImageResize();

class Images
{
	/**
	 * Display the background images random or the selected favorites
	 */
	backgroundImage()
	{
		clearTimeout(this.currTimeout);
		if(localStorage.getItem('all')==0 && localStorage.getItem('chosen') && JSON.parse(localStorage.getItem('chosen')).length>0){
			let chosen = JSON.parse(localStorage.getItem('chosen'));
			let index = Math.floor(Math.random() * chosen.length);

			let image_path = chosen[index];
			$('<img class="background" id="background-wallpaper" src="' + image_path + '"/>').on('load', function() {
				$('#background-wallpaper').replaceWith(this);
				image_resize.resizeDOMImageObject(window, this);
			});
		}
		else
		{

			let index = Math.floor(Math.random() * theme_config['image_count']);

			index = _.padStart(index, 2, '0');
			let image_path = '/images/wallpaper/wall_' + index + '.jpg';
			$('<img class="background" id="background-wallpaper" src="' + image_path + '"/>').on('load', function() {
				$('#background-wallpaper').replaceWith(this);
				image_resize.resizeDOMImageObject(window, this);
			});
		}
		this.startInterval();
	}

	/**
	 * Display all background images in settings background section
	 */
	displayAll()
	{
		if(localStorage.getItem('all')==0 && localStorage.getItem('chosen') && JSON.parse(localStorage.getItem('chosen')).length>0){
		}else{
			document.getElementById('filter_images').src = chrome.extension.getURL('/images/toggle-switch-off.svg');
			document.getElementById('imagesOn').innerHTML = 'Off';
		}
		let outer_div = document.getElementById("backgrounds");
		for(let i=0; i < theme_config['image_count']; i++)
		{
			let inner_div = document.createElement("div");
			let img = document.createElement("img");

			i = _.padStart(i, 2, '0');
			img.src=chrome.extension.getURL('/images/wallpaper/wall_'+i+'.jpg');
			inner_div.width="90px";
			inner_div.height="90px";
			inner_div.className = "col-4 p-0"
			inner_div.style.display = "inline";
			img.id = i;
			if(localStorage.getItem('chosen'))
			{
				let chosen = JSON.parse(localStorage.getItem('chosen'));
				let indexOf = chosen.indexOf(img.src);
				if(indexOf<0){
					img.className = 'change';
				}else{
					img.className = 'change chosen';
				}
			} else {
				img.className = 'change';
			}
			inner_div.appendChild(img);
			outer_div.appendChild(inner_div);
		}
	}

	/**
	 * Change the favorite pictures in settings
	 * @param e
	 * @param chosen
	 * @returns {*}
	 */
	changeFavorites(e, chosen)
	{
		if(localStorage.getItem('chosen')){
			var chosen = JSON.parse(localStorage.getItem('chosen'));
		}
		if(localStorage.getItem('last') == 'youtube'){
			localStorage.setItem("last","img");
		}
		else
		{
			if(e.target.className == 'change') {
				e.target.className = 'change chosen';
				chosen.push(e.target.src);
				localStorage.setItem('chosen', JSON.stringify(chosen));
				return chosen;

			}else{
				e.target.className = 'change';
				chosen.splice(chosen.indexOf(e.target.src), 1);
				if(chosen.length == 0){
					localStorage.setItem('all',1);
					document.getElementById('filter_images').src = chrome.extension.getURL('/images/toggle-switch-off.svg');
					document.getElementById('imagesOn').innerHTML = 'Off';
				}
				localStorage.setItem('chosen',JSON.stringify(chosen));
				return chosen;
			}
		}
	}

	/**
	 * Show next background image
	 * @param e
	 */
	nextImage(e)
	{
		clearTimeout(this.currTimeout);
		if(document.getElementById('filter_images').src == chrome.extension.getURL('/images/toggle-switch.svg'))
		{
			let chosen = JSON.parse(localStorage.getItem('chosen'));
			let i = chosen.indexOf(document.getElementById('background-wallpaper').src);
			if(i<chosen.length-1){
				document.getElementById('background-wallpaper').src = chosen[i+1];
			}else{
				document.getElementById('background-wallpaper').src = chosen[0];
			}
		}
		else
		{
			let path = $("#background-wallpaper").attr("src");
			let pos_before = path.indexOf('wall_') + 5;
			let i = Number(path.substr(pos_before, 2));

			if (i < (theme_config['image_count']-1))
			{
				i++;
				i = _.padStart(i, 2, '0');
			} else {
				i = '00';
			}

			$("#background-wallpaper").attr("src",'/images/wallpaper/wall_'+ i +'.jpg');
		}
		image_resize.resizeDOMImageObject(window, $('#background-wallpaper')[0]);
		this.startInterval();
	}

	/**
	 * Activate and deactivate the favorite pictures slideshow
	 * @param e
	 */
	favoriteImages(e)
	{
		if(e.target.src == chrome.extension.getURL('/images/toggle-switch.svg') )
		{
			e.target.src = chrome.extension.getURL('/images/toggle-switch-off.svg');
			localStorage.setItem('all', 1);
			document.getElementById('imagesOn').innerHTML = 'Off';
		}
		else
		{
			if(!localStorage.getItem('chosen') || !(JSON.parse(localStorage.getItem('chosen')).length>0)){
				$('#alert_box').show();
			}else{
				e.target.src = chrome.extension.getURL('/images/toggle-switch.svg');
				localStorage.setItem('all', 0);
				document.getElementById('imagesOn').innerHTML = 'On';
			}
		}

		clearTimeout(this.currTimeout);
		this.backgroundImage();
	}

	/**
	 * Slideshow on/off
	 * @param e
	 */
	slideshow(e)
	{
		if(e.target.src == 'chrome-extension://' +chrome.runtime.id + '/images/toggle-switch.svg'){
			e.target.src = 'chrome-extension://' +chrome.runtime.id + '/images/toggle-switch-off.svg';
			document.getElementById('slideOn').innerHTML = 'Off';
			clearTimeout(this.currTimeout);
			localStorage.setItem('slideshow', 0);
			$('#divSlide').css('color','#aaaaaa');
			$('#interval').css('border-color', '#aaaaaa');
			$('#interval').css('color', '#aaaaaa');
			$('.arrow-down').css('border-top', '5px solid #aaaaaa');
		}else if(e.target.src == 'chrome-extension://' +chrome.runtime.id + '/images/toggle-switch-off.svg'){
			e.target.src = 'chrome-extension://' +chrome.runtime.id +'/images/toggle-switch.svg';
			document.getElementById('slideOn').innerHTML = 'On';
			localStorage.setItem('slideshow', 1);
			this.startInterval();
			$('#divSlide').css('color','#ffffff');
			$('#interval').css('border-color', '#ffffff');
			$('#interval').css('color', '#ffffff');
			$('.arrow-down').css('border-top', '5px solid #ffffff');
		}
	}

	/**
	 * Clear the current timeout and start a new one
	 */
	startInterval()
	{
		clearTimeout(this.currTimeout);
		if(!localStorage.getItem('interval')){
			localStorage.setItem('interval', 10000);
		}
		if(localStorage.getItem('slideshow') == 1 || !localStorage.getItem('slideshow')) {
			this.currTimeout = setTimeout(this.backgroundImage.bind(this), localStorage.getItem('interval'));
		}
	}

	/**
	 * Clear all favorite images
	 */
	 clearImages()
	 {
		 document.getElementById('filter_images').src = chrome.extension.getURL('/images/toggle-switch-off.svg');
		 localStorage.setItem('all', 1);
		 document.getElementById('imagesOn').innerHTML = 'Off';
		 localStorage.removeItem('chosen');
		 let all_images = document.getElementsByClassName('change');
		 for(let i = 0; i < all_images.length; i++){
			 all_images[i].className = 'change';
		 }
	 }
}

module.exports = Images;
