import tree from 'state';
import sendMetric from 'utility/sendMetric';
import _ from 'lodash';
import getGoogleContacts from 'messenger/outbound/getGoogleContacts';

export async function getContactsFromBg(data) {
  const contacts = await getGoogleContacts(data);
  if (!_.get(data, 'contacts')) {
    sendMetric('track', 'importGoogleContactsSuccessful', {pageLocation: 'extension'});
  }

  tree.set(['googleData'], contacts);
  return contacts;
}
