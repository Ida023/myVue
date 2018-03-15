<template>
  <div id="">
    <el-table :data="TableData" border tooltip-effect="dark" style="width: 100%" :stripe="false">
      <el-table-column sortable label="序号" align="center" type="index" width="120"></el-table-column>
      <el-table-column sortable label="人员" align="center" prop="actionUser"></el-table-column>
      <el-table-column sortable label="动作" align="center" prop="actionType"></el-table-column>
      <el-table-column sortable label="时间" align="center" :formatter="tool.formatDate" prop="actionTime"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default{
    /*
     GrandsonData: 父组件条件，用于 后续 各种状态，各种条件下，操作按钮控制。
     */
    props:['PassGrandsonData'],
    name:'Journal',
    data() {
      return {
        GrandsonID:this.GrandsonID,//ID
        GrandsonState:this.GrandsonState, //选中
        GrandsonDis:this.GrandsonDis,//禁用
        TableData:[],
      }
    },
    mounted(){
//      this.getList()
    },
    methods:{
      getList:function (val) {
          this.httpGet('stockProductPlan/selectStockLog?itemId='+val).then(res=>{
            this.TableData=res.data;
          })
        },
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
