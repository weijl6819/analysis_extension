import findHotel, {searchBetweenTwoPoints, findMultple} from 'logic/hotelstorm';

export default async data => {
  if (data.type === 'searchBetweenTwoPoints') {
    searchBetweenTwoPoints(data);
    return;
  }
  if (data.type === 'findMultiple' && data.hotels && data.hotels.length) {
    return findMultple(data.hotels, data.meta);
  }
  return findHotel(data);
};
