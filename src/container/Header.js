import Header from '../components/Header';
import { connect } from 'dva';

const mapState = state => ({
  // userName:state.login.contacts_name
})

const mapDispatch = dispatch => ({
  onLoginOut() {
    dispatch({
      type: 'login/loginOut',
    })
  }
})

export default connect(mapState, mapDispatch)(Header);