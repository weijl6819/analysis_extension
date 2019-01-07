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

export default async function() {
  if (!location.href.match(/stay\/search\/details/i) || !hasFeature('show_hotels_pricelinecom')) {
    return;
  }
  let tries = 10;
  let map = document.querySelector('[stay-hotel-location-map]');
  while (!map && tries > 0) {
    await delay(500);
    map = document.querySelector('[stay-hotel-location-map]');
    tries = tries - 1;
  }
  if (!map) {
    return;
  }
  const data = {
    title: document.querySelector('input[name="location"]').value,
    address: document.querySelector('.location .address').innerText,
    price: formatPrice(document.querySelector('.price-section .item-price').innerText),
    checkIn: document.querySelector('[name="checkIn"] input').value,
    checkOut: document.querySelector('[name="checkOut"] input').value,
    rooms: document.querySelector('#roomCount').value,
    adults: document.querySelector('[name="hotelAdults"]').value,
    children: document.querySelector('[name="hotelChildren"]').value,
    latitude: map.getAttribute('latitude'),
    longitude: map.getAttribute('longitude')
  };
  return data;
}
