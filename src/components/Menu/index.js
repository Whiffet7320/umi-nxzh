import React, { useState } from 'react'
import { Menu, Button } from 'antd';
import { NavLink,router } from 'umi';
import {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  MailOutlined,
} from '@ant-design/icons';

const { SubMenu } = Menu;

export default function Index(props) {
  const [collapsed, setCollapsed] = useState(false)
  console.log(window.location.pathname)
  let pathname = window.location.pathname;
  let stuSubMenu = null;
  if(pathname.indexOf("/store") !== -1){
    stuSubMenu = '/store';
  }else if(pathname.indexOf("/shop") !== -1){
    stuSubMenu = '/shop';
  }else if(pathname.indexOf("/webSocket") !== -1){
    stuSubMenu = '/webSocket';
  }
  var toggleCollapsed = () => {
    setCollapsed(!collapsed);
    props.iscoll && props.iscoll(collapsed)
  };
  return (
    <div style={{ width: 200 }}>
      <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
      </Button>
      <Menu
        defaultSelectedKeys={[pathname]}
        defaultOpenKeys={[stuSubMenu]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
      >
        <SubMenu key="/store" icon={<MailOutlined />} title="店铺管理">
          <Menu.Item key="/store">
            <NavLink to='/store'>商品信息</NavLink>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="/shop" icon={<MailOutlined />} title="商品管理">
          <Menu.Item key="/shop">
            <NavLink to='/shop'>出售商品</NavLink>
          </Menu.Item>
          <Menu.Item key="/shop/examine">
            <NavLink to='/shop/examine'>审核商品</NavLink>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="sub3" icon={<MailOutlined />} title="订单管理">
          <Menu.Item key="4">订单列表</Menu.Item>
          <Menu.Item key="5">评论列表</Menu.Item>
        </SubMenu>
        <SubMenu key="sub4" icon={<MailOutlined />} title="运营管理">
          <Menu.Item key="6">优惠券列表</Menu.Item>
          <Menu.Item key="7">领取记录</Menu.Item>
        </SubMenu>
        <SubMenu key="/webSocket" icon={<AppstoreOutlined />} title="客服管理">
          <Menu.Item key="/webSocket">
            <NavLink to='/webSocket'>客服列表</NavLink>
          </Menu.Item>
        </SubMenu>
      </Menu>
    </div>
  )
}
