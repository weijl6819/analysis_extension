import {React} from 'utility/css-ns';
import {render} from 'react-dom';
import Root from 'components/Root';
import retargetEvents from 'utility/retargetEvents';
import style from 'utility/mountStyle';
import _ from 'lodash';
import tree from 'state';
import delay from 'utility/delay';
import preserveTopPositioning from 'utility/preserveTopPositioning';
import $ from 'jquery';
import {Router, Route, createMemoryHistory} from 'react-router';
import sendMetric from 'utility/sendMetric';
import dewey from 'utility/dewey';
import hasFeature from 'utility/hasFeature';

window.__wb_timing.loadAppRequireAt = performance.now();
if (!_.has(window, '__wb_app_count')) {
  window.__wb_app_count = 0;
}

function setupWebComponent(options) {
  const template = $(`
    <template>
      <style>
        @import "${chrome.runtime.getURL(options.cssUrl)}";
        ${options.loadCommon ? `@import "${chrome.runtime.getURL(options.commonCSS)}";` : ''}
      </style>
      <div class="__wb_container" id="__wikibuy__"><div class="__wikibuy __onTop ${options.additionalClass ||
        ''}"></div></div>
    </templat>`).get(0);
  // @font-face in shadow dom work around
  const mountPoint = $(`<div>${style}</div>`).get(0);
  mountPoint.style.all = 'initial';
  const shadowRoot = mountPoint.attachShadow({mode: 'open'});
  shadowRoot.appendChild(document.importNode(template.content, true));
  if (options && options.insertAfter) {
    const referenceNode = document.querySelector(options.insertAfter);
    referenceNode.parentNode.insertBefore(mountPoint, referenceNode.nextSibling);
  } else if (options && options.insertAfterElement) {
    const referenceNode = options.insertAfterElement;
    referenceNode.parentNode.insertBefore(mountPoint, referenceNode.nextSibling);
  } else {
    preserveTopPositioning(mountPoint);
  }
  return {
    entry: shadowRoot.querySelector('.__wikibuy'),
    shadowRoot,
    mountPoint
  };
}

function setupNonWebComponent(options) {
  const container = document.createElement('div');
  container.setAttribute('class', '__wb_container');
  container.setAttribute('id', '__wikibuy__');
  container.style.all = 'initial';
  $(container).html(`
    <style>
      @import "${chrome.runtime.getURL(options.cssUrl)}";
      ${options.loadCommon ? `@import "${chrome.runtime.getURL(options.commonCSS)}";` : ''}
    </style>
    <div class="__wikibuy __onTop ${options.additionalClass || ''}"></div>
  `);
  if (options && options.insertAfter) {
    const referenceNode = document.querySelector(options.insertAfter);
    referenceNode.parentNode.insertBefore(container, referenceNode.nextSibling);
  } else if (options && options.insertAfterElement) {
    const referenceNode = options.insertAfterElement;
    referenceNode.parentNode.insertBefore(container, referenceNode.nextSibling);
  } else {
    preserveTopPositioning(container);
  }
  return {
    entry: container.querySelector('.__wikibuy'),
    mountPoint: container
  };
}

function findElements(selectors) {
  return !!_.find(selectors, selector => document.querySelector(selector));
}

async function setupInPageComponent(options) {
  const container = document.createElement('div');
  container.setAttribute('class', '__wb_container');
  container.setAttribute('id', '__wikibuy__');
  container.style.all = 'initial';
  const className = `__wikibuy __annotation ${options.additionalClass || ''}`;
  const loadCSS = !document.getElementById('__wikibuy_css');
  $(container).html(`
   ${
     loadCSS
       ? `<link href="${chrome.runtime.getURL(options.cssUrl)}" rel="stylesheet" type="text/css" />`
       : ''
   }
    ${
      options.loadCommon
        ? `<link href="${chrome.runtime.getURL(
            options.loadCommon
          )}" rel="stylesheet" type="text/css" />`
        : ''
    }
    <div class="${className}"></div>
  `);

  if (options.waitForElement) {
    let attempts = 0;
    while (!findElements(options.insertAfter)) {
      await delay(100);
      ++attempts;
      if (options.maxWaitAttemps && attempts >= options.maxWaitAttemps) {
        break;
      }
    }
  }

  if (options && options.insertAfter && options.insertAfter.length) {
    let referenceNode;
    _.forEach(options.insertAfter, selector => {
      if (referenceNode) {
        return;
      }
      referenceNode = document.querySelector(selector);
    });
    if (referenceNode) {
      referenceNode.parentNode.insertBefore(container, referenceNode.nextSibling);
    }
  } else if (options && options.insertAfterElement) {
    const referenceNode = options.insertAfterElement;
    referenceNode.parentNode.insertBefore(container, referenceNode.nextSibling);
  } else {
    preserveTopPositioning(container);
  }
  return {
    entry: container.querySelector(`.__wikibuy.__annotation`),
    mountPoint: container
  };
}

export default async function loadApp(options, cb) {
  window.__wb_app_count++;
  const startAt = performance.now();
  options = _.assign(
    {
      initialRoute: '/notification',
      cssUrl: 'GENERATED/notifications.css',
      commonCSS: 'GENERATED/commons.css'
    },
    options
  );
  const disableCommon = true;
  if ((!options.setupInPageComponent || !tree.get('commonCSSLoaded')) && !disableCommon) {
    if (options.setupInPageComponent) {
      tree.set('commonCSSLoaded', true);
    }
    options.loadCommon = true;
  }
  if (options.deal) {
    tree.set(['notification', 'communityDeal', 'deal'], options.deal);
    tree.set(['notification', 'style'], 'notification');
  }
  const useWebComponent = !!document.head.attachShadow && !options.setupInPageComponent;
  let app;
  if (options.route) {
    const history = createMemoryHistory();
    history.push({pathname: options.initialRoute});
    app = (
      <Router history={history}>
        <Route path="/" component={Root}>
          {options.route}
        </Route>
      </Router>
    );
  } else if (options.app) {
    app = options.app;
  }
  let entry;
  let mountPoint;
  let shadowRoot;
  if (options.setupInPageComponent) {
    const refs = await setupInPageComponent(options);
    entry = refs.entry;
    mountPoint = refs.mountPoint;
  } else if (useWebComponent) {
    const refs = setupWebComponent(options);
    entry = refs.entry;
    shadowRoot = refs.shadowRoot;
    mountPoint = refs.mountPoint;
  } else {
    const refs = setupNonWebComponent(options);
    entry = refs.entry;
    mountPoint = refs.mountPoint;
  }
  // Delay rendering app to hopefully let our styles load and page to settle
  setTimeout(() => {
    if (app && entry) {
      const metricProps = _.reduce(
        window.__wb_timing,
        (c, v, k) => {
          if (_.isNumber(v)) {
            c[k] = v;
          }
          return c;
        },
        {
          loadAppInitialRoute: options.initialRoute,
          loadAppStartAt: startAt,
          loadAppRenderAt: performance.now(),
          loadAppCount: window.__wb_app_count,
          deweyMode: dewey.deweyMode
        }
      );
      // console.log('metricProps', metricProps)
      if (hasFeature('perf_samp')) {
        sendMetric('track', 'loadAppTiming', metricProps);
      }
      render(app, entry);
      if (useWebComponent) {
        retargetEvents(shadowRoot);
      }
    }
    if (cb) {
      cb();
    }
  }, options.disableDelay ? 100 : 1000);
  return mountPoint;
}
