import {getPersonalizedData} from 'api/personalization';

export default () => {
  return getPersonalizedData({promosOnly: true});
};
