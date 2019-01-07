import tree from 'state';
export default feedbackData => {
  tree.set(['notification', 'feedbackData'], feedbackData);
};
