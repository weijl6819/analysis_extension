import {addAdvice} from 'logic/feedback';
import getPreferences from 'cache/preferencesCache';
import {updatePreferences} from 'api/preferences';
import {reloadSetting} from 'storage/settings';

export default async data => {
  const prefs = await getPreferences();
  if (prefs && !prefs.username && data.username) {
    updatePreferences({
      username: data.username
    }).then(() => {
      reloadSetting();
    });
  }
  return addAdvice(data);
};
