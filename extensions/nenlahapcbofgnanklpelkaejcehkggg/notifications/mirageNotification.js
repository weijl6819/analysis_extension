import _ from 'lodash';
import {React} from 'utility/css-ns';
import MirageNotification from 'pages/MirageNotification';
import {Route} from 'react-router';
import loadApp from 'utility/loadApp';
import siteCache from 'messenger/outbound/siteCache';
import {getContentApiNotification} from 'actions/contentApiActions';
import * as dewey from 'iv-dewey';
import tree from 'state';
import $ from 'jquery';

window.__wb_timing.mirageNoteRequireAt = performance.now();

let notificationLoaded;

async function evaluateIdentifiers(identifiers) {
  if (!identifiers) {
    return;
  }
  const deweyDoc = document;
  deweyDoc.deweyParser = $;
  deweyDoc.html = document.documentElement.innerHTML;
  const result = await dewey.evaluateIdentifierTree(identifiers, deweyDoc);
  if (result) {
    return true;
  }
}

async function checkToShowNotification(deweyResult) {
  if (notificationLoaded) {
    return;
  }
  notificationLoaded = true;
  const notification = await getContentApiNotification({deweyResult});
  if (notification && !notification.error) {
    tree.set('mirageNotification', notification);
    loadApp({
      initialRoute: '/mirageNotification',
      cssUrl: 'GENERATED/mirageNotification.css',
      route: <Route path="mirageNotification" component={MirageNotification} />
    });
  }
}

async function init() {
  try {
    const {siteData} = await siteCache();
    const res = await evaluateIdentifiers(_.get(siteData, 'mirageNotification.identifiers'));
    if (!res) {
      return;
    }
    if (tree.get(['deweyResult'])) {
      checkToShowNotification(tree.get(['deweyResult']));
    } else {
      dewey.emitter.on('result', async result => {
        checkToShowNotification(result);
      });
    }
  } catch (e) {}
}

if (document.readyState !== 'loading') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}
