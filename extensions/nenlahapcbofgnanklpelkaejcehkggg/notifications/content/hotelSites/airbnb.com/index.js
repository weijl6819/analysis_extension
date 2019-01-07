import moment from 'moment';
import delay from 'utility/delay';
import hasFeature from 'utility/hasFeature';
import findHomeawayListing from 'messenger/outbound/findHomeawayListing';
import querystring from 'querystring';
import _ from 'lodash';

let offerChangeCallback;

function formatPrice(p) {
  const amount = parseFloat(p.replace(/[^0-9]/g, ''));
  if (p.indexOf('.') !== -1) {
    return parseInt(amount);
  } else {
    return parseInt(amount * 100);
  }
}

function isLoaded() {
  const el = document.querySelector('#book_it_form');
  return el && el.innerText.match(/Total/);
}

function getInputData() {
  try {
    const urlQuery = querystring.parse(location.search.substring(1));
    const initialState = JSON.parse(
      document
        .querySelector('[type="application/json"][data-hypernova-key="spaspabundlejs"]')
        .innerText.match(/<!--(.*)-->/)[1]
    );
    const listing = _.get(initialState, 'bootstrapData.reduxData.homePDP.listingInfo.listing');
    const query = _.get(initialState, 'bootstrapData.query');
    const addressParts = listing.p3_summary_address.split(',');
    let price;
    try {
      price = formatPrice(
        document.querySelector('#book_it_form > :nth-child(2) > :last-child > div > :last-child')
          .innerText
      );
    } catch (e) {}
    const data = {
      title: listing.name,
      bathroom: listing.bathroom_label.split(' ')[0].trim(),
      bedroom: listing.bedroom_label.split(' ')[0].trim(),
      bed: listing.bed_label.split(' ')[0].trim(),
      guest: listing.guest_label.split(' ')[0].trim(),
      price,
      city: addressParts[addressParts.length - 3].trim(),
      state: addressParts[addressParts.length - 2].trim(),
      country: addressParts[addressParts.length - 1].trim(),
      hostName: listing.primary_host.host_name,
      checkIn: moment(urlQuery.check_in, 'YYYY-MM-DD').format('MM/DD/YYYY'),
      checkOut: moment(urlQuery.check_out, 'YYYY-MM-DD').format('MM/DD/YYYY'),
      rooms: '1',
      adults: urlQuery.adults,
      children: String(parseInt(urlQuery.guests) - parseInt(urlQuery.adults)),
      latitude: listing.lat,
      longitude: listing.lng,
      title: listing.name
    };
    return {
      type: 'homeawaySearch',
      data: {
        lat: data.latitude,
        long: data.longitude,
        guests: data.guest,
        bathrooms: data.bathroom,
        bedrooms: data.bedroom,
        city: data.city,
        country: data.country,
        state: data.state,
        hostName: data.hostName,
        price: data.price,
        arrivalDate: data.checkIn,
        departureDate: data.checkOut,
        adults: data.adults,
        children: data.children,
        listingId: `airbnb.com_${listing.id}`,
        title: data.title
      }
    };
  } catch (e) {
    console.log(e);
  }
}

async function updateSearch() {
  const data = getInputData();
  if (offerChangeCallback) {
    offerChangeCallback({loading: true});
  }
  const listing = await findHomeawayListing(
    _.assign(
      {
        domain: location.hostname.replace(/^www\./, ''),
        pagePath: location.pathname
      },
      data
    )
  );
  if (offerChangeCallback) {
    offerChangeCallback(listing, data.data);
  }
}

export default async function() {
  if (!location.href.match(/\/rooms(?:\/plus)?\/\d+/i) || hasFeature('disable_hotels_airbnb')) {
    return;
  }
  let tries = 600; // try for 5 min
  let loaded = isLoaded();
  while (!loaded && tries > 0) {
    await delay(500);
    loaded = isLoaded();
    tries = tries - 1;
  }
  if (!loaded) {
    return;
  }
  const debouncedUpdateSearch = _.debounce(updateSearch, 2000);
  const observer = new MutationObserver(debouncedUpdateSearch);
  observer.observe(document.querySelector('#book_it_form'), {childList: true});
  const inputData = getInputData();
  return {
    ...inputData,
    props: {
      registerOfferChangeCallback: cb => {
        offerChangeCallback = cb;
      }
    }
  };
}
