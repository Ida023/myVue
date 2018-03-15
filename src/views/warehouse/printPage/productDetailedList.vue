<template>
  <div id="outermost_wrap" class="pageWidth user_manager_wrap" >
    <el-row class="header" align="middle">
      <el-col :span="18" class="header-left logo"><span class="titleName" @click="print">物品清单&签收质检入库</span></el-col>
      <el-col :span="6" class="header-right">
        <el-row style="margin-bottom: 15px;">合同编号：{{poNo}}</el-row>
        <el-row>采购员：{{name}}</el-row>
      </el-col>
    </el-row>
    <div id="content_wrap" class="content_wrap">
      <h3>物品清单</h3>
      <el-table :data="proDetailData" id="item_list" border tooltip-effect="dark" style="width: 100%">
         <el-table-column type="index" width="55" align="center" label="序号"></el-table-column>
          <el-table-column sortable prop="cnName" label="名称"   align="center"></el-table-column>
          <el-table-column sortable prop="skuNo" label="SKU" align="center"></el-table-column>
          <el-table-column sortable prop="imageUrl" label="图片" align="center">
            <template scope="scope"><img :src="scope.row.imageUrl"></template>
          </el-table-column>
          <el-table-column sortable prop="poQty" label="数量" align="center"></el-table-column>
          <el-table-column sortable prop="itemUnit" label="单位" align="center"></el-table-column>
          <el-table-column label="备注" align="center" prop="remarksDetails"  sortable  width="400">
            <template scope="scope">
              <el-row v-for="item in scope.row.remarksDetails"  :key="item.itemNo">
                <span>{{item.itemNo}}</span>/<span>{{item.poQty}}</span>/<span>{{item.whName}}</span>/<span>{{item.transportType}}<br></span>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      <h3>签收质检入库</h3>
      <el-table :data="proDetailData2" id="item_list" border tooltip-effect="dark" style="width: 100%" >
          <el-table-column type="index" width="55" align="center" label="序号"></el-table-column>
          <el-table-column sortable prop="receiveItem" label="签收"   align="center"></el-table-column>
          <el-table-column sortable prop="receiveUserName" label="签收人" align="center"></el-table-column>
          <el-table-column sortable prop="receiveTime" label="签收时间" :formatter="tool.dateFormatter"   align="center"></el-table-column>
          <el-table-column sortable prop="inspectionStatus" label="是否质检" align="center"></el-table-column>
          <el-table-column prop="inspectionItem" align="center" label="质检详情"  sortable  >
            <template scope="scope">
              <span v-for="a in scope.row.inspectionItem">{{a.item}}</span><br/>
            </template>
          </el-table-column>
          <el-table-column prop="inspectionUserName" align="center" label="质检员"  sortable  ></el-table-column>
          <el-table-column prop="inspectionTime" align="center" label="质检时间" :formatter="tool.dateFormatter"   sortable  ></el-table-column>
          <el-table-column prop="warehouseStatus" align="center" label="是否入库"  sortable  ></el-table-column>
          <el-table-column prop="warehouseRecItem" align="center" label="入库详情"  sortable  >
            <template scope="scope">
              <span v-for="a in scope.row.warehouseRecItem">{{a.item}}</span><br/>
            </template>
          </el-table-column>
          <el-table-column prop="whTaskUserName" align="center" label="入库员"  sortable  ></el-table-column>
          <el-table-column prop="whRecTime" align="center" label="入库时间"  :formatter="tool.dateFormatter"  sortable  ></el-table-column>
          <el-table-column prop="memo" align="center" label="签收备注内容"  sortable  ></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        proDetailData:[],
        proDetailData2:[],
        name:'',
        poNo:'',
        poId:'',
      }
    },
    mounted () {
      this.poId=this.tool.requestParams('poId');
      this.taskId=this.tool.requestParams('taskId');
      this.getProDetailList();
      this.getProDetailList2();
    },
    methods: {
      getProDetailList:function(){
        this.httpPost('productPurchase/query?poId='+this.poId).then(res => {
          this.proDetailData = res.data.stockObject;
          this.poNo =  res.data.delivery.poNo;
          this.name = res.data.delivery.userName;
        })
      },
      getProDetailList2:function(){
        this.httpGet('productExamine/selectInspectionWhItem?taskId='+this.taskId).then(res => {
            if(res.data.result == true){
              this.proDetailData2 = res.data.params.model;
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
  .pageWidth{
    width:1200px!important;
  }
</style>
