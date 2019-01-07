// Utility (mainly for Dewey) that keeps track of which apps are loading and loaded
import fetchLoadingApps from 'messenger/outbound/fetchLoadingApps';
import delay from 'utility/delay';
import Promise from 'bluebird';

if (!window.__wbLoadingApps) {
  window.__wbLoadingApps = new Set([]);
}
if (!window.__wbPreloadedApps) {
  window.__wbPreloadedApps = new Set([]);
}

export async function getLoadingApps() {
  if (!window.__wbLoadingAppsFetched) {
    window.__wbLoadingApps = new Set(await fetchLoadingApps());
    __wbPreloadedApps.forEach(app => {
      window.__wbLoadingApps.delete(app);
    });
    window.__wbLoadingAppsFetched = true;
  }
  return window.__wbLoadingApps;
}

export async function appLoaded(app) {
  if (window.__wbLoadingApps.size === 0) {
    __wbPreloadedApps.add(app);
  } else {
    window.__wbLoadingApps.delete(app);
  }
}

export async function waitForApps(apps) {
  await Promise.map(apps, async app => {
    window.__wbLoadingApps = await getLoadingApps();
    while (window.__wbLoadingApps.has(app)) {
      await delay(50);
      window.__wbLoadingApps = await getLoadingApps();
    }
  });
}
