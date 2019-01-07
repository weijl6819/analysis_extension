import _ from 'lodash';
import {React} from 'utility/css-ns';
import App from 'components/App';
import {Route} from 'react-router';
import hasFeature from 'utility/hasFeature';
import loadApp from 'utility/loadApp';
import tree from 'state';
import * as actions from 'actions/notificationActions';

export default function loadNotification() {
  const settings = tree.get('settings');
  const prefs = _.get(settings, 'notificationPreferences');
  if (hasFeature('notif_style_hidden') || (prefs && prefs.notificationStyle === 'button')) {
    return false;
  }
  loadApp(
    {
      initialRoute: '/offers',
      cssUrl: 'GENERATED/offers.css',
      disableDelay: true,
      setupInPageComponent: true,
      waitForElement: true,
      maxWaitAttemps: 20,
      insertAfter: [
        '#price_feature_div',
        '#pmpux_feature_div',
        '#MediaMatrix',
        '#coursewarePrice',
        '#ask_feature_div',
        '#averageCustomerReviews_feature_div'
      ],
      route: <Route path="offers" component={App} />
    },
    () => {
      actions.appReady();
    }
  );
}
