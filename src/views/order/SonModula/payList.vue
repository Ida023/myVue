
<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <el-row class="header" align="middle">
      <el-col :span="18" class="header-left logo"><span class="titleName">德国邮政平邮费用清单</span></el-col>
    </el-row>
    <div id="content_wrap" class="content_wrap">
      <el-row id="filer" class="supplierFiler" style="margin:-10px 0 0 0;">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <span class="span_label">类型</span>
            <el-radio-group v-model="pageFilter.payType" @change="page.currentPage=1;selectData()" size="small">
              <el-radio-button  label="1">充值</el-radio-button>
              <el-radio-button  label="2">消费</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn">
        <el-button type="primary" size="small"  @click="dialogFlag.isOpen = true;">筛选</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="payData" border tooltip-effect="dark" style="width: 100%" >
          <el-table-column  label="操作" align="center" width="160px">
            <template scope="scope" >
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row);dialogFlag.infoDetail = true">&#xe600;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="accountNo" label="邮票账号"   align="center"></el-table-column>
          <el-table-column sortable prop="currencyId" label="币种" align="center"></el-table-column>
          <el-table-column sortable prop="paypalAccountId" :label="pageFilter.payType == 1 ? '充值PayPal账号' : '订单账号？'" align="center"></el-table-column>
          <el-table-column sortable prop="oldBalance" :label="pageFilter.payType == 1 ? '充值前余额' :'消费前余额'" align="center"></el-table-column>
          <el-table-column sortable prop="amount" :label="pageFilter.payType == 1 ? '充值金额' :'消费金额'" align="center"></el-table-column>
          <el-table-column sortable prop="balance" :label="pageFilter.payType == 1 ? '充值后余额' :'消费后余额'" align="center"></el-table-column>
          <el-table-column sortable prop="payType" label="类型" :formatter="reserveType" align="center"></el-table-column>
          <el-table-column sortable prop="addUser" label="操作人"  align="center"></el-table-column>
          <el-table-column sortable prop="addTime" label="操作时间" :formatter="tool.formatDate" width="180px" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!---------------------筛选------------------------------------->
    <div class="smallDia">
      <el-dialog title="筛选" :visible.sync="dialogFlag.isOpen" size="small" :close-on-click-modal="false" @open="isGroup = false;" @close="isGroup = true;">
        <div class="data_body">
          <title-header></title-header>
          <select-input :select-value="pageFilter.payType" condition-name="类型" :options-data="optionsData" @child-change-val="getSelectInput"></select-input>
          <select-input :select-value="pageFilter.accountNo" condition-name="邮票账号" :options-data="mailAccount" @child-change-val="getSelectInput"></select-input>
          <select-input :select-value="pageFilter.user" condition-name="操作人" :options-data="userList" @child-change-val="getSelectInput"></select-input>
          <time-data :start-time="pageFilter.initialTime" condition-name="操作时间" :end-time="pageFilter.overTime" @child-value-Stime="getTime" @child-value-Etime="getTime"></time-data>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="clearData();">清除条件</el-button>
          <el-button @click="getMailList()">筛 选</el-button>
          <el-button @click="dialogFlag.isOpen = false;">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <!------------------查看费用明细--------------------------->
    <el-dialog title="查看费用明细" :visible.sync="dialogFlag.infoDetail" :close-on-click-modal="false" @close="tool.clearObjValue(formData)">
      <el-form :model="formData":label-width="labelWidth" >
        <el-form-item label="邮票账号："  prop="postageAccountId" >{{formData.postageAccountId}}</el-form-item>
        <el-form-item label="账号币种："  prop="currencyId" >{{formData.currencyId}}</el-form-item>
        <el-form-item label="类型："  prop="payType" >{{formData.payType == 1? '充值':'消费'}}</el-form-item>
        <el-form-item label="充值账号："  prop="payerAccId" >{{formData.payerAccId}}</el-form-item>
        <el-form-item :label="pageFilter.payType == 1 ? '充值前余额：' :'消费前余额：'"  prop="oldBalance" >{{formData.oldBalance}}</el-form-item>
        <el-form-item :label="pageFilter.payType == 1 ? '充值金额：' :'消费金额：'"  prop="amount" >{{formData.amount}}</el-form-item>
        <el-form-item :label="pageFilter.payType == 1 ? '充值后金额：' :'消费后金额：'"  prop="balance" >{{formData.balance}}</el-form-item>
        <el-form-item label="添加人："  prop="addUser" >{{formData.addUser}}</el-form-item>
        <el-form-item label="添加时间："  prop="addTime" >{{tool.formatDate('','',formData.addTime)}}</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="" @click="dialogFlag.infoDetail = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import titleHeader from "../../../components/ScreenModular/title.vue"
  import selectInput from '../../../components/ScreenModular/selectInput.vue'
  import timeData from '../../../components/ScreenModular/timeDate.vue'
  export default{
    components: {titleHeader,selectInput,timeData},
    data(){
      return {
        activeNames:'1',   // 折叠面板
        pageFilter:{
          currentPage:1,
          pageSize:10,
          accountId:'',
          payType:'1',
          overTime:'',
          user:'',
          initialTime:'',
          accountNo:'',
        },
        formData:{},
        dialogFlag:{
          isOpen:false,  // 筛选
          infoDetail:false,  // 查看
        },
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalPage:10,
          totalCount:10,
        },
        optionsData:[{label:'充值',value:'1'},{label:'消费',value:'2'}],
        payData:[],   // tableData
        mailAccount:[],   // tableData
        userList:[],   // tableData
        labelWidth:'160px',
        isGroup:true,
      }
    },
    mounted () {
      this.getMailList();
      this.getListDataq();
      this.pageFilter.accountId = this.tool.requestParams('accountId');
    },
    methods: {
      showInfoDialog:function(row){
        this.httpGet('financialPaymentPostage/select',{payId:row.payId}).then(res =>{
          let data = res.data;
          this.formData = data;
        })
      },
      getListDataq:function(){
        var vm = this;
        const userList = this.httpPost('powarehousingtask/selectUserInfo')
        const mailList = this.httpGet('financialAccountPaypal/selectList',{isUse:1})
        this.$http.all([userList,mailList]).then(this.$http.spread(function(userData,mailListData){
          vm.userList = vm.tool.replaceObjKey(userData.data.params.list,'userId','userName');
          vm.mailAccount = vm.tool.replaceObjKey(mailListData.data,'accountId','accountEmail');
        }))
      },
      selectData:function(){
          if(this.isGroup == true){
            this.getMailList();
          }
      },
      getMailList:function(){
        this.httpPost('financialPaymentPostage/selectAll',this.pageFilter).then(res => {
         const pageData = res.data;
         this.page = pageData;
         this.payData = pageData.listData;
         this.dialogFlag.isOpen = false;
         })
      },
      changePageSize:function(val){
        this.pageFilter.pageSize=val;
        this.pageFilter.currentPage = 1;
        this.getMailList();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getMailList();
      },
      getSelectInput:function(val){
        val.type == '操作人'  ? this.pageFilter.user = val.value : val.type == '邮票账号' ? this.pageFilter.accountNo = val.value : this.pageFilter.payType = val.value;
      },
      getTime:function(val){
        val.type == 'start' ? this.pageFilter.initialTime = val.value : this.pageFilter.overTime = val.value;
      } ,
      reserveType:function(val){
        return val.payType == 1 ?  '充值' : val.payType == 2 ?  '消费' : '';
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      clearData:function(){
          this.pageFilter.accountNo = '';
          this.pageFilter.overTime = '';
          this.pageFilter.user = '';
          this.pageFilter.initialTime = '';
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
