import { routerRedux } from 'dva'

export default {
  state: {
    searchObj: {
      cat1_id: '',
      cat2_id: '',
      cat3_id: '',
      keyword: '',
      page: 1,
      total: 0,
      size:10,
    },
    shopListArr: []
  },
  reducers: {
    getSearchObj(state, { payload }) {
      return {
        ...state,
        searchObj: {
          ...state.searchObj,
          ...payload
        }
      }
    },
    getShopList(state, { payload }) {
      return {
        ...state,
        shopListArr: payload,
      }
    }
  },
  effects: {
    *setSearchObj(action, { put, select }) {
      console.log(action.payload)
      yield put({
        type: 'getSearchObj',
        payload: action.payload
      })
    },
    *getfetchShopList(action, { put, select }) {
      let newShopList = '';
      const searchObj = yield select(state => state.shopList.searchObj);
      yield window.$api
        .goodsList({
          limit: searchObj.size,
          keyword: searchObj.keyword,
          cat1_id: searchObj.cat1_id,
          cat2_id: searchObj.cat2_id,
          cat3_id: searchObj.cat3_id,
          page: searchObj.page,
          // verify_state:,
        }).then(res => {
          console.log(res.data.data)
          res.data.data.data.map(ele => {
            ele.cat_name = ''
            if(ele.cat3){
              ele.cat_name = `${ele.cat1.cat_name}/${ele.cat2.cat_name}/${ele.cat3.cat_name}`
            }else if(ele.cat2){
              ele.cat_name = `${ele.cat1.cat_name}/${ele.cat2.cat_name}`
            }else if(ele.cat1){
              ele.cat_name = `${ele.cat1.cat_name}`
            }
            return ele.key = ele.goods_id
          })
          newShopList = res.data.data
        })
      console.log(newShopList)
      yield put({
        type: 'getSearchObj',
        payload: {
          total: newShopList.total
        }
      })
      yield put({
        type: 'getShopList',
        payload: newShopList.data
      })
    }
  },
  // 监听
  subscriptions: {
    fetStudent({ dispatch }) {
      dispatch({
        type: 'getfetchShopList'
      })
    },
  }
}