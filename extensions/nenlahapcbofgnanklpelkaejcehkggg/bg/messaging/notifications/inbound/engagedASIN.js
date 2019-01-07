import tree from 'state';

export default request => {
  // Push if the asin doesnt exist
  if ((tree.get('engagedASINs') || []).indexOf(request.asin) === -1) {
    tree.push('engagedASINs', request.asin);
  }
};
