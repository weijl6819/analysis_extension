import {fetchComments} from 'logic/feedback';

export default async data => {
  return fetchComments(data);
};
