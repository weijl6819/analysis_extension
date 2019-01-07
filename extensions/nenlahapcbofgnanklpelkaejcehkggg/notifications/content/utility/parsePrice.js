export default function parsePrice(price) {
  return parseInt(price.replace(/[^0-9]/gi, ''));
}
