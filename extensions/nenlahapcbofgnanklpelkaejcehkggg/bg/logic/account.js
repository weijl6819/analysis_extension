import {getSession} from 'api/session';
import hasFeature from 'utility/hasFeature';
import {identify, track} from 'utility/analytics';
import localStore from 'storage/local';
import {reloadSetting} from 'storage/settings';
import tree from 'state';
import {WIKIBUY_URL, SESSION_COOKIE} from 'constants';
import {getMerchantVisits} from 'api/personalization';
import {updateAdobeDMP} from 'api/adobedmp';
import _ from 'lodash';

let prefCheck = 0;

export async function refreshSession(options) {
  if (options && options.clearLastAccount) {
    clearLastAccount();
  }
  const session = await getSession();
  if (session && session.sessionHeaderExpired) {
    clearLastAccount();
  }
  if (session && session.id) {
    tree.set('session', session);
    identify(session.id);
    const isShadowAccount = (session.roles || []).indexOf('shadow') > -1;
    localStore.set({userId: session.id});
    localStore.set({isShadowAccount});
    chrome.cookies.get({url: WIKIBUY_URL, name: SESSION_COOKIE}, e => {
      if (e && e.value) {
        tree.set('sessionToken', e.value);
        const lastAccountSession = {sessionToken: e.value, ...session};
        localStore.set({lastAccountSession});
        tree.set('lastAccountSession', lastAccountSession);
      } else {
        tree.set('sessionToken', '');
      }
    });
  }
  await reloadSetting();
  if (Date.now() > prefCheck) {
    prefCheck = Date.now() + 24 * 60 * 60 * 1000;
    track(
      'extSettings',
      _.omit(tree.get('settings'), ['firstname', 'lastname', 'username', 'hasAgreedToTerms'])
    );
    updateAdobeDMP();
  }

  const {lastMerchantVisitCheck} = await localStore.get('lastMerchantVisitCheck');
  if (Date.now() > (lastMerchantVisitCheck || 0) && hasFeature('merchant_visit_check')) {
    localStore.set({lastMerchantVisitCheck: Date.now() + 120 * 60 * 60 * 1000}); // 5 days
    getMerchantVisits();
  }
}

function clearLastAccount() {
  localStore.set({lastAccountSession: null});
  tree.set('lastAccountSession', null);
}

localStore.get('lastAccountSession').then(({lastAccountSession}) => {
  if (lastAccountSession) {
    tree.set('lastAccountSession', lastAccountSession);
  }
});

refreshSession();
setInterval(() => {
  refreshSession();
}, 1000 * 60 * 60);
