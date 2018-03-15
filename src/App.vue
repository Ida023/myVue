<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
  export default {

    data(){
      return {
        msg: '',
        isActive: true,
      }
    },

    mounted: function () { //入口 查询
//      this.login();
    },
    methods:{
      login:function () {
        this.$router.push({ path: '/login' });
      }
    }

  }

</script>

<style>
@import "./common/style.css";
.fade-enter-active,.fade-leave-active{
  transition:opacity .5s;
}
.fade-enter,.fade-leave-active{
  opacity: 0;
}
</style>
