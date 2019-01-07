import delay from 'utility/delay';
import hasFeature from 'utility/hasFeature';

function formatPrice(p) {
  const amount = parseFloat(p.replace(/[^0-9]/g, ''));
  if (p.indexOf('.') !== -1) {
    return parseInt(amount);
  } else {
    return parseInt(amount * 100);
  }
}

function isLoaded() {
  return document.querySelector('.prw_common_responsive_static_map_image .mapImg');
}

export default async function() {
  if (!location.href.match(/\/Hotel_Review\-/i) || !hasFeature('show_hotels_tripadvisorcom')) {
    return;
  }
  let tries = 10;
  let loaded = isLoaded();
  while (!loaded && tries > 0) {
    await delay(500);
    loaded = isLoaded();
    tries = tries - 1;
  }
  if (!loaded) {
    return;
  }
  try {
    const pageData = JSON.parse(document.querySelector('.irg-data').innerText);
    const latLngMatches = document
      .querySelector('.prw_common_responsive_static_map_image .mapImg')
      .src.match(/markers=([-0-9\.]+),([-0-9\.]+)/);
    if (latLngMatches) {
      const data = {
        title: document.querySelector('h1').innerText,
        address: document.querySelector('.address').innerText,
        price: pageData.lowestPrice ? formatPrice(pageData.lowestPrice) : 0,
        checkIn: pageData.checkIn,
        checkOut: pageData.checkOut,
        rooms: '1',
        adults: '2',
        children: '0',
        latitude: latLngMatches[1],
        longitude: latLngMatches[2]
      };
      return data;
    }
  } catch (e) {
    console.log(e);
  }
}
