import React, { useState, useEffect, useRef } from 'react';
import style from './index.css';
import { message, Breadcrumb, Button, Tabs, Form, Input, Image, Cascader, Radio } from 'antd';
import { NavLink, router } from 'umi';
import E from 'wangeditor'

export default function Index(props) {
  var TabPane1 = false
  const fromRef = useRef();
  const fileInpRef = useRef();
  const { TabPane } = Tabs;
  const goods_id = props.location.query
  var goodsData = {};
  const [options, setOptions] = useState(null);
  const [goods_img, setGoods_img] = useState('')
  // const [imgFile, setImgFile] = useState('')
  let imgFile = ''
  if (JSON.stringify(props.location.query) == '{}') {
    router.push('/shop')
  }
  // 新建
  if (goods_id[0] == 'c') {
    TabPane1 = true
  }
  function readFileAsBuffer(file) {
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
  useEffect(() => {
    window.$api.allList().then(res => {
      var myOptions = res.data.data;
      var arr = JSON.parse(
        JSON.stringify(myOptions)
          .replace(/cat_name/g, "label")
          .replace(/cat_id/g, "value")
          .replace(/child/g, "children")
      );
      setOptions(arr)
    })
    if (goods_id[0] !== 'c') {
      window.$api.goodsInfo(goods_id).then(res => {
        console.log(res.data.data)
        goodsData = res.data.data;
        // 设置表单回填
        if (fromRef.current) {
          fromRef.current.setFieldsValue({
            goods_name: goodsData.goods_name,
            goods_img: goodsData.goods_img,
            cat: [goodsData.cat1_id, goodsData.cat2_id, goodsData.cat3_id],
            sort: goodsData.sort,
            content: goodsData.content,
            is_on_sale: goodsData.is_on_sale,
          })
          var a = fromRef.current.getFieldsValue(['goods_img'])
          setGoods_img(a.goods_img)
        }
      }).then(() => {
        const editor = new E("#editor");//富文本
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
          editor.config.customUploadImg = async function (
            resultFiles,
            insertImgFn
          ) {
            // resultFiles 是 input 中选中的文件列表
            // insertImgFn 是获取图片 url 后，插入到编辑器的方法
            console.log(resultFiles);
            var file_re = null;
            var imgtype = resultFiles[0].type.substr(6, 4);
            var store = `${new Date().getTime()}.${imgtype}`;
            file_re = await readFileAsBuffer(resultFiles[0]);
            // console.log(resultFiles[0]);
            client
              .put(store, file_re)
              .then(function (res) {
                insertImgFn(res.url);
              })
              .catch(function (err) {
                console.log(err);
              });
          };
          editor.create()
          console.log(goodsData.content);
          editor.txt.html(goodsData.content);
        });
      })
    } else {
      if (fromRef.current) {
        fromRef.current.setFieldsValue({
          is_on_sale: 0,
        })
        const editor = new E("#editor");//富文本
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
          editor.config.customUploadImg = async function (
            resultFiles,
            insertImgFn
          ) {
            // resultFiles 是 input 中选中的文件列表
            // insertImgFn 是获取图片 url 后，插入到编辑器的方法
            console.log(resultFiles);
            var file_re = null;
            var imgtype = resultFiles[0].type.substr(6, 4);
            var store = `${new Date().getTime()}.${imgtype}`;
            file_re = await readFileAsBuffer(resultFiles[0]);
            // console.log(resultFiles[0]);
            client
              .put(store, file_re)
              .then(function (res) {
                insertImgFn(res.url);
              })
              .catch(function (err) {
                console.log(err);
              });
          };
          editor.create()
          console.log(goodsData.content);
          editor.txt.html(goodsData.content);
        });
      }
    }

  }, [])

  function callback(key) {
    console.log(key);
  }

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
          fromRef.current.setFieldsValue({
            goods_img: newImg,
          })
          var b = fromRef.current.getFieldsValue(['goods_img'])
          setGoods_img(b.goods_img)
        });
      });
    }
  }
  const onFinish = (values) => {
    let myObj = {}
    goodsData.content = document.getElementsByClassName("w-e-text")[0].innerHTML; //获取富文本里面的内容
    if (goods_id[0] !== 'c') {
      myObj = {
        goods_name: values.goods_name,
        goods_id: goods_id,
        is_on_sale: values.is_on_sale,
        goods_img: values.goods_img,
        content: goodsData.content,
        cat1_id: values.cat[0],
        cat2_id: values.cat[1],
        cat3_id: values.cat[2],
        goods_images: values.goods_images,
        sort: values.sort,
      };
    } else {
      myObj = {
        goods_name: values.goods_name,
        is_on_sale: values.is_on_sale,
        goods_img: values.goods_img,
        content: goodsData.content,
        cat1_id: values.cat[0],
        cat2_id: values.cat[1],
        cat3_id: values.cat[2],
        goods_images: values.goods_images,
        sort: values.sort,
      };
    }

    console.log(myObj)
    window.$api
      .goodsEdit(myObj)
      .then((res) => {
        if (res.data.status == 1) {
          console.log(res.data);
        }
      })
      .then(() => {
        setTimeout(() => {
          router.push('/shop');
          router.go(0)
        }, 1000);
      });
  };
  console.log(TabPane1)
  if (TabPane1) {
    return (
      <div>
        {/* 面包屑 */}
        <div className={style.top}>
          <Breadcrumb className={style.breadcrumb}>
            <Breadcrumb.Item>商品管理</Breadcrumb.Item>
            <Breadcrumb.Item>
              <NavLink to='/shop'>商品列表</NavLink>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <NavLink to='/shop/details'>商品详情页</NavLink>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        {/* 标题 */}
        <div className={style.title}>
          <h1>商品详情页</h1>
          <Button onClick={() => {
            router.push('/shop')
          }} type="link">返回上一页</Button>
        </div>
        {/* 表单 */}
        <div className={style.tab}>
          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="商品详情" key="1">
              <Form
                ref={fromRef}
                labelCol={{ span: 2 }}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
              >
                <Form.Item
                  label="商品名称"
                  name="goods_name"
                >
                  <Input value={goodsData.goods_name} />
                </Form.Item>

                <Form.Item
                  label="商品主图"
                  name="goods_img"
                >
                  <>
                    <Image
                      width={150}
                      src={goods_img}
                    />
                    <Button onClick={() => {
                      fileInpRef.current.click()
                    }}>更换主图</Button>
                    <input
                      type="file"
                      name="companyLogo"
                      id="file0"
                      style={{ display: 'none' }}
                      multiple="multiple"
                      onChange={fileInputChange}
                      ref={fileInpRef}
                    />
                  </>
                </Form.Item>

                <Form.Item
                  label="分类"
                  name="cat"
                >
                  <Cascader changeOnSelect options={options} placeholder="请选择" />
                </Form.Item>

                <Form.Item
                  label="排序"
                  name="sort"
                >
                  <Input value={goodsData.sort} />
                </Form.Item>

                <Form.Item
                  label="是否上架"
                  name="is_on_sale"
                >
                  <Radio.Group disabled defaultValue={goodsData.is_on_sale}>
                    <Radio value={1}>上架</Radio>
                    <Radio value={0}>下架</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  label="商品详情"
                  name="content"
                  style={{ display: 'flex' }}
                >
                  <div id="editor" className={style.editor}></div>
                </Form.Item>


                <Form.Item >
                  <Button type="primary" htmlType="submit">
                    保存
                </Button>
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane tab="SKU设置" disabled key="2">
              Content of Tab Pane 2
          </TabPane>
            <TabPane tab="商品相册" disabled key="3">
              Content of Tab Pane 3
          </TabPane>
          </Tabs>
        </div>
      </div>
    )
  } else {
    return (
      <div>
        {/* 面包屑 */}
        <div className={style.top}>
          <Breadcrumb className={style.breadcrumb}>
            <Breadcrumb.Item>商品管理</Breadcrumb.Item>
            <Breadcrumb.Item>
              <NavLink to='/shop'>商品列表</NavLink>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <NavLink to='/shop/details'>商品详情页</NavLink>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        {/* 标题 */}
        <div className={style.title}>
          <h1>商品详情页</h1>
          <Button onClick={() => {
            router.push('/shop')
          }} type="link">返回上一页</Button>
        </div>
        {/* 表单 */}
        <div className={style.tab}>
          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="商品详情" key="1">
              <Form
                ref={fromRef}
                labelCol={{ span: 2 }}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
              >
                <Form.Item
                  label="商品名称"
                  name="goods_name"
                >
                  <Input value={goodsData.goods_name} />
                </Form.Item>

                <Form.Item
                  label="商品主图"
                  name="goods_img"
                >
                  <>
                    <Image
                      width={150}
                      src={goods_img}
                    />
                    <Button onClick={() => {
                      fileInpRef.current.click()
                    }}>更换主图</Button>
                    <input
                      type="file"
                      name="companyLogo"
                      id="file0"
                      style={{ display: 'none' }}
                      multiple="multiple"
                      onChange={fileInputChange}
                      ref={fileInpRef}
                    />
                  </>
                </Form.Item>

                <Form.Item
                  label="分类"
                  name="cat"
                >
                  <Cascader changeOnSelect options={options} placeholder="请选择" />
                </Form.Item>

                <Form.Item
                  label="排序"
                  name="sort"
                >
                  <Input value={goodsData.sort} />
                </Form.Item>

                <Form.Item
                  label="是否上架"
                  name="is_on_sale"
                >
                  <Radio.Group defaultValue={goodsData.is_on_sale}>
                    <Radio value={1}>上架</Radio>
                    <Radio value={0}>下架</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  label="商品详情"
                  name="content"
                  style={{ display: 'flex' }}
                >
                  <div id="editor" className={style.editor}></div>
                </Form.Item>


                <Form.Item >
                  <Button type="primary" htmlType="submit">
                    保存
                </Button>
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane tab="SKU设置" key="2">
              Content of Tab Pane 2
          </TabPane>
            <TabPane tab="商品相册" key="3">
              Content of Tab Pane 3
          </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }

}
