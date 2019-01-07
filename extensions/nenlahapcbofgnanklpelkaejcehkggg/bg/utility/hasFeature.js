import tree from 'state';

export default function hasFeature(feature) {
  const features = tree.get(['session', 'features']) || [];
  return features.indexOf(feature) > -1;
}
