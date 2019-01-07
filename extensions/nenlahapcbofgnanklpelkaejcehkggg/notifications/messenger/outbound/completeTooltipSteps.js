import invoke from 'messenger';

export default step => {
  return invoke('completeTooltipSteps', {step});
};
