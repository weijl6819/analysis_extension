export default function openWithoutReferrer(url) {
  var meta = document.createElement('meta');
  meta.name = 'referrer';
  meta.content = 'no-referrer';
  meta.id = 'no-referrer';
  document.getElementsByTagName('head')[0].appendChild(meta);
  window.open(url);
  document.getElementById('no-referrer').remove();
}
