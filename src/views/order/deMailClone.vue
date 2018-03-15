<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="8" class="optionValue">
          <el-input type="text"  v-model="pageFilter.warehouse" placeholder="请输入邮票账号" size="small"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="small" @click="getSenderAddressList">搜索</el-button>
        </el-col>
      </el-row>
      <el-row id="filer" class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <span class="span_label">类型</span>
            <el-radio-group v-model="pageFilter.status" @change="page.currentPage=1;getVATList()" size="small">
              <el-radio-button  label="0">全部批次</el-radio-button>
              <el-radio-button  label="1">未克隆批次</el-radio-button>
              <el-radio-button  label="2">已克隆批次</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn">
        <el-button type="primary" size="small"  @click="dialogFlag.filterDialog = true;">筛选</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="VATinvoiceData" border tooltip-effect="dark" style="width: 100%">
          <el-table-column  label="操作" align="center" width="120px">
            <template scope="scope" >
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start" >
                <i class="iconfontyyy" @click="tool.goToPage('mailList')" >&#xe600;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="a" label="邮票批次编号"  min-width="180px" align="center"></el-table-column>
          <el-table-column sortable prop="a" label="邮票金额"   width="120px" align="center"></el-table-column>
          <el-table-column sortable prop="a" label="张数"  width="120px"  align="center"></el-table-column>
          <el-table-column sortable prop="a" label="克隆时间" :formatter="tool.formatDate" width="180px" align="center"></el-table-column>
          <el-table-column sortable prop="a" label="使用情况"   width="180px" align="center"></el-table-column>
          <el-table-column sortable prop="a" label="状态" width="120px" align="center"></el-table-column>
          <el-table-column sortable prop="a" label="添加人"   width="140px" align="center"></el-table-column>
          <el-table-column sortable prop="a" label="添加时间" :formatter="tool.formatDate" width="180px" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!------------------筛选 弹出框--------------------------->
    <el-dialog title="筛选" :visible.sync="dialogFlag.filterDialog" :close-on-click-modal="false" size="small" @open="closeDialog">
      <div class="data_body">
        <title-header></title-header>
        <time-data :start-time="pageFilter.initialTime" condition-name="平台" :end-time="pageFilter.overTime" @child-value-Stime="getTime" @child-value-Etime="getTime"></time-data>
        <select-input :select-value="pageFilter.state" condition-name="店铺账号" :options-data="pageFilter.transportType == '01' ? statusOption : FBAStatusOption" @child-change-val="getSelectInput"></select-input>
        <select-input :select-value="pageFilter.stockWhId" condition-name="市场/站点" :options-data="warehouseList" @child-change-val="getSelectInput"></select-input>
        <text-input :select-value="pageFilter.requestId" condition-name="订单号" place-value="请输入订单号" @child-change-val="getTextInput"></text-input>
        <text-input :select-value="pageFilter.requestId" condition-name="收件人/邮箱/地址/邮编" place-value="请输入" @child-change-val="getTextInput"></text-input>
        <select-input :select-value="pageFilter.deptId" condition-name="物流方式" :options-data="deptList" @child-change-val="getSelectInput"></select-input>
        <select-input :select-value="pageFilter.deptId" condition-name="发货仓库" :options-data="deptList" @child-change-val="getSelectInput"></select-input>
        <text-input :select-value="pageFilter.requestId" condition-name="SKU" place-value="请输入SKU" @child-change-val="getTextInput"></text-input>
        <select-input :select-value="pageFilter.deptId" condition-name="销售人员" :options-data="deptList" @child-change-val="getSelectInput"></select-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">清空筛选</el-button>
        <el-button @click="getStockingData();">筛选</el-button>
        <el-button @click="dialogFlag.filterDialog = false;">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { mapState,mapMutations,mapGetters,mapActions } from 'vuex'
  import payDialog from "../../components/singleDialogData/deMailPayDialog.vue"
  import titleHeader from "../../components/ScreenModular/title.vue"
  import textInput from '../../components/ScreenModular/textInput.vue'
  import selectInput from '../../components/ScreenModular/selectInput.vue'
  export default{
    components: {payDialog,titleHeader, textInput,selectInput},
    data(){
      return {
        isOpen:false,   // 触发 子组件 消费弹窗是否打开的标识
        activeNames: ['1'],
        poSamplesItemList: [],
        poSamplesModel: {             // 基本信息
          a: '',
          b: '',
        },
        samplesItemIdList:[],
        pageFilter:{
          currentPage:1,
          pageSize:10,
          status:'0',
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
          filterDialog:false,  //  筛选弹出框
          putMoneyFlag:false,     // 充值
          infoDetail:false,    //  添加 编辑  查看框
          inputDisabled:false,   //checkbox是否处理可点击状态
        },
        financeFormLabelWidth: '140px',
      }
    },
    computed:{
    },
    mounted () {
      this.getVATList();
    },
    methods: {
      ...mapMutations([
        'EditorContent',
      ]),
      getVATList:function(){
        this.VATinvoiceData = [{a:111}];
        this.httpPost('samplesProcurement/select',this.pageFilter).then(res => {
          if(res.data.result == true){
            const pageData = res.data.params.list;
            this.page.currentPage = pageData;
            this.VATinvoiceData = pageData.listData;
          }else{
            this.VATinvoiceData = [];
          }
        }).catch(function(err){
          console.log(err);
        })
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
        this.getVATList();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getVATList();
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      updateUATinfo:function(formName){
        this.poSamplesModel.b = this.$store.state.EditorContent;
        this.$refs[formName].validate((valid) =>{
            if(valid){
                //alert(this.$store.state.EditorContent)
            } else {
              console.log('error submit!!');
              return false;
            }
        })
      },
      childChangeVal(val){
        val.type == '申请人' ? this.pageFilter.addUser = val.value : this.status = val.value;
      },
      childChangeValCurrency(val){
        this.poSamplesChargesModel.currencyId = val.value;
      },
      closeDialog(formName){
          this.$refs[formName].resetFields();
          this.EditorContent('');
      },
      closeFilterDialog:function(){
          this.pageFilter.overTime = '';
          this.pageFilter.initialTime = '';
          this.pageFilter.addUser = '';
          this.pageFilter.poNo = '';
          this.status = ''
      },
      filterData(){
        this.pageFilter.status = this.status;
        this.getVATList();
      }
    }
  }
</script>
<style>
.mailInfo{
  border-top:1px solid #dfe6ec;
  margin-top:10px;
  padding-top:10px;
}
</style>
