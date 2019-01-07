import {React} from 'utility/css-ns';
import Deals from 'pages/Deals';
import {Route} from 'react-router';
import loadApp from 'utility/loadApp';
import setBrowserAction from 'messenger/outbound/setBrowserAction';
import findDeal from 'messenger/outbound/findDeal';
import tree from 'state';
import initSite from 'content/deals';

async function checkForDeal(data) {
  if (data) {
    const deal = await findDeal(data);
    if (deal) {
      setBrowserAction({active: true});
      tree.set('dealsView', {
        deal,
        queryData: data
      });
      loadApp({
        initialRoute: '/deals',
        cssUrl: 'GENERATED/deals.css',
        route: <Route path="deals" component={Deals} />
      });
    }
  }
}

async function init() {
  const data = await initSite();
  checkForDeal(data);
}

if (document.readyState !== 'loading') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}
