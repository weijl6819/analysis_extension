import {parse} from 'url';
import querystring from 'querystring';
import _ from 'lodash';

export default function setUTM(url, queryParams) {
  const parsedUrl = parse(url);
  const params = querystring.parse(parsedUrl.query);
  const query = querystring.stringify(_.assign({}, params, queryParams));
  return `${parsedUrl.protocol}//${parsedUrl.hostname}${parsedUrl.pathname}${
    query ? `?${query}` : ''
  }`;
}
