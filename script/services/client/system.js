import fetch from '@utils/client/request';

export function GET_homePage(payload = {}) {
  return fetch('GET', '/', payload);
}
