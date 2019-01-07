import tree from 'state';
import localStore from 'storage/local';

export default ({path, value, persistKey}, tab) => {
  tree.set(path, value);
  if (persistKey) {
    localStore.set({[persistKey]: value});
  }
};
