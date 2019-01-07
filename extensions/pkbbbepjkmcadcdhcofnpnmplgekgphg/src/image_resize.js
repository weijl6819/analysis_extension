

class ImageResize
{
	/**
	 * Calculates the images size and return style information
	 * @param xw - window width
	 * @param yw - window height
	 * @param xi - image width
	 * @param yi - image height
	 * @return obj
	 */
	calculateImageSize(xw, yw, xi, yi)
	{
		/*
		  xw
		  yw . windowinnerHeight
		  xi - imageWidth
		  yi - imageHeight
		  back - DOM image Element
		*/

		var n = 0;
		var m = 0;

		if(xw <= xi && yw <= yi){
			/*----------------------------------------
			Originalbild ist größer als Window
			----------------------------------------*/
			// Berechne Verhältnis von jeweils Breite und Höhe von Bild zu Window
			var nn = xi/xw;
			var mm = yi/yw;

			/*------------------------------------
			Wenn das Verhältnis der Breite größer ist als das Verhältnis
			der Höhe
			--> Höhe anpassen und anschließend Breite an Höhe anpassen und z
				zuschneiden
			------------------------------------*/
			if(nn >= mm){
				var k = yw/yi;
				yi = yw;

				var xn = k * xi;
				xi = xn;
				n = xn - xw;
			}

			/*------------------------------------
			Wenn das Verhältnis der Höhe größer ist als das Verhältnis
			der Breite
			--> Breite anpassen und anschließend Höhe an Breite anpassen und
				zuschneiden
			------------------------------------*/
			else if(mm > nn){
				var k = xw/xi;
				xi = xw;
				var yn = k * yi;
				m = yn - yw;
				yi = yn;
			}

		}
		//usually not the case
		else if(xw > xi && yw <= yi){
			var k = xw/xi;
			xi = xw;
			var yn = yi * k;
			m = yn-yw;
			yi = yn;
		}else if(xw <= xi && yw > yi){

			yi = yw;
			var k = yw/yi;
			var xn = xi * k;
			n = xn - xw;
			xi = xn;
		} else if(xw > xi && yw > yi){

			var nn = xw/xi;
			var mm = yw/yi;
			if(mm<nn){
				var k = xw/xi;
				xi = xw;
				var yn = yi * k;
				m = yn - yw;
				yi = yn;
			}else{
				var k = yw/yi;
				yi = yw;
				var xn = xi * k;
				n = xn-xw;
				xi = xn;
			}
		}
		return {

			left: -n/2,
			top: -m/2,
			height: yi,
			width: xi
		};

	}

	/**
	 * Resize an DOM image element
	 * @param window
	 * @param image_tag
	 */
	resizeDOMImageObject(window, image_tag)
	{
		let style = this.calculateImageSize(window.innerWidth, window.innerHeight, image_tag.naturalWidth, image_tag.naturalHeight)
		image_tag.style.left = style.left + 'px';
		image_tag.style.top = style.top + 'px';
		image_tag.style.height = style.height + 'px';
		image_tag.style.width = style.width + 'px';
	}

	ping() {
		console.log('Hello World!!');
	}
}

module.exports = ImageResize;
