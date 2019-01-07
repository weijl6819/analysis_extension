import tree from 'state';
import xhr from 'utility/xhr';
import * as analytics from 'utility/analytics';

const settingsCursor = tree.select('settings');

export default (request, tab) => {
  const url = 'https://wikibuy.com/api/v1/zip/' + request.zipcode;
  return xhr('GET', url)
    .then(result => {
      if (!result.city || !result.state) {
        analytics.trackError('zipcodeFailureError', `invalid zip code for ${request.zipcode}`);
      }
      // Store address if we have a full address
      if (result.street_line_1) {
        settingsCursor.set('address', result);
      }
      return result;
    })
    .catch(err => {
      analytics.trackError('zipcodeFailureError', `zip code service error for ${request.zipcode}`);
      return {error: 'Zipcode error'};
    });
};
