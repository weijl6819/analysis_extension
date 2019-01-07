import {WIKIBUY_URL} from 'constants';
import * as analytics from '../utility/analytics';
import currentTab from '../utility/currentTab';
import {showInactiveIcon} from './activeMonitor';
import showSiteHub from 'messaging/notifications/outbound/showSiteHub';
import getSiteDomainFromUrl from 'utility/getSiteDomainFromUrl';
import hasFeature from 'utility/hasFeature';
import getSite from 'cache/siteCache';
import tree from 'state';
import Promise from 'bluebird';
import _ from 'lodash';

function checkForCommon(tab) {
  return new Promise(resolve => {
    chrome.tabs.sendMessage(tab.id, {type: 'isCommonLoaded'}, response => {
      resolve({loadCommon: response && response.loaded ? false : true});
    });
  })
    .timeout(1000)
    .catch(e => {
      console.log(e);
    });
}

function checkSiteHub(tab, siteData) {
  return new Promise(resolve => {
    chrome.tabs.sendMessage(tab.id, {type: 'isCommonLoaded'}, response => {
      showSiteHub(tab.id, {site: siteData}).then(loadApp => {
        resolve({loadApp});
      });
    });
  })
    .timeout(1000)
    .catch(e => {
      return {loadApp: true};
      console.log(e);
    });
}

function resetStandDown({domain, tab, siteData}) {
  if (
    (tree.get(['couponsDisabledSites', `${domain}_${tab.id}`]) ||
      tree.get(['couponsDisabledSites', `${domain}_all`]) ||
      tree.get(['couponsAffiliateDisabledSites', `${domain}_${tab.id}`]) ||
      tree.get(['couponsAffiliateDisabledSites', `${domain}_all`])) &&
    (!_.get(siteData, 'siteData.flags.siteHubStandDown') && domain !== 'booking.com')
  ) {
    tree.set(['couponsDisabledSites', `${domain}_${tab.id}`], 0);
    tree.set(['couponsDisabledSites', `${domain}_all`], 0);
    tree.set(['couponsAffiliateDisabledSites', `${domain}_${tab.id}`], 0);
    tree.set(['couponsAffiliateDisabledSites', `${domain}_all`], 0);
  }
}

chrome.browserAction.onClicked.addListener(async () => {
  const tab = await currentTab();
  const session = tree.get('session');
  if (
    hasFeature('ext_alert_unverified') &&
    session &&
    session.roles &&
    session.roles.indexOf('unverified') > -1
  ) {
    chrome.tabs.create({url: `${WIKIBUY_URL}/onboarding?unverified=true`, active: true}, tab => {
      if (tab) {
        showInactiveIcon(tab.id);
      }
    });
  } else if (tab) {
    const domain = getSiteDomainFromUrl(tab.url);
    const siteData = await getSite(domain);
    resetStandDown({domain, tab, siteData});
    if (domain && domain.indexOf('www.') === 0) {
      const parentDomain = domain.replace('www.', '');
      resetStandDown({domain: parentDomain, tab, siteData});
    }
    const commonInfo = await checkForCommon(tab);
    const loadInfo = await checkSiteHub(tab, siteData);
    if (commonInfo && commonInfo.loadCommon && loadInfo && loadInfo.loadApp) {
      chrome.tabs.executeScript(tab.id, {file: '/GENERATED/commons.js'}, () => {
        chrome.tabs.executeScript(tab.id, {file: '/GENERATED/sitehub.js'});
      });
    } else if (loadInfo && loadInfo.loadApp) {
      chrome.tabs.executeScript(tab.id, {file: '/GENERATED/sitehub.js'});
    }
  } else {
    chrome.tabs.create({url: `${WIKIBUY_URL}/home`, active: true});
  }
  analytics.track('browserAction');
});
