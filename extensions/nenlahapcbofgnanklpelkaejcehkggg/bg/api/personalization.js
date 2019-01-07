import _ from 'lodash';
import {track} from 'utility/analytics';
import Promise from 'bluebird';
import xhr from 'utility/xhr';
import {WIKIBUY_API} from 'constants';
import queryString from 'querystring';

export async function getMerchantVisits() {
  try {
    chrome.cookies.getAll({url: 'http://cg.linksynergy.com'}, async cookies => {
      await Promise.map(
        cookies,
        async c => {
          const m = c.name.match(/lsclick_mid(\d*)/);
          const storeId = _.get(m, '[1]');
          if (storeId) {
            try {
              const h = await xhr(
                'GET',
                `http://cg.linksynergy.com/assets/consumer?token=c62512b92393fba80a7b0552349fc0b694a992d1b9bceeb4d2fe6b7ff5dc09ec&mid=${storeId}`
              );
              const clickDate = c.value.split('|')[0] || '';
              track('merchantTrips', {
                storeId,
                transactionDate: h.transactionDate || null,
                clickDate: clickDate.replace(/"/g, '')
              });
            } catch (err) {}
          }
        },
        {concurrency: 5}
      );
    });
  } catch (err) {}
}

export async function getPersonalizedData(options = {}) {
  return await xhr('GET', `${WIKIBUY_API}/personalizationPage?${queryString.stringify(options)}`);
}
