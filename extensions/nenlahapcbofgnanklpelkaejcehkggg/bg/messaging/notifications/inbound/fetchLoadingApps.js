import tree from 'state';

export default async data => {
  return tree.get('loadingApps');
};
