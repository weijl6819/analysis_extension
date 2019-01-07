import _ from 'lodash';

export default async () => {
  return {
    itemSelector: '.PartialSearchResults-body .PartialSearchResults-item',
    linkSelector: '.PartialSearchResults-item-title a',
    injectAfterFunction: el => _.last(el.children),
    additionalClass: 'serp-page-ask'
  };
};
