<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="6" class="optionValue">
          <el-input v-model="pageFilters.borrowNo" placeholder="请输入部门借调单号" size="small"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="pageFilters.status= '';getSencondData();">搜索</el-button>
        </el-col>
      </el-row>
      <el-row id="filer" class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <div>
              <div class="updType">
                <span class="span_label">类型</span>
                <el-radio-group v-model="transportType"  size="small">
                  <el-radio-button  label="01">部门借调</el-radio-button>
                </el-radio-group>
              </div>
              <div class="updSea">
                <span class="span_label">状态</span>
                <el-radio-group v-model="pageFilters.status" size="small" @change="fifleData($event,'type');">
                  <el-radio-button :label="item.value" v-for="item in statusOption" :key="item.value"  v-if="ButtonInfo[item.label]!='0'">{{item.label}}</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn ">
        <el-button type="primary" size="small"  @click="flag=false;dialogFlag.isOpen=true;getListDataq()">筛选</el-button>
      </el-row>
      <el-row class="supplier_btn last_btn">
        <el-button type="primary" size="small"  @click="handlerItems();radio='2';radioShow=true;"  v-if="pageFilters.status == '1' &&  ButtonInfo['批量同意']!='0'">批量同意</el-button>
        <el-button type="primary" size="small"  @click="handlerItems();radio='3';radioShow=true;"  v-if="pageFilters.status == '1' &&  ButtonInfo['批量不同意']!='0'">批量不同意</el-button>
      </el-row>
      <div class="table_padding">
        <el-table :data="secondListData" ref="tableData" border tooltip-effect="dark" style="width: 100%"   @selection-change="selsChange" >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column  label="操作" align="center" width="120px">
            <template scope="scope" width="100px">
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start"  v-if="ButtonInfo['查看']!='0'">
                <i class="iconfontyyy" @click="isBatch = false;showInfoDialog(scope.row);" >&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="同意申请" placement="top-start" v-if="scope.row.status=='待审核' && ButtonInfo['同意申请']!='0'">
                <i class="iconfontyyy" @click="saveParams(scope);radio='2';radioShow=true;" >&#xe63d;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="不同意申请" placement="top-start" v-if="scope.row.status=='待审核' &&  ButtonInfo['不同意申请']!='0'" >
                <i class="iconfontyyy" @click="saveParams(scope);radio='3';radioShow=true;" >&#xe665;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="borrowNo" label="部门借调单编号" align="center"  width="180px"></el-table-column>
          <el-table-column sortable prop="detailsList" label="借调详情"  align="center" width="280px">
            <template scope="scope">
              <span v-for="item in scope.row.detailsList">{{item.skuNo}}/{{item.stockItemNo}}/{{item.availableQty}}/{{item.borrowQty}}</span><br>
            </template>
          </el-table-column>
          <el-table-column sortable prop="borrowAllQty" label="借调数量总计"  align="center"></el-table-column>
          <el-table-column sortable prop="lendDeptName" label="被借部门" align="center"></el-table-column>
          <el-table-column sortable prop="borrowWh" label="所属仓库"   align="center"></el-table-column>
          <el-table-column sortable prop="borrowUserName" label="借调人"   align="center"></el-table-column>
          <el-table-column sortable prop="borrowTime" label="借调时间" :formatter="tool.formatDate" width="180px"  align="center"></el-table-column>
          <el-table-column sortable prop="borrowDeptName" label="申请部门"  align="center"></el-table-column>
          <el-table-column sortable prop="status" label="状态"   align="center"></el-table-column>
          <el-table-column sortable prop="lendUserName" label="处理人"   align="center"></el-table-column>
          <el-table-column sortable prop="lendTime" label="处理时间"  :formatter="tool.formatDate" width="180px" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!------------------筛选 弹出框--------------------------->
    <el-dialog title="筛选" :visible.sync="dialogFlag.isOpen" :close-on-click-modal="false" size="small" @open="closeDialog">
      <div class="data_body">
        <title-header></title-header>
        <text-input :select-value="borrowNoo" condition-name="借调单编号" place-value="请输入分仓调拨单编号" @child-change-val="getTextInput"></text-input>
        <time-data :start-time="pageFilters.startDate" condition-name="借调单创建日期" :end-time="pageFilters.endDate" @child-value-Stime="getTime" @child-value-Etime="getTime"></time-data>
        <select-input :select-value="pageFilters.status" condition-name="借调状态" :options-data="statusOption" @child-change-val="getSelectInput"></select-input>
        <select-input :select-value="pageFilters.borrowDept" condition-name="借入方(部门)" :options-data="deptList" @child-change-val="getSelectInput"></select-input>
        <select-input :select-value="pageFilters.lendDept" condition-name="借出方(部门)" :options-data="deptList" @child-change-val="getSelectInput"></select-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">清空筛选</el-button>
        <el-button @click="flag=true;screenDialog();">筛选</el-button>
        <el-button @click="dialogFlag.isOpen = false;">取消</el-button>
      </div>
    </el-dialog>
    <!--提交，同意，不同意申请=============================-->
    <el-dialog title="提示" :visible.sync="dialogFlag.infoDetail" :close-on-click-modal="false" size="tiny" @open="notes=''">
      <el-form :model="infoForm" ref="infoForm" style="margin-left: 10px;" class="formData">
        <el-form-item  label="处理意见：" prop="poUser" :label-width="labelWidth" >
          <el-radio-group v-model="radio"  v-if="radioShow==false">
            <el-radio label="2" >同意</el-radio>
            <el-radio label="3" >不同意</el-radio>
          </el-radio-group>
          <el-radio-group v-model="radio" v-if="radioShow==true" >
            <el-radio label="2" v-if="radio=='2'">同意</el-radio>
            <el-radio label="3" v-if="radio=='3'">不同意</el-radio>
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
    <el-dialog title="部门借调详情" :visible.sync="dialogFlag.info" :close-on-click-modal="false" >
      <el-form :model="infoForm" ref="infoForm" style="margin-left: 10px;" class="formData">
        <div class="bold-weight">基本信息</div>
        <el-form-item  label="部门借调单编号：" prop="poUser" :label-width="financeFormLabelWidth" >{{infoForm.borrowNo}}</el-form-item>
        <el-form-item  label="申请人：" prop="poTime" :label-width="financeFormLabelWidth" >{{infoForm.borrowUserName}}</el-form-item>
        <el-form-item  label="申请时间：" prop="borrowTime" :label-width="financeFormLabelWidth" >{{tool.formatDate('','',infoForm.borrowTime)}}</el-form-item>
        <el-form-item  label="申请部门：" prop="poTime" :label-width="financeFormLabelWidth" >{{infoForm.borrowDeptName}}</el-form-item>
        <el-form-item  label="被借部门：" prop="poTime" :label-width="financeFormLabelWidth" >{{infoForm.lendDeptName}}</el-form-item>
        <el-form-item  label="所在仓库：" prop="poTime" :label-width="financeFormLabelWidth" >{{infoForm.borrowWh}}</el-form-item>
        <el-form-item  label="状态：" prop="poTime" :label-width="financeFormLabelWidth" >{{infoForm.status}}</el-form-item>
        <div class="boldBigFont">部门借调数量</div>
        <div class="table_padding">
          <el-table :data="infoForm.detailsList"  show-summary  ref="tableData" border tooltip-effect="dark" style="width: 100%">
            <el-table-column sortable prop="skuNo" label="SKU" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column sortable prop="stockItemNo" label="所属备货计划"  align="center"></el-table-column>
            <el-table-column sortable prop="availableQty" label="备货子计划数量"  align="center"></el-table-column>
            <el-table-column sortable prop="borrowQty" label="借调数量" align="center"></el-table-column>
          </el-table>
        </div>
        <div class="boldBigFont">申请备注</div>
        <el-form-item  label="" prop="borrowMemo"  >{{infoForm.borrowMemo}}</el-form-item>
        <div v-if="pageFilters.status != '1'">
          <span class="boldBigFont">被借部门备注</span>
          <el-form-item  label="" prop=""  >
            <span>{{infoForm.lendUserName}}</span>&nbsp;
            <span>{{tool.formatDate('','',infoForm.lendTime)}}</span>&nbsp;
            <span>{{infoForm.status}}</span><br>
            <span>{{infoForm.lendMemo}}</span>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.info = false;">关闭</el-button>
        <el-button type="primary" @click="dialogFlag.infoDetail=true;radioShow=false;" v-if="pageFilters.status == '1' ">审核</el-button>
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
        borrowNoo:'',
        radioShow:false,
        statusOption:[{label:'待审单员审核',value:'1'},{label:'审核不通过',value:'3'},{label:'审核通过',value:'2'},],
        flag:true,
        transportType:'01',
        activeTab:'0',     //
        pageFilters:{
          status:'1',
          borrowNo:'',
          startDate:'',
          endDate:'',
          borrowDept:'',
          lendDept:'',
          currentPage:1,
          pageSize:10,

        },
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalCount:10,
          totalPage:10
        },
        activeNames: ['1'],
        secondListData:[],
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
          borrowNo:'',
          lendDeptName:'',
          borrowWh:'',
          borrowUserName:'',
          borrowDeptName:'',
          status:'',
          lendUserName:'',
          lendTime:'',
          addTime:'',
          borrowMemo:'',
          lendMemo:'',
          detailsList:[]
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
        borrowId:'',
        arrParams:[],
        isBatch :false,
        batchList:[],
        ButtonInfo:{},//按钮权限列表20171227
      }
    },
    mounted () {
      this.getauthorityList();
      this.getSencondData();
    },
    methods: {
    	  /*********************页面按钮权限 20171227*****************************/
          getauthorityList(){
            var vm=this;
            vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
            console.log('horityList % 0',vm.ButtonInfo)

          },
        /*********************页面按钮权限 20171227*****************************/
      fifleData(val,vall){
      	if(val != '' && vall == 'type'){
          this.closeDialog();
          this.getSencondData();
        }
      },
      getListDataq:function(){
        this.httpPost('stockinventory/selectReqDeptList').then(res =>{
          this.deptList = this.tool.replaceObjKey(res.data.params.list,'deptId','deptName');
        })
      },
      screenDialog(){
      	this.pageFilters.borrowNo=this.borrowNoo;
        this.getSencondData();
      },
      getSencondData:function(){
          this.httpPost('/deptBorrow/list',this.pageFilters).then(res => {
              this.dialogFlag.isOpen = false;
              this.page = res.data;
              this.secondListData = res.data.listData;
          })

      },
      selsChange: function (sels) {
        this.batchList=[];
        this.sels = sels;
        this.batchList=sels.map(item=>item.borrowId);
      },
      handlerItems:function(){
        var ids = this.sels.length;
        this.arrParams = [];
        if(ids >0 ){
          this.dialogFlag.infoDetail = true;
          this.isBatch = true;
        }else{
          this.tips();
        }
      },
      getStockInfo:function(){
        var obj={};
        obj.borrowIds=[];
        this.isBatch == true ? obj.borrowIds=this.batchList :obj.borrowIds.push(this.borrowId);
        obj.lendMemo=this.notes;
        obj.auditNo=this.radio;
        if(this.radio == ''){
          this.$message('处理意见不能为空！')
        }else if(this.notes == ''){
          this.$message('备注内空不能为空！')
        }else{
          this.httpPost('/deptBorrow/audit',obj).then(res =>{
            if(res.data.result == true){
              this.$message(res.data.message);
              this.dialogFlag.infoDetail = false;
              this.dialogFlag.info = false;
              this.getSencondData();
            }else{
              this.$message(res.data.message);
            }
          })
        }
      },
      saveParams:function(scope){
        this.borrowId = scope.row.borrowId;
        this.status = scope.row.state;
        this.type = scope.row.reqType;
        this.isBatch = false;
        this.dialogFlag.infoDetail = true
      },
      showInfoDialog:function(row){
        this.borrowId = row.borrowId;
        this.dialogFlag.info = true;
        console.log('row %0==',row);
        this.infoForm.borrowNo=row.borrowNo;
       this.infoForm.borrowUserName=row.borrowUserName;
       this.infoForm.borrowTime=row.borrowTime;
       this.infoForm.borrowDeptName=row.borrowDeptName;
        this.infoForm.lendDeptName=row.lendDeptName;
        this.infoForm.status=row.status;
        this.infoForm.borrowWh=row.borrowWh;
        this.infoForm.detailsList=row.detailsList;
        this.infoForm.borrowMemo=row.borrowMemo;
        this.infoForm.lendMemo=row.lendMemo;
        this.infoForm.lendUserName=row.lendUserName;
        this.infoForm.lendTime=row.lendTime;
      },
      changePageSize:function(val){
        this.pageFilters.pageSize=val;
        this.pageFilters.currentPage = 1;
        this.getSencondData();
      },
      changeCurrentPage:function(val){
        this.pageFilters.currentPage=val;
        this.getSencondData();
      },
      getTextInput:function(val){
        this.borrowNoo= val.value;
      },
      getSelectInput:function(val){
        val.type == '部门借调状态'  ? this.pageFilters.status = val.value : val.type == '借入方(部门)'  ? this.pageFilters.borrowDept = val.value : val.type == '借出方(部门)'  ? this.pageFilters.lendDept = val.value : '';
      },
      getTime:function(val){
        val.type == 'start' ? this.pageFilters.startDate = val.value : this.pageFilters.endDate = val.value;
      } ,
      closeDialog:function(){
        this.pageFilters.borrowDept = '';
        this.pageFilters.lendDept = '';
        this.pageFilters.borrowNo = '';
        this.borrowNoo='';
        this.pageFilters.endDate = '';
        this.pageFilters.startDate = '';
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
