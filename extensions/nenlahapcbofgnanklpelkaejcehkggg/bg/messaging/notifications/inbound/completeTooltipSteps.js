import tree from 'state';
import _ from 'lodash';
import {setEvent} from 'api/preferences';

export default async request => {
  if (request.step === 'notificationTooltip') {
    setEvent('hasSeenNotificationTooltip');
    updateSettings('hasSeenNotificationTooltip');
  } else if (request.step === 'notificationAffiliateTooltip') {
    setEvent('hasSeenNotificationAffiliateTooltip');
    updateSettings('hasSeenNotificationAffiliateTooltip');
  } else if (request.step === 'modalTooltip') {
    setEvent('hasSeenModalTooltip');
    updateSettings('hasSeenModalTooltip');
  } else {
    setEvent(request.step);
    updateSettings(request.step);
  }
};

function updateSettings(eventName) {
  const obj = {};
  obj[eventName] = Date.now();
  let events = _.cloneDeep(tree.get(['settings', 'events']));
  events = _.merge(events, obj);
  tree.set(['settings', 'events'], events);
}
