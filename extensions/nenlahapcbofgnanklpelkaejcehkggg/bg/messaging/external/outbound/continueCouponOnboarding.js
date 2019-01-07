import {invokeInTab} from '../index.js';
import _ from 'lodash';
import currentTab from '../../../utility/currentTab';
import {WIKIBUY_URL} from 'constants';
let jcrewTab = {};

export default async data => {
  const jId = jcrewTab.id || 0;
  const ct = await currentTab();
  try {
    chrome.tabs.get(jId, s => {
      if (s) {
        chrome.tabs.update(jId, {selected: true, active: true});
        chrome.tabs.remove(ct.id);
        return invokeInTab(jId, 'continueCouponOnboarding', data);
      } else {
        chrome.tabs.query({url: `${WIKIBUY_URL}/*`}, t => {
          t = _.get(t, '[0]', t);
          chrome.tabs.update(t.id, {selected: true, active: true});
          chrome.tabs.remove(ct.id);
        });
      }
    });
  } catch (err) {
    chrome.tabs.query({url: `${WIKIBUY_URL}/*`}, t => {
      t = _.get(t, '[0]', t);
      chrome.tabs.update(t.id, {selected: true, active: true});
      chrome.tabs.remove(ct.id);
    });
  }
};

export function setTab(t) {
  jcrewTab = t;
}
