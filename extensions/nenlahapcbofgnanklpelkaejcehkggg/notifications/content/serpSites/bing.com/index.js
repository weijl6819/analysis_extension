export default async () => {
  return {
    itemSelector: '#b_results .b_algo',
    linkSelector: 'h2 a',
    injectAfterSelector: '.b_caption > :last-child',
    additionalClass: 'serp-page-bing'
  };
};
