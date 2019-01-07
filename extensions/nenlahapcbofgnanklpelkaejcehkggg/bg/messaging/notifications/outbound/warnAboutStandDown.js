import {invokeInTab} from '../index';
import * as analytics from 'utility/analytics';

export default (tabId, data) => {
  analytics.track('warnAboutStandDown');
  return invokeInTab(tabId, 'warnAboutStandDown', data);
};
