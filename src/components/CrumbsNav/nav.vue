<template>
    <div id="" >
      <span>当前位置：</span>
      <span v-for="(item,index) in $route.matched" :key="index">
       {{ item.name }}<span v-show="index == $route.matched.length-1? dis=false: dis=true">/</span>
      </span>
    </div>
</template>

<script>
  export default{
      data(){
          return{
            msg:JSON.parse(sessionStorage.getItem('MuneObj')),
            dis:false,
        }
      },
    mounted:function () {
      this.pustCrumbsNav()
    },
    methods:{
      pustCrumbsNav(){
        console.log(66666)
        console.log(this.msg)
      }
    }
  }

</script>

<style scoped>
</style>
