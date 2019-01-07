import constants from '../bg/constants';

let browserName = 'chrome';
(async () => {
  if (window.browser && window.browser.runtime && window.browser.runtime.getBrowserInfo) {
    const {name} = await window.browser.runtime.getBrowserInfo();
    browserName = name;
  }
})();

const SEGMENT_ID = constants.SEGMENT_KEY;
const analytics = (window.analytics = window.analytics || []);
if (!analytics.initialize) {
  if (analytics.invoked) {
    window.console && console.error && console.error('Segment snippet included twice.');
  } else {
    analytics.invoked = !0;
    analytics.methods = [
      'trackSubmit',
      'trackClick',
      'trackLink',
      'trackForm',
      'pageview',
      'identify',
      'group',
      'track',
      'ready',
      'alias',
      'page',
      'once',
      'off',
      'on'
    ];
    analytics.factory = function(t) {
      return function() {
        const e = Array.prototype.slice.call(arguments);
        e.unshift(t);
        analytics.push(e);
        return analytics;
      };
    };
    for (let t = 0; t < analytics.methods.length; t++) {
      const e = analytics.methods[t];
      analytics[e] = analytics.factory(e);
    }
    if (browserName !== 'chrome') {
      analytics.settings = {
        Wikibuy: {
          apiKey: SEGMENT_ID,
          apiHost: __ENV__ === 'prod' ? 'track.wikibuy.com' : 'track.dev.ivaws.com',
          addBundledMetadata: true,
          unbundledIntegrations: []
        }
      };
    } else {
      analytics.settings = {
        AdWords: {
          conversionId: '954845542',
          eventMappings: [
            {
              key: '{  "type": "track",  "event": "install_extension" }',
              value: {
                eventName: '{  "type": "track",  "event": "install_extension" }',
                label: 'I7ySCJ3Nx2cQ5pKnxwM',
                conversionId: '',
                remarketing: false
              }
            }
          ],
          pageRemarketing: false
        },
        'Facebook Pixel': {
          initWithExistingTraits: true,
          legacyEvents: {},
          pixelId: '622390247902295',
          standardEvents: {
            extensionInstalled: 'CompleteRegistration'
          },
          valueIdentifier: 'price'
        },
        Hotjar: {
          hjPlaceholderPolyfill: true,
          hjid: '622102'
        },
        'Google Analytics': {
          anonymizeIp: false,
          classic: false,
          contentGroupings: {},
          dimensions: {},
          domain: '',
          doubleClick: false,
          enableServerIdentify: false,
          enhancedEcommerce: false,
          enhancedLinkAttribution: false,
          identifyCategory: '',
          identifyEventName: '',
          ignoredReferrers: [],
          includeSearch: true,
          metrics: {},
          mobileTrackingId: '',
          nameTracker: false,
          nonInteraction: false,
          optimize: '',
          protocolMappings: {},
          reportUncaughtExceptions: false,
          sampleRate: 100,
          sendUserId: false,
          setAllMappedProps: true,
          siteSpeedSampleRate: 1,
          trackCategorizedPages: true,
          trackNamedPages: true,
          trackingId: 'UA-66435804-1',
          useGoogleAmpClientId: false
        },
        Wikibuy: {
          apiKey: SEGMENT_ID,
          apiHost: __ENV__ === 'prod' ? 'track.wikibuy.com' : 'track.dev.ivaws.com',
          addBundledMetadata: true,
          unbundledIntegrations: []
        }
      };
    }
  }
}
