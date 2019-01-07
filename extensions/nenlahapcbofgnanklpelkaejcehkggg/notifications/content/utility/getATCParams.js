import _ from 'lodash';
export default function getATCParams() {
  const inputs = document.querySelectorAll('#addToCart input[type=hidden]');
  return _.map(inputs, input => {
    return {
      name: input.name,
      value: input.value
    };
  });
}
