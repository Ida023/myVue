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
      <el-col :span="18" id="menuList">
        <!--<el-menu theme="dark" :default-active="menu" class="el-menu-demo" mode="horizontal" router @select="handleSelect" v-for="item in msg">-->
          <!--<el-menu-item :index="iten.menuUrl">{{iten.menuName}}</el-menu-item>-->
        <!--</el-menu>-->
<<<<<<< .mine

          <el-menu theme="dark" :default-active="menu" class="el-menu-demo menu-width"  mode="horizontal"
                   @select="handleSelect">
            <el-menu-item v-for="(item,index) in msg" :index="item.menuId" >
              <router-link :to="item.menuUrl"> {{ item.menuName }}</router-link>
            </el-menu-item>
          </el-menu>
||||||| .r5866
        <el-menu theme="dark" :default-active="menu" class="el-menu-demo" mode="horizontal"
                 @select="handleSelect">
          <el-menu-item v-for="(item,index) in msg" :index="item.menuId" >
            <router-link :to="item.menuUrl"> {{ item.menuName }}</router-link>
          </el-menu-item>
        </el-menu>
=======
        <el-menu  :default-active="menu"theme="dark" class="el-menu-demo" mode="horizontal"
                 @select="handleSelect">
          <el-menu-item v-for="(item,index) in msg" :index="item.menuId" >
            <router-link :to="item.menuUrl"> {{ item.menuName }}</router-link>
          </el-menu-item>
        </el-menu>
>>>>>>> .r5895
      </el-col>
      <el-col :span="3" style="text-align: right">
        <span class="menuNext" @click="changeMenu('next')" v-if="menuWidthFlag==true"></span>
        <span class="menuPrev" @click="changeMenu('prev')" v-if="menuWidthFlag==true"></span>
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
  import ElCol from "element-ui/packages/col/src/col";
  import subnav from './subnav.vue'
  export default {
    components: {ElCol,subnav},
    data () {
      return {

      	menuWidthFlag:false,
        menuWidth:'',
        screenWidth: document.body.clientWidth,
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
        mss:'111',
        menuKey:'',
      }
    },
    mounted: function () {
     //const that = this ; // _.debounce 是一个通过 lodash 限制操作频率的函数。
      const that = this;
     // var menuW=document.getElementById('menuList');
     // alert(menuW.offsetWidth<1000)
      this.setMenuWidth();
      window.onresize = function() {
        return function(){
          window.screenWidth = document.body.clientWidth;
          that.screenWidth = window.screenWidth
        }()
      }

  //this.setMenuWidth();
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

      ]),
      changeMenu(val){
        let menuIndex='',that=this;
        that.msg.forEach((item,index,data)=>{
      		if(that.menu==item.menuId){
            menuIndex=index
          }
        })
        if(val=='next'){
          menuIndex++;

        }else{
          menuIndex--;
        }
        that.msg.forEach((item,index,data)=>{
            if(menuIndex==index){
              that.$store.state.menu=item.menuId
              //that.menu=item.menuId
            }
        })
      },
      setMenuWidth(){
      	let menuWidth=document.getElementById('menuList');
      	this.menuWidth=menuWidth.offsetWidth;
      	//alert(this.menuWidth)
        if(this.menuWidth<=1000){
          this.menuWidthFlag=true;
        }else{
          this.menuWidthFlag=false;
        }
      },
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

/*      	this.menuKey=key;
console.log('key ',key)
        console.log('keyPath ',keyPath)

//        sessionStorage.setItem("currentnav",key);
||||||| .r5866
//        sessionStorage.setItem("currentnav",key);
=======
       sessionStorage.setItem("currentNav",key);
>>>>>>> .r5895
//        this.$refs.subnav.handleParentClick(key);*/
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
    watch: {
      'screenWidth': {
        handler(val){
        	this.setMenuWidth();
        },
        deep: true
      }
    }
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
  .menu-width{
    max-width: 1000px;
    overflow: hidden;
    display: inline-block;
  }
.menuPrev{
  background: url(../assets/ZB-001.png)no-repeat 20% 50%;

}
.menuNext{
  background: url(../assets/YB-001.png)no-repeat 20% 50%;

}
  .menuPrev, .menuNext{
    float: right;
    display: inline-block;
    width: 30px;
    height: 60px;
    line-height: 60px;
    margin:0;
    cursor: pointer;
    position: relative;
    box-sizing: border-box;
    border-bottom: 5px solid transparent;
    background-size: 50% 30%;
  }


</style>
