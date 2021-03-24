import Shop from '../components/Shop';
import { connect } from 'dva';
import router from 'umi/router'

const mapState = state => ({
  size: state.shopList.searchObj.size,
  page: state.shopList.searchObj.page,
  cat1_id: state.shopList.searchObj.cat1_id,
  cat2_id: state.shopList.searchObj.cat2_id,
  cat3_id: state.shopList.searchObj.cat3_id,
  keyword: state.shopList.searchObj.keyword,
  shopList: state.shopList.shopListArr,
  total: state.shopList.searchObj.total,
})

const mapDispatch = dispatch => ({
  // 改变每页条数
  onShowSizeChange(cuurrent, newSize) {
    console.log(newSize);
    dispatch({
      type: 'shopList/setSearchObj',
      payload: {
        size: newSize
      }
    })
    dispatch({
      type: 'shopList/getfetchShopList'
    })
  },
  // 改变页码
  pageOnChange(newPage) {
    dispatch({
      type: 'shopList/setSearchObj',
      payload: {
        page: newPage
      }
    })
    dispatch({
      type: 'shopList/getfetchShopList'
    })
  },
  // 重置
  onReset() {
    dispatch({
      type: 'shopList/setSearchObj',
      payload: {
        cat1_id: '',
        cat2_id: '',
        cat3_id: '',
        keyword: '',
        page: 1,
        total: 0,
      }
    })
    dispatch({
      type: 'shopList/getfetchShopList'
    })
  },
  // 搜索
  onSearch(searchObj) {
    console.log(searchObj)
    if (searchObj.cascader) {
      let cat1_id = searchObj.cascader[0] || '';
      let cat2_id = searchObj.cascader[1] || '';
      let cat3_id = searchObj.cascader[2] || '';
      dispatch({
        type: 'shopList/setSearchObj',
        payload: {
          cat1_id: cat1_id,
          cat2_id: cat2_id,
          cat3_id: cat3_id,
          keyword: searchObj.keyword,
          page: 1
        }
      })
      dispatch({
        type: 'shopList/getfetchShopList'
      })
    } else {
      dispatch({
        type: 'shopList/setSearchObj',
        payload: {
          keyword: searchObj.keyword,
          page: 1
        }
      })
      dispatch({
        type: 'shopList/getfetchShopList'
      })
    }
  },
  // 删除
  onDelate(id) {
    console.log(id)
    window.$api.goodsChange({
      goods_id: id,
      status: 0
    }).then(res => {
      console.log(res)
      dispatch({
        type: 'shopList/getfetchShopList'
      })
    })
  },
  // 列表直接修改商品排序
  numOnchange(num, row) {
    console.log(num, row)
    window.$api.goodsEdit({
      goods_id: row.goods_id,
      sort: num,
      goods_name: row.goods_name,
      cat1_id: row.cat1_id,
      cat2_id: row.cat2_id,
      cat3_id: row.cat3_id,
      goods_img: row.goods_img,
    }).then(res => {
      console.log(res)
      dispatch({
        type: 'shopList/getfetchShopList'
      })
    })
  },
  // 详情按钮
  onDetails(id) {
    router.push({ pathname: '/shop/details', query: id })
  }
})

export default connect(mapState, mapDispatch)(Shop);