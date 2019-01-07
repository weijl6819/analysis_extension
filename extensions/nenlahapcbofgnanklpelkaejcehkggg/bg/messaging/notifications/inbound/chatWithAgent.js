import {WIKIBUY_URL} from 'constants';

export default request => {
  chrome.tabs.create(
    {
      url: `${WIKIBUY_URL}/run/${request.runId}/place-order/${request.detail.id}?withChat=true`,
      active: true
    },
    tab => {}
  );
};
