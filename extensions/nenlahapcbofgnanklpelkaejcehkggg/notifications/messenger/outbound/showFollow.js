import invoke from 'messenger';

export default function showFollow(data) {
  return invoke('showFollow', data);
}
