<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <el-row class="header" align="middle">
      <el-col :span="18" class="header-left logo"><span class="titleName">德国邮政平邮邮票清单</span></el-col>
    </el-row>
    <div id="content_wrap" class="content_wrap">
      <el-row id="filer" class="supplierFiler" style="margin:-10px 0 10px 0;">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <span class="span_label">类型</span>
            <el-radio-group v-model="pageFilter.isUse" @change="page.currentPage=1;getMailList()" size="small">
              <el-radio-button  label="">全部</el-radio-button>
              <el-radio-button  label="1">已启用</el-radio-button>
              <el-radio-button  label="0">已暂停</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <div id="item_list">
        <el-table :data="mailData" border tooltip-effect="dark" style="width: 100%" >
          <el-table-column sortable prop="orderId" label="订单ID"   align="center"></el-table-column>
          <el-table-column sortable prop="cnName" label="物流方式" align="center"></el-table-column>
          <el-table-column sortable prop="postageType" label="邮票类型" align="center"></el-table-column>
          <el-table-column sortable prop="a" label="邮票" align="center">
            <template scope="scope"><img :src="scope.row.picture"></template>
          </el-table-column>
          <el-table-column sortable prop="batchNo" label="邮票批次号" align="center"></el-table-column>
          <el-table-column sortable prop="isUse" label="使用" :formatter="reserveIsUse" align="center"></el-table-column>
          <el-table-column sortable prop="isClone" label="克隆"  :formatter="reserveIsClone" align="center"></el-table-column>
          <el-table-column sortable prop="userName" label="上传者"  align="center"></el-table-column>
          <el-table-column sortable prop="addTime" label="上传时间" :formatter="tool.formatDate" width="180px" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!--消费弹出框------------->
    <pay-dialog mail-ids='123456789' :is-open="isOpen" :call-back="getVATList"></pay-dialog>
  </div>
</template>
<script>
  import payDialog from "../../../components/singleDialogData/deMailPayDialog.vue"
  export default{
    components: {payDialog},
    data(){
      return {
        isOpen:false,
        activeNames:'1',   // 折叠面板
        pageFilter:{
          currentPage:1,
          pageSize:10,
          isUse:'',
          accountId:'',
        },
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalPage:10,
          totalCount:10,
        },
        mailData:[],   // tableData
      }
    },
    mounted () {
      this.getMailList();
    },
    methods: {
      getMailList:function(){
        this.pageFilter.accountId = this.tool.requestParams('accountId');
        this.httpGet('financialAccountPostage/postagePaymentItem',this.pageFilter).then(res => {
           const pageData = res.data;
           this.page.currentPage = pageData;
           this.mailData = pageData.listData;
         })
      },
      reserveIsUse:function(val){
          return val.isUse === '0' ? '未使用' : val === '1' ? '已使用' : '';
      },
      reserveIsClone:function(val){
        return val.isClone === '0' ? '未克隆' : val === '1' ? '已克隆' : '';
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
</style>
