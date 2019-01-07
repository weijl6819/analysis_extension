import tree from 'state';

export default function isFullAccount() {
  const session = tree.get(['session']);
  return session && session.roles && session.roles.indexOf('shadow') === -1;
}
