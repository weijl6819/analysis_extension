import {React} from 'utility/css-ns';
import SiteHub from 'pages/SiteHub';
import Offers from 'pages/SiteHub/components/Offers';
import VerifyAccount from 'components/VerifyAccount';
import {Route} from 'react-router';
import loadApp from 'utility/loadApp';
import tree from 'state';
import _ from 'lodash';
import getUser from 'messenger/outbound/getUser';
import isSuspendedAccount from 'utility/isSuspendedAccount';

window.__wb_timing.siteHubRequireAt = performance.now();

getUser().then(resp => {
  tree.set(['siteHubView', 'visible'], true);
  tree.set(['siteHubView', 'shown'], true);
  tree.set(['siteHubScriptLoaded'], true);
  tree.set('couponsDisabledSites', _.get(resp, 'couponsDisabledSites'));
  tree.set('couponsAffiliateDisabledSites', _.get(resp, 'couponsAffiliateDisabledSites'));
  tree.set('session', _.get(resp, 'session'));
  tree.set('events', _.get(resp, 'settings.events'));
  tree.set('settings', _.get(resp, 'settings'));
  const Component = isSuspendedAccount() ? VerifyAccount : Offers;
  loadApp({
    initialRoute: '/sitehub/offers',
    cssUrl: 'GENERATED/sitehub.css',
    disableDelay: true,
    route: (
      <Route path="sitehub" component={SiteHub}>
        <Route path="offers" component={Component} />
      </Route>
    )
  });
});
