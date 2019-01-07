import tree from 'state';
import moment from 'moment';

export default ({vendor}, tab) => {
  tree.set(['miniCashbackTabState', vendor], moment().format());
};
