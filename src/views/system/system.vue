<template>
  <div class="main2">
    <div  class="subnav" :class="collapsed?'menu-collapsed':'menu-expanded'">
      <el-menu v-show="!collapsed" v-if="!collapsed" class="el-menu-vertical-demo el-menu-show " theme="dark" router :default-active="subNavv" :unique-opened="true">
        <el-submenu v-for="(item,index) in msg " :index="item.grpName" v-if="item.parentId==='10'" :key="index">
          <template slot="title"><i class="el-icon-message"></i>{{ item.grpName }}</template>
          <el-menu-item v-for="listurl in item.groupMenuList" :index="listurl.menuUrl" :key="index">
            <i :class="listurl.menuIconClass"></i>{{ listurl.menuName }}
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <ul class="el-menu el-menu-hide el-menu-vertical-demo collapsed" ref="menuCollapsed" v-show="collapsed">
        <li v-for="(item,index) in msg " :index="item.grpName" v-if="item.parentId==='10'" class="subnavitem" :key="index">
          <template>
            <div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)"
                 @mouseout="showMenu(index,false)">
              <i class="el-icon-message" style="color: #fff;"></i>
            </div>
            <ul class="el-menu submenu sidebar-n" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)"
                @mouseout="showMenu(index,false)">
              <li v-for="(listurl,index) in item.groupMenuList" :index="listurl.menuUrl" class="el-menu-item" style="padding-left: 40px;" :key="index">
                <router-link :to="listurl.menuUrl">{{ listurl.menuName }}</router-link>
              </li>
            </ul>
          </template>
        </li>
      </ul>
    </div >
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
        msg:JSON.parse(sessionStorage.getItem('MuneObj')),
        activeIndex: '1',
        subNavv:sessionStorage.getItem('subNav'),
        user:{
          userId:this.sessuserid,
          menuId:'10'
        }
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
      this.postmenu('10')
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
      showMenu(i, status){
        this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
      },
      handleParentClick(homemenuId) {
      },
    },
    created() {
    },
    updated: function() {
      // Vue.nextTick(function() {
      //     $('.tag').popup({ position: 'bottom left' });
      // });

    }
  }

</script>

<style scoped>

</style>
