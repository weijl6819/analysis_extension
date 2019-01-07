import {
  getData,
  addVote,
  deleteVote,
  addComment,
  deleteComment,
  fetchComments,
  addData,
  getMetaData,
  addAdvice,
  deleteAdvice,
  setEndpoint
} from 'iv-feedback';
import {FEEDBACK_BASE} from 'constants';

setEndpoint(FEEDBACK_BASE);

export {
  getData,
  addVote,
  deleteVote,
  addComment,
  deleteComment,
  fetchComments,
  addData,
  getMetaData,
  addAdvice,
  deleteAdvice
};
