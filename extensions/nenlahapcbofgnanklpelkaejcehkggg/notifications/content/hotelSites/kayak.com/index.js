import delay from 'utility/delay';
import moment from 'moment';
import hasFeature from 'utility/hasFeature';
import _ from 'lodash';

function formatPrice(p) {
  const amount = parseFloat(p.replace(/[^0-9]/g, ''));
  if (p.indexOf('.') !== -1) {
    return parseInt(amount);
  } else {
    return parseInt(amount * 100);
  }
}
let LOADED = document.readyState !== 'loading';
document.addEventListener('DOMContentLoaded', () => {
  LOADED = true;
});
function isLoaded() {
  return LOADED && !!document.querySelector('.Common-Results-ProgressBar.Hidden');
}

export default async function() {
  if (!location.href.match(/hotels\//i) || !hasFeature('show_hotels_kayak')) {
    return;
  }
  let tries = 60;
  let loaded = isLoaded();
  while (!loaded && tries > 0) {
    await delay(500);
    loaded = isLoaded();
    tries = tries - 1;
  }
  if (!loaded) {
    return;
  }
  const scripts = document.querySelectorAll('script[type="text/javascript"]');
  const script = _.find(scripts, script => {
    return (script.innerText || '').indexOf('R9.hotels.results.HotelResultInfoColumn') > -1;
  });
  const regex = /R9\.hotels\.results\.HotelResultItem\(".*",[.*\s](\{.*)\);/g;
  let matches;
  const output = [];
  while ((matches = regex.exec(script.innerText))) {
    output.push(JSON.parse(matches[1]));
  }
  const data = _.map(output, hotel => {
    return {
      title: hotel.name,
      address: '',
      price: formatPrice(hotel.displayPrice),
      checkIn: moment(hotel.checkinDate).format('MM/DD/YYYY'),
      checkOut: moment(hotel.checkoutDate).format('MM/DD/YYYY'),
      rooms: `${hotel.rooms}`,
      adults: `${hotel.guests}`,
      children: '0',
      latitude: `${hotel.latitude}`,
      longitude: `${hotel.longitude}`
    };
  });
  return {
    type: 'findMultiple',
    hotels: data,
    meta: {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname
    }
  };
}
