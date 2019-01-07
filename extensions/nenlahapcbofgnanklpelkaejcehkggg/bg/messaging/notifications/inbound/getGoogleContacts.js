import * as actions from 'utility/oauthActions';

export default async data => {
  if (data.contacts) {
    return actions.getContacts();
  } else {
    return actions.authWithGoogle();
  }
};
