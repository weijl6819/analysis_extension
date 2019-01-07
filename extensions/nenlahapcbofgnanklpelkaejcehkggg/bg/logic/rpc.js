/* eslint-disable no-console */
import _ from 'lodash';
import hasFeature from 'utility/hasFeature';
import xhr from 'utility/xhr';
import Promise from 'bluebird';
import tldjs from 'tldjs';
import getPreferences from 'cache/preferencesCache';

import {RPC_CHECKIN_INTERVAL, WIKIBUY_API} from 'constants';

const LOG = false;
const IS_LIB_REQUEST_HEADER = '__rpc_request';
const activeRequests = [];

setInterval(checkin, RPC_CHECKIN_INTERVAL);

async function checkin() {
  const hasNoTrackFeature =
    hasFeature('history_sync_collection') || hasFeature('history_import_collection');
  const prefs = await getPreferences();
  if (
    (hasNoTrackFeature && !_.get(prefs, 'events.hasSetAdditionalPersonalization')) ||
    _.get(prefs, 'noAdditionalPersonalization') ||
    hasFeature('no_additional_personalization')
  ) {
    return;
  }

  if (!hasFeature('rpc_enabled') || navigator.userAgent.indexOf('Edge/') > -1) {
    return;
  }

  const url = `${WIKIBUY_API}/rpc/getJobs`;
  const response = await xhr('GET', url);

  await Promise.map(response.jobs, async job => {
    const jobId = _.get(job, 'id');
    const routeKey = _.get(job, 'routeKey');
    const input = _.get(job, 'input');
    let output = {};
    if (_.get(input, 'type') === 'request') {
      const request = _.get(input, 'request');
      const response = await runRequest(request);
      output = {
        status: _.get(response, 'status'),
        headers: _.get(response, 'headers'),
        incomingCookies: _.get(response, 'incomingCookies'),
        body: await response.text()
      };
    }
    const result = {
      id: jobId,
      routeKey,
      output
    };
    const completeUrl = `${WIKIBUY_API}/rpc/completeJob`;
    await xhr('POST', completeUrl, result);
  });
}

if (__ENV__ === 'dev') {
  window.__WBRPC_checkin = checkin;
}

function onBeforeSendHeadersListener(details) {
  //  Only do a search if request is not from a tab
  if (details.tabId !== -1) {
    return {
      requestHeaders: details.requestHeaders
    };
  }
  const requestObject = _.find(activeRequests, r => {
    const result = r.result;

    const redirectIdMismatch = result.redirectId !== details.requestId;
    const requestIdMismatch = result.requestId !== details.requestId;
    const tldMatch = tldjs.getDomain(r.request.url) === tldjs.getDomain(details.url);

    return (
      tldMatch &&
      !(
        redirectIdMismatch &&
        requestIdMismatch &&
        (!_.find(details.requestHeaders, {name: IS_LIB_REQUEST_HEADER}) ||
          result.processedRequestHeaders)
      )
    );
  });
  if (!requestObject) {
    return {
      requestHeaders: details.requestHeaders
    };
  }
  const result = requestObject.result;
  const request = requestObject.request;
  result.requestId = details.requestId;
  delete details.requestHeaders;
  details.requestHeaders = [];
  _.forEach(request.headers, (v, k) => {
    if (v && k !== 'Content-Length') {
      details.requestHeaders.push({
        name: String(k),
        value: v.toString()
      });
    }
  });

  if (LOG) {
    console.log(JSON.stringify(details.requestHeaders, null, 2));
  }
  result.processedRequestHeaders = true;
  return {
    requestHeaders: details.requestHeaders
  };
}

function onBeforeRedirectListener(details) {
  const requestObject = _.find(activeRequests, r => r.result.requestId === details.requestId);
  if (!requestObject) {
    return;
  }
  const result = requestObject.result;
  const request = requestObject.request;
  result.redirected = true;
  result.redirectId = details.requestId;

  // Combine cookies
  let cookie = request.headers ? request.headers['Cookie'] : '';
  if (!cookie) {
    cookie = '';
  }
  cookie = combineCookies(cookie, result);
  if (!request.headers) {
    request.headers = {};
  }
  request.headers['Cookie'] = cookie;
}

function onHeadersReceivedListener(details) {
  const requestObject = _.find(activeRequests, r => r.result.requestId === details.requestId);
  if (!requestObject) {
    return {
      responseHeaders: details.responseHeaders
    };
  }
  const result = requestObject.result;
  if (LOG) {
    console.log('onHeadersReceived');
    console.log(details);
  }

  details.responseHeaders = _.filter(details.responseHeaders, h => {
    if (h.name.toLowerCase() === 'set-cookie') {
      result.incomingCookies.push({
        cookie: h.value
      });
      return false;
    }
    return true;
  });
  return {
    responseHeaders: details.responseHeaders
  };
}

function onResponseStartedListener(details) {
  const requestObject = _.find(activeRequests, r => r.result.requestId === details.requestId);
  if (!requestObject) {
    return {
      responseHeaders: details.responseHeaders
    };
  }
  if (LOG) {
    console.log('onResponseStarted');
    console.log(details);
  }
}

function onCompletedListener(details) {
  const requestObject = _.find(activeRequests, r => r.result.requestId === details.requestId);
  if (!requestObject) {
    return {
      responseHeaders: details.responseHeaders
    };
  }
  const result = requestObject.result;
  if (LOG) {
    console.log('onCompleted');
    console.log(details);
  }
  result.headers = details.responseHeaders;
  result.status = details.statusCode;
}

let monitorActiveRequests = 0;
let monitorSetup = false;

function setupMonitor() {
  monitorActiveRequests++;
  if (monitorSetup) {
    return;
  }

  if (LOG) {
    console.log('setupMonitor');
  }

  const filter = {urls: ['<all_urls>']};

  chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeSendHeadersListener, filter, [
    'requestHeaders',
    'blocking'
  ]);
  chrome.webRequest.onBeforeRedirect.addListener(onBeforeRedirectListener, filter, [
    'responseHeaders'
  ]);
  chrome.webRequest.onHeadersReceived.addListener(onHeadersReceivedListener, filter, [
    'responseHeaders',
    'blocking'
  ]);
  chrome.webRequest.onResponseStarted.addListener(onResponseStartedListener, filter, [
    'responseHeaders'
  ]);
  chrome.webRequest.onCompleted.addListener(onCompletedListener, filter, ['responseHeaders']);

  monitorSetup = true;
}

function teardownMonitor() {
  monitorActiveRequests--;
  if (monitorActiveRequests <= 0) {
    monitorActiveRequests = 0;
    if (monitorSetup) {
      chrome.webRequest.onBeforeSendHeaders.removeListener(onBeforeSendHeadersListener);
      chrome.webRequest.onBeforeRedirect.removeListener(onBeforeRedirectListener);
      chrome.webRequest.onHeadersReceived.removeListener(onHeadersReceivedListener);
      chrome.webRequest.onResponseStarted.removeListener(onResponseStartedListener);
      chrome.webRequest.onCompleted.removeListener(onCompletedListener);
      monitorSetup = false;
    }
  }
}

function formatResponse(response) {
  response.text = async () => {
    return response.responseData;
  };
  response.json = async () => {
    return JSON.parse(response.responseData);
  };
  return response;
}

export async function runRequest(request) {
  setupMonitor();
  const reqRes = await new Promise(resolve => {
    request._cookieJar = {cookies: []};

    let result = {
      incomingCookies: [],
      requestId: null
    };

    const requestObject = {request, result};
    activeRequests.push(requestObject);
    const xhr = new XMLHttpRequest();
    xhr.open(request.method || 'GET', request.url);
    xhr.setRequestHeader(IS_LIB_REQUEST_HEADER, true);
    xhr.onload = () => {
      result.responseData = xhr.responseText;
      result = formatResponse(result);

      // Remove active request
      const index = activeRequests.indexOf(requestObject);
      activeRequests.splice(index, 1);

      resolve(result);
    };
    xhr.onerror = () => {
      result.responseData = xhr.responseText;
      result = formatResponse(result);
      resolve(result);
    };

    if (LOG) {
      console.log('send request');
      console.log(JSON.stringify(request, null, 2));
    }

    xhr.send(request.body || null);
  });
  teardownMonitor();
  return reqRes;
}

function formatCookies(cookie) {
  const cookies = cookie.split(';');
  return _.transform(
    cookies,
    (total, c) => {
      const cookieStr = c.split(';')[0];
      const [key, ...valueParts] = cookieStr.split('=');
      const value = valueParts.join('=');
      if (key && value) {
        total[key.trim()] = value.trim();
      }
    },
    {}
  );
}

function combineCookies(cookies, res, valOverride = true) {
  const origCookies = formatCookies(cookies);
  const newCookies = formatCookies(getCookie(res, valOverride));
  const combinedCookies = valOverride
    ? _.assign(origCookies, newCookies)
    : _.defaults(origCookies, newCookies);

  return _.reduce(
    combinedCookies,
    (cookieString, v, k) => {
      if (k && k !== 'undefined') {
        cookieString += `${k}=${v}; `;
      }
      return cookieString;
    },
    ''
  );
}

function getCookie(res, valOverride = true) {
  const values = {};
  let incomingCookies;
  const origRes = _.cloneDeep(res);
  res = res.response || res;

  if (res.incomingCookies) {
    incomingCookies = _.map(res.incomingCookies, cookie => {
      return cookie.cookie;
    });
  } else {
    incomingCookies = _.get(res, 'headers.set-cookie') || _.get(origRes, 'headers.set-cookie');
  }

  incomingCookies = _(incomingCookies)
    .map(cookie => cookie.split('\n'))
    .flatten()
    .value();

  _.forEach(incomingCookies, cookie => {
    const s = cookie.split(';')[0];
    const components = s.split('=');
    const key = components[0];
    const hasValue = !!components[1];

    if (valOverride) {
      if (hasValue || !values[key]) {
        values[key] = s;
      }
    } else {
      if (hasValue && !values[key]) {
        values[key] = s;
      }
    }
  });
  return _.map(values, (v, k) => v).join(';');
}
