import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import getters from './getters';

Vue.use(Vuex)

// 应用初始状态
const state={//访问 状态对象
  loading:false,
  errorCount:0,         // 错误次数
  collapsed:false,
  count : 66,
  count2: 77,
  form99:'',
  menu:'0',
  subNav:'',
  selectedArr:[],//人员选择arr<产品开发/商品开发>
  SeeCardData:{//
    whId:'11',
    wIdStore:'',
    stockTransportTypeId:'',
    type:'1',
  },
  EditorContent:'',//富文本编辑器
}

// 定义所需的 mutations
const mutations = {
  //获取变更arr<产品开发/商品开发>
  select(state,n){
    state.selectedArr = n;
  },
  EditorContent(state,val){//富文本
    state.EditorContent=val;
  },
  getSeeCardData(state,obj){
    state.SeeCardData=obj;
  },
  jia(state,n){
    console.log(state)
    state.count += n.b
  },
  jian(state){
    console.log(state)
    state.count --
  },
  errorCountUp(state){
    state.errorCount++
  },
  resetErrorCount(state,n){
    state.errorCount = n
  },
  postmenu(state,n){
    state.menu=n
  },
  subnav(state,n){
    sessionStorage.setItem('subNav',n);
    state.subNav=sessionStorage.getItem('subNav')
  },
  collapse(state){
    if(state.collapsed===false){
      state.collapsed=true
      console.log( state.collapsed)
    }else {
      state.collapsed=false
      console.log( state.collapsed)
    }
  },
  getsub(state){
  // let user={
  //     userId:'20170728143745630927',
  //     menuId:'02'
  //   }
  //   $http.post(this.RmsUrl+'/login/getSubMenus', qs.stringify(user)).then(res => {
  //     this.msg = res.data;
  //     console.log(this.msg)
  //   })
  }
}

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
})
