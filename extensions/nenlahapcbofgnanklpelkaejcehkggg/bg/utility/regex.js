export default function regex(pattern, string) {
  const matches = pattern.exec(string);
  if (matches && matches.length) {
    return matches[1];
  }
  return null;
}
