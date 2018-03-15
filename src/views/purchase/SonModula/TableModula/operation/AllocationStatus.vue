<template>
  <div id="">
    <el-table :data="TableData" border tooltip-effect="dark" style="width: 100%" :stripe="false">
      <el-table-column sortable label="序号" align="center" type="index" width="120"></el-table-column>
      <el-table-column sortable label="调拨单号" align="center" prop="name"></el-table-column>
      <el-table-column sortable label="状态" align="center" prop="action"></el-table-column>
      <el-table-column sortable label="数量" align="center" prop="time"></el-table-column>
      <el-table-column sortable label="跟踪单号" align="center" prop="time2"></el-table-column>
      <el-table-column sortable label="调拨单生产时间" align="center" prop="time3"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default{
    /*
     GrandsonData: 父组件条件，用于 后续 各种状态，各种条件下，操作按钮控制。
     */
    props:['PassGrandsonData'],
    name:'AllocationStatus',
    data() {
      return {
        GrandsonID:this.GrandsonID,//ID
        GrandsonState:this.GrandsonState, //选中
        GrandsonDis:this.GrandsonDis,//禁用
        TableData:[],
      }
    },
    mounted(){

    },
    methods:{
      getList:function () {
        this.$http.get('static/Journal.json').then(res=>{
          this.TableData=res.data.TableList;
          console.log(this.TableData)
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
