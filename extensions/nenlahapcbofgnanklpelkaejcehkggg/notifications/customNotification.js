import _ from 'lodash';
import {React} from 'utility/css-ns';
import CustomNotification from 'pages/CustomNotification';
import {Route} from 'react-router';
import loadApp from 'utility/loadApp';
import siteCache from 'messenger/outbound/siteCache';
import currentDomain from 'utility/currentDomain';
import getCustomNotification from 'messenger/outbound/getCustomNotification';
import tree from 'state';
import $ from 'jquery';

function checkValue(identifier) {
  if (identifier.type === 'url') {
    return !!document.URL.match(identifier.value);
  } else if (identifier.type === 'title') {
    return document.title.match(identifier.value);
  } else if (identifier.type === 'selector') {
    return !!$(identifier.value).length;
  }
}

function evaluate(identifiers) {
  if (identifiers.and) {
    const count = _(identifiers.and)
      .map(identifier => checkValue(identifier))
      .filter()
      .value().length;
    return count === identifiers.and.length;
  } else if (identifiers.or) {
    const count = _(identifiers.or)
      .map(identifier => checkValue(identifier))
      .filter()
      .value().length;
    return !!count;
  }
}

function checkNotifications(notifications) {
  return _.find(notifications, n => evaluate(n.identifiers));
}

function checkRunWithCoupons(siteData, notification) {
  if (_.has(notification, 'runWithCoupons')) {
    const runningCoupons = !_.get(siteData, 'coupons.ignoreSite');
    if ((runningCoupons && notification.runWithCoupons !== false) || !runningCoupons) {
      return true;
    }
    return false;
  } else {
    return true;
  }
}

async function init() {
  try {
    const custom = await getCustomNotification();
    // Check if the notification has been engaged with in the last hour
    if (custom && custom.engaged) {
      return false;
    }
    const {siteData} = await siteCache();
    const notifications = _.filter(
      siteData.notifications,
      n => n.enabled !== false && checkRunWithCoupons(siteData, n)
    );
    const notificationPage = checkNotifications(notifications);

    if (notificationPage && notifications.length) {
      tree.set('customNotificationData', notifications);
      loadApp({
        initialRoute: '/customNotification',
        cssUrl: 'GENERATED/customNotification.css',
        route: <Route path="customNotification" component={CustomNotification} />
      });
    }
  } catch (e) {}
}

if (document.readyState !== 'loading') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}
