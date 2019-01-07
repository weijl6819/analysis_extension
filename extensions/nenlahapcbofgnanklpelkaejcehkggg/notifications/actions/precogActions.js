import tree from 'state';
import precogMessenger from 'messenger/outbound/precogMessenger';
import currentDomain from 'utility/currentDomain';

export function throttleNotification() {
  precogMessenger({domain: currentDomain(), message: 'throttle'});
}
