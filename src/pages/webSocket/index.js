import React, { useEffect, useState, useRef } from 'react';
import style from './index.css';
import { NavLink, router } from 'umi';
import { Breadcrumb, Popover, Button, Input, Avatar, Badge, message, Image } from 'antd';
import { SearchOutlined, PictureOutlined } from '@ant-design/icons';
const { TextArea } = Input;

export default function Index() {
  const wxchatBorderRightMidRef = useRef()
  const fileInpRef = useRef();
  const [dot, setDot] = useState(false)
  // const [goods_img, setGoods_img] = useState('')
  let goods_img = ''
  let imgFile = ''
  const [sendMsg, setSendMsg] = useState('')
  const [popInp, setPopInp] = useState(true)
  const [active, setActive] = useState(true)//左侧用户列表是否被点击
  const [userList, setUserList] = useState([])//左侧用户列表
  const [wxchatBorderRightMid, setWxchatBorderRightMid] = useState([])//右侧聊天记录
  const [userName, setUserName] = useState('')//右侧聊天的用户名称
  const [isSend, setIsSend] = useState(false)
  const [user_id, setUser_id] = useState('')
  const [content, setContent] = useState(
    <div>
      <p>请选择上传方式：</p>
      <Button type="primary" onClick={() => {
        console.log(fileInpRef, 111)
        fileInpRef.current.click()
      }} style={{ margin: '0px 10px 0px 0px' }}>本地上传</Button>
      <Button type="primary" onClick={() => {
        setPopInp(false)
      }} >输入网络资源地址</Button>
      <input
        type="file"
        name="companyLogo"
        id="file0"
        style={{ display: 'none' }}
        multiple="multiple"
        onChange={fileInputChange}
        ref={fileInpRef}
      />
    </div>
  )
  // 上传oss图片
  const fileInputChange = (event) => {
    var file = event.target.files[0];
    var fileSize = file.size; //文件大小
    var filetType = file.type; //文件类型
    // console.log(event)
    //创建文件读取对象
    if (fileSize <= 10240 * 1024) {
      if (
        filetType == "image/png" ||
        filetType == "image/jpeg" ||
        filetType == "image/gif"
      ) {
        console.log(file)
        // setImgFile(file)
        imgFile = file
        uploading(true);
      } else {
        message.error('图片格式不正确');
      }
    } else {
      message.error('图片大小不符合');
    }
  }
  //将文件转为blob类型
  function readFileAsBuffer(file) {
    console.log(file)
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.readAsDataURL(file);
      reader.onload = function () {
        const base64File = reader.result.replace(
          /^data:\w+\/\w+;base64,/,
          ""
        );
        resolve(new window.OSS.Buffer(base64File, "base64"));
      };
    });
  }
  async function uploading(flag) {
    // console.log(document.getElementById("file0").value);
    if (flag) {
      var file_re = await readFileAsBuffer(imgFile);
      // console.log(imgFile);
      window.$api.ossststoken().then((res) => {
        console.log(res.data.data.date);
        let myData = res.data.data.date;
        let client = new window.OSS.Wrapper({
          region: "oss-cn-hangzhou", //oss地址
          accessKeyId: myData.Credentials.AccessKeyId, //ak
          accessKeySecret: myData.Credentials.AccessKeySecret, //secret
          stsToken: myData.Credentials.SecurityToken,
          bucket: "nxhzapp", //oss名字
        });
        // console.log(client);
        var imgtype = imgFile.type.substr(6, 4);
        var store = `${new Date().getTime()}.${imgtype}`;
        // console.log(store);
        client.put(store, file_re).then((res) => {
          //这个结果就是url
          console.log(res);
          // var a = client.signatureUrl(store);
          var newImg = `http://nxhzapp.oss-cn-hangzhou.aliyuncs.com/${store}`;
          // oss_imgurl = a;
          console.log(newImg);
          // setGoods_img(newImg)
          goods_img = newImg
        }).then(() => {
          console.log(1)
          sentMsg()
        })
      });
    }
  }
  // 滚动条到底部
  function scrollBottm() {
    let el = wxchatBorderRightMidRef.current;
    el.scrollTop = el.scrollHeight;
  }
  // 发送
  function sentMsg(e) {
    let obj = {}
    if (e) {
      setSendMsg(e.target.value)
      obj = {
        type: "0",
        content: e.target.value,
        user_id: user_id,
      };
      window.$api.userSay(obj).then(res => {
        console.log(res)
        setIsSend(!isSend)
      }).then(() => {
        setSendMsg('')
      }).then(() => {
        setTimeout(() => {
          scrollBottm()
        }, 500)
      })
    } else {
      obj = {
        type: "1",
        content: goods_img,
        user_id: user_id,
      };
      window.$api.userSay(obj).then(res => {
        console.log(res)
        setIsSend(!isSend)
      }).then(() => {
        setTimeout(() => {
          scrollBottm()
        }, 500)
      })
    }


    // window.$api.userSay(obj).then(res => {
    //   console.log(res)
    //   setIsSend(true)
    // }).then(() => {
    //   setSendMsg('')
    // }).then(() => {
    //   setTimeout(() => {
    //     scrollBottm()
    //   }, 500)
    // })
  }
  function textAreaChange(e) {
    setSendMsg(e.target.value)
  }
  // 点击左侧用户列表
  function userClick(ele, i) {
    console.log(ele, i)
    setActive(false)
    setUser_id(ele.user.user_id)
    setUserName(ele.user.nick_name) // 设置右侧聊天的用户名称
    // dot = false;
    setDot(false)
  }


  useEffect(() => {
    // console.log(window.sayData.send_id.slice(2))
    console.log(user_id)
    if (user_id != '') {
      console.log(user_id)
      let historyObj = {
        user_id: user_id,
        // between_time:,
        // is_read:,//是否已读
      };
      window.$api.userHistory(historyObj).then((res) => {
        console.log(res.data.data)
        // 设置右侧的聊天记录
        setWxchatBorderRightMid(res.data.data.map((ele, i) => {
          if (ele.send_id == 's_35') {
            return (
              <div key={i}>
                <div style={{ marginLeft: '30px', marginTop: '15px' }}>
                  <div style={{ padding: '15px 0', textAlign: 'center' }}>
                    <span className={style.time}>2021-3-23 16:35:41</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className={style.el_col_21}>
                    <div className={style.popspan1}>
                      {/* {key == 1 ? '我爱你' : key == 2 ? '我喜欢你' : key == 3 ? '我恨你' : '我讨厌你'} */}
                      {
                        ele.type == '1' ? <Image
                          width={200}
                          src={ele.content}
                        /> : ele.type == '0' ? <div><p>{ele.content}</p></div> : 'type=3'
                      }

                    </div>
                  </div>
                  <div className={style.el_col_2}>
                    <Avatar size={34} shape="square" src={ele.head_pic} />
                  </div>
                </div>
              </div>
            )
          } else {
            return (
              <div key={i}>
                <div style={{ marginLeft: '30px', marginTop: '15px' }}>
                  <div style={{ padding: '15px 0', textAlign: 'center' }}>
                    <span className={style.time}>2021-3-23 16:35:41</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className={style.myel_col_2}>
                    <Avatar size={34} shape="square" src={ele.head_pic} />
                  </div>
                  <div className={style.el_col_21}>
                    <div className={style.popspan2}>
                      {
                        ele.type == '1' ? <Image
                          width={200}
                          src={ele.content}
                        /> : ele.type == '0' ? <div><p>{ele.content}</p></div> : 'type=3'
                      }
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        }))
      })
    }
    if (!popInp) {
      setContent(<div>
        <p>请选择上传方式：</p>
        <Button type="primary" onClick={() => {
          fileInpRef.current.click()
        }} style={{ margin: '0px 10px 0px 0px' }}>本地上传</Button>
        <Button type="primary">输入网络资源地址</Button>
        <Input placeholder="输入网络资源地址" />
        <Button>上传</Button>
        <input
          type="file"
          name="companyLogo"
          id="file0"
          style={{ display: 'none' }}
          multiple="multiple"
          onChange={fileInputChange}
          ref={fileInpRef}
        />
      </div>)
    } else {
      setContent(
        <div>
          <p>请选择上传方式：</p>
          <Button type="primary" onClick={() => {
            fileInpRef.current.click()
          }} style={{ margin: '0px 10px 0px 0px' }}>本地上传</Button>
          <Button type="primary" onClick={() => {
            setPopInp(false)
          }} >输入网络资源地址</Button>
          <input
            type="file"
            name="companyLogo"
            id="file0"
            style={{ display: 'none' }}
            multiple="multiple"
            onChange={fileInputChange}
            ref={fileInpRef}
          />
        </div>
      )
    }
    // 获取聊天用户列表
    window.$api.userList().then(res => {
      // console.log(res.data.data)
      let newUserList = res.data.data.map((ele, i) => {
        console.log(ele.user.user_id)
        if (window.sayData.send_id && ele.user.user_id == window.sayData.send_id.slice(2)) {
          window.sayData.send_id = ''
          setDot(true)
        }
        return (
          <div key={i} className={active ? style.user : style.userActive} onClick={() => {
            userClick(ele, i)
          }}>
            <div style={{ display: 'inline-block', padding: '12px' }}>
              <Badge dot={dot}>
                <Avatar size={40} shape="square" src={ele.user.head_pic} />
              </Badge>
            </div>
            <div className={style.leftUser_input}>
              <div className={style.wxchatPeople}>{ele.user.nick_name}</div>
              <div className={style.wxchatNews}>{ele.chat_info.content}</div>
            </div>
          </div>
        )
      })
      setUserList(newUserList)
    })
    setTimeout(() => {
      scrollBottm()
    }, 500)
  }, [popInp, active, user_id, isSend, window.sayData, dot])



  return (
    <div className={style.wrapper}>
      {/* 面包屑 */}
      <div className={style.top}>
        <Breadcrumb className={style.breadcrumb}>
          <Breadcrumb.Item>客服管理</Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to='/webSocket'>客服列表</NavLink>
          </Breadcrumb.Item>
        </Breadcrumb>,
      </div>
      <div className={style.webSocketWrapper}>
        <div className={style.wxchatBorderLeft}>
          <div style={{ padding: "20px 10px 10px 10px", backgroundColor: 'rgb(238, 234,232)' }}>
            <div style={{ display: 'inline-block' }}>
              <Input placeholder="default size" prefix={<SearchOutlined />} />
            </div>
          </div>
          <div className={style.userList}>
            {userList}
            {/* <div className={style.user}>
              <div style={{ display: 'inline-block', padding: '12px' }}>
                <Avatar size={40} shape="square" src="https://nxhzapp.oss-cn-hangzhou.aliyuncs.com/file/default_head_pic.png" />
              </div>
              <div className={style.leftUser_input}>
                <div className={style.wxchatPeople}>cyy</div>
                <div className={style.wxchatNews}>陈奕宇你好帅啊啊啊啊啊啊啊啊 啊啊啊啊啊</div>
              </div>
            </div>
            <div className={style.user}>
              <div style={{ display: 'inline-block', padding: '12px' }}>
                <Avatar size={40} shape="square" src="https://nxhzapp.oss-cn-hangzhou.aliyuncs.com/file/default_head_pic.png" />
              </div>
              <div className={style.leftUser_input}>
                <div className={style.wxchatPeople}>cyy</div>
                <div className={style.wxchatNews}>hahahahah</div>
              </div>
            </div> */}
          </div>
        </div>
        <div className={style.leftContent}>
          <div className={style.wxchatBorderRightTop}>
            <div className={style.wxchatName}>{userName}</div>
          </div>
          <div ref={wxchatBorderRightMidRef} className={style.wxchatBorderRightMid}>
            {wxchatBorderRightMid}
            {/* 右侧 */}
            {/* <>
              <div style={{ marginLeft: '30px', marginTop: '15px' }}>
                <div style={{ padding: '15px 0', textAlign: 'center' }}>
                  <span className={style.time}>2021-3-23 16:35:41</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className={style.el_col_21}>
                  <div className={style.popspan1}>
                    <div><p>哈哈</p></div>
                  </div>
                </div>
                <div className={style.el_col_2}>
                  <Avatar size={34} shape="square" src="https://nxhzapp.oss-cn-hangzhou.aliyuncs.com/file/default_head_pic.png" />
                </div>
              </div>
            </> */}
            {/* 左侧 */}
            {/* <>
              <div style={{ marginLeft: '30px', marginTop: '15px' }}>
                <div style={{ padding: '15px 0', textAlign: 'center' }}>
                  <span className={style.time}>2021-3-23 16:35:41</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className={style.myel_col_2}>
                  <Avatar size={34} shape="square" src="https://nxhzapp.oss-cn-hangzhou.aliyuncs.com/file/default_head_pic.png" />
                </div>
                <div className={style.el_col_21}>
                  <div className={style.popspan2}>
                    <div><p>哈哈</p></div>
                  </div>
                </div>
              </div>
            </> */}
          </div>
          <div className={style.wxchatBorderRightBottom}>
            <div className={style.wxchatIcon1}>
              <Popover placement="top" content={content} trigger="click">
                <PictureOutlined onClick={() => {
                  setPopInp(true)
                }} />
              </Popover>
            </div>
            <div className={style.textarea}>
              <TextArea value={sendMsg} onChange={textAreaChange} onPressEnter={sentMsg} rows={3} />
            </div>
            <div className={style.sendBtn}>
              <Button size={'small'}>发送 (Enter)</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

