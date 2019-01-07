import _ from 'lodash';
import xhr from '../utility/xhr';
import {checkPrime, getBrowseHistory} from './onboarding';
import regex from '../utility/regex';
import tldjs from 'tldjs';
import {WIKIBUY_API} from 'constants';
import cheerio from 'cheerio';
import {setEvent} from 'api/preferences';
import getPreferences from 'cache/preferencesCache';

import DOMAINS from '../resources/cookies.json';

async function getTransaction(mid) {
  const url = `http://cg.linksynergy.com/assets/consumer?token=c62512b92393fba80a7b0552349fc0b694a992d1b9bceeb4d2fe6b7ff5dc09ec&mid=${mid}`;
  const resp = await xhr('GET', url);
  let date = _.get(resp, 'transactionDate');
  if (date) {
    date = new Date(date * 1000).toISOString();
    return {
      mid,
      date
    };
  }
}

async function checkJetCustomer() {
  const prefs = await getPreferences();
  if (_.get(prefs, 'events.isJetCustomer') || _.get(prefs, 'events.hasCheckedJetCustomer')) {
    return;
  }

  try {
    getTransaction(41098).then(res => {
      if (res) {
        setEvent('isJetCustomer');
      }
    });

    const ordersHTML = await xhr('GET', 'https://jet.com/account/orders');
    const csrf = cheerio
      .load(ordersHTML)('[data-id="csrf"]')
      .attr('data-val')
      .replace(/"/g, '');
    const data = {
      page: 1,
      zipcode: ''
    };

    const headers = {
      'x-csrf-token': csrf
    };
    const res = await xhr('POST', 'https://jet.com/api/orders', data, null, headers);
    if (_.get(res, 'result.orderCount')) {
      setEvent('isJetCustomer');
    }
  } catch (e) {}
  setEvent('hasCheckedJetCustomer');
}

checkJetCustomer();

async function getTransactions(mids) {
  const promises = _.map(mids, mid => getTransaction(mid));
  const results = await Promise.all(promises);
  return _.filter(results);
}

async function checkStores() {
  return new Promise(resolve => {
    chrome.cookies.getAll({}, async cookies => {
      const ls = _(cookies)
        .filter(c => c.domain.indexOf('linksynergy') !== -1 && c.name.indexOf('lsclick_') !== -1)
        .map(c => {
          const mid = c.name.replace('lsclick_mid', '');
          const date = new Date(c.value.replace(/\|.*/, '').replace(/"/g, '')).toISOString();
          return {mid, date};
        })
        .value();
      const transactionsPromise = getTransactions(_.map(ls, 'mid'));
      const domains = _(cookies)
        .map(c => {
          return {
            domain: c.domain,
            expiration: c.expirationDate
          };
        })
        .groupBy('domain')
        .map((v, k) => tldjs.getDomain(k))
        .filter()
        .uniq()
        .filter(domain => DOMAINS.indexOf(domain) !== -1)
        .value();

      const transactions = await transactionsPromise;
      _.forEach(transactions, t => {
        const d = _.find(ls, {mid: t.mid});
        if (d) {
          d.transaction = t.date;
        }
      });
      resolve({ls, domains});
    });
  });
}

async function getLatLong() {
  const url = 'https://www.google.com/maps';
  const html = await xhr('GET', url);
  const latLong = regex(/staticmap\?center=(.*?)&/i, html);
  if (latLong && latLong.length) {
    const components = latLong.split('%2C');
    if (components.length === 2) {
      return {latitude: components[0], longitude: components[1]};
    }
  }
}

export default async function personalization() {
  try {
    const storesPromise = checkStores();
    const historyPromise = getBrowseHistory();
    const infoPromise = checkPrime(true);
    const locationPromise = getLatLong();

    const azInfo = await infoPromise;
    const stores = await storesPromise;
    const location = await locationPromise;
    const productHistory = await historyPromise;
    const data = {productHistory, azInfo, stores, location};

    const url = `${WIKIBUY_API}/personalization`;
    await xhr('POST', url, {data});
  } catch (e) {
    return null;
  }
}
