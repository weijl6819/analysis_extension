import regex from 'utility/regex';
import Promise from 'bluebird';
import _ from 'lodash';

let observer;

function getLatLong(latLongEl) {
  try {
    const latLong = regex(
      /@([-0-9.]+,[-0-9.]+)/,
      _.get(latLongEl.dataset, 'url') || latLongEl.href
    );
    if (latLong && latLong.length) {
      const components = latLong.split(',');
      const latitude = components[0];
      const longitude = components[1];
      const title = document
        .querySelector('#rhs_block [role="heading"] > div')
        .innerText.replace(/Saved to your Map View on Map/i, '')
        .trim();
      const website = document.querySelector('#rhs_block [role="heading"] .ab_button').href;
      const address = document
        .querySelector(
          '#rhs_block [data-md="1002"] [data-local-attribute="d3adr"] > span:nth-child(2)'
        )
        .innerText.trim();
      const phone = document
        .querySelector(
          '#rhs_block [data-md="1006"] [data-local-attribute="d3ph"] > span:nth-child(2)'
        )
        .innerText.trim();
      return {
        latitude,
        longitude,
        title,
        website,
        address,
        phone
      };
    }
  } catch (e) {
    console.log(e);
  }
}

function checkForLatLng() {
  const latLongEl = document.querySelector('#rhs_block .kp-header .kno-fb-ctx div > a[tabindex]');
  if (latLongEl) {
    if (observer) {
      observer.disconnect();
    }
    return getLatLong(latLongEl);
  }
}

export default async () => {
  // Confirm we are on google search
  if (window.location.hostname !== 'www.google.com') {
    return;
  }
  const data = checkForLatLng();
  if (data) {
    return data;
  }
  const target = document.getElementById('main');
  if (target) {
    return new Promise(resolve => {
      observer = new MutationObserver(
        _.debounce(mutations => {
          const data = checkForLatLng();
          if (data) {
            resolve(data);
          }
        }, 500)
      );
      // pass in the target node, as well as the observer options
      observer.observe(target, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
      });
    });
  }
};
