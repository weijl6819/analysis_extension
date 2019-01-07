import {getData as getFeedbackData} from 'logic/feedback';

export default async data => {
  return getFeedbackData(data);
};
