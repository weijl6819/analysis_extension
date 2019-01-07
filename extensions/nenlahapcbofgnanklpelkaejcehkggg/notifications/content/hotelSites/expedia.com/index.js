import findHotel from 'messenger/outbound/findHotel';
import regex from 'utility/regex';
import delay from 'utility/delay';
import _ from 'lodash';

function formatPrice(p) {
  const amount = parseFloat(p.replace(/[^0-9]/g, ''));
  if (p.indexOf('.') !== -1) {
    return parseInt(amount);
  } else {
    return parseInt(amount * 100);
  }
}

export default async function() {
  if (!location.href.match(/Hotel-Information|Hotel-Search/i)) {
    return;
  }
  const map = document.querySelector('.map > a > figure');
  if (map) {
    const data = map.getAttribute('data-src');
    if (data) {
      const latLong = regex(/center=([-0-9\.]+,[-0-9\.]+)/, data);
      if (latLong) {
        const components = latLong.split(',');
        if (components.length === 2) {
          const latitude = components[0].substr(0, 8);
          const longitude = components[1].substr(0, 8);

          const title = document.querySelector('h1').innerText.trim();
          const address = document.querySelector('#policies-and-amenities [itemprop="address"]')
            .innerText;

          while (!document.querySelector('#availability-wizard')) {
            await delay(500);
          }

          const checkIn = document.querySelector('#availability-check-in').value;
          const checkOut = document.querySelector('#availability-check-out').value;

          let rooms = 1;
          let adults = 1;
          let children = 0;
          let price = 0;

          try {
            const roomsEl = document.querySelector('#availability-wizard .rooms-selector');
            rooms = _.get(roomsEl, 'value', 1);
          } catch (e) {}

          try {
            const adultsEl = document.querySelector('#availability-wizard .adult-selector');
            adults = _.get(adultsEl, 'value', 1);
          } catch (e) {}

          try {
            const childrenEl = document.querySelector('#availability-wizard .children-selector');
            children = _.get(childrenEl, 'value', 0);
          } catch (e) {}

          try {
            const s = '.price.link-to-rooms';
            let el = document.querySelector(s);
            while (!el) {
              await delay(500);
              el = document.querySelector(s);
            }
            price = formatPrice(_.get(el, 'innerText', 0));
          } catch (e) {}

          const data = {
            title,
            address,
            price,
            checkIn,
            checkOut,
            rooms,
            adults,
            children,
            latitude,
            longitude
          };
          return data;
        }
      }
    }
  } else {
    let tries = 10;
    let map = document.querySelector('#googleMapContainer .mapIcon');
    while (!map && tries > 0) {
      await delay(500);
      map = document.querySelector('#googleMapContainer .mapIcon');
      tries = tries - 1;
    }
    if (!map) {
      return;
    }
    const latLong = map.src.match(/visible=([-0-9\.]+),([-0-9\.]+)%7C([-0-9\.]+),([-0-9\.]+)/);
    const data = {
      checkIn: location.href.match(/startDate=([0-9\/%F]+)&/)[1].replace(/\//g, '%2F'),
      checkOut: location.href.match(/endDate=([0-9\/%F]+)&/)[1].replace(/\//g, '%2F'),
      adults: location.href.match(/adults=([0-9\/%F]+)&/)[1],
      rooms: '1',
      latLongs: [
        {
          latitude: latLong[1],
          longitude: latLong[2]
        },
        {
          latitude: latLong[3],
          longitude: latLong[4]
        }
      ],
      type: 'searchBetweenTwoPoints'
    };
    findHotel(
      _.assign(
        {
          domain: location.hostname.replace(/^www\./, ''),
          pagePath: location.pathname
        },
        data
      )
    );
  }
}
