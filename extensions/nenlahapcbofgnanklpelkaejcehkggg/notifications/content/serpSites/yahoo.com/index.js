export default async () => {
  return {
    itemSelector: '#web > ol > li',
    linkSelector: 'h3 a',
    injectAfterSelector: '.dd',
    additionalClass: 'serp-page-yahoo'
  };
};
