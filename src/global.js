import $api from './api/index';
import router from 'umi/router';
const oScript = document.createElement("script");
oScript.type = "text/javascript";
oScript.src = "https://gosspublic.alicdn.com/aliyun-oss-sdk-4.4.4.min.js";
document.body.appendChild(oScript);
window.$api = $api
window.sayData = '';
function initWebSocket() {
  if (sessionStorage.getItem("isLogin") == 'false') {
    return false;
  } else {
    let ws = new WebSocket("ws://192.168.2.200:8282");//测试服
    console.log(ws)
    ws.onopen = function () {
      console.log("服务器连接成功");
    };
    ws.onclose = function () {
      console.log("服务器连接关闭");
    };
    ws.onerror = function () {
      console.log("服务器连接出错");
    };
    ws.onmessage = function (e) {
      //接收服务器返回的数据
      let resData = JSON.parse(e.data);
      console.log(resData);
      if (resData.type == "say") {
        console.log("say说");
        window.sayData = resData.data
        router.push('/webSocket')
      } else if (resData.type == "init") {
        console.log(resData.client_id)
        window.$api.bindShop(resData.client_id).then(() => {
          //绑定client_id到shop_id
          // console.log(res.data.info);
        });
      }
    }
  }
}
initWebSocket()