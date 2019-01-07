/**
 * WebExtension driver
 */

/** global: browser */
/** global: Wappalyzer */

const wappalyzer = new Wappalyzer();

var tabCache = {};
var headersCache = {};
var categoryOrder = [];

(function (i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
    (i[r].q = i[r].q || []).push(arguments)
  }, i[r].l = 1 * new Date(); a = s.createElement(o),
    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
ga('create', 'UA-94112226-10', 'auto');
ga('set', 'checkProtocolTask', function () { });
// ga('require', 'displayfeatures');

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == 'install') {
    chrome.tabs.create({ url: 'https://app.snov.io/techcheck' }, function (tab) {
    });

    ga('send', 'event', {
      eventCategory: 'Snovio_Tech_Ext',
      eventAction: 'install',
    });
  }
});

browser.tabs.onRemoved.addListener(tabId => {
  tabCache[tabId] = null;
});

/**
 * Get a value from localStorage
 */
function getOption(name, defaultValue) {
  return new Promise((resolve, reject) => {
    const callback = item => {
      resolve(item.hasOwnProperty(name) ? item[name] : defaultValue);
    };

    browser.storage.local.get(name)
      .then(callback)
      .catch(error => wappalyzer.log(error, 'driver', 'error'));
  });
}

/**
 * Set a value in localStorage
 */
function setOption(name, value) {
  var option = {};

  option[name] = value;

  browser.storage.local.set(option);
}

/**
 * Open a tab
 */
function openTab(args) {
  browser.tabs.create({
    url: args.url,
    active: args.background === undefined || !args.background
  });
}

/**
 * Make a POST request
 */
function post(url, body) {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(response => {
      // response.json().then(data => {alert(JSON.stringify(data))});
      wappalyzer.log('POST ' + url + ': ' + response.status, 'driver');
    })
    .catch(error => {
      wappalyzer.log('POST ' + url + ': ' + error, 'driver', 'error');
    });
}

fetch('../apps.json')
  .then(response => {
    return response.json();
  })
  .then(json => {
    wappalyzer.apps = json.apps;
    wappalyzer.categories = json.categories;

    categoryOrder = Object.keys(wappalyzer.categories).sort((a, b) => wappalyzer.categories[a].priority - wappalyzer.categories[b].priority);

    wappalyzer.parseJsPatterns();
  })
  .catch(error => {
    wappalyzer.log('GET apps.json: ' + error, 'driver', 'error');
  });

// Version check
var version = browser.runtime.getManifest().version;

getOption('version')
  .then(previousVersion => {
    if (previousVersion === null) {
      openTab({
        url: wappalyzer.config.websiteURL + 'installed'
      });
    } else if (version !== previousVersion) {
      getOption('upgradeMessage', false)
        .then(upgradeMessage => {
          if (upgradeMessage) {
            openTab({
              url: wappalyzer.config.websiteURL + 'upgraded?v' + version,
              background: true
            });
          }
        });
    }

    setOption('version', version);
  });

// Run content script
var callback = tabs => {
  tabs.forEach(tab => {
    if (tab.url.match(/^https?:\/\//)) {
      browser.tabs.executeScript(tab.id, {
        file: 'js/content.js'
      });
    }
  })
};

browser.tabs.query({})
  .then(callback)
  .catch(error => wappalyzer.log(error, 'driver', 'error'));

// Capture response headers
browser.webRequest.onCompleted.addListener(request => {
  var responseHeaders = {};

  if (request.responseHeaders) {
    var url = wappalyzer.parseUrl(request.url);

    request.responseHeaders.forEach(function (header) {
      if (!responseHeaders[header.name.toLowerCase()]) {
        responseHeaders[header.name.toLowerCase()] = []
      }
      responseHeaders[header.name.toLowerCase()].push(header.value || '' + header.binaryValue);
    });

    if (headersCache.length > 50) {
      headersCache = {};
    }

    if (/text\/html/.test(responseHeaders['content-type'][0])) {
      if (headersCache[url.canonical] === undefined) {
        headersCache[url.canonical] = {};
      }

      Object.keys(responseHeaders).forEach(header => {
        headersCache[url.canonical][header] = responseHeaders[header].slice();
      });
    }
  }
}, { urls: ['http://*/*', 'https://*/*'], types: ['main_frame'] }, ['responseHeaders']);

// Listen for messages
(chrome || browser).runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (typeof message.id != 'undefined') {
    if (message.id !== 'log') {
      wappalyzer.log('Message received' + (message.source ? ' from ' + message.source : '') + ': ' + message.id, 'driver');
    }

    var response;

    switch (message.id) {
      case 'log':
        wappalyzer.log(message.message, message.source);

        break;
      case 'analyze':
        var url = wappalyzer.parseUrl(sender.tab.url);

        if (headersCache[url.canonical] !== undefined) {
          message.subject.headers = headersCache[url.canonical];
        }

        wappalyzer.analyze(url, message.subject, {
          tab: sender.tab
        });

        break;
      case 'ad_log':
        wappalyzer.cacheDetectedAds(message.subject);

        break;
      case 'get_apps':
        response = {
          tabCache: tabCache[message.tab.id],
          apps: wappalyzer.apps,
          categories: wappalyzer.categories
        };

        break;
      case 'init_js':
        response = {
          patterns: wappalyzer.jsPatterns
        };

        break;
      default:
    }

    sendResponse(response);
  }
});

wappalyzer.driver.document = document;

/**
 * Log messages to console
 */
wappalyzer.driver.log = (message, source, type) => {
  console.log('[wappalyzer ' + type + ']', '[' + source + ']', message);
};

/**
 * Display apps
 */
wappalyzer.driver.displayApps = (detected, meta, context) => {
  var tab = context.tab;

  tabCache[tab.id] = tabCache[tab.id] || { detected: [] };

  tabCache[tab.id].detected = detected;

  if (Object.keys(detected).length) {
    getOption('dynamicIcon', false)
      .then(dynamicIcon => {
        var appName, found = false;

        // Find the main application to display
        categoryOrder.forEach(match => {
          Object.keys(detected).forEach(appName => {
            var app = detected[appName];

            app.props.cats.forEach(category => {
              if (category === match && !found) {
                var icon = app.props.icon || 'default.svg';

                if (!dynamicIcon) {
                  icon = 'default.svg';
                }

                if (/\.svg$/i.test(icon)) {
                  icon = 'converted/' + icon.replace(/\.svg$/, '.png');
                }

                try {
                  browser.pageAction.setIcon({
                    tabId: tab.id,
                    path: '../images/icons/' + icon
                  });
                } catch (e) {
                  // Firefox for Android does not support setIcon see https://bugzilla.mozilla.org/show_bug.cgi?id=1331746
                }

                found = true;
              }
            });
          });
        });

        if (typeof chrome !== 'undefined') {
          // Browser polyfill doesn't seem to work here
          chrome.pageAction.show(tab.id);
        } else {
          browser.pageAction.show(tab.id);
        }
      });
  }
};

/**
 * Fetch and cache robots.txt for host
 */
wappalyzer.driver.getRobotsTxt = (host, secure = false) => {
  return new Promise((resolve, reject) => {
    getOption('tracking', true)
      .then(tracking => {
        if (!tracking) {
          return resolve([]);
        }

        getOption('robotsTxtCache')
          .then(robotsTxtCache => {
            robotsTxtCache = robotsTxtCache || {};

            if (host in robotsTxtCache) {
              resolve(robotsTxtCache[host]);
            } else {
              const url = 'http' + (secure ? 's' : '') + '://' + host + '/robots.txt';

              fetch('http' + (secure ? 's' : '') + '://' + host + '/robots.txt')
                .then(response => {
                  if (!response.ok) {
                    if (response.status === 404) {
                      return '';
                    } else {
                      throw 'GET ' + response.url + ' was not ok';
                    }
                  }

                  return response.text();
                })
                .then(robotsTxt => {
                  robotsTxtCache[host] = wappalyzer.parseRobotsTxt(robotsTxt);

                  setOption('robotsTxtCache', robotsTxtCache);

                  resolve(robotsTxtCache[host]);
                })
                .catch(reject);
            }
          });
      });
  });
};

/**
 * Anonymously track detected applications for research purposes
 */
wappalyzer.driver.ping = (hostnameCache, adCache) => {
  getOption('tracking', true)
    .then(tracking => {
      if (tracking) {
        if (Object.keys(hostnameCache).length) {
          post('https://app.snov.io/api/saveData', { data: hostnameCache });
        }

        if (adCache.length) {
          // post('https://app.snov.io/log/wp/', adCache);
        }

        setOption('robotsTxtCache', {});
      }
    });
};
