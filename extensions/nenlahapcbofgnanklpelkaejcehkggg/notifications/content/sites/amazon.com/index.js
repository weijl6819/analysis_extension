import _ from 'lodash';
import loadApp from '../../utility/loadNotification';
import loadEstimateAnnotation from '../../utility/loadEstimateAnnotation';
import tree from 'state';
import {default as getPriceFromSelector, convertPrice} from '../../utility/getPriceFromSelector';
import getSeller from '../../utility/getSeller';
import checkParents from '../../utility/checkParents';
import {getPriceAsync} from '../../utility/getPrice';
import regex from '../../utility/regex';
import getATCParams from '../../utility/getATCParams';
import {default as startASIN} from 'messenger/outbound/asin';
import {ignoreRun, resetNotification} from 'actions/notificationActions';
import {checkPageData} from 'iv-linus';
import persistLinusData from 'messenger/outbound/persistLinusData';
import delay from '../../utility/delay';
import getDataFromParsers from '../../utility/getDataFromParsers';
import hasFeature from 'utility/hasFeature';

let showingNotification = false;
let ignoreClicks = false;

function runASIN(asin, price, shipping, seller, atcData, product, feedback, dealId) {
  if (!asin) {
    return;
  }
  tree.set('currentASIN', asin);
  // Load notification if it isn't loaded and we found an ASIN to process
  if (!showingNotification) {
    showingNotification = true;
    loadApp();
  }
  checkPageData(window.location.href, {type: 'run', asin, price, shipping, seller, product}).then(
    data => {
      if (data) {
        persistLinusData(data);
      }
    }
  );
  startASIN({asin, price, shipping, seller, atcData, product, feedback, dealId});
}

function getTextFromSelectors(selectors) {
  let text;
  _.forEach(selectors, s => {
    if (text) {
      return;
    }
    const textEl = document.querySelector(s);
    if (textEl && textEl.innerText) {
      text = textEl.innerText;
    }
  });
  return text;
}

function getProductResults() {
  const products = [];
  const els = document.querySelectorAll('[data-a-carousel-options]');
  _.forEach(els, el => {
    const source = el
      .querySelector('.a-carousel-heading')
      .innerText.replace("(What's this?)", '')
      .trim()
      .toLowerCase();
    if (source !== 'related video shorts') {
      const cardEls = el.querySelectorAll('.a-carousel-row .a-carousel-card');
      _.forEach(cardEls, elem => {
        try {
          const price = convertPrice(elem.querySelector('.a-color-price').innerText); //parsePrice($(elem).find('.a-color-price').text()) || 0;
          let asin;
          let asinEl = elem.querySelector('[data-asin]');
          if (asinEl) {
            asin = asinEl.getAttribute('data-asin');
          } else {
            asinEl = elem.querySelector('[data-p13n-asin-metadata]');
            if (asinEl) {
              asin = JSON.parse(asinEl.getAttribute('data-p13n-asin-metadata')).asin;
            }
          }

          let title;
          let linkEl = elem.querySelector('.p13n-sc-truncated[title]');
          if (linkEl) {
            title = linkEl.getAttribute('title');
          } else {
            linkEl = elem.querySelector('a[title]');
            if (linkEl) {
              title = linkEl.getAttribute('title');
            }
          }

          const url = `http://www.amazon.com/dp/${asin}`;
          let image;
          let imageEl = elem.querySelector('.a-carousel-photo img');
          if (imageEl) {
            image = imageEl.src;
            if (imageEl.alt) {
              title = imageEl.alt;
            }
          } else {
            imageEl = elem.querySelector('img[data-a-dynamic-image]');
            if (imageEl) {
              image = imageEl.src;
              if (imageEl.alt) {
                title = imageEl.alt;
              }
            }
          }
          if (asin && price) {
            products.push({title, url, image, price, asin, source});
          }
        } catch (e) {}
      });
    }
  });
  return products;
}

function extractFeedbackData(price, asin) {
  try {
    if (!price) {
      const priceEl = document.querySelector(
        '#moreBuyingChoices_feature_div span.a-size-small > a'
      );
      if (priceEl) {
        price = convertPrice(priceEl.innerText.split('$')[1]);
      }
    }

    let els = document.querySelectorAll('#SalesRank b > a');
    if (!els.length) {
      els = document.querySelectorAll('.prodDetTable a');
    }
    const rankings = _(els)
      .map(el => {
        let parent = el.parentElement;
        let text = parent.innerText;
        while (text.indexOf('#') === -1 && parent !== document.body) {
          parent = parent.parentElement;
          text = parent.innerText;
        }
        const rank = parseInt(regex(/#([0-9]+)/, text));
        return {
          rank,
          text,
          url: el.href
        };
      })
      .filter(
        r => r && r.url && r.url.indexOf('bestsellers') !== -1 && r.url.indexOf('_last') !== -1
      )
      .sort((a, b) => a.rank - b.rank)
      .value();

    const infoEls = _(['.prodDetTable', '#detail-bullets_feature_div .content ul'])
      .map(selector => document.querySelector(selector))
      .filter()
      .value();

    let productInfo;
    let introduced;

    if (infoEls.length) {
      const infoString = infoEls[0].innerText;
      productInfo = _(infoString.split('\n'))
        .map(s => {
          const components = s.split(/\\t|:/);
          if (components.length >= 2) {
            const name = components[0];
            const value = components
              .splice(1)
              .join(' ')
              .trim();
            if (
              value.match(
                /((january|february|march|april|may|june|august|september|october|november|december)\s[0-9]+,\s[0-9]+)/i
              )
            ) {
              introduced = value;
            }
            return {name, value};
          }
        })
        .filter()
        .value();
    }

    // Category Link
    const category = {};

    let categoryEl = document.querySelector('.nav-search-dropdown option[selected]');
    if (categoryEl) {
      const node = categoryEl.value;
      category.link = `https://www.amazon.com/s/ref=nb_sb_noss_2?${node}`;
      category.text = categoryEl.innerText;
    } else {
      categoryEl = document.querySelector('#nav-subnav .nav-b');
      if (categoryEl) {
        category.link = categoryEl.href;
        category.text = categoryEl.innerText;
      }
    }

    const products = getProductResults();

    return {price, rankings, asin, introduced, productInfo, category, products};
  } catch (e) {}
}

function extractImageFromData(html, asin) {
  try {
    let data = regex(/data = ({.*});/, html);
    if (data) {
      data = JSON.parse(data);
    }
    if (data && data.colorToAsin && _.keys(data.colorToAsin).length) {
      let name;
      _.forEach(data.colorToAsin, (v, k) => {
        if (v.asin === asin) {
          name = k;
        }
      });
      if (name) {
        let colorImages = regex(/data\["colorImages"\] = ({.*});/, html);
        if (colorImages) {
          colorImages = JSON.parse(colorImages);
          const d = colorImages[name];
          const main = _.find(d, {variant: 'MAIN'});
          return _.get(main, 'large') || _.get(d, '[0].large');
        }
      }
    } else {
      data = regex(/'colorImages':(.*)/, html);
      if (data) {
        data = data.replace("{ 'initial':", '');
        data = data.substr(0, data.length - 2);
        data = JSON.parse(data);
        if (data) {
          return _.get(data, '[0].large');
        }
      }
    }
  } catch (e) {
    return null;
  }
}

function getMainImage(asin) {
  const html = document.documentElement.innerHTML;
  let image = extractImageFromData(html, asin);
  if (image) {
    return image;
  }
  const selectors = [
    '#landingImage',
    '#imgTagWrapperId img',
    '.image img',
    '#imageBlock [data-a-dynamic-image]'
  ];
  _.forEach(selectors, s => {
    if (image) {
      return;
    }
    const imageEl = document.querySelector(s);
    if (imageEl) {
      const attrib = imageEl.getAttribute('data-a-dynamic-image');
      if (attrib) {
        try {
          const json = JSON.parse(attrib);
          if (json) {
            const keys = _.keys(json);
            image = keys[keys.length - 1];
          }
        } catch (e) {}
      }
      if (!image && imageEl.src) {
        image = imageEl.src;
      }
    }
  });
  return image;
}

function getProductData(asin, title) {
  if (!title) {
    title = getTextFromSelectors(['#title', 'h1']);
  }
  const image = getMainImage(asin);
  const url = `http://www.amazon.com/dp/${asin}?psc=1`;
  return {title, image, url, vendor: 'amazon.com'};
}

async function updateASIN(asin, getDetails) {
  const currentASIN = tree.get('currentASIN');
  if (asin && currentASIN !== asin) {
    tree.set('currentASIN', asin);
    if (!ignoreClicks || !getDetails) {
      let price;
      let shipping;
      let seller;
      let atcData;
      let product;
      let dealId;
      if (getDetails) {
        const siteData = tree.get('siteAPIData');
        atcData = getATCParams();
        const parsers = _.get(siteData, 'siteData.runParsers.productPage');
        if (parsers) {
          const data = await getDataFromParsers(parsers);
          if (data) {
            price = data.price;
            product = getProductData(asin, data.title);
            shipping = data.shipping;
            seller = data.seller;
          }
        } else {
          price = await getPriceAsync(5);
          shipping = getPriceFromSelector('#ourprice_shippingmessage .a-color-secondary');
          seller = getSeller();
          product = getProductData(asin);
        }
        const hasSelection = document.querySelector('#partialStateBuybox .unselectedDims');
        if (hasSelection) {
          return;
        }
      }
      const dealEl = document.querySelector('[id^="gb_atc_"]');
      if (dealEl) {
        dealId = dealEl.id.replace('gb_atc_', '');
      }
      const feedback = extractFeedbackData(price, asin);
      runASIN(asin, price, shipping, seller, atcData, product, feedback, dealId);
    }
  } else {
    ignoreClicks = false;
  }
}

function checkGlobablIgnoreList() {
  const atcEl = document.getElementById('common-buy-box') || document.getElementById('addToCart');
  if (atcEl) {
    let text = atcEl.innerText;
    // Remove accessory text from comparison
    const accessoryEl = document.getElementById('#abbWrapper');
    if (accessoryEl) {
      text = text.replace(accessoryEl.innerText, '');
    }
    if (
      text &&
      text.match(
        /amazon digital services llc|pre-order: add to cart|add to rental|buy and get code/i
      )
    ) {
      return true;
    }
  }
  const titleEl = document.getElementById('productTitle');
  const titleText = titleEl ? titleEl.innerText : null;

  if (
    titleText &&
    titleText.match(/gift\s?card|\[digital\scode\]|key\scard|pc\sdownload|protection\splan/i)
  ) {
    return true;
  }

  const subNavEl = document.getElementById('nav-subnav');
  const subNavText = subNavEl ? subNavEl.innerText : '';
  const bundleExceptionPattern = /xbox|nintendo|playstation|ps4/i;
  if (
    titleText &&
    titleText.match(/\bbundle/i) &&
    !titleText.match(bundleExceptionPattern) &&
    !subNavText.match(/video\sgames/i)
  ) {
    return true;
  }

  const activeTab = document.querySelector('.a-active .mediaTab_title');
  const activeTabText = activeTab ? activeTab.innerText : null;
  if (activeTabText && activeTabText.match(/access\scode|pamphlet/i)) {
    return true;
  }

  const ignoreSelectors = ['#dv-buybox-play', '#dv-action-box', '#bundle_feature_div h2'];
  return !!_.find(ignoreSelectors, s => document.querySelector(s));
}

function checkIgnoreList(el) {
  // Only checking for digital movies and music right now
  const pattern = new RegExp(/wl-movie|dmusic_wishlist|dv-buybox-play/i);
  return checkParents(el, pattern);
}

async function asinUpdateCheck() {
  // Wait for ASIN, or bail after 5 seconds
  let updateCount = 0;
  while (
    (!document.getElementById('ASIN') || !document.getElementById('title')) &&
    updateCount < 100
  ) {
    await delay(50);
    ++updateCount;
  }
  function onChange() {
    const newAsinEl = document.getElementById('ASIN');
    const newAsin = newAsinEl ? newAsinEl.value : null;
    const currentASIN = tree.get('currentASIN');
    if (newAsin && newAsin !== currentASIN) {
      resetNotification();
      if (checkGlobablIgnoreList() || checkIgnoreList(newAsinEl)) {
        ignoreRun();
        tree.set('currentASIN', null);
        return;
      }
      tree.set('currentASIN', null);
      updateASIN(newAsin, true);
    }
  }

  const selectors = ['#actionPanel', '#rightCol', '#ppd-right'];
  _.forEach(selectors, selector => {
    const el = document.querySelector(selector);
    if (el) {
      const observer = new MutationObserver(onChange);
      observer.observe(el, {
        childList: true,
        subtree: true
      });
    }
  });
  onChange();
}

async function findCartAsins() {
  let attempts = 0;
  while (!document.querySelector('#activeCartViewForm [data-asin]')) {
    await delay(100);
    ++attempts;
    if (attempts >= 100) {
      break;
    }
  }
  _.forEach(document.querySelectorAll('#activeCartViewForm [data-asin]'), itemEl => {
    const priceEl = itemEl.querySelector('.sc-product-price');
    const asin = itemEl.getAttribute('data-asin');
    if (priceEl) {
      loadEstimateAnnotation(
        {
          additionalClass: 'cart-page',
          insertAfterElement: priceEl
        },
        {asin}
      );
    }
  });
}

async function findCheckoutAsins() {
  let attempts = 0;
  await delay(1000);
  while (!document.querySelector('[name="dupOrderCheckArgs"]')) {
    await delay(500);
    ++attempts;
    if (attempts >= 30) {
      break;
    }
  }
  _.forEach(document.querySelectorAll('[name="dupOrderCheckArgs"]'), itemEl => {
    const asin = itemEl.getAttribute('value').split('|')[0];
    if (itemEl) {
      loadEstimateAnnotation(
        {
          additionalClass: 'checkout-page',
          insertAfterElement: itemEl
        },
        {asin}
      );
    }
  });
}

export default function getSite() {
  let active = false;
  if (window.location.hostname.match(/amazon\.com$/)) {
    const settings = tree.get('settings');
    const where = _.get(settings, 'notificationPreferences.notificationWhere');

    if (window.location.href.match(/(dp|gp|d).*[0-9A-Z]{10}/)) {
      let showNotification = true;
      if (where) {
        showNotification = where.indexOf('productPage') !== -1;
      }
      if (showNotification) {
        tree.set('trigger', 'productPage');
        asinUpdateCheck();
        active = true;
      }
    } else if (
      location.href.match(/(dp|gp)\/cart\/view\.html/) ||
      location.href.match(/(dp|gp)\/item-dispatch/)
    ) {
      if (hasFeature('ext_amz_cart')) {
        findCartAsins();
      }
    } else if (location.href.match(/(dp|gp)\/buy\/.*\/handlers\/display\.html/)) {
      if (hasFeature('ext_amz_checkout')) {
        findCheckoutAsins();
      }
    }
  }
  return {active};
}
