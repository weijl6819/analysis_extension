import _ from 'lodash';

import * as DeweyAsync from 'iv-dewey';
import hasFeature from 'utility/hasFeature';

import $ from 'jquery';
import {exponential} from 'backoff';
import sendMetric from 'utility/sendMetric';

let dewey;

function shouldMeasurePerf() {
  const measurePerf = hasFeature('perf_samp');
  return measurePerf;
}

function getDeweyInterface() {
  window.__wb_timing.deweyUtilRequireAt = performance.now();
  //  differ until needed, hasFeatures uses tree.session which is not immediatly available
  let selectedVersion, deweyMode;
  function getADeweyVersion() {
    if (selectedVersion) {
      return selectedVersion;
    }
    deweyMode = 'async';

    const aDewey = new DeweyAsync.Dewey();
    aDewey._isasync = true;
    aDewey.setDocument(document);
    aDewey.setParser($);
    selectedVersion = aDewey;

    let pageTypeCompleteFired = false;

    selectedVersion.startAttempt = 0;
    selectedVersion.deweyMode = deweyMode;
    selectedVersion.pageTypeComplete = (nPageType, callsite) => {
      if (pageTypeCompleteFired) {
        return;
      }
      pageTypeCompleteFired = true;
      window.__wb_timing.deweyPageTypeFoundAt = performance.now();
      const timeFromPageInit = performance.now() - window.__wb_timing.docStartAt;
      const timeFromDomLoadInit = performance.now() - window.__wb_timing.DOMContentLoadedAt;
      const timeFromDeweyStart = performance.now() - window.__wb_timing.deweyStartAt;
      const metricProps = {
        url: window.location.href,
        deweyAttempt: selectedVersion.startAttempt,
        deweyMode,
        pageType: nPageType,
        pageTypeTimes: {
          timeFromPageInit,
          timeFromDomLoadInit,
          timeFromDeweyStart
        },
        callsite
      };
      // console.log('final dewey page type', metricProps, {deweyMode, timeFromDeweyStart})
      if (hasFeature('perf_samp')) {
        sendMetric('track', 'deweyPageTypeTiming', metricProps);
      }
    };
    selectedVersion.emitter.on('result', result => {
      const pageType = _.get(result, 'pageType');
      if (pageType) {
        selectedVersion.pageTypeComplete(pageType, 'emitter');
      }
    });
    selectedVersion.emitter.on('perf', perfData => {
      if (shouldMeasurePerf()) {
        const myDewey = getADeweyVersion();
        const {result, rootSpan} = perfData;
        const {pageType} = result;

        const allSpans = DeweyAsync.flattenSpans(rootSpan);
        const syncSpans = _.filter(allSpans, span => span.childCount === 0 || span.isSync);
        const longSpans = _.filter(syncSpans, span => span.duration > 1);
        // console.log('longSpans', longSpans);
        const timingInfo = {
          runDuration: rootSpan.duration,
          // allSpans,
          longSpansStr: JSON.stringify(longSpans),
          maxSyncSpanDuration: _.chain(syncSpans)
            .maxBy('duration')
            .get('duration')
            .value()
        };
        const metricProps = {
          url: window.location.href,
          deweyAttempt: myDewey.startAttempt,
          pageType,
          timingInfo,
          deweyMode
        };
        sendMetric('track', 'deweyRunTiming', metricProps);
      }
    });
    return selectedVersion;
  }
  let started = false;
  //  old dewey interface but using async version of dewey
  const anAsyncDewey = {
    get deweyMode() {
      const myDewey = getADeweyVersion();
      return myDewey.deweyMode;
    },
    get startAttempt() {
      const myDewey = getADeweyVersion();
      return myDewey.startAttempt;
    },
    setDefaultConfig: nConfig => {
      const myDewey = getADeweyVersion();
      myDewey.setDefaultConfig(nConfig);
      // console.log('dewey config', nConfig)
    },
    get emitter() {
      const myDewey = getADeweyVersion();
      return myDewey.emitter;
    },
    evaluateIdentifierTree: async (identifiers, deweyDoc) => {
      const myDewey = getADeweyVersion();
      if (myDewey._isasync) {
        const evalDocument = deweyDoc;
        const parser = deweyDoc.deweyParser;
        const matchTypes = {
          url: 0,
          title: 0,
          selectors: []
        };
        const input = {identifiers, parser, evalDocument, matchTypes};
        const res = await DeweyAsync.evaluateIdentifierTree(input);
        return res;
      } else {
        return myDewey.evaluateIdentifierTree(identifiers, deweyDoc);
      }
    },
    run: async (input, trigger) => {
      const myDewey = getADeweyVersion();
      const result = await myDewey.run(input, trigger);
      return result;
    },
    start: () => {
      if (started) {
        return;
      }
      started = true;
      const startDate = performance.now();
      window.__wb_timing.deweyStartAt = startDate;
      //  run dewey until we get a pageType
      const exponentialBackoff = exponential({
        randomisationFactor: 0,
        initialDelay: 50,
        maxDelay: 3000
      });
      async function runDewey() {
        const myDewey = getADeweyVersion();
        myDewey.startAttempt++;
        const result = await anAsyncDewey.run();
        // console.log('run result', result);
        const pageType = _.get(result, 'pageType');
        const totalTimeElapsed = performance.now() - startDate;
        if (!pageType && totalTimeElapsed < 5000) {
          exponentialBackoff.backoff();
        } else {
          const myDewey = getADeweyVersion();
          myDewey.pageTypeComplete(pageType, 'startup');
        }
      }
      exponentialBackoff.on('ready', runDewey);
      runDewey();
    }
  };
  return anAsyncDewey;
}

if (window.Dewey) {
  dewey = window.Dewey;
} else {
  window.Dewey = getDeweyInterface();
  dewey = window.Dewey;
}

export default dewey;
