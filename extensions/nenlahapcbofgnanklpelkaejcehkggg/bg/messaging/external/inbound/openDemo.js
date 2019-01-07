import {setTab} from '../outbound/continueCouponOnboarding';
import currentTab from '../../../utility/currentTab';
export default async data => {
  const tab = await currentTab();
  chrome.tabs.create(
    {url: 'https://www.jcrew.com/checkout2/shoppingbag.jsp?wikibuydemo=true', active: true},
    () => {
      setTab(tab);
    }
  );
};
