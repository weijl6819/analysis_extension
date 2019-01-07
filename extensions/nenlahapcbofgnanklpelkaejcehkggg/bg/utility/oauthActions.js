import xhr from './xhr';
import tree from 'state';
import {WIKIBUY_API, ACCOUNT_SERVICE_URL} from 'constants';
import _ from 'lodash';
let openedWindow;
let messageHandlerWrapper;

export async function auth() {
  try {
    const s = tree.get('sessionToken');
    const {url} = await xhr(
      'GET',
      `${ACCOUNT_SERVICE_URL}/third_party/google?redirectUrl=https://wikibuy.com/oauth/google`,
      null,
      null,
      null,
      decodeURIComponent(s)
    );
    return url;
  } catch (err) {
    console.log('Error fetching google oauth url: ', err);
    return false;
  }
}

export async function getContacts(importFlow) {
  const googleData = tree.get('googleData');
  if (googleData && !googleData.error && !_.isEmpty(googleData)) {
    return googleData;
  }

  if (googleData && googleData.error && !importFlow) {
    return null;
  }

  const s = tree.get('sessionToken');
  try {
    const contacts = await xhr(
      'GET',
      `https://wikibuy.com/api/v1/google/contacts`,
      null,
      null,
      null,
      decodeURIComponent(s)
    );
    tree.set('googleData', contacts);
    return contacts;
  } catch (err) {
    return {error: err};
  }
}

export async function authWithGoogle() {
  const googleData = tree.get('googleData');
  if (googleData && !googleData.error && !_.isEmpty(googleData)) {
    return googleData;
  }

  let url = await auth();
  url = _.unescape(url);
  if (!url) {
    throw new Error('Google auth url not set');
  }
  const winWidth = 520;
  const winHeight = 560;
  const winTop = screen.height / 2 - winWidth / 2;
  const winLeft = screen.width / 2 - winHeight / 2;
  openedWindow = window.open(
    url + '&popup=true',
    'Wikibuy',
    'top=' +
      winTop +
      ',left=' +
      winLeft +
      ',toolbar=0,status=0,width=' +
      winWidth +
      ',height=' +
      winHeight
  );
  try {
    return bindMessageHandler();
  } catch (e) {
    return {error: 'contacts not synced'};
  }
}

async function messageHandler(e) {
  const data = e.data;
  if (data && data.type === 'googleAuthComplete') {
    openedWindow.close();
    if (data.data) {
      const c = await getContacts(true);
      if (!c.error) {
        return c;
      }
    } else {
      console.log('no data');
    }
  }
}
function bindMessageHandler() {
  return new Promise((resolve, reject) => {
    unbindMessageHandler();
    messageHandlerWrapper = async e => {
      const contacts = await messageHandler(e);
      resolve(contacts);
    };
    window.addEventListener('message', messageHandlerWrapper, false);
  });
}
function unbindMessageHandler() {
  if (messageHandlerWrapper) {
    window.removeEventListener('message', messageHandlerWrapper);
  }
}
