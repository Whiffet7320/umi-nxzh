import React, { useEffect, useState, useRef } from 'react';
import { Breadcrumb, Button, Modal, Input, Form } from 'antd';
import { NavLink } from 'umi';
import style from './index.css';
import router from 'umi/router'


export default function Index() {
  const submitRef = useRef('subm')
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    submitRef.current.click()
    setIsModalVisible(false);
  };
  const onSearch = (e) => {
    console.log(e)
    let obj = {
      new_password: e.new_password,
      old_password: e.old_password,
      confirm_password: e.confirm_password,
    };
    window.$api.infoChange(obj).then((res) => {
      console.log(res);
      if (res && res.data.status == 1) {
        setTimeout(() => {
          router.push('/login')
        }, 1000)
      }else{
        e.new_password = ''
      }
    });
  }
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  useEffect(() => {
    window.$api.info().then(res => {
      console.log(res.data.data)
    })
  }, [])
  return (
    <div>
      <div className={style.top}>
        <Breadcrumb className={style.breadcrumb}>
          <Breadcrumb.Item>店铺管理</Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to='/store'>商品信息</NavLink>
          </Breadcrumb.Item>
        </Breadcrumb>,
      </div>
      <div className={style.content}>
        <div className={style.title}>
          <h1>商铺信息</h1>
          <Button type="primary" onClick={showModal}>修改密码</Button>
        </div>
      </div>
      <Modal title="修改密码" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form
          className={style.myFrom}
          name="basic"
          onFinish={onSearch}
        >
          <Form.Item
            className={style.formItem}
            label="旧密码"
            name="old_password"
          >
            <Input.Password className={style.formInput} />
          </Form.Item>

          <Form.Item
            className={style.formItem}
            label="新密码"
            name="new_password"
          >
            <Input.Password className={style.formInput} />
          </Form.Item>
          <Form.Item
            className={style.formItem}
            label="确认密码"
            name="confirm_password"
          >
            <Input.Password className={style.formInput} />
          </Form.Item>
          <Button style={{ display: 'none' }} ref={submitRef} type="primary" htmlType="submit" >
            登录
          </Button>
        </Form>
      </Modal>
    </div>
  )
}