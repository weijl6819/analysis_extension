export default function getSeller() {
  const el = document.getElementById('merchant-info');
  if (el) {
    return el.innerText;
  }
  return null;
}
