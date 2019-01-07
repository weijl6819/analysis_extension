let constants = {};

if (__ENV__ === 'local') {
  constants = {
    WIKIBUY_API: 'http://api.ivf-local.com:3000/v1',
    WIKIBUY_URL: 'http://ivf-local.com:3000',
    SITE_API: 'https://origin-site.dev.ivaws.com/v1',
    SITE_API_V3: 'https://origin-site.dev.ivaws.com/v3',
    ORIGIN_SITE_API: 'https://origin-site.dev.ivaws.com/v2',
    ENV: __ENV__
  };
} else if (__ENV__ === 'dev') {
  constants = {
    WIKIBUY_API: 'https://api.ivf-dev.com/v1',
    WIKIBUY_URL: 'https://ivf-dev.com',
    SITE_API: 'https://origin-site.dev.ivaws.com/v1',
    SITE_API_V3: 'https://origin-site.dev.ivaws.com/v3',
    ORIGIN_SITE_API: 'https://origin-site.dev.ivaws.com/v2',
    ENV: __ENV__
  };
} else {
  constants = {
    WIKIBUY_API: 'https://wikibuy.com/api/v1',
    WIKIBUY_URL: 'https://wikibuy.com',
    SITE_API: 'https://site.ivaws.com/v1',
    SITE_API_V3: 'https://site.ivaws.com/v3',
    ORIGIN_SITE_API: 'https://origin-site.ivaws.com/v2',
    ENV: __ENV__
  };
}

constants.REVIEW_URL =
  'https://chrome.google.com/webstore/detail/wikibuy/nenlahapcbofgnanklpelkaejcehkggg/reviews';

module.exports = constants;
