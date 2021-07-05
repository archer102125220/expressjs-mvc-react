import fetch from '@utils/client/request';

export function GET_userList(payload = {}, token) {
  return fetch('GET', '/api/users', payload, {
    headers: {
      // eslint-disable-next-line no-useless-escape
      Authorization: token.replace(/\"/g, '')
    }
  });
}

export function POST_userRegistered(payload = {}) {
  return fetch('POST', '/api/users/registered', payload);
}

export function POST_userLogin(payload = {}) {
  return fetch('POST', '/api/users/login', payload);// , { withCredentials: true }
}

export function POST_videoUploadTest(payload = {}, token, onUploadProgress = () => { }) {
  return fetch('POST', '/api/users/video_upload_test', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
      // eslint-disable-next-line no-useless-escape
      Authorization: token.replace(/\"/g, '')
    },
    // https://www.jb51.net/article/131209.htm
    onUploadProgress: function (progressEvent) { //原生获取上传进度的事件
      if (progressEvent.lengthComputable) {
        //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
        //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
        onUploadProgress(progressEvent);
      }
    },
  });// , { withCredentials: true }
}