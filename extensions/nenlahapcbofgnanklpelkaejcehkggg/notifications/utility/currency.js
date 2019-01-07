export default function currency(input, roundDown) {
  input = input ? new String(input) : '';
  input = input.replace(/\$|\.|\,|\-/g, '');
  let result = '';
  if (input || input === 0) {
    if (typeof input !== 'string') {
      input = String(input);
    }
    if (input.length === 1) {
      result = '$0.0' + input;
    } else if (input.length === 2) {
      result = '$0.' + input;
    } else {
      result = '$' + input.substring(0, input.length - 2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      result = roundDown ? result : result + '.' + input.substr(-2);
    }
  }
  return result;
}
