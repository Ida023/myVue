<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="6" class="optionValue">
          <el-input v-model="pageFilter.requestId" placeholder="请输入分仓调拨单编号" size="small"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="getStockingData();">搜索</el-button>
        </el-col>
      </el-row>
      <el-row id="filer" class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <div>
              <div class="updType">
                <span class="span_label">类型</span>
                <el-radio-group v-model="pageFilter.transportType" @change="getStockingData()" size="small">
                  <el-radio-button  label="01"  v-if="ButtonInfo['自有仓分仓调拨']!='0'">自有仓分仓调拨</el-radio-button>
                  <el-radio-button  label="02"  v-if="ButtonInfo['FBA分仓调拨']!='0'">FBA分仓调拨</el-radio-button>
                </el-radio-group>
              </div>
              <div class="updSea">
                <span class="span_label">状态</span>
                <el-radio-group v-model="pageFilter.state" @change="filterStateData()" size="small">
                  <el-radio-button  :label="item.value" v-if="pageFilter.transportType == '01' && ButtonInfo['自有仓分仓调拨/'+item.label]!='0'" v-for="item in statusOption" >{{item.label}}</el-radio-button>
                  <el-radio-button  :label="item.value" v-if="pageFilter.transportType == '02' && ButtonInfo['FBA分仓调拨/'+item.label]!='0'" v-for="item in FBAStatusOption" >{{item.label}}</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn ">
        <el-button type="" size="small"  @click="isGroup=false;dialogFlag.isOpen=true;getListDataq()">筛选</el-button>
      </el-row>
      <el-row class="supplier_btn last_btn" v-if="pageFilter.state == '01' || (pageFilter.state == '02' && pageFilter.transportType == '02')">
        <el-button type="primary" size="small"  @click="radio=(pageFilter.transportType == '02' && pageFilter.state == '02') ? '04' : '02';handlerItems()">批量同意</el-button>
        <el-button type="primary" size="small"  @click="radio=(pageFilter.transportType == '02' && pageFilter.state == '02') ? '05' : '03';handlerItems()">批量不同意</el-button>
      </el-row>
      <div class="table_padding">
        <el-table :data="stockListData" ref="tableData" border tooltip-effect="dark" style="width: 100%"   @selection-change="selsChange" >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column  label="操作" align="center" width="120px">
            <template scope="scope">
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start" >
                <i class="iconfontyyy" @click="isBatch = false;status=scope.row.state;type=scope.row.reqType;showInfoDialog(scope.row);" >&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="同意申请" placement="top-start" v-if="scope.row.state == '待审核' || scope.row.state == '待主管审核' || scope.row.state == '待审单员审核'">
                <i class="iconfontyyy" @click="saveParams(scope);radio=(type == '02' && status == '待审单员审核') ? '04' : '02';" >&#xe63d;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="不同意申请" placement="top-start" v-if="scope.row.state == '待审核' || scope.row.state == '待主管审核' || scope.row.state == '待审单员审核'">
                <i class="iconfontyyy" @click="saveParams(scope);radio=(type == '02' && status == '待审单员审核') ? '05' : '03'" >&#xe665;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="requestNo" label="分仓调拨单编号" align="center" ></el-table-column>
          <el-table-column sortable prop="itemDosc" label="分仓调拨详情"  align="center">
            <template scope="scope">
              <span v-for="item in scope.row.itemDosc">{{item}}</span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="itemCount" label="分仓调拨数量总计"  align="center"></el-table-column>
          <el-table-column sortable prop="stockDept" label="申请部门" align="center"></el-table-column>
          <el-table-column sortable prop="stockWhName" label="所属仓库"   align="center"></el-table-column>
          <el-table-column sortable prop="stockUser" label="申请人"   align="center"></el-table-column>
          <el-table-column sortable prop="updTime" label="申请时间" :formatter="tool.formatDate" width="180px"  align="center"></el-table-column>
          <el-table-column sortable prop="reqWhName" label="调往仓库"  align="center"></el-table-column>
          <el-table-column sortable prop="state" label="状态"   align="center"></el-table-column>
          <el-table-column sortable prop="reqUserName" label="处理人"   align="center"></el-table-column>
          <el-table-column sortable prop="addTime" label="处理时间"  :formatter="tool.formatDate" width="180px" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!------------------筛选 弹出框--------------------------->
    <el-dialog title="筛选" :visible.sync="dialogFlag.isOpen" :close-on-click-modal="false" size="small" @open="closeDialog" @close="isGroup=true;">
      <div class="data_body">
        <title-header></title-header>
        <text-input :select-value="pageFilter.requestId" condition-name="调拨单编号" place-value="请输入分仓调拨单编号" @child-change-val="getTextInput"></text-input>
        <time-data :start-time="pageFilter.initialTime" condition-name="调拨单创建日期" :end-time="pageFilter.overTime" @child-value-Stime="getTime" @child-value-Etime="getTime"></time-data>
        <select-input :select-value="pageFilter.state" condition-name="状态" :options-data="pageFilter.transportType == '01' ? statusOption : FBAStatusOption" @child-change-val="getSelectInput"></select-input>
        <select-input :select-value="pageFilter.stockWhId" condition-name="备货仓库" :options-data="warehouseList" @child-change-val="getSelectInput"></select-input>
        <select-input :select-value="pageFilter.reqWhId" condition-name="目的仓" :options-data="warehouseList" @child-change-val="getSelectInput"></select-input>
        <select-input :select-value="pageFilter.deptId" condition-name="申请部门" :options-data="deptList" @child-change-val="getSelectInput"></select-input>
       <!-- <select-dept :select-value="deptId" condition-name="申请部门" place-value="请输入备货部门" @getDept="getDept"></select-dept>-->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">清空筛选</el-button>
        <el-button @click="flag=true;getStockingData();">筛选</el-button>
        <el-button @click="dialogFlag.isOpen = false;">取消</el-button>
      </div>
    </el-dialog>
    <!--提交，同意，不同意申请=============================-->
    <el-dialog title="提示" :visible.sync="dialogFlag.infoDetail" :close-on-click-modal="false" size="tiny" @open="notes=''">
      <el-form :model="infoForm" ref="infoForm" style="margin-left: 10px;" class="formData">
        <el-form-item  label="处理意见：" prop="poUser" :label-width="labelWidth" v-if="radioShow == true">
          <el-radio-group v-model="radio">
            <el-radio :label="(type == '02' && status == '待审单员审核') ? '04' : '02'">同意</el-radio>
            <el-radio :label="(type == '02' && status == '待审单员审核') ? '05' : '03'">不同意</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item  label="备注内容：" prop="poUser" :label-width="labelWidth" >
          <el-input type="textarea" placeholder="请输入备注"  v-model="notes"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.infoDetail = false;">取消</el-button>
        <el-button type="primary" @click="getStockInfo('');" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <!--查看-========================================-->
    <el-dialog title="自有仓备货调拨详情" :visible.sync="dialogFlag.info" :close-on-click-modal="false" >
      <el-form :model="infoForm" ref="infoForm" style="margin-left: 10px;" class="formData">
        <div class="bold-weight">基本信息</div>
        <el-form-item  label="分仓调拨单编号：" prop="poUser" :label-width="financeFormLabelWidth" >{{infoForm.requestId}}</el-form-item>
        <el-form-item  label="申请人：" prop="poTime" :label-width="financeFormLabelWidth" >{{infoForm.reqUserName}}</el-form-item>
        <el-form-item  label="申请时间：" prop="poTime" :label-width="financeFormLabelWidth" >{{tool.dateFormatter('','',infoForm.reqUserTime)}}</el-form-item>
        <el-form-item  label="申请部门：" prop="poTime" :label-width="financeFormLabelWidth" >{{infoForm.stockDept}}</el-form-item>
        <el-form-item  label="所在仓库：" prop="poTime" :label-width="financeFormLabelWidth" >{{infoForm.stockWhName}}</el-form-item>
        <el-form-item  label="调往仓库：" prop="poTime" :label-width="financeFormLabelWidth" >{{infoForm.reqWhName}}</el-form-item>
        <el-form-item  label="状态：" prop="poTime" :label-width="financeFormLabelWidth" >{{infoForm.state}}</el-form-item>
        <div class="boldBigFont">分仓调拨数量</div>
        <div class="table_padding">
          <el-table :data="infoForm.queryStockInvenModel" ref="tableData" border tooltip-effect="dark" style="width: 100%">
            <el-table-column sortable prop="skuNo" label="SKU" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column sortable prop="stockNo" label="所属备货计划"  align="center"></el-table-column>
            <el-table-column sortable prop="availQty" label="可销售数量"  align="center"></el-table-column>
            <el-table-column sortable prop="lockedQty" label="调拨数量" align="center"></el-table-column>
          </el-table>
        </div>
        <div class="boldBigFont">申请备注</div>
        <el-form-item  label="" prop="poTime"  >{{infoForm.dosc}}</el-form-item>
        <div v-if="status == '主管审核不通过' || status == '待审单员审核' || status == '审单员审核通过' || status == '审单员审核不通过'">
          <span class="boldBigFont">主管审核备注</span>
          <el-form-item  label="" prop=""  >
            <span v-if="infoForm.auditUser!=null">{{infoForm.auditUser}}</span><span style="margin-left: 10px;" v-if="infoForm.auditTime!=null">{{infoForm.auditTime}}<br/></span>
            <span>{{infoForm.auditMemo}}</span>
          </el-form-item>
        </div>
        <div v-if="status == '审单员审核通过' || status == '审单员审核不通过'  ||　status == '审核通过' ||　status == '审核不通过'" >
          <span class="boldBigFont">审单员审核备注</span>
          <el-form-item  label="" prop=""  >
            <span v-if="infoForm.auditUser2!=null" >{{infoForm.auditUser2}}</span><span v-if="infoForm.auditTime2!=null" >{{infoForm.auditTime2}}<br/></span>
            <span>{{infoForm.auditMemo2}}</span>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.info = false;">关闭</el-button>
        <el-button type="primary" @click="radioShow=true;dialogFlag.infoDetail=true" v-if="status == '待审核' || status == '待主管审核' || status == '待审单员审核'">审核</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import titleHeader from "../../components/ScreenModular/title.vue"
  import textInput from '../../components/ScreenModular/textInput.vue'
  import selectInput from '../../components/ScreenModular/selectInput.vue'
  import timeData from '../../components/ScreenModular/timeDate.vue'
  import selectDept from '../../components/ScreenModular/selectDept.vue'
  export default{
    components: {titleHeader, textInput,selectInput,timeData,selectDept},
    data(){
      return {
        ButtonInfo:{},//按钮权限列表20171227
        statusOption:[{label:'待审核',value:'01'},{label:'审核不通过',value:'03'},{label:'审核通过',value:'02'},],
        FBAStatusOption:[{label:'待主管审核',value:'01'},{label:'主管审核不通过',value:'03'},{label:'待审单员审核',value:'02'},
          {label:'审单员审核通过',value:'04'},{label:'审单员审核不通过',value:'05'}],
        radioShow:'',
        flag:true,
        activeTab:'0',     //
        pageFilter:{
          currentPage:1,
          pageSize:10,
          state:'01',
          stockWhId:'',
          reqWhId:'',
          deptId:'',
          overTime:'',
          requestId:'',
          transportType:'01',
        },
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalCount:10,
          totalPage:10
        },
        activeNames: ['1'],
        stockListData:[],
        warehouseList:[],
        deptList:[],
        dialogFlag:{
          info:false  ,
          isOpen:false,
          infoDetail:false,
          dialogTitle:"",
          inputDisabled:false,
        },
        infoForm: {

        },
        sels:[],
        deptId:[],
        type:'updateList/select',
        labelWidth:'100px',
        financeFormLabelWidth:'130px',
        status:'',
        type:'',
        radio:'',
        notes:'',
        requestId:'',
        arrParams:[],
        isBatch :false,
        isGroup :true,
      }
    },
    mounted () {
      this.getauthorityList();
      this.getStockingData();
    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      filterStateData:function(val,type){
        if(this.isGroup == true){
          this.getStockingData();
        }
      },
      getListDataq:function(){
        var vm = this;
        const wareList = this.httpPost('stockinventory/selectReqWhInfoList')
        const deptList = this.httpPost('stockinventory/selectReqDeptList')
        this.$http.all([wareList,deptList]).then(this.$http.spread(function(wareData,deptData){
          vm.warehouseList = vm.tool.replaceObjKey(wareData.data.params.list,'whId','whName');
          vm.deptList = vm.tool.replaceObjKey(deptData.data.params.list,'deptId','deptName');
          }))
      },
      getStockingData:function(){
          if(this.flag == true){
            this.httpPost('stockinventory/selectWhAllorInfo',this.pageFilter).then(res => {
              this.dialogFlag.isOpen = false;
              if(res.data.result == true) {
                const pageData = res.data.params.list;
                this.page = pageData;
                this.stockListData = pageData.listData;
              }else{
                this.stockListData = [];
              }
            })
          }
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      handlerItems:function(){
        var ids = this.sels.length;
        this.arrParams = [];
        if(ids >0 ){
          this.dialogFlag.infoDetail = true;
          this.radioShow = false;
          this.isBatch = true;
        }else{
            this.tips();
        }
      },
      getStockInfo:function(){
        var vm = this;
        this.sels.forEach(function(item){
          var processPhase = item.state == '01' ? '01' : '02';
          vm.arrParams.push({processPhase:processPhase,requestId:item.requestId,type:vm.radio,docs:vm.notes});
        })
          var processPhase = this.status == '01' ? '01' : '02';
          var data = [{requestId:this.requestId,type:this.radio,docs:this.notes,processPhase:processPhase}];
          var jsonData = this.isBatch == true ? this.arrParams :data;
          if(this.radio == '' && this.radioShow == true){
              this.$message('处理意见不能为空！')
          }else if(this.notes == ''){
            this.$message('备注内空不能为空！')
          }else{
            this.httpPost('stockinventory/addStockReqLog',jsonData).then(res =>{
              if(res.data.result == true){
                this.$message(res.data.message);
                this.dialogFlag.infoDetail = false;
                this.dialogFlag.info = false;
                this.getStockingData();
              }else{
                this.$message(res.data.message);
              }
            })
          }
      },
      saveParams:function(scope){
        this.requestId = scope.row.requestId;
        this.status = scope.row.state;
        this.type = scope.row.reqType;
        this.radioShow = false;
        this.radioShow = false;
        this.isBatch = false;
        this.dialogFlag.infoDetail = true
      },
      showInfoDialog:function(row){
        this.requestId = row.requestId;
        this.dialogFlag.info = true;
        this.dialogFlag.dialogTitle = row.type == 1 ? '自有仓分仓调拨详情' : 'FBA仓分仓调拨详情';
        this.httpPost('stockinventory/selectStockItem',{requestId:row.requestId}).then(res =>{
          if(res.data.result == true){
              this.infoForm = res.data.params.list;
          }
        })
      },
      changePageSize:function(val){
        this.pageFilter.pageSize=val;
        this.pageFilter.currentPage = 1;
        this.getStockingData();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getStockingData();
      },
      getTextInput:function(val){
        this.pageFilter.requestId = val.value;
      },
      getSelectInput:function(val){
        val.type == '目的仓'  ? this.pageFilter.reqWhId = val.value : val.type == '备货仓库'  ? this.pageFilter.stockWhId = val.value : val.type == '申请部门'  ? this.pageFilter.deptId = val.value : this.pageFilter.state = val.value;
      },
      getTime:function(val){
        val.type == 'start' ? this.pageFilter.initialTime = val.value : this.pageFilter.overTime = val.value;
      } ,
      closeDialog:function(){
          this.pageFilter.stockWhId = '';
          this.pageFilter.reqWhId = '';
          this.pageFilter.deptId = '';
          this.pageFilter.overTime = '';
          this.pageFilter.requestId = '';
          //this.pageFilter.transportType = '';
          //this.pageFilter.state = '';
      }
    }
  }
</script>
<style scoped>
.updSea{
  margin-top:10px;
}
 .boldBigFont{
   font-size: 15px;
   font-weight: bold;
   margin: 10px 0px;
  }
 .bold-weight{
   font-size: 15px;
   font-weight: bold;
 }
.formData .el-form-item {
  margin:0px;
}
  .mb-20{
    margin-bottom:20px;
  }
</style>
