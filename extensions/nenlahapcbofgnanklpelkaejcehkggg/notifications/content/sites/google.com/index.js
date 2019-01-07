import _ from 'lodash';
import cheerio from 'cheerio';
import Promise from 'bluebird';
import {convertPrice} from '../../utility/getPriceFromSelector';
import loadEstimateAnnotation from '../../utility/loadEstimateAnnotation';
import hasFeature from 'utility/hasFeature';

async function getProductSpecs(gpid) {
  const resp = await fetch(`https://www.google.com/shopping/product/${gpid}/specs`);
  const html = await resp.text();
  const $ = cheerio.load(html);
  const gtinString = $('span:contains("GTIN") + span').text();
  return {
    gtins: gtinString.split(', ')
  };
}

async function findProducts() {
  let results;
  if (!!location.pathname.match(/\/shopping\/product\//)) {
    const match = location.pathname.match(/\/product\/(\d+)/);
    const el = document.querySelector('#product-basic-info');
    if (match && el) {
      results = [
        {
          gpid: match && match[1] ? match[1] : null,
          product: {
            title: el.querySelector('#product-name').innerText,
            price: convertPrice(el.querySelector('#summary-prices .price').innerText) * 100
          },
          el
        }
      ];
    }
  } else if (!!location.href.match(/google\.com\/search.*&tbm=shop/)) {
    const listResults = document.querySelectorAll('.sh-dlr__list-result');
    const gridResults = document.querySelectorAll('.sh-dgr__grid-result');
    if (listResults && listResults.length) {
      results = _.map(listResults, el => {
        const a = el.querySelector('.sh-dlr__thumbnail a');
        const match = a.href.match(/\/product\/(\d+)/);
        return {
          gpid: match && match[1] ? match[1] : null,
          product: {
            title: el.querySelector('a[data-what="1"]').innerText,
            price: convertPrice(el.querySelector('span').innerText)
          },
          el
        };
      });
    } else if (gridResults && gridResults.length) {
      results = _.map(gridResults, el => {
        const a = el.querySelector('.sh-dgr__thumbnail a');
        const match = a.href.match(/\/product\/(\d+)/);
        return {
          gpid: match && match[1] ? match[1] : null,
          product: {
            title: el.querySelector('a[data-what="1"]').innerText,
            price: convertPrice(el.querySelector('span').innerText)
          },
          el
        };
      });
    }
  }
  if (results) {
    addAnnotations(results);
  }
}

async function addAnnotations(results) {
  Promise.map(_.take(results, 3), async result => {
    if (result.gpid) {
      const specs = await getProductSpecs(result.gpid);
      loadEstimateAnnotation(
        {
          additionalClass: 'gs-list-page',
          insertAfterElement:
            result.el.querySelector('.sh-dgr__content > :last-child') ||
            result.el.querySelector('#summary-container > div > :last-child') ||
            result.el.querySelector('.sh-dlr__thumbnail > :last-child > :last-child')
        },
        {
          simulateResize: true,
          offersFrom: true,
          input: {
            product: {
              gtin: specs.gtins[0],
              ...result.product
            }
          }
        }
      );
    }
  });
}

export default function init() {
  if (!hasFeature('ext_other_origins')) {
    return false;
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => findProducts());
  } else {
    findProducts();
  }
}
