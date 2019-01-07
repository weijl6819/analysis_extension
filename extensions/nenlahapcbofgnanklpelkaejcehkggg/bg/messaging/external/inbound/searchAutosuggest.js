import {autosuggest} from 'logic/search';

export default ({term}) => {
  return autosuggest(term);
};
