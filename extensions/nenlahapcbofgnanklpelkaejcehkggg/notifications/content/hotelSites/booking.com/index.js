import delay from 'utility/delay';
import hasFeature from 'utility/hasFeature';
import _ from 'lodash';
import moment from 'moment';

function formatPrice(p) {
  const amount = parseFloat(p.replace(/[^0-9]/g, ''));
  if (p.indexOf('.') !== -1) {
    return parseInt(amount);
  } else {
    return parseInt(amount * 100);
  }
}

async function runListPage() {
  let tries = 10;
  let items = document.querySelectorAll('.sr_item');
  while (!items && tries > 0) {
    await delay(500);
    items = document.querySelectorAll('.sr_item');
    tries = tries - 1;
  }
  if (!items) {
    return;
  }
  const checkIn = moment(
    new Date(document.querySelector('.--checkin-field .sb-date-field__display').innerText)
  );
  const checkOut = moment(
    new Date(document.querySelector('.--checkout-field .sb-date-field__display').innerText)
  );
  const nights = checkOut.diff(checkIn, 'days');
  const rooms = document.querySelector('#no_rooms').value;
  const adults = document.querySelector('#group_adults').value;
  const children = document.querySelector('#group_children').value;
  const data = _.map(items, item => {
    const mapDataEl = item.querySelector('.address > a');
    if (!mapDataEl) {
      return {};
    }
    const coords = mapDataEl.getAttribute('data-coords').split(',');
    const price = item.querySelector('.roomPrice .price');

    return {
      title: item.querySelector('.sr-hotel__name').innerText,
      address: '',
      price: Math.ceil((price && price.innerText ? formatPrice(price.innerText) : 0) / nights),
      checkIn: checkIn.format('MM/DD/YYYY'),
      checkOut: checkOut.format('MM/DD/YYYY'),
      rooms,
      adults,
      children,
      latitude: coords[1],
      longitude: coords[0]
    };
  });
  return {
    type: 'findMultiple',
    hotels: _.take(_.filter(data, h => h.price > 0), 10),
    meta: {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname
    }
  };
}

async function runHotelPage() {
  let tries = 10;
  let loaded = document.querySelectorAll('.hp__hotel-name');
  while (!loaded && tries > 0) {
    await delay(500);
    loaded = document.querySelectorAll('.hp__hotel-name');
    tries = tries - 1;
  }
  if (!loaded) {
    return;
  }
  const checkIn = moment(
    new Date(document.querySelector('.--checkin-field .sb-date-field__display').innerText)
  );
  const checkOut = moment(
    new Date(document.querySelector('.--checkout-field .sb-date-field__display').innerText)
  );
  const nights = checkOut.diff(checkIn, 'days');
  const rooms = document.querySelector('#no_rooms').value;
  const adults = document.querySelector('#group_adults').value;
  const children = document.querySelector('#group_children').value;
  const latLng = document
    .querySelector('.map_static_zoom')
    .getAttribute('style')
    .match(/center=([-0-9\.]+,[-0-9\.]+)/)[1]
    .split(',');
  const price =
    document.querySelector(
      '.room_loop_counter1[data-occupancy] .roomDefaultUse .rooms-table-room-price'
    ) || document.querySelector('.hprt-table-cheapest-block .hprt-price-price');
  const data = {
    title: document.querySelector('.hp__hotel-name').innerText,
    address: document.querySelector('.hp_address_subtitle').innerText,
    price: Math.ceil((price && price.innerText ? formatPrice(price.innerText) : 0) / nights),
    checkIn: checkIn.format('MM/DD/YYYY'),
    checkOut: checkOut.format('MM/DD/YYYY'),
    rooms,
    adults,
    children,
    latitude: latLng[0],
    longitude: latLng[1]
  };
  return data;
}

export default function() {
  if (
    !location.href.match(/searchresults\.html|\/hotel\//i) ||
    !hasFeature('show_hotels_bookingcom')
  ) {
    return;
  }
  if (location.href.match(/searchresults\.html/)) {
    return runListPage();
  }
  if (location.href.match(/\/hotel\//)) {
    return runHotelPage();
  }
}
