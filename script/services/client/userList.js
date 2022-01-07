import fetch from '@utils/client/request';

export function GET_userList(payload = {}, token) {
  return fetch('GET', '/users', payload, {
    headers: {
      // eslint-disable-next-line no-useless-escape
      Authorization: token.replace(/\"/g, '')
    }
  });
}

export function POST_userRegistered(payload = {}) {
  return fetch('POST', '/users/registered', payload);
}

export function POST_userLogin(payload = {}) {
  return fetch('POST', '/users/login', payload);// , { withCredentials: true }
}