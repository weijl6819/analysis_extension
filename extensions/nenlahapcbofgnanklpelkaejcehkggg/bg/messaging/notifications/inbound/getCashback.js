import getCashback from 'logic/cashback';

export default async (data, tab) => {
  return await getCashback({url: tab.url});
};
