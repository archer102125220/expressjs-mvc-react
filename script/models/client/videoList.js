import { GET_videoList, POST_videoUploadTest } from '@services/client/videoList';


export default {

  namespace: 'videoList',

  state: {
    videoList: undefined //[]
  },

  effects: {
    *GET_VideoList({ payload, loading }, { call, put, select }) {
      try {
        if (typeof (loading) === 'function') { loading(true); }
        const token = yield select(state => state.userList?.userToken || '');
        const data = yield call(GET_videoList, payload, token);
        yield put({ type: 'SAVE_video_list', payload: data });
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') console.log(error);
        console.log('get video list error');
      }
      if (typeof (loading) === 'function') { loading(false); }
    },
    *POST_VideoUploadTest({ payload, onUploadProgress, callback, loading }, { call, put, select }) {
      try {
        if (typeof (loading) === 'function') { loading(true); }
        const token = yield select(state => state.userList?.userToken || '');
        const data = yield call(POST_videoUploadTest, payload, token, onUploadProgress);
        // yield put({ type: 'system/message_success', payload: '上傳成功!' });
        yield put({ type: 'system/message_success', payload: data });
        if (typeof (callback) === 'function') { callback(); }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') console.log(error);
        console.log('upload video error');
        yield put({ type: 'system/message_error', payload: '上傳失敗!' });
      }
      if (typeof (loading) === 'function') { loading(false); }
    },
  },

  reducers: {
    SAVE_video_list(state, { payload }) {
      return { ...state, videoList: payload };
    },
  },

};
