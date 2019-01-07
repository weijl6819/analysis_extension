import tree from 'state';
import {completeOnboarding} from 'logic/instant';

const settingsCursor = tree.select('settings');

export default request => {
  settingsCursor.set('prime', request.prime);
  completeOnboarding();
};
