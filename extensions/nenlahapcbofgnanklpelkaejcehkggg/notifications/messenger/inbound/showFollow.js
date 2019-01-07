import tree from 'state';
import Promise from 'bluebird';
import initNotificationApp from 'messenger/outbound/initNotificationApp';

export default async data => {
  tree.set('followView', {
    resultData: data
  });
  initNotificationApp({name: 'follow'});
};
