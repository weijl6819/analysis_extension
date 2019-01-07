import addVoteFeedback from 'messenger/outbound/addVote';
import deleteVoteFeedback from 'messenger/outbound/deleteVote';
import getFeedbackData from 'messenger/outbound/getFeedbackData';
import addCommentFeedback from 'messenger/outbound/addComment';
import deleteCommentFeedback from 'messenger/outbound/deleteComment';
import getMetaDataFeedback from 'messenger/outbound/getMetaData';
import addFeedbackData from 'messenger/outbound/addFeedbackData';
import addAdviceFeedback from 'messenger/outbound/addAdvice';
import deleteAdviceFeedback from 'messenger/outbound/deleteAdvice';
import fetchCommentsFeedback from 'messenger/outbound/fetchComments';
import {WIKIBUY_URL} from 'constants';
import _ from 'lodash';
import Promise from 'bluebird';
import tree from 'state';

function getTypePlural(type) {
  type = type === 'video' ? 'review' : type;
  return type === 'advice' ? type : `${type}s`;
}

async function refreshFeedbackData() {
  const product = tree.get(['ProductPage', 'inputData', 'product']);
  const asin = tree.get(['ProductPage', 'inputData', 'asin']);
  const meta = tree.get(['ProductPage', 'inputData', 'feedback']);
  const userId = tree.get(['session', 'id']);
  const wbpid = product && product.wbpid ? product.wbpid : `amazon.com_${asin}`;
  const feedback = await getFeedbackData({wbpid, userId, product, meta});
  tree.set(['ProductPage', 'feedbackData'], feedback);
}

function getFeedbackById(id, parentId) {
  let type = (parentId || id).split('.')[0];
  if (type === 'video') {
    type = 'review';
  }
  const feedbackData = tree.get(['ProductPage', 'feedbackData']);
  let feedback;
  if (parentId) {
    const parentFeedback = _.find(feedbackData[getTypePlural(type)], {id: parentId});
    feedback = _.find(_.get(parentFeedback, 'comments'), {id});
  } else if (feedbackData) {
    feedback = _.find(feedbackData[getTypePlural(type)], {id});
  }
  return {
    feedback,
    type
  };
}

function setUpdatedFeedback({feedback, updatedFeedback, type, data}) {
  if (data.parent_id) {
    const parentCursor = tree.select([
      'ProductPage',
      'feedbackData',
      getTypePlural(type),
      {id: data.parent_id}
    ]);
    parentCursor.set(['comments', {id: data.id}], updatedFeedback);
    if (data.parent_id === tree.get(['selectedFeedback', 'id'])) {
      // Patch feedback if it is currently selected
      tree.set(['selectedFeedback', 'comments', {id: data.id}], updatedFeedback);
    }
  } else {
    tree.merge(
      ['ProductPage', 'feedbackData', getTypePlural(type), {id: data.id}],
      updatedFeedback
    );
    if (feedback.id === tree.get(['selectedFeedback', 'id'])) {
      // Patch feedback if it is currently selected
      tree.set(['selectedFeedback'], updatedFeedback);
    }
  }
}

function pushNewFeedback({feedback, type}) {
  const items = tree.get(['ProductPage', 'feedbackData', getTypePlural(type)]);
  if (items) {
    items.push(feedback);
    tree.set(['ProductPage', 'feedbackData', getTypePlural(type)], items);
    tree.commit();
  }
}

async function updateComments(feedback) {
  const run = tree.get(['ProductPage', 'run']);
  const asin = tree.get(['ProductPage', 'inputData', 'asin']);
  const wbpid = feedback.wbpid || _.get(run, 'originResult.product.wbpid') || `amazon.com_${asin}`;
  const comments = await fetchCommentsFeedback({wbpid, id: feedback.id, page_size: 20});
  tree.set(['selectedFeedbackComments'], comments);
}

export async function addVote(data) {
  const userId = tree.get(['session', 'id']);
  const {feedback, type} = getFeedbackById(data.id, data.parent_id);
  function patchFeedback(feedback) {
    feedback = _.clone(feedback);
    feedback.up_votes = feedback.up_votes || 0;
    feedback.down_votes = feedback.down_votes || 0;
    feedback.up_votes = data.upVote ? feedback.up_votes + 1 : feedback.up_votes;
    feedback.down_votes = !data.upVote ? feedback.down_votes + 1 : feedback.down_votes;
    if (feedback.vote_selection === 'up_vote') {
      feedback.up_votes -= 1;
    }
    if (feedback.vote_selection === 'down_vote') {
      feedback.down_votes -= 1;
    }
    feedback.vote_selection = data.upVote ? 'up_vote' : 'down_vote';
    return feedback;
  }
  if (feedback) {
    const updatedFeedback = patchFeedback(feedback);
    setUpdatedFeedback({feedback, updatedFeedback, type, data});
  } else {
    // push on if needs to be created for products
    const item = patchFeedback(data);
    pushNewFeedback({feedback: item, type});
  }
  await addVoteFeedback(_.assign({userId}, data));
  await refreshFeedbackData();
}

export async function deleteVote(data) {
  const userId = tree.get(['session', 'id']);
  const {feedback, type} = getFeedbackById(data.id, data.parent_id);
  if (feedback) {
    const updatedFeedback = _.clone(feedback);
    if (updatedFeedback.vote_selection === 'up_vote') {
      updatedFeedback.up_votes -= 1;
    }
    if (updatedFeedback.vote_selection === 'down_vote') {
      updatedFeedback.down_votes -= 1;
    }
    updatedFeedback.vote_selection = null;
    setUpdatedFeedback({feedback, updatedFeedback, type, data});
  }
  await deleteVoteFeedback(_.assign({userId}, data));
  await refreshFeedbackData();
}

export async function setSelectedFeedbackId(data) {
  const {feedback} = getFeedbackById(data.id);
  if (feedback) {
    tree.set(['selectedFeedback'], feedback);
    updateComments(feedback);
  } else {
    const type = data.id.split('.')[0];
    pushNewFeedback({feedback: data, type: type === 'video' ? 'review' : type});
    setSelectedFeedbackId(data);
  }
  clearAddFeedbackType();
}

export function clearSelectedFeedback() {
  tree.set(['selectedFeedback'], null);
  tree.set(['selectedFeedbackComments'], []);
}

export function setAddFeedbackType(type) {
  const productUrl = tree.get(['ProductPage', 'productData', 'url']);
  const runId = tree.get(['ProductPage', 'run', 'id']);
  if (productUrl) {
    window.open(`${WIKIBUY_URL}${productUrl}${runId ? `?run=${runId}` : ''}`);
  } else {
    tree.set(['addFeedbackType'], type);
    clearSelectedFeedback();
  }
}

export function clearAddFeedbackType() {
  tree.set(['addFeedbackType'], null);
}

export async function addComment({wbpid, id, comment, feedbackId, username}) {
  const userId = tree.get(['session', 'id']);
  const email = tree.get(['session', 'email']);
  const run = tree.get(['ProductPage', 'run']);
  const asin = tree.get(['ProductPage', 'inputData', 'asin']);
  wbpid = wbpid || _.get(run, 'originResult.product.wbpid') || `amazon.com_${asin}`;
  await addCommentFeedback({
    wbpid,
    id,
    username:
      username ||
      (email && email.indexOf('shadow.wikibuy.com') === -1 ? email.split('@')[0] : 'anonymous'),
    comment,
    userId
  });
  await updateComments({id: feedbackId});
  const {feedback} = getFeedbackById(feedbackId);
  setUpdatedFeedback({
    feedback,
    updatedFeedback: _.assign(feedback, {comment_count: feedback.comment_count + 1}),
    type: feedback.type,
    data: {id: feedbackId}
  });
  if (username && username !== tree.get(['settings', 'username'])) {
    tree.set(['settings', 'username'], username);
  }
}

export async function deleteComment({id, wbpid, parent_id, feedbackId}) {
  const userId = tree.get(['session', 'id']);
  await deleteCommentFeedback({id, userId});
  await updateComments({id: feedbackId});
  const {feedback} = getFeedbackById(feedbackId);
  setUpdatedFeedback({
    feedback,
    updatedFeedback: _.assign(feedback, {comment_count: feedback.comment_count - 1}),
    type: feedback.type,
    data: {id: feedbackId}
  });
  if (feedbackId === tree.get(['selectedFeedback', 'id'])) {
    // Patch feedback if it is currently selected
    const {feedback} = getFeedbackById(feedbackId);
    tree.set(['selectedFeedback'], feedback);
  }
}

export async function addAdvice({text, username}) {
  const run = tree.get(['ProductPage', 'run']);
  const userId = tree.get(['session', 'id']);
  const email = tree.get(['session', 'email']);
  const asin = tree.get(['ProductPage', 'inputData', 'asin']);
  const wbpid = _.get(run, 'originResult.product.wbpid') || `amazon.com_${asin}`;
  const resp = await addAdviceFeedback({
    wbpid,
    username:
      username ||
      (email && email.indexOf('shadow.wikibuy.com') === -1 ? email.split('@')[0] : 'anonymous'),
    text,
    userId
  });
  await refreshFeedbackData();
  if (username && username !== tree.get(['settings', 'username'])) {
    tree.set(['settings', 'username'], username);
  }
  return resp;
}

export async function deleteAdvice({id, wbpid}) {
  const userId = tree.get(['session', 'id']);
  await deleteAdviceFeedback({id, userId});
  await refreshFeedbackData();
}

export async function getMetaData(...args) {
  const data = await getMetaDataFeedback(...args);
  return data;
}

export async function addData(type, data) {
  const run = tree.get(['ProductPage', 'run']);
  const asin = tree.get(['ProductPage', 'inputData', 'asin']);
  const wbpid = _.get(run, 'originResult.product.wbpid') || `amazon.com_${asin}`;
  const originTitle = _.get(run, 'originResult.product.title');
  const userId = tree.get(['session', 'id']);
  await addFeedbackData(_.assign({}, data, {type, wbpid, userId, originTitle}));
  await Promise.resolve().delay(1000);
  await refreshFeedbackData();
  const feedback = tree.get(['ProductPage', 'feedbackData', getTypePlural(type)]);
  const submittedFeedback = _.find(feedback, f => {
    return f.title === data.title && f.user_id === userId;
  });
  return submittedFeedback;
}
