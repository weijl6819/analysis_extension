import Promise from 'bluebird';
export default function delay(interval) {
  return new Promise(function(resolve) {
    setTimeout(resolve, interval);
  });
}
