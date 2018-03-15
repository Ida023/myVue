<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <el-row class="header">
      <el-col class="header-left logo"><span class="titleName">{{type == '1'?'待入库清单': '已入库清单'}}</span></el-col>
    </el-row>
    <div id="content_wrap" class="content_wrap">
      <el-row type="flex" justify="space-around" class="margin-bottom">
        <el-col><span>入库仓库：{{tableData.whName}}</span></el-col>
        <el-col class="align-right"><span>打印人：{{tableData.name}}</span><span class="padding-left">打印时间：{{tableData.time}}</span></el-col>
      </el-row>
      <div id="item_list">
        <el-table :data="tableData.wareEnterItemList" border tooltip-effect="dark" style="width: 100%">
          <el-table-column sortable label="图片" align="center" width="150px">
            <template scope="scope">
              <img :src="scope.row.picture"  style="width: 100%;height: 100px;">
            </template>
          </el-table-column>
          <el-table-column sortable label="采购订单编号"  prop="poNo" align="center"></el-table-column>
          <el-table-column sortable label="SKU/名称"  align="center">
            <template scope="scope">
              <span>{{scope.row.skuNo}}</span><br/>
              <span>{{scope.row.proName}}</span><br/>
            </template>
          </el-table-column>
          <el-table-column sortable label="质检结果"  prop="insAllQty" align="center"></el-table-column>
          <el-table-column sortable label="质检完成时间"  prop="insTime" align="center"></el-table-column>
          <el-table-column sortable label="质检员"  prop="insUser" align="center"></el-table-column>
          <el-table-column sortable label="实际入库"   align="center">
            <el-table-column sortable label="良品"  prop="wareQty" align="center"></el-table-column>
            <el-table-column sortable label="次品"  prop="wareDefectiveQty" align="center"></el-table-column>
          </el-table-column>
          <el-table-column v-if="type != '1'"sortable label="入库员"  prop="wareUserName" align="center"></el-table-column>
        </el-table>
      </div>
      <el-row class="margin-top">
        <p>小计：<i class="hr-i"></i></p>
        <p>质检结果：良品数/故障品数：{{insQty}}</p>
        <p>入库结果：良品数：<i class="hr-i"></i> 故障品数：<i class="hr-i"></i> </p>
        <p>签字：<i class="hr-i"></i></p>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        type:'',
        src:'',
        tableData:'',
        insQty:'',   // 良品数 / 故障品数
        itemList:[],
        sels:[],
        poId:'',
      }
    },
    beforeRouteEnter(to, from, next){
      window.opener=null;
      next();
    },
    mounted(){
      this.type = this.tool.requestParams('type');
      this.getListData();
    },
    methods: {
      getListData:function () {
        var data = this.tool.requestParams('list').split(',');
        var list = [],vm = this;
        data.forEach(function(item){
            list.push({taskId:item});
        })
        this.httpPost('powarehousingtask/selectWhEnterItem',list).then(res=>{
            if(res.data.result == true){
              this.tableData = res.data.params.list;
              var insQty =  this.tableData.wareEnterItemList.map(item =>item.insQty);
              var insDefectiveQty =  this.tableData.wareEnterItemList.map(item =>item.insDefectiveQty);
              if(insQty.length>0 || insDefectiveQty.length>0) {
                insQty = eval(insQty.join("+"));
                insDefectiveQty = eval(insDefectiveQty.join("+"));
                insQty = insQty === undefined ? '' : insQty;
                insDefectiveQty = insDefectiveQty === undefined ? '' : insDefectiveQty;
                this.insQty = insQty + '/' + insDefectiveQty
              }
            }else{
              this.tableData = [];
            }
        })
      },

    }
  }
</script>
<style scoped>
  .header {
    width: 100%;
    line-height: 80px;
    height: 80px;
    border-bottom:1px solid #dfe6ec;
  }
  .logo{
    display: block;
    height: 80px;
    box-sizing: border-box;
    background:url("../../../assets/banner_title.jpg")no-repeat left;
  }
  .titleName{
    padding-left: 500px;
    font-weight:bold;
    font-size:18px;
  }
  .padding-left{
    padding-left:20px;
  }
  .margin-bottom{
    margin-bottom:20px;
  }
  .margin-top{
    margin-top: 30px;
  }

</style>
