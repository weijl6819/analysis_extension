import tree from 'state';
import Promise from 'bluebird';

export default async data => {
  tree.merge('followView', {
    hiddenFromWebApp: true
  });
};
