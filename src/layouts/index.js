import React,{useState} from 'react';
import style from './index.css'
import { Layout } from 'antd';
import MyHeader from '../container/Header';
import Menu from '../components/Menu'

const { Header, Sider, Content } = Layout;

export default function Index(props) {
  const [collapsed, setCollapsed] = useState('')
  if(props.location.pathname === '/login'){
    return (<>{props.children}</>)
  }
  function getColl(e){
    console.log(e)
    setCollapsed(!e)
  } 
  return (
    <>
      <Layout className={style.myroot}>
        <Header className={style.header}><MyHeader /></Header>
        <Layout className={style.layout}>
          {/* <Menu/> */}
          <Sider className={style.sider} collapsed={collapsed}><Menu iscoll={getColl}/></Sider>
          <Content className={style.content} >{props.children}</Content>
        </Layout>
      </Layout>
    </>
  )
}
