import {checkPrime} from 'logic/onboarding';
import _ from 'lodash';

export default async () => {
  return checkPrime()
    .then(prime => {
      return {
        prime
      };
    })
    .catch(err => {
      return {
        error: true,
        prime: false
      };
    });
};
