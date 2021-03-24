import React,{useState} from 'react';
import style from './index.css';
import { Row, Col, Button } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import $api from '../../api/index';
import shopImg from '../../assets/images/ICON20pt@2px.png'

export default function Index(props) {
  const [userName, setUserName] = useState('');
  const [shopLogo, setShopLogo] = useState('');
  if(sessionStorage.getItem("isLogin") === 'true'){
    $api.info().then(res=>{
      setUserName(res.data.data.contacts_name)
      setShopLogo(res.data.data.shop_logo)
    })
  }
  function loginOut() {
    props.onLoginOut && props.onLoginOut()
  }
  return (
    <div className={style.header}>
      <div className={style.left}>
        <img src={shopImg} alt=""/>
        <h1>农心海祝商城商家后台</h1>
      </div>

      <div className={style.right}>
        <img className={style.shopLogo} src={shopLogo} alt=""/>
        <p>{userName}</p>
      <Button onClick={loginOut} type="primary" shape="circle" icon={<LoginOutlined />} />
      </div>
    </div>
  )
}
