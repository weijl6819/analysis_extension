import cheerio from 'cheerio';

function getContent(selector, options) {
  if (options && options.$) {
    try {
      const el = options.$(selector);
      if (el) {
        return el.attr('content');
      }
    } catch (e) {}
  } else {
    try {
      const el = document.querySelector(selector);
      if (el) {
        return el.getAttribute('content');
      }
    } catch (e) {}
  }
}

function parseOpenTable($) {
  try {
    const latitude = getContent('[property="place:location:latitude"]', {$});
    if (latitude) {
      const longitude = getContent('[property="place:location:longitude"]', {$});
      const title = getContent('[property="og:description"]', {$}).split(',')[0];
      const website = getContent('[property="business:contact_data:website"]', {$});
      const address = getContent('[property="business:contact_data:street_address"]', {$});
      const phone = getContent('[property="business:contact_data:phone_number"]', {$});
      return {
        latitude,
        longitude,
        title,
        website,
        address,
        phone
      };
    }
  } catch (e) {}
}

async function getStorePage(url) {
  const resp = await fetch(url);
  const html = await resp.text();
  const $ = cheerio.load(html);
  const data = parseOpenTable($);
  const gtinString = $('._IDu:contains("GTIN") + ._KDu').text();
  return data;
}

export default async () => {
  const restaurantLink = document.querySelector('[data-bf-acceptance="restaurantLink"]');
  if (restaurantLink) {
    return getStorePage(restaurantLink.href);
  } else {
    return parseOpenTable();
  }
};
