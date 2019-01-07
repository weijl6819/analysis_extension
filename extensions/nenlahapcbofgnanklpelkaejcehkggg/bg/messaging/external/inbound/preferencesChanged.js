import _ from 'lodash';
import {reloadSetting} from 'storage/settings';

const debounceReloadSetting = _.debounce(reloadSetting, 1000);
export default function() {
  debounceReloadSetting();
}
