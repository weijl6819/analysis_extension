import moment from 'moment';
import _ from 'lodash';
import findHotel from 'messenger/outbound/findHotel';

let offerChangeCallback;

function formatPrice(p) {
  const amount = parseFloat(p.replace(/[^0-9]/g, ''));
  if (p.indexOf('.') !== -1) {
    return parseInt(amount);
  } else {
    return parseInt(amount * 100);
  }
}

function getInputData() {
  const hotelModule = document.querySelector('.gws-local-hotels__booking-module');
  const [match, latitude, longitude] = hotelModule
    .getAttribute('data-async-context')
    .match(/lat\:([0-9-,.]+);.*lng\:([0-9-,.]+);/);
  return {
    title: document.querySelector('.kp-header [role="heading"]').innerText,
    address: document
      .querySelector('[data-local-attribute="d3adr"] > span:nth-child(2)')
      .innerText.split(',')[0],
    price: formatPrice(document.querySelectorAll('[data-dp]')[1].getAttribute('data-dp')),
    checkIn: moment(document.querySelector('[data-luh-i]').getAttribute('data-luh-i')).format(
      'MM/DD/YYYY'
    ),
    checkOut: moment(document.querySelector('[data-luh-o]').getAttribute('data-luh-o')).format(
      'MM/DD/YYYY'
    ),
    rooms: 1,
    adults: 2,
    children: 0,
    latitude: latitude / 10000000,
    longitude: longitude / 10000000
  };
}

async function updateSearch() {
  const data = getInputData();
  if (offerChangeCallback) {
    offerChangeCallback({loading: true});
  }
  const hotel = await findHotel(
    _.assign(
      {
        domain: location.hostname.replace(/^www\./, ''),
        pagePath: location.pathname
      },
      data
    )
  );
  if (offerChangeCallback) {
    offerChangeCallback(hotel);
  }
}

export default async () => {
  const hotelModule = document.querySelector('.gws-local-hotels__booking-module');
  if (hotelModule) {
    const debouncedUpdateSearch = _.debounce(updateSearch, 1000);
    const observer = new MutationObserver(debouncedUpdateSearch);
    observer.observe(document.querySelector('[data-async-type="updateHotelBookingModule"]'), {
      childList: true
    });
    const inputData = getInputData();
    return {
      ...inputData,
      props: {
        registerOfferChangeCallback: cb => {
          offerChangeCallback = cb;
        },
        showNightlyRate: true
      }
    };
  }
};
