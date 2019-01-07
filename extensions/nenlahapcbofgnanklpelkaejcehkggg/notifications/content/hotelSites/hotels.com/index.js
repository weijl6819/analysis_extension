import delay from 'utility/delay';
import moment from 'moment';
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
  return document.querySelector('.property-address');
}

export default async function() {
  if (!location.href.match(/ho\d+\//i) || !hasFeature('show_hotels_hotelscom')) {
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
  const data = {
    title: document.querySelector('h1').innerText,
    address: document.querySelector('.property-address').innerText,
    price: formatPrice(document.querySelector('.pricing .current-price').innerText),
    checkIn: moment(document.querySelector('#totpq-localised-check-in').value, 'MM/DD/YY').format(
      'MM/DD/YYYY'
    ),
    checkOut: moment(document.querySelector('#totpq-localised-check-out').value, 'MM/DD/YY').format(
      'MM/DD/YYYY'
    ),
    rooms: document.querySelector('#totpq-rooms').value,
    adults: document.querySelector('#totpq-room-0-adults').value,
    children: document.querySelector('#totpq-room-0-children').value,
    latitude: document
      .querySelector('[property="place:location:latitude"]')
      .getAttribute('content'),
    longitude: document
      .querySelector('[property="place:location:longitude"]')
      .getAttribute('content')
  };
  return data;
}
