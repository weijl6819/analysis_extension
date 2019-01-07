import tree from 'state';

export default function isSuspendedAccount() {
  const session = tree.get(['session']);
  return session && session.roles && session.roles.indexOf('suspended') > -1;
}
