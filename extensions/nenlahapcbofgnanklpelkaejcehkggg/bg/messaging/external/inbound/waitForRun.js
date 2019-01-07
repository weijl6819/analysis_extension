import tree from 'state';
import _ from 'lodash';
import Promise from 'bluebird';

export default ({runId}) => {
  const runCache = tree.select('runCache');
  const runData = runCache.get([runId]) || {};
  const {cart} = runData;
  if (_.get(cart, 'items[0].status') === 'complete') {
    return {
      isRunning: false,
      runUpdated: true,
      cart,
      runId
    };
  } else {
    return new Promise(resolve => {
      runCache.select(runId).on(
        'update',
        () => {
          const runData = runCache.get([runId]) || {};
          const {cart} = runData;
          resolve({
            isRunning: false,
            runUpdated: !!cart,
            cart,
            runId
          });
        },
        {once: true}
      );
    });
  }
};
