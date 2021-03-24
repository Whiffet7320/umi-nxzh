import React, { useState, useEffect,useRef } from 'react';
import style from './index.css';
import { NavLink, router } from 'umi';
import { InputNumber, Breadcrumb, Button, Cascader, Input, Form, Table, Tooltip, Avatar, Tag } from 'antd';

export default function Index(props) {
  const numInpRef = useRef()
  console.log(props)
  const [options, setOptions] = useState(null);
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
  }, [])
  const [form] = Form.useForm();
  const onReset = () => {
    form.resetFields();
    props.onReset()
  };

  function newlyBuild(){
    router.push({
      pathname:'/shop/details',
      query:'c'
    })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'goods_id',
      key: 'goods_id',
    },
    {
      title: '商品名称',
      dataIndex: 'goods_name',
      key: 'goods_name',
      onCell: () => {
        return {
          style: {
            maxWidth: 150,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer'
          }
        }
      },
      render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    },
    {
      title: '商品主图',
      dataIndex: 'goods_img',
      key: 'goods_img',
      render: (text) => <Avatar shape="square" size={54} src={text} />
    },
    {
      title: '分类',
      dataIndex: 'cat_name',
      key: 'cat_name',
      render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    },
    {
      title: '成本价',
      dataIndex: 'prime_cost',
      key: 'prime_cost',
    },
    {
      title: '销售价',
      dataIndex: 'shop_price',
      key: 'shop_price',
    },
    {
      title: '库存',
      dataIndex: 'sale_count',
      key: 'sale_count',
    },
    {
      title: '审核状态',
      dataIndex: 'verify_state',
      key: 'verify_state',
      render(text) {
        if (text == 0) {
          text = '待审核'
        } else if (text == 1) {
          text = '审核未通过'
        } else if (text == 2) {
          text = '审核通过'
        }
        return (
          <Tag color="success">{text}</Tag>
        )
      }
    },
    {
      title: '是否上架',
      dataIndex: 'is_on_sale',
      key: 'is_on_sale',
      render(text) {
        if (text == 0) {
          text = '下架'
        } else if (text == 1) {
          text = '上架'
        }
        return (
          <Tag color="success">{text}</Tag>
        )
      }
    },
    {
      title: '排序',
      dataIndex: ['sort'],
      key: 'sort',
      render: (sort,row) => {
        return (
          <InputNumber defaultValue={sort} ref={numInpRef} onPressEnter={()=>{
            // console.log(sort,row)
            props.numOnchange(numInpRef.current.value,row)
          }} onChange={(e)=>{
            // props.numOnchange(e)
          }} />
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'goods_id',
      key: 'goods_id',
      render: (id) => {
        return (
          <>
            <Button type="link" onClick={() => {
              props.onDetails(id)
            }}>详情</Button>
            <Button type="link" onClick={() => {
              props.onDelate(id)
            }}>删除</Button>
          </>
        )
      }
    },
  ];


  // SKU的列表
  const SKUcolumns = [
    {
      dataIndex: 'sku_id',
      key: 'sku_id',
      onCell: () => {
        return {
          style: {
            maxWidth: 71,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer'
          }
        }
      },
    },
    {
      dataIndex: 'sale_attr_name',
      key: 'sale_attr_name',
      onCell: () => {
        return {
          style: {
            maxWidth: 222,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer'
          }
        }
      },
      render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    },
    {
      dataIndex: 'goods_img',
      key: 'goods_img',
      render: (text) => <Avatar shape="square" size={54} src={text} />
    },
    {
      dataIndex: 'cat_name',
      key: 'cat_name',
    },
    {
      dataIndex: 'prime_cost',
      key: 'prime_cost',
    },
    {
      dataIndex: 'shop_price',
      key: 'shop_price',
    },
    {
      dataIndex: 'storage',
      key: 'storage',
    },
    {
      dataIndex: 'verify_state',
      key: 'verify_state',
    },
    {
      dataIndex: 'is_on_sale',
      key: 'is_on_sale',
      render(text) {
        if (text == 0) {
          text = '下架'
        } else if (text == 1) {
          text = '上架'
        }
        return (
          <Tag color="success">{text}</Tag>
        )
      }
    },
    {
      dataIndex: 'sort',
      key: 'sort',
    },
    {
      dataIndex: '',
      key: 'x',
      render: () => <a>操作</a>,
    },
  ];

  return (
    <div>
      {/* 面包屑 */}
      <div className={style.top}>
        <Breadcrumb className={style.breadcrumb}>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to='/shop'>出售商品</NavLink>
          </Breadcrumb.Item>
        </Breadcrumb>,
      </div>
      {/* 搜索 */}
      <div className={style.content}>
        <div className={style.title}>
          <h1>商品列表</h1>
          <Form
            form={form}
            className={style.myFrom}
            name="basic"
            onFinish={props.onSearch}
          >
            <Form.Item
              className={style.formItem}
              label="分类"
              name="cascader"
            >
              <Cascader changeOnSelect options={options} onChange={props.searchOnChange} placeholder="请选择" />
            </Form.Item>

            <Form.Item
              className={style.formItem}
              label="关键字"
              name="keyword"
            >
              <Input className={style.formInput} />
            </Form.Item>
            <Button type="primary" htmlType="submit" >
              搜索
            </Button>
            <Button htmlType="button" onClick={onReset}>
              重置
            </Button>
            <Button htmlType="button" onClick={newlyBuild}>
              新建
            </Button>
          </Form>
        </div>
      </div>
      {/* 列表 */}
      <div className={style.table}>
        <Table
          columns={columns}
          expandable={{
            expandedRowRender: record => {
              console.log(record.sku)
              record.sku.map(ele => {
                return ele.key = ele.sku_id
              })
              return <Table className={style.skuTable} pagination={false} columns={SKUcolumns} dataSource={record.sku} />
            },
          }}
          dataSource={props.shopList}
          pagination={{
            current: props.page,
            total: props.total,
            onChange: props.pageOnChange,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: props.onShowSizeChange,
            pageSize: props.size
          }}
        />
      </div>
    </div>
  )
}
