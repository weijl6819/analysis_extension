import invoke from 'messenger';

export default term => {
  return invoke('amazonAutoComplete', {term});
};
