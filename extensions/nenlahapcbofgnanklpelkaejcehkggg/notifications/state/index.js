import Baobab from './baobab';
import {branch, root} from 'higher-order/baobab';
import _ from 'lodash';

const loaders = [];
const tree =
  window.tree ||
  new Baobab(
    {
      notification: {
        run: null,
        relatedRuns: null,
        lastSavings: 0,
        currentSavings: 0,
        updating: false,
        showModal: false,
        details: null,
        showOnboarding: false,
        activeRunId: false
      },
      messages: []
    },
    {immutable: false}
  );

if (!window.tree) {
  window.tree = tree;
}

tree.on('get', e => {
  const solvedPath = e.data.solvedPath;
  const path = solvedPath ? solvedPath.join('.') : false;
  const data = e.data.data;
  const pathLoader = _.find(loaders, {path});
  if (pathLoader && pathLoader.loader) {
    pathLoader.loader(data, e.data.solvedPath);
  }
});

export function addLoader(path, loader) {
  if (_.find(loaders, {path})) {
    throw new Error('Only one loader per path');
  }
  loaders.push({path, loader});
}

export default tree;
