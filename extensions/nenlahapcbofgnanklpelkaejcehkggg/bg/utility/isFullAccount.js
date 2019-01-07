import tree from 'state';
export default function isFullAccount() {
  const session = tree.get(['session']);
  return session && session.email && session.email.indexOf('shadow.wikibuy.com') === -1;
}
