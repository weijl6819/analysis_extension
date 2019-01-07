import generateString from './generateElIdentificationString';

export default function checkParents(el, regex) {
  if (!el || el === document.body) {
    return false;
  }
  const string = generateString(el);
  const match = !!string.match(regex);
  if (match) {
    return true;
  }
  return checkParents(el.parentElement, regex);
}
