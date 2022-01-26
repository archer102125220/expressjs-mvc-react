import { GET_userList, POST_userRegistered, POST_userLogin } from '@services/client/userList';

export default {

  namespace: 'userList',

  state: {
    userToken: '',
    userList: []
  },

  effects: {
    *POST_UserLogin({ payload }, { call, put, select }) {
      try {
        const { account, password, rememberMe } = payload;
        const token = yield call(POST_userLogin, { account, password });
        if (token !== '查無資料') {
          yield put({ type: 'SAVE_user_token', payload: token });
          yield put({ type: 'system/message_success', payload: '登入成功!' });
          localStorage.setItem('rememberMe', rememberMe);
          if (rememberMe === true) {
            localStorage.setItem('token', token);
          }
          const videoList = yield select(state => state.videoList?.videoList) || [];
          if (videoList.length <= 0) yield put({ type: 'videoList/GET_VideoList', payload: token });
        } else {
          yield put({ type: 'system/message_error', payload: '帳號或密碼錯誤!' });
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') console.log(error);
        console.log('user login error');
        yield put({ type: 'system/message_error', payload: '登入失敗!' });
      }
    },
    *GET_UserList({ payload }, { call, put, select }) {
      try {
        const token = yield select(state => state.userList?.userToken || '');
        const data = yield call(GET_userList, payload, token);
        yield put({ type: 'SAVE_user_list', payload: data });
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') console.log(error);
        console.log('get user list error');
      }
    },
    *POST_UserRegistered({ payload }, { call, put }) {
      try {
        yield call(POST_userRegistered, payload);
        yield put({ type: 'system/message_success', payload: '註冊成功!' });
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') console.log(error);
        console.log('get user list error');
        yield put({ type: 'system/message_error', payload: '註冊失敗!' });
      }
    },
    *SOCKET_UserList({ payload, callback, loading, token }, { call, put }) {  // eslint-disable-line
      // const data = yield call(GET_userList, 'testEvent', payload, token);
      yield put({ type: 'SAVE_user_list', payload: payload });
    },
  },

  reducers: {
    SAVE_user_token(state, { payload }) {
      // document.cookie = `token=${payload}`;
      return { ...state, userToken: payload };
    },
    SAVE_user_list(state, { payload }) {
      return { ...state, userList: payload };
    },
    SAVE_test(state, { payload }) {
      return { ...state, test: payload };
    },
  },

};
