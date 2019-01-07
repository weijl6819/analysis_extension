function parseYelp() {
  try {
    const latLongEl = document.querySelector('[data-map-state]');
    if (latLongEl) {
      const data = JSON.parse(latLongEl.getAttribute('data-map-state'));
      const latitude = data.center.latitude;
      const longitude = data.center.longitude;
      const title = document.querySelector('h1').innerText.trim();
      const website = document
        .querySelector('.biz-website a')
        .innerText.toLowerCase()
        .trim();
      const address = document.querySelector('.street-address').innerText.trim();
      const phone = document.querySelector('.biz-phone').innerText.trim();
      return {
        latitude,
        longitude,
        title,
        website,
        address,
        phone
      };
    }
  } catch (e) {}
}

export default async () => {
  const data = parseYelp();
  return data;
};
