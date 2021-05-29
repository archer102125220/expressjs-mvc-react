
import { GET_userList, /*SOCKET_UserList*/ } from '@services/client/userList';

export default {

  namespace: 'userList',

  state: {
    userList: [],
    test: -1
  },

  effects: {
    *GET_UserList({ payload }, { call, put }) {  // eslint-disable-line
      const data = yield call(GET_userList, payload, 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiYWNjb3VudCI6Ik1hcm5pZSIsImVtYWlsIjoiTWFybmllQGIuY29tIiwiYWNjb3VudF9JZCI6IjgwMTQxMDNmLWY5MjMtNGM3OC05M2U0LWQxZGY2YzI4MzI2YSIsImNyZWF0ZWRBdCI6IjIwMjEtMDUtMjlUMDY6MjU6MjguMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjEtMDUtMjlUMDY6MjU6MjguMDAwWiIsImlhdCI6MTYyMjI2OTU0MCwiZXhwIjoxNjIyNTI4NzQwfQ.1GCE_6DPg28qOMQLYHweyJv_VyEbf1mdNLpvzPFJFag');
      yield put({ type: 'set_user_list', payload: data });
    },
    *SOCKET_UserList({ payload, callback, loading, token }, { call, put }) {  // eslint-disable-line
      // const data = yield call(GET_userList, 'testEvent', payload, token);
      yield put({ type: 'set_user_list', payload: payload });
    },

    *TEST_UserList({ payload, callback, loading, token }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'set_test', payload });
    },
  },

  reducers: {
    set_user_list(state, { payload }) {
      return { ...state, userList: payload };
    },
    set_test(state, { payload }) {
      return { ...state, test: payload };
    },
  },

};
