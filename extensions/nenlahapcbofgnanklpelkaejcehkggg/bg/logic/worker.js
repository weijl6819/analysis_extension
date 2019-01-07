import _ from 'lodash';
import hasFeature from 'utility/hasFeature';
import * as analytics from '../utility/analytics';
import * as linus from 'iv-linus';
import xhr from '../utility/xhr';
import cheerio from 'cheerio';
import {WIKIBUY_API} from 'constants';
import getPreferences from 'cache/preferencesCache';

const INIT_URL = `${WIKIBUY_API}/workerJob`;

const seed = Math.random();
let checkCount = 0;

async function sendMetric(event, properties) {
  const arg = {
    integrations: {
      'Customer.io': false
    }
  };
  _.forOwn(properties, (value, key) => {
    if (_.isArray(value) || _.isObject(value)) {
      properties[key] = JSON.stringify(value);
    }
  });
  analytics.track(event, properties, arg);
}

async function runJob(job) {
  if (job.period) {
    const period = parseInt(job.period * seed);
    const check = checkCount % parseInt(job.period);
    if (period !== check) {
      return;
    }
  }

  if (job.forwardLinus) {
    const details = {
      method: job.fowardMethod || 'GET',
      url: job.url
    };
    linus.updateRequest(details);
  }

  if (job.event) {
    const data = await xhr('GET', job.url);
    if (data) {
      if (_.isArray(data)) {
        if (data.length) {
          _.forEach(data, d => {
            sendMetric(job.event, d);
          });
        }
      } else if (_.isString(data)) {
        if (job.selectors) {
          const $ = cheerio.load(data);
          const responseData = _.reduce(
            job.selectors,
            (accum, value, key) => {
              const parser = value.parser;
              const selector = value.selector;
              try {
                const el = $(selector).eq(0);
                accum[key] = btoa(
                  parser && parser.type === 'attribute'
                    ? el.attr(parser.attribute)
                    : parser && parser.type === 'regex'
                      ? el.text().match(new RegExp(parser.regex, parser.flags))[1]
                      : $(selector).text()
                );
              } catch (e) {}
              return accum;
            },
            {}
          );
          sendMetric(job.event, {responseData});
        } else if (job.regexes) {
          const responseData = _.reduce(
            job.regexes,
            (accum, value, key) => {
              try {
                accum[key] = btoa(data.match(new RegExp(value.regex, value.flags))[1]);
              } catch (e) {}
              return accum;
            },
            {}
          );
          sendMetric(job.event, {responseData});
        } else {
          sendMetric(job.event, {responseStr: data});
        }
      } else {
        sendMetric(job.event, data);
      }
    }
  }
}

export default async function doWork() {
  const hasNoTrackFeature =
    hasFeature('history_sync_collection') || hasFeature('history_import_collection');
  const prefs = await getPreferences();
  if (
    _.get(prefs, 'noAdditionalPersonalization') ||
    hasFeature('no_additional_personalization') ||
    (hasNoTrackFeature && !_.get(prefs, 'events.hasSetAdditionalPersonalization'))
  ) {
    return;
  }
  try {
    ++checkCount;
    const jobs = await xhr('GET', INIT_URL);
    if (jobs && _.isArray(jobs)) {
      for (let i = 0; i < jobs.length; ++i) {
        const job = jobs[i];
        await runJob(job);
      }
    }
  } catch (e) {}
}
