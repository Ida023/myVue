<template>
  <div id="outermost_wrap" class="user_manager_wrap" >
    <el-row class="header" align="middle">
      <el-col :span="24" class="header-left logo"><span class="titleName">供应商关系-SKU列表</span></el-col>
    </el-row>
    <div id="content_wrap" class="content_wrap">
      <el-row style="">
        <el-col :span="12">
          <span style="font-weight: bold;margin-right:10px;">{{vendorName}}</span>
          <span>共计SKU <span style="color: red;">{{productCount}}</span>个</span>
        </el-col>
        <div style="text-align: right;">
          <el-button type="primary" size="small"  @click="downDown()" >导出供应商商品</el-button>
        </div>
      </el-row>
      <el-row style="margin: 10px 0;">
        <el-col :span="2">
          <el-select v-model="inputTitle" filterable  @change="inputValue=''" size="small">
            <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.label"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4" class="optionValue">
          <el-input v-model="inputValue" :placeholder="inputTitle == 'sku' ? '请输入sku' :  '请输入spu'" size="small"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" size="small" @click="selectFilter(inputTitle,inputValue)">搜索</el-button>
        </el-col>
      </el-row>
      <div id="item_list">
        <el-table :data="proDetailData" border tooltip-effect="dark" style="width: 100%" >
          <el-table-column  label="操作" align="center" width="150px">
           <template scope="scope">
             <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
               <i class="iconfontyyy" @click="selectProduct(scope.row)" >&#xe600;</i>
             </el-tooltip>
             <el-tooltip class="item" effect="dark" content="库存详情" placement="top-start">
               <i class="iconfontyyy" @click="queryItem(scope.row)" >&#xe608;</i>
             </el-tooltip>
             <el-tooltip content="商品库存"  effect="dark" placement="bottom">
               <i  class="iconfontyyy" content="Bottom center" @click="tool.goToPage('commodityStock?Id='+scope.row.orderId)">&#xe6f6;</i>
             </el-tooltip>
             <el-tooltip content="历史销量"  effect="dark" placement="bottom">
               <i  class="iconfontyyy" content="Bottom center" @click="tool.goToPage('HistoricalSales?Id='+scope.row.orderId);">&#xe61b;</i>
             </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="skuNo" label="SKU" align="center"></el-table-column>
          <el-table-column sortable prop="productImageId" label="图片" align="center" width="106px">
            <template scope="scope"><img :src="scope.row.productImageId"></template>
          </el-table-column>
          <el-table-column sortable prop="productName" label="商品名称" align="center"></el-table-column>
          <el-table-column sortable prop="marketCount" label="最近7/15/30/60/90天/1年销量" align="center"></el-table-column>
          <el-table-column sortable prop="poCount" label="最近7/15/30/60/90/1年采购量" align="center"></el-table-column>
          <el-table-column sortable prop="usableQty" label="货架数量总计" align="center"></el-table-column>
          <el-table-column sortable prop="inRoadQty" label="可销售数总计" align="center"></el-table-column>
          <el-table-column sortable prop="defectiveQty" label="在途数量总计 " align="center"></el-table-column>
          <el-table-column sortable prop="allUsableQty" label="故障品数总计 " align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <el-dialog title="库存详情" :visible.sync="dialogFlag.openF" size="small" :close-on-click-modal="false" >
      <el-table :data="leaveData" border tooltip-effect="dark" style="width: 100%" >
        <el-table-column sortable prop="whName" label="仓库" align="center"></el-table-column>
        <el-table-column sortable prop="locationNo" label="库位号" align="center"></el-table-column>
        <el-table-column sortable prop="usableQty" label="货架数量" align="center"></el-table-column>
        <el-table-column sortable prop="inRoadQty" label="可销售数量 " align="center"></el-table-column>
        <el-table-column sortable prop="allUsableQty" label="在途数量 " align="center"></el-table-column>
        <el-table-column sortable prop="defectiveQty" label="故障品数量 " align="center"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.openF = false;">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        proDetailData:[],
        leaveData:[],
        pageFilter:{
          currentPage:1,
          pageSize:10,
          skuNo:'',
          spuNo:'',
          vendorId:'',
        },
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalCount:10,
          totalPage:10
        },
        inputTitle:'SPU',
        inputValue:'',
        dialogFlag:{
          openF:false,
          isOpen:false,
          activeTab:'0',
        },
        options: [{value: 1, label: 'SPU'}, {value: 2, label: 'SKU'}],
        productCount:'',
        vendorName:'',
        leaveData:[],
      }
    },
    mounted () {
    	this.pageFilter.vendorId=this.tool.requestParams('vendorId');
    	this.productCount=this.tool.requestParams('productCount');
    	this.vendorName=this.tool.requestParams('vendorName');
      this.getData();
    },
    methods: {
      selectFilter:function(title,val){  // 搜索
        this.pageFilter.spuNo = title == 'SPU' ? val :'';
        this.pageFilter.skuNo = title == 'SKU' ? val :'';
        this.getData();
      },
      getData:function(){   // 加载数据
        this.httpGet('vendorRelation/queryVendorProductInfo',this.pageFilter).then(res => {
          if(res.data){
            this.proDetailData = res.data.listData;
            this.page = res.data;
          }else{
            this.proDetailData = [];
          }
        })
      },
      queryItem:function(row){  // 查看查存详情
          this.httpGet('vendorRelation/queryVendorItem',{productId:row.productId}).then(res =>{
              if(res.data.result == true){
                  this.leaveData = res.data.params.list;
                  this.dialogFlag.openF = true;
              }
          })
      },
      selectProduct:function(row){  // 查看商品信息
          this.$message('商品列表未更新2.0，暂时未开发')
      },
      downDown:function(){   // 导出 sku列表
        var url = this.RmsUrl+'vendorRelation/excelVendorProductInfo?Authorization='+sessionStorage.getItem("userSession")+'&vendorId='+this.pageFilter.vendorId
          +'&skuNo='+this.pageFilter.skuNo+'&spuNo='+this.pageFilter.spuNo;
        window.open(url);
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
