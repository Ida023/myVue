<template>
  <!--可合并订单-&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row >
        <el-col :span="2">
          <el-select v-model="inputTitle" filterable  @change="inputValue=''" size="small">
            <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.label"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4" class="optionValue">
          <el-input v-model="inputValue" :placeholder="inputTitle == '平台订单' ? '请输入平台订单' :  '请输入系统订单'" size="small"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" size="small" @click="selectFilter(inputTitle,inputValue)"">搜索</el-button>
        </el-col>
      </el-row>
      <!--筛选条件 平台，账号，站点及国家-->
      <el-row id="filer" class="">
        <status-type :channel-id-item="pageFilter.channelId"  :account-no-item="pageFilter.accountNo" :country-no-item="pageFilter.countryNo" :country-item="pageFilter.country" @getParamsData="getParamsData"></status-type>
      </el-row>
      <el-row class="supplier_btn ">
        <el-button type="primary" size="small"  @click="dialogFlag.filterDialog = true;dialogFlag.open = !dialogFlag.open">筛选</el-button>
      </el-row>
      <el-row class="supplier_btn last_btn">
        <el-button type="primary" size="small" @click="batchBtnDone('合并订单');" >合并订单</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="tableData" border tooltip-effect="dark" style="width: 100%"   @selection-change="selsChange">
          <table-column-data></table-column-data>
          <el-table-column label="操作"  prop="label" align="center"  width="160px">
            <template scope="scope">
              <el-tooltip content="订单详情"  effect="dark" placement="bottom">
                <i  class="iconfontyyy" content="Bottom center" @click="tool.goToPage('orderDetails?transferId='+scope.row.orderId+'&allowRefund='+scope.row.allowRefund+'&allowRedirect='+scope.row.allowRedirect+'&allowReturn='+scope.row.allowReturn)">&#xe600;</i>
              </el-tooltip>
              <el-tooltip content="添加备注"  effect="dark" placement="bottom">
                <i  class="iconfontyyy" content="Bottom center" @click="rowBtnDone(scope.row, '添加备注')">&#xe623;</i>
              </el-tooltip>
              <el-tooltip content="发邮件"  effect="dark" placement="bottom">
                <i  class="iconfontyyy" content="Bottom center" @click="rowBtnDone(scope.row, '发邮件')">&#xe738;</i>
              </el-tooltip>
              <el-tooltip content="复制创建手工订单"  effect="dark" placement="bottom">
                <i  class="iconfontyyy" content="Bottom center" @click="rowBtnDone(scope.row, '复制创建手工订单')">&#xe607;</i>
              </el-tooltip>
              <el-tooltip content="退款"  effect="dark" placement="bottom" v-if="scope.row.allowRefund == 1">
                <i  class="iconfontyyy" content="Bottom center" @click="rowBtnDone(scope.row, '退款')">&#xe690;</i>
              </el-tooltip>
              <el-tooltip content="发起预退件"  effect="dark" placement="bottom" v-if="scope.row.allowReturn == 1">
                <i  class="iconfontyyy" content="Bottom center" @click="rowBtnDone(scope.row, '发起预退件')">&#xe62b;</i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!------------------退款 弹出框--------------------------->
    <refunds-dialog :id-value="refundsData.id" :is-open="refundsData.isOpen" @getData="getData"></refunds-dialog>
    <!------------------发起预退件 弹出框--------------------------->
    <pre-withdrawal :id-value="preWithdrawal.id" :is-open="preWithdrawal.isOpen" :add-btn="true" dialog-title="发起预退件" @getData="getData"></pre-withdrawal>
    <!------------------复制手工订单 弹出框--------------------------->
    <copy-order-dialog :id-value="copyOrderData.id" :is-open="copyOrderData.isOpen" :dialog-title="copyOrderData.title"  @getData="getData"></copy-order-dialog>
    <!------------------添加备注 弹出框--------------------------->
    <remark-dialog :id-value="remarkData.id" :is-open="remarkData.isOpen" @getData="getData"></remark-dialog>
    <!------------------发消息/邮件 弹出框--------------------------->
    <mail-dialog :id-list="mailData.ids" :is-open="mailData.isOpen" :dialog-title="mailData.title" :channel-id="pageFilter.channelId" @getData="getData"></mail-dialog>
    <!------------------筛选 弹出框--------------------------->
    <el-dialog title="筛选" :visible.sync="dialogFlag.filterDialog" :close-on-click-modal="false" size="small" @open="isGroup=false" @close="isGroup=true;">
      <screen-data :params-data="pageFilter" ref="screenData" :is-open="dialogFlag.open"></screen-data>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeFilterDialog">清空筛选</el-button>
        <el-button @click="filterData();" :loading="$store.state.loading">筛选</el-button>
        <el-button @click="dialogFlag.filterDialog = false;">取消</el-button>
      </div>
    </el-dialog>
    <!------------------设置物流方式 弹出框--------------------------->
    <el-dialog title="设置物流方式" :visible.sync="combinedDialog.isOpen" :close-on-click-modal="false" size="small" @open="isGroup=false" @close="isGroup=true;">
      <el-form label-width="180px" :model="combinedDialog"  ref="supplyData">
        <el-form-item label="分配仓库：">
          <span>{{combinedDialog.whId}}</span>
        </el-form-item>
        <el-form-item label="请设置该可合并订单的物流方式：" prop="type">
          <el-select v-model="combinedDialog.type" placeholder="请选择" style="margin-bottom: 20px;">
            <el-option v-for="item in combinedDialog.list" :key="item.methodId" :label="item.cnName" :value="item.methodId">{{item.cnName}}</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="combinedDialog.isOpen = false;">取消</el-button>
        <el-button type="primary" @click="saveCombined();" :loading="$store.state.loading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { mapState,mapMutations,mapGetters,mapActions } from 'vuex'
  export default{
    components: {},
    data(){
      return {
        mailData:{   // 发邮件/消息 子组件传参
          ids:[],
          isOpen:false,
          title:'',
        },
        remarkData:{  // 添加血液 子组件传参
           id:'',
          isOpen:false,
        },
        copyOrderData:{  // 复制/新建手工订单 子组件传参
           id:'',
          title:'',
          isOpen:false,
        },
        refundsData:{  // 退款 子组件传参
           id:'',
          isOpen:false,
        },
        preWithdrawal:{  // 发起预退件 子组件传参
          id:'',
          isOpen:false,
        },
        combinedDialog:{  // 发起预退件 子组件传参
          ids:'',
          isOpen:false,
          list:[],
          title:'',
        },
        inputTitle:'系统订单',
        inputValue:'',
        options: [{value: 1, label: '系统订单'}, {value: 2, label: '平台订单'}],
        isOpen:false,   // 触发 子组件 消费弹窗是否打开的标识
        activeNames: ['1'],
        sels: [],   // table选中数据
        tableData:[],   // 表格数据
        pageFilter:{
          currentPage:1,
          pageSize:10,
          status:'可合并订单',   //  节点
          orderNo:'',  //  系统  订单号
          shopOrderId:'',  // 平台  订单号
          channelId:'',
          accountNo:'',
          countryNo:'',
          toCountryNo:'',
          customerInfo:'',
          logisticsMethod:'',
          whId:'',
          skuNo:'',
          salesUser:'',
        },
        status:'',
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalPage:10,
          totalCount:10,
        },
        VATinvoiceData:[],   // 供应商列表
        dialogFlag:{
          isOpen:false,     // 批量及单个删除框
          open:false,     // 批量及单个删除框
          filterDialog:false,  //  筛选弹出框
          putMoneyFlag:false,     // 充值
          infoDetail:false,    //  添加 编辑  查看框
          remarkDialog:false,    //  添加 编辑  查看框
          inputDisabled:false,   //checkbox是否处理可点击状态
        },
        financeFormLabelWidth: '140px',
        isGroup:true,
      }
    },
    computed:{
    },
    mounted () {
      this.getData();
    },
    methods: {
      selectFilter:function(title,val){
        this.pageFilter.poNo = title == '系统订单' ? val :'';
        this.pageFilter.abnormalNo = title == '平台订单' ? val :'';
        this.getData();
      },
      getData:function(){
       /* this.$http.get('static/Table2.json').then(res=>{
          this.tableData=res.data.table;
        })*/
        this.httpPost('orderInfo/selectList',this.pageFilter,'Sms').then(res =>{
          this.page = res.data;
          this.tableData=res.data.listData;
          this.dialogFlag.filterDialog = false;
        })
      },
      selsChange:function(sels){
         this.sels = sels;
      },
      batchBtnDone:function(type){    // 批量操作
        let vm=this;
        var whNames = this.sels.map(item =>item.whName);;
        var flag = whNames.every(function(item,index,arr){
            for(var i=0;i<arr.length;i++){
                return item == arr[i];
            }
        })
        switch(type){
          case '合并订单':
            if(this.sels.length<1){
                this.tips();
            }else if(flag == false){
                this.$message('所选订单的发货仓库不相同，禁止合并！');
            }else{
                this.combinedDialog.isOpen = true;
                var orderIds = this.sels.map(item =>item.orderId).join(',');
                this.combinedDialog.whId = whNames[0];
                this.httpGet('logisticsMethod/selectByOrders',{orderIds:orderIds},'Lwms').then(res =>{
                  if(res.data){
                    this.combinedDialog.list = res.data;
                  }
                })
            }
            break;
        }
      },
      saveCombined:function(){
          var logisticsMethod = this.combinedDialog.type;
          if(logisticsMethod == ''){
            this.$message('物流方式不能为空！');
          }else{
            var params = {};
            var params = [];
            this.sels.forEach(function(item){
                params.push({nodeId:3213213,orderId:item.orderId,logisticsMethod:321321});
            })
/*            var orderIds = this.sels.map(item =>item.orderId).join(',');
            var nodeId = this.sels.map(item =>item.nodeId).join(',');
            params.orderIds = orderIds;
            params.nodeId = nodeId;
            params.logisticsMethod = 252542;*/
            this.httpPost('orderInfo/mergeParcel',params,'Sms').then(res =>{
              this.$message(res.data.message);
              if(res.data.result == true){
                this.combinedDialog.isOpen = false;
                this.getData();
              }
            })
          }
      },
      rowBtnDone:function(row,type) {   // 行内操作
        let vm=this;
        switch(type){
          case '添加备注':
            this.remarkData.id = row.orderId;
            this.remarkData.isOpen = !this.remarkData.isOpen;
            break;
          case '发邮件':
            this.mailData.title = '发邮件';
            this.mailData.ids = [];
            this.mailData.ids.push(row.orderId);
            this.mailData.isOpen = !this.mailData.isOpen;
            break;
          case '复制创建手工订单':
            this.copyOrderData.id = row.orderId;
            this.copyOrderData.title = '复制创建手工订单';
            this.copyOrderData.isOpen = !this.copyOrderData.isOpen;
            break;
          case '退款':
            this.refundsData.id = row.orderId;
            this.refundsData.isOpen = !this.refundsData.isOpen;
            break;
          case '发起预退件':
            this.preWithdrawal.id = row.orderId;
            this.preWithdrawal.isOpen = !this.preWithdrawal.isOpen;
            break;
        }
      },
      changePageSize:function(val){
        this.pageFilter.pageSize=val;
        this.pageFilter.currentPage = 1;
        this.getData();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getData();
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      filterData(){
        var data = this.$refs.screenData.returnData();
        console.log(data);
        console.log(111111111111)
        this.pageFilter.channelId = data.channelId;
        this.pageFilter.countryNo = data.countryNo;
        this.pageFilter.accountNo = data.accountNo;
        this.pageFilter.orderNo = data.orderNo;   //  系统订单号？
        this.pageFilter.customerInfo = data.customerInfo;
        this.pageFilter.logisticsMethod = data.logisticsMethod;
        this.pageFilter.whId = data.whId;
        this.pageFilter.skuNo = data.skuNo;
        this.pageFilter.salesUser = data.salesUser;
        this.getData();
      },
      getParamsData:function(val){
        console.log(val)
        console.log(22222222222);
        if(this.isGroup == true){
          var data = JSON.parse(JSON.stringify(val.params));
          this.pageFilter.channelId = data.channelId;
          this.pageFilter.countryNo = data.countryNo;
          this.pageFilter.accountNo = data.accountNo;
          this.pageFilter.toCountryNo = data.toCountryNo;
          this.getData();
        }
      },
    }
  }
</script>
<style>
.mailInfo{
  border-top:1px solid #dfe6ec;
  margin-top:10px;
  padding-top:10px;
}
  #border_bt{
    border-top:1px solid #d1dbe5 ;
  }
  .paddingStyle{
    padding:5px 0;
  }
</style>
