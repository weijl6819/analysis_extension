import getContentApiData from 'messenger/outbound/getContentApiData';
import trackContentApiEvent from 'messenger/outbound/trackContentApiEvent';
import {getContextProperties} from '../utility/getPageContext';
export async function getContentApiStores(contentId) {
  try {
    const data = await getContentApiData({
      contentSlug: 'coupon-complete-offers',
      contentProps: {
        supportedComponents: ['storeContentCard']
      },
      context: getContextProperties()
    });
    return data;
  } catch (err) {
    return null;
  }
}

export async function getContentApiSitehubStores(contentId) {
  try {
    const data = await getContentApiData({
      contentSlug: 'site-hub-offers',
      contentProps: {
        supportedComponents: ['storeContentCard']
      },
      context: getContextProperties()
    });
    return data;
  } catch (err) {
    return null;
  }
}

export async function getContentApiNotification(contentProps) {
  try {
    const data = await getContentApiData({
      contentSlug: 'extension-notification',
      contentProps: {
        supportedComponents: ['extensionDefaultNotification'],
        ...contentProps
      },
      context: getContextProperties()
    });
    return data;
  } catch (err) {
    return null;
  }
}

export async function logImpression(data) {
  try {
    const track = await trackContentApiEvent(data);
    return track;
  } catch (err) {
    console.log(err);
    return null;
  }
}
