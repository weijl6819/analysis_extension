import xhr from '../utility/xhr';
import _ from 'lodash';
import cache from 'cache/grouponNotificationCache';

export function throttleNotification() {
  cache.set('throttled', true);
}

export default async function findDeal(data) {
  const throttled = cache.get('throttled');
  if (throttled) {
    return;
  }
  const deal = cache.get(`${data.latitude}:${data.longitude}`);
  if (deal) {
    return deal;
  }
  const url = `https://partner-api.groupon.com/deals.json?tsToken=US_AFF_0_206976_212556_0&lat=${
    data.latitude
  }&lng=${data.longitude}&offset=0&limit=20&radius=1`;
  const result = await xhr('GET', url);
  if (result && result.deals) {
    const titleLower = data.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const phone = data.phone && data.phone.replace(/[^0-9]/g, '');
    const deal = _.find(result.deals, deal => {
      const name = _.get(deal, 'merchant.name');
      if (name) {
        const s1 = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (s1.indexOf(titleLower) !== -1 || titleLower.indexOf(s1) !== -1) {
          return true;
        }
      }
      // Try matching by website
      const website = _.get(deal, 'merchant.websiteUrl');
      if (
        website &&
        data.website &&
        (website.indexOf(data.website) !== -1 || data.website.indexOf(website) !== -1)
      ) {
        return true;
      }
      // Try matching by phone number
      const phoneNumbers = _(deal.options)
        .map('redemptionLocations')
        .flatten()
        .filter('phoneNumber')
        .map(r => r.phoneNumber.replace('+1', ''))
        .value();
      if (phoneNumbers.indexOf(phone) !== -1) {
        return true;
      }
    });

    if (deal && _.get(deal, 'announcementTitle', '').indexOf('Cash Back') === -1) {
      const options = deal.options.sort((a, b) => {
        return b.discount.amount - a.discount.amount;
      });
      const resp = {
        title: deal.announcementTitle,
        image: deal.sidebarImageUrl,
        url: deal.dealUrl,
        discount: options[0].discount.amount
      };
      cache.set(`${data.latitude}:${data.longitude}`, resp);
      return resp;
    }
  }
}
