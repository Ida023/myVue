<template>
  <div id="outermost_wrap" class="user_manager_wrap" >
    <el-row class="header" align="middle">
      <el-col :span="24" class="header-left logo"><span class="titleName">供应商关系-采购订单列表</span></el-col>
    </el-row>
    <div id="content_wrap" class="content_wrap">
      <el-row style="margin-bottom: 10px;">
        <el-col :span="12">
          <span style="font-weight: bold;margin-right:10px;">{{vendorName}}</span>
          <span>共计采购订单 <span style="color: red;">{{poInfoCount}}</span>个</span>
        </el-col>
        <div style="text-align: right;">
          <el-button type="primary" size="small"  @click="downDown()" >导出供应商商品</el-button>
        </div>
      </el-row>
      <el-row style="margin: 10px 0;">
         <el-col :span="4" class="optionValue">
          <el-input v-model="pageFilter.poNo" placeholder="请输入采购订单编号" size="small"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" size="small" @click="getData">搜索</el-button>
        </el-col>
      </el-row>
      <div id="item_list">
        <el-table :data="proDetailData" border tooltip-effect="dark" style="width: 100%" >
          <el-table-column  label="操作" align="center">
            <template scope="scope">
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
                <i class="iconfontyyy" @click="" >&#xe600;</i>
              </el-tooltip>
           </template>
          </el-table-column>
          <el-table-column type="index" width="55" align="center" label="序号"></el-table-column>
          <el-table-column sortable prop="poNo" label="采购单编号"   align="center"></el-table-column>
          <el-table-column sortable prop="userName" label="创建人" align="center"></el-table-column>
          <el-table-column sortable prop="addTime" label="创建时间" align="center"></el-table-column>
          <el-table-column sortable prop="vendorName" label="供应商" align="center"></el-table-column>
          <el-table-column sortable prop="elseAmount" label="货款小计" align="center"></el-table-column>
          <el-table-column sortable prop="totalAmount" label="其他费用" align="center"></el-table-column>
          <el-table-column sortable prop="deductionCost" label="抵扣" align="center"></el-table-column>
          <el-table-column sortable prop="allAmount" label="货款总计" align="center"></el-table-column>
          <el-table-column sortable prop="whName" label="交货仓库" align="center"></el-table-column>
          <el-table-column sortable prop="approveStatus" label="审核状态" align="center"></el-table-column>
          <el-table-column sortable prop="paymentStatus" label="付款状态" align="center"></el-table-column>
          <el-table-column sortable prop="warehouseStatus" label="到货状态" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        proDetailData:[],
        vendorName:'',
        poInfoCount:'',
        pageFilter:{
          currentPage:1,
          pageSize:10,
          vendorId:'',
          poNo:'',
        },
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalCount:10,
          totalPage:10
        },
      }
    },
    mounted () {
      this.pageFilter.vendorId=this.tool.requestParams('vendorId');
      this.poInfoCount=this.tool.requestParams('poInfoCount');
      this.vendorName=this.tool.requestParams('vendorName');
      this.getData();
    },
    methods: {
      getData:function(){
        this.httpGet('vendorRelation/queryVendorPoInfo',this.pageFilter).then(res => {
            if(res.data){
              this.proDetailData = res.data.listData;
              this.page = res.data;
            }else{
                this.proDetailData = [];
            }
        })
      },
      changePageSize:function(val){
        this.pageFilter.pageSize=val;
        this.pageFilter.currentPage = '1';
        this.getData();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getData();
      },
      downDown:function(){   // 导出 sku列表
        var url = this.RmsUrl+'vendorRelation/excelVendorPoInfo?Authorization='+sessionStorage.getItem("userSession")+'&vendorId='+this.pageFilter.vendorId
          +'&poNo='+this.pageFilter.poNo;
        window.open(url);
      },
      openDialog(val,info){   // 查看
        this.poIdd = val.poId;
        this.poNoo = val.poNo;
        this.relaIdd = val.relaId;
        this.nodeIdd=val.nodeId;
        this.processKeyy = this.NodeIdlist[1].processKey;
        this.DialogStatus = val.nodeName;
        console.log('	this.DialogStatus====='+	this.DialogStatus)
        info == '编辑' ? this.dialogFlag.inputDisabled = false : this.dialogFlag.inputDisabled = true;
        this.httpPost('/productPurchase/query?poId='+this.poIdd).then(res => {
          var vm=this;
          vm.tabListData=res.data;
          if(res.data.purchaseNote){
            for(var item of res.data.purchaseNote){
              item.updTime = this.tool.formatDate('','',item.updTime);
            }
            this.tabListData.purchaseNote = res.data.purchaseNote;
          }
          if(res.data.purchaseContract){
            var arrImg = res.data.purchaseContract;
            var newImg = [];
            for(let i=0;i<arrImg.length;i++){
              newImg.push({url:arrImg[i].imageUrl,id:arrImg[i].id,attachmentId:arrImg[i].attachmentId});
            }
            vm.tabListData.purchaseContract = newImg;
          }
          if(res.data.purchaseInvoice){
            var Invoice = res.data.purchaseInvoice;
            var newInvoice = [];
            for(let i=0;i<Invoice.length;i++){
              newInvoice.push({url:Invoice[i].imageUrl,id:Invoice[i].id,attachmentId:Invoice[i].attachmentId});
            }
            vm.tabListData.purchaseInvoice = newInvoice;
          }
        })
      },
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
