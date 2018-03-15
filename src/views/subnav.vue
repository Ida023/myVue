<template>
  <div class="main2">
    <el-menu :collapse="collapsed"  router :default-active="subNavv" theme="dark" :unique-opened="true">
      <el-submenu v-for="(item,index) in msg " :index="item.grpName" v-show="item.parentId===menu" :key="index" >
        <template slot="title"><i class="el-icon-message"></i><span>{{item.grpName}}</span></template>
        <el-menu-item v-for="listurl in item.groupMenuList" :index="listurl.menuUrl" :key="index">
          <i :class="listurl.menuIconClass"></i><span>{{listurl.menuName}}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <el-col class="main-content">
      <router-view></router-view>
    </el-col>
  </div>
</template>

<script>
  import { mapState,mapMutations,mapGetters,mapActions } from 'vuex'
  export default {
    data(){
      return{
        msg:JSON.parse(sessionStorage.getItem('MuneObj')),  //  获取所有的侧边栏菜单
        activeIndex: '1',
        subNavv:sessionStorage.getItem('subNav'),    //  获取侧边栏正被点击path
        topMenu:sessionStorage.getItem('currentNav'),    //
      }
    },
    computed: {
      ...mapGetters([
        'getters',
        'menu',
        'collapsed',
        'subNav'
      ])
    },
    mounted: function () {
      this.postmenu(this.topMenu);
      //this.subNavv = this.$route.path;  //  获取侧边栏正被点击path
      //this.topMenu = sessionStorage.getItem('currentNav')  //  对应高亮 的topMenu
      console.log('正在点击侧边栏：'+this.subNavv);
      console.log('正在点击一级菜单：'+this.menu);
    },
    methods:{
      ...mapMutations([
        'postmenu',
        'subnav',
        'getsub'
      ]),
      collapse: function () {
        this.collapsed = !this.collapsed;
      },
    },
    watch:{
        '$route.path':{
            handler(val){
              this.subNavv = val;  //  获取侧边栏正被点击path
              this.topMenu = sessionStorage.getItem('currentNav')  //  对应高亮 的topMenu
              console.log('正在点击侧边栏：'+this.subNavv);
              console.log('正在点击一级菜单：'+this.topMenu);
            }
        },
      'collapsed':{
        handler(val){

        }
      },
    }
  }
</script>

<style scoped>
  .el-menu--dark:not(.el-menu--collapse) {
    width: 230px!important;
  }
</style>
