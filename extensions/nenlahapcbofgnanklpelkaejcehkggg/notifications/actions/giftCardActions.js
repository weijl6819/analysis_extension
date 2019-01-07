import tree from 'state';
import giftCardMessenger from 'messenger/outbound/giftCardMessenger';
import currentDomain from 'utility/currentDomain';

export function throttleNotification() {
  giftCardMessenger({domain: currentDomain(), message: 'throttle'});
}
