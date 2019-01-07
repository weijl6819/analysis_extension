import * as logger from 'iv-client-logger';
import {WHISPER_URL, LOGGER_URL, WHISPER_HEARTBEAT} from 'constants';
import tree from 'state';
import hasFeature from 'utility/hasFeature';
import {Whisper} from 'iv-whisper-client/dist/whisper';

logger.config(LOGGER_URL, 'iv-whisper');

let whisper;
let checkinIntervalId;
let userId;

function teardownSocket() {
  if (whisper) {
    whisper.disconnect();
  }
}

function setupSocket() {
  if (whisper) {
    // already connected
    return;
  }

  // Get current user
  userId = tree.get(['session', 'id']);

  whisper = new Whisper(['wikibuy_webapp_whisper'], {
    host: WHISPER_URL,
    secure: true,
    key: 'FB7CE2DBFD59E3B00A26690B35B6CEAF'
  });
}

tree.select('session').on('update', () => {
  if (userId !== tree.get(['session', 'id'])) {
    teardownSocket();
    if (hasFeature('ext_iv_whisper_v2')) {
      setupSocket();
    }
  }
});
