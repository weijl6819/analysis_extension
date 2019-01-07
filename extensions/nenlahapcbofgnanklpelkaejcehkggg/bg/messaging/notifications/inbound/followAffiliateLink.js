import xhr from 'utility/xhr';

export default async ({url}) => {
  let success = false;
  try {
    await xhr('GET', url);
    success = true;
  } catch (e) {}
  return success;
};
