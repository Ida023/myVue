<!--
<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <el-row>
      <h4>拣货单</h4>
    </el-row>
    <el-row class="header" align="middle">
      <el-col :span="18" class="header-left logo"><span class="titleName" @click="print">物品清单</span></el-col>
      <el-col :span="6" class="header-right">
        <el-row style="margin-bottom: 15px;">合同编号：{{poNo}}</el-row>
        <el-row>采购员：{{name}}</el-row>
      </el-col>
    </el-row>
    <div id="content_wrap" class="content_wrap">
      <div id="item_list">
        <el-table :data="proDetailData" border tooltip-effect="dark" style="width: 100%" >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column sortable prop="proName" label="名称"   align="center"></el-table-column>
          <el-table-column sortable prop="skuNo" label="SKU" align="center"></el-table-column>
          <el-table-column sortable prop="nation" label="图片" align="center">
            <template scope="scope"><img :src="scope.row.picture"></template>
          </el-table-column>
          <el-table-column sortable prop="count" label="数量" align="center"></el-table-column>
          <el-table-column sortable prop="unit" label="单位" align="center"></el-table-column>
          <el-table-column sortable prop="docs" label="备注"  align="center"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        proDetailData:[],
        name:'',
        poNo:'',
      }
    },
    mounted () {
      this.getProDetailList();
    },
    methods: {
      getProDetailList:function(){
        this.httpPost('url',{taskId:this.tool.requestParams('taskId')}).then(res => {
            if(res.data.result == true){

            }else{

            }
        })
      },
      print:function(){
          alert(434);
        document.body.innerHTML=document.getElementById('outermost_wrap').innerHTML;
        window.print();
      }
    }
  }
</script>
<style scoped>
  .header {
    width: 100%;
    height: 80px;
    border-bottom:1px solid #dfe6ec;
  }
  .logo{
    display: block;
    height: 80px;
    line-height: 80px;
    box-sizing: border-box;
    background:url("../../../assets/banner_title.jpg")no-repeat left;
  }
  .titleName{
    padding-left: 500px;
    font-weight:bold;
    font-size:18px;
  }
  .header-right{
    text-align: right;
    padding: 13px 20px;
    font-size: 14px;
  }
</style>
-->
