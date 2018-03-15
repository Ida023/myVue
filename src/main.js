import "babel-polyfill";
import Vue from 'vue'
import App from './App'
import router from './router/index'
Vue.config.debug = true;
// import routes from './routers';
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import webServer from 'static/webserver.config.js'
/*import Vuex from 'vuex'*/
//城市联动插件
import VDistpicker from 'v-distpicker'
Vue.component('v-distpicker', VDistpicker)
import selectItem from './components/selector_item.vue'
import selectOptions from './components/selector_item_with_key.vue'
import Editor from './components/Tinymce/Editor.vue'
Vue.component('Editor',Editor);
Vue.component('selector-item',selectItem);
Vue.component('selector-options',selectOptions);
import echarts from 'echarts';//图表插件
Vue.prototype.$echarts = echarts;
Vue.config.silent = true;
import CrumbsNav from './components/CrumbsNav/nav.vue';
import statusType from './components/order/statusTypeData.vue';
import screenData from './components/order/screenData.vue';
import mailDialog from './components/order/mailDialog.vue';
import remarkDialog from './components/order/remarkDialog.vue';
import copyOrderDialog from './components/order/copyOrderDialog.vue';
import refundsDialog from './components/order/refundsDialog.vue';
import preWithdrawal from './components/order/pre-withdrawal.vue';
import resendDialog from './components/order/resendDialog.vue';
import interceptDialog from './components/order/interceptDialog.vue';
import manualDialog from './components/order/manualDialog.vue';
import tableColumnData from './components/order/tableColumnData.vue';
import importDialog from './components/importData/importDialog.vue';
import tools from './common/js/tools'

Vue.component('CrumbsNav',CrumbsNav);
Vue.component('statusType',statusType);  // 订单页面统一平台，账号，站点及国家通用组件
Vue.component('screenData',screenData);  // 订单页面统一筛选框数据弹窗组件
Vue.component('mailDialog',mailDialog);  // 订单页面统一发邮件/消息弹窗组件
Vue.component('remarkDialog',remarkDialog);  // 订单页面统一添加备注弹窗组件
Vue.component('copyOrderDialog',copyOrderDialog);  // 订单页面统一复制/新建手工订单弹窗组件
Vue.component('refundsDialog',refundsDialog);  // 订单页面统一退款弹窗组件
Vue.component('preWithdrawal',preWithdrawal);  // 订单页面统一发起预退件弹窗组件
Vue.component('resendDialog',resendDialog);  // 订单页面统一重寄弹窗组件
Vue.component('interceptDialog',interceptDialog);  // 订单页面统一拦截订单弹窗组件
Vue.component('manualDialog',manualDialog);  // 订单页面统一手工同步订单弹窗组件
Vue.component('tableColumnData',tableColumnData);  // 订单页面统一表格公共列组件
Vue.component('importDialog',importDialog);  // 导入统一组件
import store from './vuex/store'
import VueQuillEditor from 'vue-quill-editor'


router.beforeEach((to, from, next) => {
 // next();
  sessionStorage.setItem('subNav',to.path);
  Vue.prototype.currentPath = sessionStorage.getItem('subNav');
  // console.log(sessionStorage.getItem('subNav'));
  Vue.prototype.muneData=''
  let rol = [{path:'/userManager'},{path:'/department'},{path:'/menu'}];//随便写的权限数据
  let lurisdiction =[];
  let Jurisdiction=sessionStorage.getItem("userSession");
  if(to.path === '/login'|| to.path === '/register' || to.path === '/progress' || to.path === '/mailbox' || to.path === '/mailsuccess'
    || to.path === '/reset' || to.path === '/resbox' || to.path === '/respaswd' || to.path === '/ressuccess'|| to.path==='/api-docs'|| to.path==='/swagger'){
    sessionStorage.removeItem('MuneObj');
    sessionStorage.removeItem('topMenus');
    sessionStorage.removeItem('userSession');
  }
  if(to.path === '/'){
    if(Jurisdiction===null){
      router.push({ path: '/login' });
    }else {
      router.push({ path: '/personal' });
    }
  }
  if (to.path !== '/login' && to.path !== '/register' && to.path !== '/progress' && to.path !== '/mailbox' && to.path !== '/mailsuccess'
    && to.path !== '/reset' && to.path !== '/resbox' && to.path !== '/respaswd' && to.path !== '/ressuccess'&& to.path!=='/api-docs'
    ) {
    if(Jurisdiction===null){
      router.push({ path: '/login' });
    }else {
      for(let i=0; i<rol.length; i++){
        if (to.path!==rol[i].path){
          lurisdiction.push(rol[i].path)
        }
        next()
      }
      if(rol.length===lurisdiction.length){
        // alert('没有权限')
        // router.push({ path: '/login' });
      }else {
        next()
      }
    }
  }
  else {
    next()
  }
});
/*Vue.use(Vuex)*/
Vue.use(VueQuillEditor);
Vue.use(ElementUI);
Vue.prototype.$http = axios;
Vue.prototype.tool = tools;
Vue.use(router);
Vue.config.productionTip = false;
axios.defaults.withCredentials=true;
Vue.prototype.qs = require('qs');
Vue.prototype.abc=tools.getRandomNumber();
Vue.prototype.RmsUrl = webServer.getRmsUrl();//权限管理系统
Vue.prototype.ScmUrl = webServer.getScmUrl();//供应链模块
Vue.prototype.SmsUrl = webServer.getSmsUrl();//订单管理
Vue.prototype.LwmsUrl = webServer.getLwmsUrl();//仓库管理
Vue.prototype.sessuserid = sessionStorage.getItem("userSession");
Vue.prototype.groupMenuList = JSON.parse(sessionStorage.getItem("leftMenusArr"));
/*
 exports.groupMenuList = function(url){
 var list=JSON.parse(sessionStorage.getItem("leftMenusArr"));
 //var url = !!location.search ? location.search : location.hash; //#/categoryManagerNew
 var str = url.substr(url.indexOf("#") + 1);
 list.forEach(item=>{
 if(item.groupMenuList && item.groupMenuList.length>0){
 item.groupMenuList.forEach(MenuList=>{
 if(MenuList.menuUrl==str){
 var objKeys=Object.keys(MenuList.cmdRightMap);
 if(objKeys.length>0){
 return MenuList.cmdRightMap;
 }
 }
 })
 }
 })

 }
 */

// Vue.http.options.emulateJSON = true;

/* eslint-disable no-new */
//axios.defaults.headers.common['Authorization'] = Vue.prototype.sessuserid;
//axios.defaults.headers.common['Authorization'] = '123456';
var urlFix = function (uri,baseUrl) {
/*  let split = "/";
  if (uri.substring(0, 1) == '/') {
    split = "";
  }*/
  if(baseUrl==='Rms'){
    var url = Vue.prototype.RmsUrl + uri;
  }else if(baseUrl==='Scm'){
    var url = Vue.prototype.ScmUrl + uri;
  }else if(baseUrl==='Sms'){
    var url = Vue.prototype.SmsUrl + uri;
  }else if(baseUrl==='Lwms'){
    var url = Vue.prototype.LwmsUrl + uri;
  }else {
    var url = Vue.prototype.RmsUrl + uri;
  }
/*  let type = '?';
  if (uri.indexOf('?') != -1) {
    type = '&';
  }*/
  //url += type + 'Authorization=' + sessionStorage.getItem("userSession") ;
  return url;
};
var errorMessage = function (msg){
  store.commit('errorCountUp');
  if(store.state.errorCount == 1){
    Vue.prototype.$alert(msg, '提示', {
      confirmButtonText: '确定',
      callback: action => {
        router.replace({
          path: 'login',
          /*query: {redirect: router.currentRoute.fullPath}*/
        })
      }
    });
  }
};
//  通用的get请求
Vue.prototype.httpGet = function (url, param,baseUrl,time) {
  url = urlFix(url,baseUrl);
  return new Promise((resolve, reject) => {
    var timeout = time != undefined ? {timeout:time} : '';
    axios.get(url,{params:param},timeout)
      .then((res) => {
          resolve(res);
      })
      .catch((res) => {
        console.log(22222)
        console.log(res)
        reject(res.data);
      })
  });
};
/**
 * 通用 httpPost
 * @param url --- http请求地址
 * @param param --- http请求传参
 * @param baseUrl --- 所属模拟 sms , scm.....
 * @param time  --- 重置请求超时时间
 */
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';
//axios.defaults.timeout = 30000;   // 全局设置请求时间
// axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.prototype.httpPost = function (url, param,baseUrl,time) {
  url = urlFix(url,baseUrl);
  return new Promise((resolve, reject) => {
    var timeout = time != undefined ? {timeout:time} : '';
    axios.post(url,param,timeout)
      .then((res) => {
          resolve(res);
      })
      .catch((err) => {
      console.log(err);
     // alert(err.status)
      if(err.status == 400){
        Vue.prototype.$message('网络请求错误！');
      }
        reject(err.data);
      })
  });
};//  通用的delete请求
Vue.prototype.httpDelete = function (url, param,baseUrl,time) {
  url = urlFix(url,baseUrl);
  return new Promise((resolve, reject) => {
    var c = time != undefined ? {timeout:time} : '';
    axios.delete(url, param,time)
      .then((res) => {
          resolve(res);
      })
      .catch((res) => {
        reject(res.data);
      })
  });
};//  通用的put请求1
Vue.prototype.httpPut = function (url, param,baseUrl) {
  url = urlFix(url,baseUrl);
  return new Promise((resolve, reject) => {
    axios.put(url, param)
      .then((res) => {
          resolve(res);
      })
      .catch((res) => {
        reject(res.data);
      })
  });
};
// http request 拦截器
axios.interceptors.request.use(
  config => {
    // console.log('% O=',store.state.loading);
    store.state.loading=true;
    config.headers['Authorization'] = sessionStorage.getItem("userSession");
    return config;
  },
  err => {
    console.log(err)
    return Promise.reject(err);
  });

// http response 拦截器
axios.interceptors.response.use(
  response => {
    setTimeout(()=>{
      store.state.loading=false;
    },20);
    console.log(response);
    return response;
  },
  error => {
    setTimeout(()=>{
      store.state.loading=false;
    },20);
    let xmlhttp=new XMLHttpRequest();
    if (error.response) {
      switch (error.response.status) {
          case 401:
            errorMessage('未登录请登录');
          break;
          case 402:
            errorMessage('账户在其他地方登录,如非本人操作请及时修改密码！');
          break;
          case 455:
            errorMessage('登录信息过期或失效，请重新登录！');
          break;
          case 403:
            router.replace({
              path: '/403',
            });
          break;
        case 404:
          alert('404')
          break;
        default:
          // router.replace({
          //   path: '/500',
          // });
          break;
      }
    }else{
      console.log(error.response)
      Vue.prototype.$message('网络请求错误！');
    }
    setTimeout(()=>{
      store.state.loading=false;
    },5000);
    return Promise.reject(error.response)   // 返回接口返回的错误信息
  });
// 通用批量操作时未选中数据提示框
Vue.prototype.tips = function() {
  Vue.prototype.$message('未选中任何数据');
};
/**
 * 通用带弹窗并操作方法 httpPost
 * @param msg  --- 弹窗提示信息
 * @param url --- http请求地址
 * @param jsonData --- http请求传参
 * @param callback --- 点击确定后的回调函数
 * @param callParams  --- 回调函数所带的参数
 */
Vue.prototype.doItem = (msg,url,jsonData,callback,callParams) => {
  Vue.prototype.$confirm(msg, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
    var resRes = function(ress,msgg){
      if(ress == true){
        Vue.prototype.$message({
          message: msgg
        });
        if(callParams != undefined){
          callback(callParams);
        }else{
          callback();
        }
      }else{
        Vue.prototype.$message(msgg);
      }
    };
    if(jsonData == ''){
      Vue.prototype.httpPost(url).then(res =>{
        resRes(res.data.result,res.data.message);
      })
    }else{
      Vue.prototype.httpPost(url,jsonData).then(res =>{
        resRes(res.data.result,res.data.message);
      })
    }
  }).catch(() => {
  });
};

// 通用带弹窗并操作Geg请求方法
Vue.prototype.doGetItem = (msg,url,callback) => {
  Vue.prototype.$confirm(msg, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
     Vue.prototype.httpGet(url,callback).then(res =>{
       if(res.data.result == true){
         Vue.prototype.$message({
           message: res.data.message
         });
         callback();
       }else{
         Vue.prototype.$message(res.data.message);
       }
     })
  }).catch(() => {
  });
};
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
});
