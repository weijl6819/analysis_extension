import _ from 'lodash';
import $ from 'jquery';
import {WIKIBUY_API} from 'constants';

export default (domain, clickId, channel = 'coupons') => {
  if (/dell\.com\/en-us\/work\/cart/i.test(document.URL)) {
    return `${WIKIBUY_API}/redirect?url=http://dell.com&t=${encodeURIComponent(
      `http://www.dpbolvw.net/click-7882476-10600279?sid=${clickId}`
    )}&clickId=${clickId}&channel=${channel}&r=1`;
  } else if (/cvs\.com\/photo/i.test(document.URL)) {
    return `${WIKIBUY_API}/redirect?url=http://cvs.com&t=${encodeURIComponent(
      `http://www.dpbolvw.net/click-7882476-13016181?url=https%3A%2F%2Fwww.cvs.com%2Fphoto%2Fshop&sid=${clickId}`
    )}&clickId=${clickId}&channel=${channel}&r=1`;
  } else if (
    (/ecomm\.dell\.com/i.test(document.URL) &&
      _.get($('.mNav:contains(Outlet for Home)'), 'length')) ||
    _.get($('.mNav:contains(Outlet for Work)'), 'length')
  ) {
    return `${WIKIBUY_API}/redirect?url=http://dell.com&t=${encodeURIComponent(
      `http://www.anrdoezrs.net/click-7882476-12923553?sid=${clickId}`
    )}&clickId=${clickId}&channel=${channel}&r=1`;
  } else if (domain === 'att.com') {
    if (
      location.pathname.indexOf('/shop/wireless/devices/') > -1 ||
      location.pathname.indexOf('/shop/wireless/deviceconfigurator.html') > -1 ||
      location.pathname.indexOf('checkout/onepagecheckout') > -1 ||
      _.get($('.text-legal p:first-child b:contains(Wireless)'), 'length')
    ) {
      return `${WIKIBUY_API}/redirect?url=http://att.com&t=${encodeURIComponent(
        `https://click.linksynergy.com/deeplink?id=3*BIL10dmOI&mid=13798&u1=${clickId}&murl=${encodeURIComponent(
          location.href
        )}`
      )}&clickId=${clickId}&channel=cashback&r=1`;
    } else {
      return `${WIKIBUY_API}/redirect?url=http://att.com&t=${encodeURIComponent(
        `http://www.dpbolvw.net/click-7882476-12404612?sid=${clickId}`
      )}&clickId=${clickId}&channel=cashback&r=1`;
    }
  } else if (/weightwatchers\.com/.test(document.URL)) {
    if (/\us\/shop/.test(document.URL)) {
      return `${WIKIBUY_API}/redirect?url=http://weightwatchers.com&t=${encodeURIComponent(
        `http://www.pjtra.com/t/8-11187-126336-146437?sid=${clickId}`
      )}&clickId=${clickId}&channel=${channel}&r=1`;
    } else {
      return `${WIKIBUY_API}/redirect?url=http://weightwatchers.com&t=${encodeURIComponent(
        `http://www.kqzyfj.com/click-7882476-10280677?sid=${clickId}`
      )}&clickId=${clickId}&channel=cashback&r=1`;
    }
  } else if (/gilt\.com\/city/.test(document.URL)) {
    return `${WIKIBUY_API}/redirect?url=http://gilt.com&t=${encodeURIComponent(
      `https://click.linksynergy.com/fs-bin/click?id=3*BIL10dmOI&offerid=539629.3&type=3&subid=0&u1=${clickId}`
    )}&clickId=${clickId}&channel=cashback&r=1`;
  }
};
