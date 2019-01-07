import {reportIssue} from 'api/reportIssue';

export default async ({type, data}) => {
  return reportIssue(type, data);
};
