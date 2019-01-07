import _ from 'lodash';
import LRU from 'lru-cache';

const runs = {};
const cancelledRuns = LRU({
  max: 15,
  maxAge: 1000 * 20 // 20 seconds
});

const SOFT_RUN_TTL = 1000 * 60 * 4.5; // 4.5 min
const HARD_RUN_TTL = 1000 * 60 * 6; // 6 min

export default (data, tab) => {
  try {
    const {action, script, total, removed, coupon, coupons, store, ignoreCancelled} = data;

    if (cancelledRuns.has(tab.id)) {
      cancelledRuns.del(tab.id);
      // ignoreCancelled is to fix sitehub retrying within the 20 second window.
      if (!ignoreCancelled) {
        return {action: 'cancelled'};
      }
    }

    if (runs[tab.id] && new Date().getTime() > runs[tab.id].startTime + HARD_RUN_TTL) {
      // cancels run and does not show UI (meant for cases where a user closed the window / domain and comes back to it much later on)
      cancelRun(tab);
      return;
    }

    if (
      action !== 'error' &&
      runs[tab.id] &&
      new Date().getTime() > runs[tab.id].startTime + SOFT_RUN_TTL
    ) {
      // cancels run and shows "no savings found" UI (meant for cases where the run is simply taking too long).
      // we need to let errors pass through because this function throws an error, which circles back through with an "error" action.
      throw new Error('Run timed out');
    }

    if (action === 'pageLoad') {
      setPageLoaded(tab, true);
    } else if (action === 'saveCoupon') {
      saveCoupon(tab, coupon);
    } else if (action === 'saveTotal') {
      saveTotal(tab, total);
    } else if (action === 'codeRemoved') {
      setPreviousCodeRemoved(tab, removed);
    } else if (action === 'next') {
      const next = getNextAction(tab);
      return next;
    } else if (action === 'init') {
      initRun(tab, script, coupons, store);
    } else if (action === 'cancel') {
      cancelRun(tab);
    } else if (action === 'error') {
      return finishWithError(tab);
    } else if (action === 'nextCode') {
      /* get the next code or, if we just tried the last code
      and the page reloaded, re-send the last code
      for ui purposes */
      return (
        getNextCode(runs[tab.id]) ||
        (beforeCodeSavings(runs[tab.id]) && _.last(runs[tab.id].coupons).code)
      );
    }
  } catch (e) {
    return {
      error: {message: e.message},
      action: 'error'
    };
  }
};

const states = [
  // Order matters (e.g. beforePageReload must come before beforeCodeSavings)
  {
    identifer: beforePageReload,
    next: tab => {
      return {
        action: 'wait'
      };
    }
  },
  {
    identifer: beforeInitialTotal,
    next: tab => {
      return {
        action: 'getTotal',
        script: runs[tab.id].script
      };
    }
  },
  {
    identifer: beforeCodeSavings,
    next: tab => {
      return {
        action: 'getTotal',
        script: runs[tab.id].script
      };
    }
  },
  {
    identifer: beforePreviousCodeRemoved,
    next: tab => {
      setPageLoaded(tab, false);
      const run = getRun(tab);
      if (run.script.promoRemoveAction) {
        return {
          action: 'removePrevious',
          script: run.script,
          lastCodeHadSavings: lastCodeHadSavings(run)
        };
      } else {
        // Don't bother sending it down; skip to the next code
        setPreviousCodeRemoved(tab, false);
        return getNextAction(tab);
      }
    }
  },
  {
    identifer: beforeNextCode,
    next: tab => {
      setPageLoaded(tab, false);
      const run = getRun(tab);
      return {
        action: 'tryCode',
        script: run.script,
        code: getNextCode(run)
      };
    }
  },
  {
    identifer: beforeBestCodeApplied,
    next: tab => {
      const run = getRun(tab);
      const bestCoupon = getBestCoupon(runs[tab.id].results);
      runs[tab.id].finalTotal = 'pending';
      if (bestCoupon) {
        return {
          applyingBestCode: true,
          action: 'tryCode',
          script: run.script,
          code: bestCoupon.code
        };
      } else {
        // Finish without applying a code
        const run = _.cloneDeep(runs[tab.id]);
        run.finalTotal = run.originalTotal;
        cancelRun(tab);
        return {
          action: 'finish',
          result: formatResult(run)
        };
      }
    }
  },
  {
    identifer: beforeFinalTotal,
    next: tab => {
      return {
        action: 'getTotal',
        script: runs[tab.id].script
      };
    }
  },
  {
    identifer: beforeFinish,
    next: tab => {
      const run = _.cloneDeep(runs[tab.id]);
      delete runs[tab.id];
      return {
        action: 'finish',
        result: formatResult(run)
      };
    }
  }
];

function getNextAction(tab) {
  const run = getRun(tab);
  if (!run) {
    return null;
  }
  return _.find(states, state => state.identifer(run)).next(tab);
}

/**
/ State getters
**/

function beforePageReload(run) {
  if (run.script.reload) {
    return (beforeCodeSavings(run) || beforeFinish(run)) && !run.loaded;
  }
}

function beforeInitialTotal(run) {
  return run.originalTotal === null;
}

function beforeCodeSavings(run) {
  return run.results.length && _.isUndefined(_.last(run.results).savings);
}

function beforeNextCode(run) {
  return (
    (run.results.length &&
      !_.isUndefined(_.last(run.results).savings) &&
      !_.isUndefined(_.last(run.results).removed) &&
      run.results.length < run.coupons.length) ||
    !run.results.length
  );
}

function beforePreviousCodeRemoved(run) {
  return (
    run.results.length &&
    !_.isUndefined(_.last(run.results).savings) &&
    _.isUndefined(_.last(run.results).removed)
  );
}

function beforeFinalTotal(run) {
  return (
    run.results.length === run.coupons.length &&
    !_.isUndefined(_.last(run.results).savings) &&
    run.finalTotal === 'pending'
  );
}

function beforeFinish(run) {
  return run.finalTotal !== null;
}

function beforeBestCodeApplied(run) {
  return (
    run.results.length === run.coupons.length &&
    !_.isUndefined(_.last(run.results).savings) &&
    run.finalTotal === null
  );
}

/**
/ State setters
**/

function initRun(tab, script, coupons, store) {
  const run = {
    startTime: new Date().getTime(),
    script,
    coupons,
    store,
    originalTotal: null,
    finalTotal: null,
    lastCoupon: null,
    results: [],
    error: null
  };

  runs[tab.id] = run;
}

function saveTotal(tab, total) {
  const run = getRun(tab);
  if (beforeInitialTotal(run)) {
    runs[tab.id].originalTotal = total;
    runs[tab.id].currentTotal = total;
  } else if (beforeFinalTotal(run)) {
    runs[tab.id].finalTotal = total;
  } else if (beforeCodeSavings(run)) {
    const lastIndex = runs[tab.id].results.length - 1;

    let savings;

    if (runs[tab.id].currentTotal === total) {
      savings = 0;
    } else {
      savings = runs[tab.id].originalTotal - total;
      runs[tab.id].currentTotal = total;
    }

    runs[tab.id].results[lastIndex].savings = savings;
  }
}

function setPreviousCodeRemoved(tab, removed) {
  const lastIndex = runs[tab.id].results.length - 1;
  runs[tab.id].results[lastIndex].removed = removed;
}

function saveCoupon(tab, coupon) {
  const run = getRun(tab);
  if (!beforeFinalTotal(run)) {
    // Don't save the best coupon when we apply it at the end
    runs[tab.id].results.push(coupon);
  }
}

function cancelRun(tab) {
  cancelledRuns.set(tab.id, true);
  delete runs[tab.id];
}

function finishWithError(tab) {
  const run = _.cloneDeep(runs[tab.id]);
  cancelRun(tab);
  run.results = [];
  run.finalTotal = run.originalTotal;
  return formatResult(run);
}

function setPageLoaded(tab, loaded) {
  runs[tab.id].loaded = loaded;
}

/**
/ Helpers
**/

function lastCodeHadSavings(run) {
  return (
    _.chain(run.results)
      .last()
      .get('savings')
      .value() > 0
  );
}

function getRun(tab) {
  return runs[tab.id];
}

function getNextCode(run) {
  return run.coupons[run.results.length] && run.coupons[run.results.length].code;
}

function formatResult(run) {
  return {
    store: run.store,
    coupons: run.results,
    savings: run.originalTotal - run.finalTotal,
    originalTotal: run.originalTotal,
    bestCoupon: getBestCoupon(run.results),
    runTime: new Date().getTime() - run.startTime,
    error: run.error
  };
}

function getBestCoupon(coupons) {
  if (coupons.length) {
    const best = _.orderBy(coupons, ['savings'], ['desc'])[0];
    return best.savings ? best : null;
  }
}
