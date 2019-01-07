import invoke from 'messenger';

export default async data => {
  return invoke('continueCouponOnboarding', data);
};
