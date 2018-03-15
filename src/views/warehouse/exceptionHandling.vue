<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="8" class="optionValue">
          <el-select v-model="pageFilter.whId" filterable clearable placeholder="请选择仓库" @change="getExceptionList" size="small" style="width:100%">
            <el-option v-for="item in warehouseList" :label="item.whName" :key="item.whId" :value="item.whId"  v-if="ButtonInfo[item.whName]!='0'"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row id="filer" class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <div>
              <div style="margin-bottom: 10px;">
                <span class="span_label">类型</span>
                <el-radio-group v-model="pageFilter.type" size="small" @change="filterStateData">
                  <el-radio-button  label="01"   v-if="ButtonInfo['故障品']!='0'">故障品</el-radio-button>
                  <el-radio-button  label="02"   v-if="ButtonInfo['数量异常']!='0'">数量异常</el-radio-button>
                </el-radio-group>
              </div>
              <div style="margin-bottom: 10px;">
                <span class="span_label">状态</span>
                <el-radio-group v-model="pageFilter.status" size="small" @change="filterStateData">
                  <el-radio-button  label="01"   v-if="ButtonInfo['采购未处理']!='0'">采购未处理</el-radio-button>
                  <el-radio-button  label="02"   v-if="ButtonInfo['质检未处理']!='0'">质检未处理</el-radio-button>
                  <el-radio-button  label="03"   v-if="ButtonInfo['已处理']!='0'">已处理</el-radio-button>
                </el-radio-group>
              </div>
              <el-row type="flex" justify="start" align="center">
                <span class="span_label" style="width:30px;line-height:2">搜索</span>
                <el-select size="small" v-model="inputTitle" filterable clearable style="width:120px;" @change="inputValue=''">
                  <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.label"></el-option>
                </el-select>
                <el-input v-model="inputValue" :placeholder="inputTitle == '异常编号' ? '请输入异常编号' : inputTitle == '采购单号' ? '请输入采购单号' :''" size="small" style="width:240px;margin:0 10px"></el-input>
                <el-button type="primary" size="small" @click="selectFilter(inputTitle,inputValue)">搜索</el-button>
              </el-row>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn"  v-if="ButtonInfo['筛选']!='0'">
        <el-button type="primary" size="small"  @click="status=pageFilter.status;dialogFlag.isOpen = true;isGroup = true;getSelectData()">筛选</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="exceptionData" border tooltip-effect="dark" style="width: 100%">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="操作" align="center" >
            <template scope="scope" width="100px">
              <el-tooltip class="item" effect="dark" :content="pageFilter.status == '03' ? '查看':'异常处理方式'" placement="top-start"   v-if="ButtonInfo[pageFilter.status == '03' ? '查看':'异常处理方式']!='0'">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row)" v-if="pageFilter.status != '03'">&#xe657;</i>
                <i class="iconfontyyy" @click="showInfoDialog(scope.row)" v-if="pageFilter.status == '03'">&#xe600;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="abnormalNo" label="异常单编号" align="center"></el-table-column>
          <el-table-column sortable prop="poNo" label="采购单编号"   align="center"></el-table-column>
          <el-table-column sortable prop="porUser" label="采购员" align="center"></el-table-column>
          <el-table-column sortable prop="venderName" label="供应商" align="center"></el-table-column>
          <el-table-column sortable prop="sendProductTime" label="送货时间" :formatter="tool.dateFormatter"  width="180px" align="center"></el-table-column>
          <el-table-column sortable prop="sendProductCount" label="送货数" align="center"></el-table-column>
          <el-table-column sortable prop="inspectionUser" label="质检员" align="center"></el-table-column>
          <el-table-column sortable prop="inspectionQty" label="质检数量" align="center"></el-table-column>
          <el-table-column sortable prop="warhousingQty" label="入库数量" align="center"></el-table-column>
          <el-table-column sortable prop="defectiveQty" label="故障品数量"  align="center"></el-table-column>
          <el-table-column sortable prop="status" label="状态"  align="center"></el-table-column>
          <el-table-column sortable prop="stage" label="来源阶段"  align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!------------------数量异常处理方式--------------------------->
    <el-dialog title="异常处理方式" :visible.sync="dialogFlag.infoDetail" :close-on-click-modal="false">
      <el-form :model="errorInfo" style="margin-left:20px;">
        <el-form-item :label="errorInfo.formerlySource+'备注：'" required><br/><span class="word-break">{{errorInfo.formerlyMemo}}</span><br/><span class="word-break">{{errorInfo.formerlyUser+'  '+tool.dateFormatter('','',errorInfo.formerlyTime)}}</span></el-form-item>
        <el-form-item  v-if="pageFilter.status == '01'" label="请录入处理方式:" required>
          <el-select v-model="purMeasures" filterable clearable placeholder="请选择处理方式" size="small" style="width:180px">
            <el-option v-for="item in typeList" :label="item.refValue" :key="item.refId" :value="item.refId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  v-if="rowStatus == '采购未处理'" label="备注：" required><el-input v-model="purMemo" type="textarea"></el-input></el-form-item>
        <el-form-item  v-if="rowStatus != '采购未处理'" label="采购备注：" required><br/><span class="word-break">{{errorInfo.purMemo}}</span><br/><span class="word-break">{{errorInfo.purUser+'  '+tool.dateFormatter('','',errorInfo.purTime)}}</span></el-form-item>
        <el-form-item  v-if="rowStatus == '已处理'" label="质检处理：" required><br/><span class="word-break">{{errorInfo.inspectionMemo}}</span><br/><span class="word-break">{{errorInfo.inspectionUser+'  '+tool.dateFormatter('','',errorInfo.inspectionTime)}}</span></el-form-item>
        <el-form-item  v-if="rowStatus == '质检未处理'" label="质检处理：" required><el-input v-model="inspectionMemo" type="textarea"></el-input></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.infoDetail = false;">{{rowStatus != '已处理' ? '取消':'关闭'}}</el-button>
        <el-button type="primary" v-if="rowStatus != '已处理'" @click="submit" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <!--筛选-->
    <div class="smallDia">
      <el-dialog title="筛选" :visible.sync="dialogFlag.isOpen" size="small" :close-on-click-modal="false" @close="isGroup=true;pageFilter.abnormalNo='';pageFilter.poNo='';pageFilter.inspectionUser='';status=''">
        <div class="data_body">
          <title-header></title-header>
          <text-input :select-value="pageFilter.abnormalNo" condition-name="异常单编号" text-type="异常单编号" place-value="请输入异常单编号" @child-change-val="getTextInput"></text-input>
          <text-input :select-value="pageFilter.poNo"  condition-name="采购单编号" text-type="采购单编号" place-value="请输入采购单编号" @child-change-val="getTextInput"></text-input>
          <select-input :select-value="pageFilter.inspectionUser" condition-name="质检员" :options-data="abnormalList" @child-change-val="getSelectInput"></select-input>
          <select-input :select-value="status" condition-name="状态" :options-data="statusOptions" @child-change-val="getSelectInput"></select-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="pageFilter.abnormalNo='';pageFilter.poNo='';pageFilter.inspectionUser='';status=''">清除条件</el-button>
          <el-button @click="pageFilter.status=status;getExceptionList();">筛 选</el-button>
          <el-button @click="dialogFlag.isOpen = false;">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import titleHeader from "../../components/ScreenModular/title.vue"
  import textInput from '../../components/ScreenModular/textInput.vue'
  import selectInput from '../../components/ScreenModular/selectInput.vue'
  export default{
    components: {titleHeader, textInput,selectInput},
    data(){
      return {
        options: [{value: 1, label: '采购单号'}, {value: 2, label: '异常编号'}],
        activeNames: ['1'],
        inputValue:'',
        inputTitle:'采购单号',
        errorInfo: {
          abnormalNo: '',
          formerlyMemo: '',
          formerlyTime: '',
          formerlyUser: '',
          purMemo: '',
          purUser: '',
          purTime: '',
          inspectionMemo: '',
          inspectionUser: '',
          inspectionTime: '',
        },
        exceptionData: [],
        pageFilter: {
          currentPage: 1,
          pageSize: 10,
          status: '01',
          type:'01',
          inspectionUser: '',
          whId: '',
          abnormalNo: '',
          poNo: '',
        },
        page: {          // 分页参数
          currentPage: 1,
          pageSize: 10,
          totalCount: 10,
          totalPage: 10
        },
        dialogFlag: {
          isOpen: false,
          infoDetail: false,
          dialogTitle: "",
          inputDisabled: false,
        },
        formLabelWidth: '100px',
        warehouseList:[],   //  仓库下拉
        abnormalList:[],   //  质检员下拉
        typeList:[],      //  处理方式下拉
        statusOptions:[],    //  状态下拉
        status:'',    //转换状态中间变量
        inspectionMemo:'',  //质检备注
        purMemo:'', //备注
        purMeasures:'', //处理方式
        rowStatus:'',  // 当前行的状态
        isGroup:true,
        ButtonInfo:{},//按钮权限列表20171227
      }
    },
    mounted () {
      this.getauthorityList();
      this.getExceptionList();
      this.getWarehouseList();
    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      filterStateData:function(){
        if(this.isGroup == true){
          this.getExceptionList();
        }
      },
      selectFilter:function(title,val){
        this.pageFilter.poNo = title == '采购单号' ? val :'';
        this.pageFilter.abnormalNo = title == '异常编号' ? val :'';
        this.getExceptionList();
      },
      getWarehouseList:function(){
        this.httpPost('productExamine/selectWhList').then(res =>{
          if(res.data.result == true){
            this.warehouseList = res.data.params.list;
          }
        })
      },
      getSelectData:function(){
        var vm = this;
        const abnormal=this.httpPost('poabnormaltask/selectAbnormal');
        const status=this.httpPost('refabnormalstatus/selectAll');
        this.$http.all([abnormal,status]).then(this.$http.spread(function(abnormalData,statusData){
            vm.abnormalList = vm.tool.replaceObjKey(abnormalData.data.params.user,'userId','userName');
            vm.statusOptions = vm.tool.replaceObjKey(statusData.data.params.list,'refId','refValue');
        }))
      },
      getExceptionList: function () {
        this.httpPost('poabnormaltask/select', this.pageFilter).then(res => {
          if (res.data.result == true) {
            const pageData = res.data.params.list;
            this.page = pageData;
            this.dialogFlag.isOpen = false;
            this.exceptionData = pageData.listData;
          } else {
            this.exceptionData = [];
          }
        })
      },
      showInfoDialog(row){
        this.rowStatus = row.status;
        if(row.status == '采购未处理'){
          this.httpPost('refabnormalmeasures/selectAll').then(typeData =>{
              if(typeData.data.result == true){
                this.typeList = typeData.data.params.list;
              }else{
                this.$message(typeData.data.message)
              }
          })
        }
        this.dialogFlag.infoDetail = true;
        this.httpPost('poabnormaltask/selectPoAbnDisposeInfo',{abnormalNo:row.abnormalNo}).then(res =>{
          if(res.data.result == true){
            var data = res.data.params.poAbn;
            this.errorInfo = data == null ? this.tool.clearObjValue(this.errorInfo) : data;
          }else{
              this.$message(res.data.message)
          }
        })
      },
      submit:function(){
          var status = this.pageFilter.status == '01' ? '02': '03';
          if(this.rowStatus == '采购未处理' && (this.purMemo == '' || this.purMeasures == '')){
            this.$message('处理方式及备注均为必填项！');
          }else if(this.pageFilter.status == '02' && this.inspectionMemo == ''){
            this.$message('质检备注不能为空！');
          }else{
            this.httpPost('poabnormaltask/update',{status:status,abnormalNo:this.errorInfo.abnormalNo,purMemo:this.purMemo,purMeasures:this.purMeasures,inspectionMemo:this.inspectionMemo}).then(res =>{
              if(res.data.result == true){
                this.$message(res.data.message);
                this.dialogFlag.infoDetail = false;
                this.purMemo = '';
                this.purMeasures = '';
                this.inspectionMemo = '';
                this.getExceptionList();
              }else{
                this.$message(res.data.message);
              }
            })
          }
      },
      changePageSize: function (val) {
        this.pageFilter.pageSize = val;
        this.pageFilter.currentPage = '1';
        this.getExceptionList();
      },
      changeCurrentPage: function (val) {
        this.pageFilter.currentPage = val;
        this.getExceptionList();
      },
      getTextInput:function(val){
        val.type === '异常单编号'? this.pageFilter.abnormalNo = val.value : this.pageFilter.poNo = val.value;
      },
      getSelectInput:function(val){
        val.type === '质检员'? this.pageFilter.inspectionUser = val.value : this.status = val.value;
      }
    }
  }
</script>
<style scoped>
.word-break{
  word-break: break-all;
  margin-left: 20px;
}
</style>
