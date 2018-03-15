<template>
    <div id="">
        这是个孙子
    </div>
</template>

<script>
  export default{
    /*
     GrandsonData: 父组件条件，用于 后续 各种状态，各种条件下，操作按钮控制。
     */
    props:['PassGrandsonData'],
    name:'GrandsonDemo',
    data() {
      return {
        GrandsonID:this.GrandsonID,//ID
        GrandsonState:this.GrandsonState, //选中
        GrandsonDis:this.GrandsonDis,//禁用
      }
    },
    watch:{
      'PassGrandsonData':{
        handler(val){
          this.GrandsonID=val.GrandsonID;
          this.GrandsonState=val.GrandsonState;
          this.GrandsonDis=val.GrandsonDis;
        },
        deep: true
      },
    },

  }


</script>

<style scoped>

</style>
