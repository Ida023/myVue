<template>
  <!--未付款-&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
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
        <div style="text-align: right;">
          <el-button  type="primary" size="small"  @click="manualData.isOpen = !manualData.isOpen;">手工同步订单</el-button>
        </div>
      </el-row>
      <!--筛选条件 平台，账号，站点及国家-->
      <el-row id="filer" class="">
        <status-type :channel-id-item="pageFilter.channelId"  :account-no-item="pageFilter.accountNo" :country-no-item="pageFilter.countryNo" :country-item="pageFilter.country" @getParamsData="getParamsData"></status-type>
      </el-row>
      <el-row class="supplier_btn ">
        <el-button type="primary" size="small"  @click="dialogFlag.filterDialog = true;dialogFlag.open = !dialogFlag.open">筛选</el-button>
      </el-row>
      <el-row class="supplier_btn last_btn"  v-if="pageFilter.channelId == '01' || pageFilter.channelId == '02'">
        <el-button type="primary" size="small" @click="batchBtnDone('发邮件');"  v-if="pageFilter.channelId == '01'">发邮件</el-button>
        <el-button type="primary" size="small" @click="batchBtnDone('发消息');" v-if="pageFilter.channelId == '02'">发消息</el-button>
        <!--平台等于ebay的时候显示发消息，其他平台都是发邮件-->
        <!--平台等于AliExpress的时候显示发消息，发邮件都不显示-->
        <el-button type="primary" size="small" v-if="pageFilter.channelId == '02'" @click="batchBtnDone('批量取消');">批量取消</el-button>
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
              <el-tooltip content="检测付款"  effect="dark" placement="bottom">
                <i  class="iconfontyyy" content="Bottom center" @click="rowBtnDone(scope.row, '检测付款')">&#xe610;</i>
              </el-tooltip>
              <!--认领付款和取消订单按钮是平台为ebay才显示出来的-->
              <el-tooltip content="取消订单"  effect="dark" placement="bottom"  v-if="pageFilter.channelId=='02'">
                <i  class="iconfontyyy" content="Bottom center" @click="rowBtnDone(scope.row, '取消订单')">&#xe611;</i>
              </el-tooltip>
              <el-tooltip content="认领付款"  effect="dark" placement="bottom" v-if="pageFilter.channelId=='02'">
                <i  class="iconfontyyy" content="Bottom center" @click="rowBtnDone(scope.row, '认领付款')">&#xe6e8;</i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!------------------手工同步订单 弹出框--------------------------->
    <manual-dialog :id-value="manualData.id" :is-open="manualData.isOpen" @getData="getData"></manual-dialog>
    <!------------------认领付款 弹出框--------------------------->
    <el-dialog title="认领付款" :visible.sync="claimData.isOpen" :close-on-click-modal="false" size="small">
      <el-form :model="claimData"  ref="claimData" label-width="150px">
      <el-form-item label="交易ID " prop="flowId" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
        <el-select v-model="claimData.flowId" placeholder="请选择" >
          <el-option v-for="item in claimData.list" :key="item.tradingNo" :label="item.tradingNo" :value="item.tradingNo"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="转账交易备注" prop="modelType" >
        <el-row style="border: 1px solid #bfcbd9;line-height: 25px;margin-bottom: 10px;"  v-for="(item,index) in claimData.list" :key="index">
          <el-col :span="3" style="text-align: center; height: 105px; padding-top: 20px">
            <span>{{item.tradingNo}}</span><br />
            <el-tooltip content="查看银行转账"  effect="dark" placement="bottom">
              <i  class="iconfontyyy" content="Bottom center" @click="getBankInfo(item.flowId)">&#xe600;</i>
            </el-tooltip>
          </el-col>
          <el-col :span="21" style="border-left: 1px solid #bfcbd9;">
            <el-row style="border-bottom: 1px solid #bfcbd9;min-height: 65px;padding: 10px;">
                <span style="margin-right: 10px;">备注</span>
                <span class="word-break">{{item.payMemo}}</span>
            </el-row>
            <el-row style="padding: 10px;">
              <span style="margin-right: 10px;">付款人</span>
              <span class="word-break">{{item.payUserName}}</span>
            </el-row>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="claimData.isOpen = false;">取消</el-button>
        <el-button type="primary" @click="saveBoundOrder" :loading="$store.state.loading">确定</el-button>
      </div>
    </el-dialog>
    <!-------------------查看银行转账--------------------------->
    <bank-transfer-dialog :id-value="bankData.id" :is-open="bankData.isOpen"  @getData="getData"></bank-transfer-dialog>
    <!------------------复制手工订单 弹出框--------------------------->
    <copy-order-dialog :id-value="copyOrderData.id" :is-open="copyOrderData.isOpen" :dialog-title="copyOrderData.title"  @getData="getData"></copy-order-dialog>
    <!------------------添加备注 弹出框--------------------------->
    <remark-dialog :id-value="remarkData.id" :is-open="remarkData.isOpen" @getData="getData"></remark-dialog>
    <!------------------发消息/邮件 弹出框--------------------------->
    <mail-dialog :id-list="mailData.ids" :is-open="mailData.isOpen" :channel-id="pageFilter.channelId"  :dialog-title="mailData.title"  @getData="getData"></mail-dialog>
    <!------------------筛选 弹出框--------------------------->
    <el-dialog title="筛选" :visible.sync="dialogFlag.filterDialog" :close-on-click-modal="false" size="small" @open="isGroup=false" @close="isGroup=true;">
      <screen-data :params-data="pageFilter"  ref="screenData" :is-open="dialogFlag.open"></screen-data>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeFilterDialog">清空筛选</el-button>
        <el-button @click="filterData();" :loading="$store.state.loading">筛选</el-button>
        <el-button @click="dialogFlag.filterDialog = false;">取消</el-button>
      </div>
    </el-dialog>
    <!------------------取消订单 弹出框--------------------------->
    <el-dialog :title="cancelData.title" :visible.sync="cancelData.isOpen" :close-on-click-modal="false" size="small" @open="isGroup=false" @close="isGroup=true;">
      <el-row style="margin-left: 60px;">
        <el-col style="margin-bottom: 20px;">您确定客户或者您需要取消订单？请选择取消原因！</el-col>
        <el-select v-model="cancelData.reason" placeholder="请选择">
          <el-option v-for="item in cancelData.modelData" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelData.isOpen = false;">取消</el-button>
        <el-button type="primary" @click="cancelOrder" :loading="$store.state.loading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { mapState,mapMutations,mapGetters,mapActions } from 'vuex'
  import bankTransferDialog from '../../components/order/bankTransfer.vue'
  export default{
    components:{bankTransferDialog},
    data(){
      return {
        manualData:{  // 手工同步订单 子组件传参
          id:'',
          isOpen:false,
        },
        bankData:{  // 查看银行转账
          id:'',
          isOpen:false,
        },
        cancelData:{  // 查看银行转账
          id:'',
          nodeId:'',
          reason:'',
          title:'',
          isOpen:false,
          modelData1:[{value:'1',label:'测试数据1'},{value:'2',label:'测试数据2'},{value:'3',label:'测试数据3'},{value:'4',label:'测试数据4'}],   //
          modelData:['缺货或者货品损坏','客户取消或者其他地址原因'],   //
        },
        claimData:{   // 认领付款 子组件传参
          id:'',
          flowId:'',
          isOpen:false,
          list:[],   //
        },
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
          status:'未付款',   //  节点
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
      getUnboundedList:function(){  // 查询银行转账未绑定的交易
        var params = {totalAmount:0,offsetPercent:0};
        this.httpGet('financialFlowOrders/selectUnboundedList',params,'Sms').then(res =>{
          if(res.data){
            this.claimData.list = res.data;
            this.claimData.flowId = res.data[0].flowId;
          }
        })
      },
      saveBoundOrder:function(){
        var params = {
            flowId:this.claimData.flowId,
            orderId:this.claimData.id,
        }
        if(this.claimData.flowId == ''){
          this.$message('交易ID不能为空！');
        }else{
            alert(this.claimData.flowId)
          this.httpGet('financialFlowOrders/boundOrder',params,'Sms').then(res =>{
            this.$message(res.data.message);
            if(res.data.result == true){
              this.claimData.isOpen = false;
              this.getData();
            }
          })
        }
      },
      selectFilter:function(title,val){
        this.pageFilter.poNo = title == '系统订单' ? val :'';
        this.pageFilter.abnormalNo = title == '平台订单' ? val :'';
        this.getData();
      },
      getData:function(){
        this.httpPost('orderInfo/selectList',this.pageFilter,'Sms').then(res =>{
          this.page = res.data;
          this.tableData=res.data.listData;
          this.dialogFlag.filterDialog = false;
        })
/*        this.$http.get('static/Table2.json').then(res=>{
          this.tableData=res.data.table;
        })*/
      },
      selsChange:function(sels){
        this.sels = sels;
      },
      batchBtnDone:function(type){    // 批量操作
        let vm=this;
        var commonMail = function(title){
          if(vm.sels.length < 1){
            vm.tips();
          }else{
            vm.mailData.title = title;
            vm.mailData.ids = vm.sels.map(item =>item.orderId);
            vm.mailData.isOpen = !vm.mailData.isOpen;
          }
        }
        switch(type){
          case '发邮件':
            commonMail('发邮件');
            break;
          case '发消息':
            commonMail('发消息');
            break;
          case '批量取消':
            if(this.sels.length < 1){
              this.tips();
            }else{
              this.cancelData.isOpen=true;
              this.cancelData.title = '批量取消订单';
              this.cancelData.reason = this.cancelData.modelData[0]
            }
            break;
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
          case '认领付款':
            this.claimData.id = row.orderId;
            this.claimData.isOpen = true;
            this.getUnboundedList();
            break;
          case '取消订单':
            this.cancelData.id = row.orderId;
            this.cancelData.nodeId = row.nodeId;
            this.cancelData.title = '取消订单';
            this.cancelData.reason = this.cancelData.modelData[0];
            this.cancelData.isOpen=true;
            break;
          case '检测付款':
            var params = {nodeId:row.nodeId,orderId:row.orderId};
            vm.doItem('您确定提交该订单？','orderInfo/completeTask',params,vm.getData);
            break;
        }
      },
      cancelOrder:function(){
        var params = '';
        var single = {};
        var batch = [];
        var url = this.cancelData.title == '取消订单' ? 'orderInfo/cancelEbayOrder' : 'orderInfo/cancelMultiEbayOrder';
        if(this.cancelData.title == '取消订单'){
          single = {
              orderId:this.cancelData.id,
              nodeId:this.cancelData.nodeId,
              reason:this.cancelData.reason,
            }
        }else{
            this.sels.forEach(function(item){
              batch.push({
                orderId:item.orderId,
                nodeId:item.nodeId,
                reason:item.reason,
              })
            })
        }
        var params = this.cancelData.title == '取消订单' ? single : batch;
        this.httpPost(url,params,'Sms').then(res =>{
            this.$message(res.data.message);
            if(res.data.result == true){
              this.cancelData.isOpen = false;
                this.getData();
            }
        })
      },
      getBankInfo:function(val){   //查看银行转账
        this.bankData.isOpen = !this.bankData.isOpen;
        this.bankData.id = val;
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
      closeFilterDialog:function(){
        this.$refs.screenData.clearData();
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
