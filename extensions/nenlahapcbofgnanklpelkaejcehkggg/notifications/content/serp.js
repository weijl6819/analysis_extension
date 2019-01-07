import loadSerpProductAnnotation from './utility/loadSerpProductAnnotation';
import loadSerpAnnotation from './utility/loadSerpAnnotation';
import setBrowserAction from 'messenger/outbound/setBrowserAction';
import getSerpOffers from 'messenger/outbound/getSerpOffers';
import _ from 'lodash';
import tldjs from 'tldjs';
import 'less/serp.less';

let mountPoints = [];
let annotating;
const debouncedMutationCallback = _.debounce(
  config => {
    if (!annotating && (!mountPoints.length || !document.body.contains(mountPoints[0]))) {
      mountPoints = [];
      annotateSerp(config);
    }
  },
  1000,
  {trailing: true}
);

async function annotateSerp(config = {}) {
  annotating = true;
  const {
    itemSelector,
    linkSelector,
    injectAfterSelector,
    injectAfterFunction,
    additionalClass
  } = config;
  try {
    const results = _(document.querySelectorAll(itemSelector))
      .map((el, i) => {
        const link = el.querySelector(linkSelector);
        if (link) {
          const domain = tldjs.getDomain(link.href);
          const asinMatch = link.href.match(/amazon\.com.*(?:\/dp\/|\/gp\/|\/d\/).*([0-9A-Z]{10})/);
          return {
            domain,
            searchIndex: i,
            linkEl: link,
            asin: asinMatch && asinMatch[1],
            el: injectAfterSelector
              ? el.querySelector(injectAfterSelector)
              : injectAfterFunction(el)
          };
        }
        return false;
      })
      .compact()
      .value();
    if (results && results.length) {
      const sites = await getSerpOffers(_.map(results, r => r.domain));
      setBrowserAction({active: true});
      _.forEach(results, result => {
        const site = _.find(sites, s => s.domain === result.domain);
        if (result.asin) {
          loadSerpProductAnnotation(
            {
              cssUrl: 'GENERATED/serp.css',
              additionalClass: additionalClass || 'serp-page',
              insertAfterElement: result.el
            },
            {asin: result.asin, searchIndex: result.searchIndex}
          ).then(mountPoint => {
            mountPoints.push(mountPoint);
          });
        } else if (
          (_.get(site, 'merchantPage.showInMerchantIndex') &&
            !_.get(site, 'merchantPage.disableCouponInfo') &&
            _.get(site, 'coupons.coupons.length')) ||
          _.get(site, 'cashback.reward.amount')
        ) {
          loadSerpAnnotation(
            {
              cssUrl: 'GENERATED/serp.css',
              additionalClass: additionalClass || 'serp-page',
              insertAfterElement: result.el
            },
            {site, linkEl: result.linkEl, searchIndex: result.searchIndex}
          ).then(mountPoint => {
            mountPoints.push(mountPoint);
          });
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
  annotating = false;
}

async function init(config) {
  annotateSerp(config);
  const observer = new MutationObserver(() => debouncedMutationCallback(config));
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

export default async function initSite() {
  try {
    const domain = tldjs.getDomain(window.location.href);
    const result = require('./serpSites/' + domain + '/index');
    if (result) {
      const config = await result.default();
      return init(config);
    }
  } catch (e) {
    return {
      error: 'Site not supported'
    };
  }
}
