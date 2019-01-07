let constants = {};

if (__ENV__ === 'local') {
  constants = {
    SEGMENT_KEY: '76Bk8BDfJu5SPmaXzFj9UfcRwpcdbiUD',
    SITE_API: 'https://site.ivf-dev.com/v2',
    SITE_API_V3: 'https://site.ivf-dev.com/v3',
    ORIGIN_SITE_API: 'https://origin-site.dev.ivaws.com/v2',
    WIKIBUY_API: 'http://api.ivf-local.com:3000/v1',
    WIKIBUY_URL: 'http://ivf-local.com:3000',
    WIKIBUY_HOST: 'ivf-local.com',
    INSTANT_URL: 'https://instant.ivf-dev.com/v1',
    WHISPER_URL: 'ws.ivf-dev.com:443',
    WHISPER_HEARTBEAT: 6 * 1000,
    LOGGER_URL: 'http://client-logger-api.dev.ivaws.com/log',
    INSTANT_URL_V2: 'https://instant.ivf-dev.com/v2',
    INSTANT_URL_V2_BASE: 'https://instant.ivf-dev.com',
    FEEDBACK_BASE: 'http://feedback.dev.ivaws.com/api/v1/',
    SESSION_COOKIE: 'wb_session_dev',
    RPC_CHECKIN_INTERVAL: 1000 * 60 * 60 * 1,
    ACCOUNT_SERVICE_URL: 'http://accounts.dev.ivaws.com',
    SS_ENV: 'dev'
  };
} else if (__ENV__ === 'dev') {
  constants = {
    SEGMENT_KEY: '76Bk8BDfJu5SPmaXzFj9UfcRwpcdbiUD',
    SITE_API: 'https://site.ivf-dev.com/v2',
    SITE_API_V3: 'https://site.ivf-dev.com/v3',
    ORIGIN_SITE_API: 'https://origin-site.dev.ivaws.com/v2',
    WIKIBUY_API: 'https://api.ivf-dev.com/v1',
    WIKIBUY_URL: 'https://ivf-dev.com',
    WIKIBUY_HOST: 'ivf-dev.com',
    INSTANT_URL: 'https://instant.ivf-dev.com/v1',
    WHISPER_URL: 'ws.ivf-dev.com:443',
    WHISPER_HEARTBEAT: 6 * 1000,
    LOGGER_URL: 'http://client-logger-api.dev.ivaws.com/log',
    INSTANT_URL_V2: 'https://instant.ivf-dev.com/v2',
    INSTANT_URL_V2_BASE: 'https://instant.ivf-dev.com',
    FEEDBACK_BASE: 'http://feedback.dev.ivaws.com/api/v1/',
    SESSION_COOKIE: 'wb_session_dev',
    RPC_CHECKIN_INTERVAL: 1000 * 60 * 60 * 1,
    ACCOUNT_SERVICE_URL: 'http://accounts.dev.ivaws.com',
    SS_ENV: 'dev'
  };
} else {
  constants = {
    SEGMENT_KEY: 'hoJ2AjJaErOjhma79jutVyqhc4P25Rxc',
    SITE_API: 'https://site.wikibuy.com/v2',
    SITE_API_V3: 'https://site.wikibuy.com/v3',
    ORIGIN_SITE_API: 'https://origin-site.ivaws.com/v2',
    WIKIBUY_API: 'https://wikibuy.com/api/v1',
    WIKIBUY_URL: 'https://wikibuy.com',
    WIKIBUY_HOST: 'wikibuy.com',
    INSTANT_URL: 'https://instant.wikibuy.com/v1',
    WHISPER_URL: 'ws.wikibuy.com:443',
    WHISPER_HEARTBEAT: 2 * 60 * 60 * 1000,
    LOGGER_URL: 'http://client-logger-api.ivaws.com/log',
    INSTANT_URL_V2: 'https://instant.wikibuy.com/v2',
    INSTANT_URL_V2_BASE: 'https://instant.wikibuy.com',
    FEEDBACK_BASE: 'http://feedback.ivaws.com/api/v1/',
    SESSION_COOKIE: 'wb_session',
    RPC_CHECKIN_INTERVAL: 1000 * 60 * 60 * 1,
    ACCOUNT_SERVICE_URL: 'https://accounts.ivaws.com',
    SS_ENV: 'prod'
  };
}

constants.BG_SCRIPT_SOURCE = '__wikibuy_bg';
constants.CONTENT_SCRIPT_SOURCE = '__wikibuy_content';
constants.EXTERNAL_MESSAGING_PORT_NAME = '__wikibuy_external_messages';

constants.BG_INSTANT_SOURCE = '__wikibuy_instant_bg';
constants.CONTENT_INSTANT_SOURCE = '__wikibuy_instant_content';
constants.INSTANT_MESSAGING_PORT_NAME = '__wikibuy_instant_external_messages';

module.exports = constants;
