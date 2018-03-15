<template>
  <div id="home">
    <el-row class="header">
      <el-col :span="3" class="logo">
      </el-col>
      <el-col :span="1">
        <div class="" @click="collapse">
          <i class="header-ionic el-icon-menu" >
          </i>
        </div>
      </el-col>
      <el-col :span="18">
        <el-menu  :default-active="menu" theme="dark" class="el-menu-demo" mode="horizontal"
                 @select="handleSelect">
          <el-menu-item v-for="(item,index) in msg" :index="item.menuId" >
            <router-link :to="item.menuUrl"> {{ item.menuName }}</router-link>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="2" >
        <router-link to="/personal" class="personal" @claick="personal">个人中心</router-link>
      </el-col>
    </el-row>
    <el-row class="main">
      <router-view></router-view>
    </el-row>
  </div>
</template>
<script>
  import { mapState,mapMutations,mapGetters,mapActions } from 'vuex'
  import subnav from './subnav.vue'
  export default {
    components: {subnav},
    data () {
      return {
        msg: JSON.parse(sessionStorage.getItem('topMenus')),
        menuId:'',
        activeIndex: '/product',
        uesr:{
          userId:this.sessuserid
        },
        uesr2:{
          userId:this.sessuserid,
          menuId:''
        },
        mss:'111'
      }
    },
    mounted: function () {
//        let ws =  WebSocket(url, name)
//      this.open()
//      setTimeout(()=>{
//          this.mss='222'
//        this.open()
//      },5000)
//      setTimeout(()=>{
//        this.mss='444'
//        this.open()
//      },5100)
//      setTimeout(()=>{
//        this.mss='22556552'
//        this.open()
//      },5500)
//      setTimeout(()=>{
//        this.mss='289644522'
//        this.open()
//      },5600)
    },
    computed: {
      ...mapGetters([
        'getters',
        'menus',
        'menu',
        'collapsed',
        'getCount'
      ])
    },
    methods: {
      ...mapMutations([
        'collapse',
        'postmenu',
        'subnav',
        'getsub'

      ]),
      open() {
        this.$notify({
          title: '您有新消息',
          message: this.mss,
          type: 'info',
          duration: 0
        });
      },
      cartView: function () {
          this.$http.post(this.RmsUrl+'/login/getTopMenus',this.qs.stringify(this.uesr)).then(res => {
            this.msg = res.data;
            console.log('横向导航  % O',res.data);
          })

      },
      /*菜单折叠*/
      handleSelect(key, keyPath) {
       sessionStorage.setItem("currentNav",key);
        this.postmenu(key);
//        this.$refs.subnav.handleParentClick(key);
      },
      handleSelect2(){
        let currentnav = sessionStorage.getItem("currentnav");
        this.$refs.subnav.handleParentClick(currentnav);
//        alert(currentnav)
      },
      personal(){
        this.$refs.subnav.handleParentClick(mull);
      }
    },
  }
</script>

<style scoped>
/*头部*/
  .header{
    display: flex;
    position: absolute;
    top: 0px;
    bottom: 0px;
    height: 60px;
    line-height: 60px;
    background: #324157;
    width: 100%;
    /*overflow: hidden;*/
  }
  .logo{
    display: block;
    height: 60px;
    box-sizing: border-box;
    background:url("../assets/logo2.png")no-repeat center center/50%;
  }
  /*头部切换*/
  .logo-width{
    width:230px;
  }
  .logo-collapse-width{
    width:60px;
    background-size: 80%;
  }
  /*主体内容*/
.main{
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
  position: absolute;
  top:60px;
  left:0;
}
.main2{
  display: flex;
  width: 100%;
}
/*侧边栏*/
.subnav{
 background: #324157;
}
/*内容*/
.main-content{
  flex:1;
  overflow-y: auto;
}
/*container*/
  body,html{
    min-width: 1280px !important;
  }
  .header-ionic{
    margin: 0 auto;
    color: #ffffff;
  }
  .personal{
    color: #ffffff;
  }
  #home{
    background: #324157;
  }
</style>
