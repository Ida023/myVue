<template>
  <!--退款订单-&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
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
          <el-button type="primary" size="small" @click="selectFilter(inputTitle,inputValue)">搜索</el-button>
        </el-col>
        <div style="text-align: right;">
          <el-button  type="primary" size="small"  @click="manualData.isOpen = !manualData.isOpen;">手工同步订单</el-button>
        </div>
      </el-row>
      <!--筛选条件 平台，账号，站点及国家-->
      <el-row id="filer" class="marginBottom">
        <status-type :channel-id-item="pageFilter.channelId"  :account-no-item="pageFilter.accountNo" :country-no-item="pageFilter.countryNo" :country-item="pageFilter.country" @getParamsData="getParamsData"></status-type>
      </el-row>
      <!--重寄下 Tab 切换-->
      <el-row>
        <el-tabs v-model="pageFilter.resendType" @tab-click="getData">
          <el-tab-pane label="待审核(配件)" name="0"></el-tab-pane>
          <el-tab-pane label="审核通过" name="1"></el-tab-pane>
          <el-tab-pane label="审核不通过" name="2"></el-tab-pane>
        </el-tabs>
      </el-row>
      <el-row class="supplier_btn ">
        <el-button type="primary" size="small"  @click="dialogFlag.filterDialog = true;dialogFlag.open = !dialogFlag.open">筛选</el-button>
      </el-row>
      <el-row class="supplier_btn last_btn">
        <el-button type="primary" size="small" @click="batchBtnDone('发消息');" v-if="pageFilter.resendType != '0'">发消息</el-button>
        <el-button type="primary" size="small" @click="batchBtnDone('发邮件');" v-if="pageFilter.resendType == '0'">发邮件</el-button>
        <el-button type="primary" size="small" @click="batchBtnDone('批量同意');" v-if="pageFilter.resendType == '0'">批量同意</el-button>
        <el-button type="primary" size="small" @click="batchBtnDone('批量不同意');" v-if="pageFilter.resendType == '0'">批量不同意</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="resendData" border tooltip-effect="dark" style="width: 100%"   @selection-change="selsChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="操作"  prop="label" align="center"  width="160px">
            <template scope="scope">
              <el-tooltip content="订单详情"  effect="dark" placement="bottom">
                <i  class="iconfontyyy" content="Bottom center" @click="tool.goToPage('orderDetails?transferId='+scope.row.stockId)">&#xe600;</i>
              </el-tooltip>
              <el-tooltip content="添加备注"  effect="dark" placement="bottom">
                <i  class="iconfontyyy" content="Bottom center" @click="rowBtnDone(scope.row, '添加备注')">&#xe623;</i>
              </el-tooltip>
              <el-tooltip content="发邮件"  effect="dark" placement="bottom" v-if="pageFilter.resendType !='0' ">
                <i  class="iconfontyyy" content="Bottom center" @click="rowBtnDone(scope.row, '发邮件')">&#xe738;</i>
              </el-tooltip>
              <el-tooltip content="复制创建手工订单"  effect="dark" placement="bottom" v-if="pageFilter.resendType !='0' ">
                <i  class="iconfontyyy" content="Bottom center" @click="rowBtnDone(scope.row, '复制创建手工订单')">&#xe607;</i>
              </el-tooltip>
              <el-tooltip content="下载回邮邮票"  effect="dark" placement="bottom" v-if="pageFilter.resendType=='1'">
                <i  class="iconfontyyy" content="Bottom center" @click="rowBtnDone(scope.row, '下载VTA发票')">&#xe804;</i>
              </el-tooltip>
              <el-tooltip content="同意"  effect="dark" placement="bottom"  v-if="pageFilter.resendType=='0'">
                <i  class="iconfontyyy" content="Bottom center" @click="rowBtnDone(scope.row, '同意')">&#xe63d;</i>
              </el-tooltip>
              <el-tooltip content="不同意"  effect="dark" placement="bottom" v-if="pageFilter.resendType=='0'">
                <i  class="iconfontyyy" content="Bottom center" @click="rowBtnDone(scope.row, '不同意')">&#xe611;</i>
              </el-tooltip>
              <el-tooltip content="取消退款"  effect="dark" placement="bottom" v-if="pageFilter.resendType!='0'">
                <i  class="iconfontyyy" content="Bottom center" @click="rowBtnDone(scope.row, '取消退款')">&#xe666;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="产品信息"  prop="label" width="260px" align="center" >
            <template scope="scope">
              <div v-for="(item,index) in scope.row.detailInventory" class="simulation" >
                <div class="childDiv paddingStyle" :id="index != 0 ? 'border_bt':''" >
                  <el-row>
                    <el-col :span="8"><img :src="item.qty"/></el-col>
                    <el-col :span="16">
                      {{ item.inventoryQty }}
                      <div style="float: right">
                        <el-tooltip content="商品库存"  effect="dark" placement="bottom">
                          <i  class="iconfontyyy" content="Bottom center" @click="tool.goToPage('commodityStock?Id='+scope.row.stockId)">&#xe6f6;</i>
                        </el-tooltip>
                        <el-tooltip content="历史销量"  effect="dark" placement="bottom">
                          <i  class="iconfontyyy" content="Bottom center" @click="tool.goToPage('HistoricalSales?Id='+scope.row.stockId);">&#xe61b;</i>
                        </el-tooltip>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>Lorem ipsum consectetur adipiscing elit. Aenean euismod bibend</el-col>
                  </el-row>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="订单信息"  prop="label" align="center" >
            <template scope="scope">
              <span v-text="scope.row.stockId"></span><br>
            </template>
          </el-table-column>
          <el-table-column label="收件人"  prop="label" align="center" >
            <template scope="scope">
              <span v-text="scope.row.stockId"></span><br>
            </template>
          </el-table-column>
          <el-table-column label="仓库与物流"  prop="label" align="center" >
            <template scope="scope">
              <span v-text="scope.row.stockId"></span><br>
            </template>
          </el-table-column>
          <el-table-column label="状态"  prop="stockId" align="center" width="100px"></el-table-column>
          <el-table-column label="时间"  prop="stockId" align="center" width="180px"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!------------------手工同步订单 弹出框--------------------------->
    <manual-dialog :id-value="manualData.id" :is-open="manualData.isOpen"></manual-dialog>
    <!------------------退款 弹出框--------------------------->
    <refunds-dialog :id-value="refundsData.id" :is-open="refundsData.isOpen"></refunds-dialog>
    <!------------------复制手工订单 弹出框--------------------------->
    <copy-order-dialog :id-value="copyOrderData.id" :is-open="copyOrderData.isOpen" :dialog-title="copyOrderData.title"></copy-order-dialog>
    <!------------------添加备注 弹出框--------------------------->
    <remark-dialog :id-value="remarkData.id" :is-open="remarkData.isOpen"></remark-dialog>
    <!------------------发消息/邮件 弹出框--------------------------->
    <mail-dialog :id-list="mailData.ids" :is-open="mailData.isOpen" :dialog-title="mailData.title"></mail-dialog>
    <!------------------筛选 弹出框--------------------------->
    <el-dialog title="筛选" :visible.sync="dialogFlag.filterDialog" :close-on-click-modal="false" size="small" @open="isGroup=false" @close="isGroup=true;">
      <screen-data :params-data="pageFilter" ref="screenData"></screen-data>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeFilterDialog">清空筛选</el-button>
        <el-button @click="filterData();" :loading="$store.state.loading">筛选</el-button>
        <el-button @click="dialogFlag.filterDialog = false;">取消</el-button>
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
        manualData:{  // 手工同步订单 子组件传参
          id:'',
          isOpen:false,
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
        refundsData:{  // 退款 子组件传参
           id:'',
          isOpen:false,
        },
        inputTitle:'系统订单',
        inputValue:'',
        options: [{value: 1, label: '系统订单'}, {value: 2, label: '平台订单'}],
        isOpen:false,   // 触发 子组件 消费弹窗是否打开的标识
        activeNames: ['1'],
        sels: [],   // table选中数据
        poSamplesModel: {             // 基本信息
          a: '',
          b: '',
        },
        samplesItemIdList:[],
        pageFilter:{
          currentPage:1,
          pageSize:10,
          status:'0',
          poNo:'',  //  系统
          abnormalNo:'',  // 平台
          resendType:'',  // 重寄type
          platform:'1',
          account:'1',
          site:'1',
          country:'1',
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
        this.$http.get('static/Table2.json').then(res=>{
          this.resendData=res.data.table;
        })
      },
      selsChange:function(sels){
         this.sels = sels.map(item =>item.stockId);
      },
      batchBtnDone:function(type){    // 批量操作
        let vm=this;
        switch(type){
          case '发邮件':
             if(this.sels.length < 1){
               this.tips();
             }else{
               this.mailData.title = '发邮件';
               this.mailData.ids = this.sels;
               this.mailData.isOpen = !this.mailData.isOpen;
             }
           break;
          case '发消息':
            if(this.sels.length < 1){
                this.tips();
            }else{
              this.mailData.title = '发消息';
              this.mailData.ids = this.sels;
              this.mailData.isOpen = !this.mailData.isOpen;
            }
           break;
          case '批量同意':
            vm.sels.length<1 ? vm.tips():vm.doItem('您确定同意该订单？','ceshiurl',this.sels,vm.getData);
            break;
          case '批量不同意':
            vm.sels.length<1 ? vm.tips():vm.doItem('您确定不同意该订单？','ceshiurl',this.sels,vm.getData);
            break;
        }
      },
      rowBtnDone:function(row,type) {   // 行内操作
        let vm=this;
        switch(type){
          case '添加备注':
            this.remarkData.id = row.stockId;
            this.remarkData.isOpen = !this.remarkData.isOpen;
            break;
          case '发邮件':
            this.mailData.title = '发邮件';
            this.mailData.ids = [];
            this.mailData.ids.push(row.stockid);
            this.mailData.isOpen = !this.mailData.isOpen;
            break;
          case '复制创建手工订单':
            this.copyOrderData.id = row.stockId;
            this.copyOrderData.title = '复制创建手工订单';
            this.copyOrderData.isOpen = !this.copyOrderData.isOpen;
            break;
          case '退款':
            this.refundsData.id = row.stockId;
            this.refundsData.isOpen = !this.refundsData.isOpen;
            break;
          case '下载VTA发票':
            //window.open('#/orderDetails?transferId='+row.transferId+ '&Whether=0');
            break;
          case '同意':
            vm.doItem('您确定同意该订单？','ceshiurl',row.stockId,vm.getData);
            break;
            case '不同意':
            vm.doItem('您确定不同意该订单？','ceshiurl',row.stockId,vm.getData);
            break;
          case '取消退款':
            var msg = '你确定要取消退款？取消退款之后该订单将退回到原始状态，如该订单之前处于异常订单，申请退款之后进入退款订单，取消之后将再次回到异常订单！'
            vm.doItem(msg,'ceshiurl',row.stockId,vm.getData);
            break;
        }
      },
      showInfoDialog:function(row){
        this.dialogFlag.infoDetail = true;
        this.EditorContent('');   //  清空富文本
        /*this.sampleId = row.poId;
        this.httpPost('samplesProcurement/selectSingleData',{poId:row.poId}).then(res =>{
            if(res.data.result == true){
                let data = res.data.params.samplesProcurement;
                this.poSamplesModel = data.poSamplesModel;
                this.poSamplesItemList = data.poSamplesItemList;
                this.poSamplesChargesModel = data.poSamplesChargesModel;
                this.dialogFlag.infoDetail = true;
            }
        })*/
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
      childChangeVal(val){
        val.type == '申请人' ? this.pageFilter.addUser = val.value : this.status = val.value;
      },
      childChangeValCurrency(val){
        this.poSamplesChargesModel.currencyId = val.value;
      },
      closeFilterDialog:function(){
        this.$refs.screenData.clearData();
      },
      filterData(){
        var data = this.$refs.screenData.returnData();
        console.log(data);
        console.log(111111111111)
        this.pageFilter.platform = data.state;
        this.getData();
      },
      getParamsData:function(val){
        console.log(val)
        console.log(22222222222);
        if(this.isGroup == true){
          this.pageFilter.platform = val.platform;
          this.pageFilter.site = val.site;
          this.pageFilter.account = val.account;
          this.pageFilter.country = val.country;
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
