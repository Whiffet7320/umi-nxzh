import Login from '../components/Login';
import { connect } from 'dva';

const mapDispatch = dispatch => ({
  onLogin(userObj) {
    dispatch({
      type: 'login/login',
      payload: userObj
    })
  }
})

export default connect(null, mapDispatch)(Login);