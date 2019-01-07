export default function generateString(el) {
  let s = el.tagName.toLowerCase();
  if (el.id) {
    s += '#' + el.id;
  }
  if (el.className) {
    s += el.className.replace(/ /g, '.');
  }
  return s;
}
