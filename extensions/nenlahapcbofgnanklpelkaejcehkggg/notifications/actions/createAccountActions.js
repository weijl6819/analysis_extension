import tree from 'state';
import createWikibuyAccount from 'messenger/outbound/createWikibuyAccount';
import _ from 'lodash';

export async function createInstantAccount({email}) {
  let success;
  try {
    await createWikibuyAccount({email});
    success = true;
  } catch (err) {}

  return success;
}
