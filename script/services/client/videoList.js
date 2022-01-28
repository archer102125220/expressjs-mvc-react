import fetch from '@utils/client/request';

export function GET_videoList(payload = {}, token) {
  return fetch('GET', '/videos', payload, {
    headers: {
      // eslint-disable-next-line no-useless-escape
      Authorization: token.replace(/\"/g, '')
    }
  });
}
export function GET_video(payload = '', token) {
  return fetch('GET', `/videos/${payload}`, null, {
    headers: {
      // eslint-disable-next-line no-useless-escape
      Authorization: token.replace(/\"/g, '')
    }
  });
}

export function POST_videoUpload(payload = {}, token, onUploadProgress = () => { }) {
  return fetch('POST', '/videos/upload', payload, {
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