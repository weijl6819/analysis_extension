import searchAmazon from 'logic/search';

export default ({term, lowPrice, highPrice, skipSearch}) => {
  return searchAmazon(term, lowPrice, highPrice, skipSearch);
};
