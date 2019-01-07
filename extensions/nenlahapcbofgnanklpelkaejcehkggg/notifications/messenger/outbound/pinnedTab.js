import invoke from 'messenger';
import sendMetric from 'utility/sendMetric';
import hasFeature from 'utility/hasFeature';

const whiteList = {
  'www.newbalance.com': true,
  'www.finishline.com': true,
  'www.ashleyfurniture.com': true,
  'www.basspro.com': true
};

export default data => {
  return invoke('pinnedTab', data).then(res => {
    if (!hasFeature('disable_mark_request') && !whiteList[window.location.hostname]) {
      window.location.href = `${window.location.protocol}//${window.location.hostname}${
        window.location.pathname
      }?afsrc=1&ha=1`;
      sendMetric('track', 'markAfsrc');
    }
    return res;
  });
};
