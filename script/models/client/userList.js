
import { GET_userList, /*SOCKET_UserList*/ } from '@services/client/userList';

export default {

  namespace: 'userList',

  state: {
    userList: [],
    test: -1
  },

  effects: {
    *GET_UserList({ payload }, { call, put }) {  // eslint-disable-line
      try {
        const data = yield call(GET_userList, payload, 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiYWNjb3VudCI6Ik1hcm5pZSIsImVtYWlsIjoiTWFybmllQGIuY29tIiwiYWNjb3VudF9JZCI6IjEwZGU5MzY0LWVhM2ItNDQwNC04M2RkLTE0MDJmYTgxNzNiMyIsImNyZWF0ZWRBdCI6IjIwMjEtMDUtMjlUMDc6MDA6MjcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjEtMDUtMjlUMDc6MDA6MjcuMDAwWiIsImlhdCI6MTYyMjk5MTY5NiwiZXhwIjoxNjIzMjUwODk2fQ.5IdJBaXGcvZ-hqBU9-V0sQNDxnUwRqhqMpL6pJZE8fk');
        yield put({ type: 'set_user_list', payload: data });
      } catch (error) {
        if (process.env.NODE_ENV !== 'production' ) console.log(error);
        console.log('get user list error');
      }
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
