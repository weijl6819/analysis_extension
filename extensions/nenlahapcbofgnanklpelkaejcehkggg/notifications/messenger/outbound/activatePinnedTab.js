import invoke from 'messenger';
import sendMetric from 'utility/sendMetric';
import currentDomain from 'utility/currentDomain';

const whiteList = {
  'www.newbalance.com': true,
  'www.finishline.com': true,
  'www.ashleyfurniture.com': true,
  'www.basspro.com': true
};

export default data => {
  data.domain = data.domain || currentDomain();
  return invoke('activatePinnedTab', data).then(res => {
    if (res && !res.error && !whiteList[window.location.hostname]) {
      window.location.href = `${window.location.protocol}//${window.location.hostname}${
        window.location.pathname
      }?afsrc=1&ha=1`;
      sendMetric('track', 'markAfsrc', {
        domain: res.domain
      });
    }
    return res;
  });
};
