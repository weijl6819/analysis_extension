import {showActiveIcon, showInactiveIcon} from 'monitors/activeMonitor';

export default (data, tab) => {
  if (data && data.active) {
    showActiveIcon(tab.id, data);
  } else {
    showInactiveIcon(tab.id);
  }
};
