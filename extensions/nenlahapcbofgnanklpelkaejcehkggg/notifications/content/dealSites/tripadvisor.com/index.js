import _ from 'lodash';
function parseTripAdvisor() {
  try {
    const mapScript = _.find(document.querySelectorAll('script'), script => {
      if (script.innerText.indexOf('lat: ') > -1) {
        return true;
      }
    });
    if (!mapScript) {
      return;
    }
    const [match, latitude, longitude] = mapScript.innerText.match(
      /lat\:\s([0-9-,.]+),\nlng\:\s([0-9-,.]+),/
    );
    const title = document.querySelector('#HEADING').innerText.trim();
    const address = document.querySelector('.address').innerText.trim();
    const phone = document.querySelector('.blEntry.phone').innerText.trim();
    return {
      latitude,
      longitude,
      title,
      address,
      phone
    };
  } catch (e) {
    console.log(e);
  }
}

export default async () => {
  if (location.pathname.indexOf('/Restaurant_Review') > -1) {
    return parseTripAdvisor();
  }
};
