import {React} from 'utility/css-ns';
import Hotel from 'pages/Hotel';
import HomeawayNotification from 'pages/HomeawayNotification';
import Root from 'components/Root';
import loadApp from 'utility/loadApp';
import setBrowserAction from 'messenger/outbound/setBrowserAction';
import findHotel from 'messenger/outbound/findHotel';
import tree from 'state';
import initSite from 'content/hotels';
import getUser from 'messenger/outbound/getUser';
import findHomeawayListing from 'messenger/outbound/findHomeawayListing';
import Promise from 'bluebird';
import _ from 'lodash';

window.__wb_timing.hotelRequireAt = performance.now();

function fetchInitialData() {
  return Promise.all([getUser()]).spread(resp => {
    if (resp) {
      tree.set('session', _.get(resp, 'session'));
      tree.set('events', _.get(resp, 'settings.events'));
      tree.set('settings', _.get(resp, 'settings'));
      tree.set('pageViewId', window.__wb_page_view_id);
      tree.set('tabId', _.get(resp, 'tabId'));
    }
  });
}

function createApp(props) {
  return (
    <Root>
      <Hotel {...props} />
    </Root>
  );
}

function createHomeawayApp(props = {}) {
  return (
    <Root>
      <HomeawayNotification {...props} />
    </Root>
  );
}

async function checkForHotel(data) {
  const {props, ...rest} = data;
  const hotel = await findHotel(
    _.assign(
      {
        domain: location.hostname.replace(/^www\./, ''),
        pagePath: location.pathname
      },
      rest
    )
  );
  if (_.isArray(hotel) && hotel.length) {
    setBrowserAction({active: true});
    tree.set('hotelView', {
      hotels: hotel
    });
    loadApp({
      initialRoute: '/hotel',
      cssUrl: 'GENERATED/hotel.css',
      app: createApp(props)
    });
  } else if (hotel && (hotel.discount || hotel.cashback)) {
    setBrowserAction({active: true});
    tree.set('hotelView', {
      hotel
    });
    loadApp({
      initialRoute: '/hotel',
      cssUrl: 'GENERATED/hotel.css',
      app: createApp(props)
    });
  }
}

async function checkHomeawayListing(data) {
  const {props, ...input} = data;
  const resp = await findHomeawayListing(input);
  if (resp && resp.results && resp.results.length) {
    setBrowserAction({active: true});
    tree.set('homeawayView', {
      listing: resp,
      sourceListing: input.data
    });
    loadApp({
      initialRoute: '/hotel',
      cssUrl: 'GENERATED/hotel.css',
      app: createHomeawayApp(props)
    });
  }
}

async function init() {
  await fetchInitialData();
  try {
    const data = await initSite();
    if (data && data.type === 'homeawaySearch') {
      checkHomeawayListing(data);
    } else if (data && !data.error) {
      checkForHotel(data);
    }
  } catch (e) {
    console.log(e);
  }
}
if (document.readyState !== 'loading') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}
