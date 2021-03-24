import React from 'react'
import { Form, Input, Button } from 'antd';
import style from './index.css';
import img1 from '../../assets/images/ICON20pt@2px.png'
import $api from '../../api/index'
import router from 'umi/router'

export default function index(props) {
  async function onSearch(e) {
    $api.login({
      mobile: e.username,
      password: e.password,
    }).then(res=>{
      if(res && res.status === 200 && res.data.status == 1){
        sessionStorage.setItem("isLogin", true);
        sessionStorage.setItem("token", res.data.data.token);
        router.push('/')
        props.onLogin && props.onLogin(res.data.data)
      }
    })
  }
  return (
    <div className={style.login}>
      <div className={style.form}>
        <div className={style.top}>
          <img src={img1} alt="" />
          <span>后台管理系统</span>
        </div>
        <Form
          className={style.myFrom}
          name="basic"
          onFinish={onSearch}
        >
          <Form.Item
          className={style.formItem}
            label="账号"
            name="username"
          >
            <Input className={style.formInput} />
          </Form.Item>

          <Form.Item
          className={style.formItem}
            label="密码"
            name="password"
          >
            <Input.Password className={style.formInput} />
          </Form.Item>

          <Form.Item className={style.btn}>
            <Button type="primary" htmlType="submit" >
              登录
          </Button>
          </Form.Item>
        </Form>
      </div>
    </div>

  )
}

