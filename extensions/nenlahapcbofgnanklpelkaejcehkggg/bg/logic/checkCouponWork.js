import xhr from '../utility/xhr';
import * as analytics from '../utility/analytics';
import cheerio from 'cheerio';
import _ from 'lodash';

export default async function determineCoupon({type, tld}) {
  if (type === 'rmn') {
    rmnCouponLookup(tld);
  } else {
    couponsCouponLookup(tld);
  }
}

async function rmnCouponLookup(tld) {
  const url = `https://www.retailmenot.com/landing5/${tld}`;
  try {
    const html = await xhr('GET', url);
    if (html) {
      const $ = cheerio.load(html);
      const value = $('[data-new-tab*="view/"]')
        .first()
        .data('new-tab');
      if (value) {
        chrome.windows.create(
          {
            url: `https://www.retailmenot.com${value.replace('/view/', '/landing5/')}`,
            incognito: true
          },
          () => {}
        );
      } else {
        chrome.windows.create(
          {url: 'https://www.retailmenot.com/coupons/codes', incognito: true},
          () => {}
        );
      }
    }
  } catch (err) {
    analytics.trackError('rmnCouponCheck');
    chrome.windows.create(
      {url: 'https://www.retailmenot.com/coupons/codes', incognito: true},
      () => {}
    );
  }
}

async function couponsCouponLookup(tld) {
  chrome.windows.create({url: `https://www.coupons.com/coupon-codes/${tld}/`, incognito: true});
}
