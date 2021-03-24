import { routerRedux } from 'dva'

export default {
  state: null,
  reducers: {
    setLoginUser(state, { payload }) {
      return payload;
    }
  },
  effects: {
    *login({ payload }, { put }) {
      // console.log(payload)
      // console.log(sessionStorage.getItem("isLogin"));
      if (payload) {
        // 登陆成功
        // console.log(payload)
        yield put({ type: 'setLoginUser', payload: payload })
      } else {
        window.alert('账号/密码错误！')
      }
    },
    *loginOut(action, { put }) {
      // localStorage.removeItem('userName')
      // yield put({ type: 'setLoginUser', payload: null })
      sessionStorage.setItem("isLogin", false);
      yield put(routerRedux.push('/login'))
    }
  },
  // 监听
  subscriptions: {
    mapLocalStorageToSetLogin({ dispatch }) {
      var userName = localStorage.getItem('userName')
      if (userName) {
        dispatch({
          type: 'setLoginUser',
          payload: userName
        })
      }
    }
  }
}