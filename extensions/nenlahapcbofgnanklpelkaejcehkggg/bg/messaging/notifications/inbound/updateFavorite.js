import {addFavorite, deleteFavorite} from 'api/favorite';

export default async (data, tab) => {
  if (data.favorite) {
    return await deleteFavorite({productId: data.id});
  } else {
    return await addFavorite({productId: data.id});
  }
};
