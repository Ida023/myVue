<template>
  <div id="outermost_wrap" class="role" style="">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="8" class="optionValue">
          <el-select v-model="pageFilter.whId" filterable clearable placeholder="请选择仓库" size="small" style="width:100%">
            <el-option v-for="item in warehouseList" :label="item.whName" :key="item.whId" :value="item.whId"></el-option>
          </el-select>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="getReportList">搜索</el-button>
        </el-col>
      </el-row>
      <el-row id="filer" class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <div>
              <div class="mb-10">
                <span class="span_label">类型</span>
                <el-radio-group v-model="pageFilter.adjustmentType" size="small" @change="getReportList();">
                  <el-radio-button  label="0"     v-if="ButtonInfo['报损']!='0'">报损</el-radio-button>
                  <el-radio-button  label="1"     v-if="ButtonInfo['报溢']!='0'">报溢</el-radio-button>
                </el-radio-group>
              </div>
              <div>
                <span class="span_label">状态</span>
                <el-radio-group v-model="pageFilter.status" size="small" @change="getReportList();">
                  <el-radio-button  :label="item.value" v-for="item in statusOptions" :key="item.value"  v-if="ButtonInfo[item.label]!='0'">{{item.label}}</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn">
        <el-button type="primary" size="small"  @click="dialogFlag.addDia = true;">新增报溢报损</el-button>
      </el-row>
      <el-row class="supplier_btn last_btn">
        <el-button size="small" type="primary" @click="updStatus('','sels','02')" v-if="pageFilter.status == '01' && ButtonInfo['批量提交']!='0'">批量提交</el-button>
        <el-button size="small" type="primary" @click="deleteItem('','sels')" v-if="pageFilter.status == '01' && ButtonInfo['批量删除']!='0'">批量删除</el-button>
        <el-button size="small" type="primary" @click="updStatus('','sels','04')" v-if="pageFilter.status == '02' && ButtonInfo['批量同意']!='0'">批量同意</el-button>
        <el-button size="small" type="primary" @click="updStatus('','sels','03')" v-if="pageFilter.status == '02' && ButtonInfo['批量不同意']!='0'">批量不同意</el-button>
    </el-row>
      <el-table :data="reportListData" id="item_list" border tooltip-effect="dark" style="width: 100%" @selection-change="selsChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="label" label="操作"width="150px"  align="center" >
          <template scope="scope" >
            <el-tooltip class="item" effect="dark" content="查看" placement="top-start"   v-if="ButtonInfo['查看']!='0'">
              <i class="iconfontyyy" @click="appValue=scope.row.appValue;showInfoDialog(scope.row);dialogFlag.infoDetail=true;dialogFlag.dialogTitle='查看报损报溢单详情'">&#xe600;</i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-if="scope.row.appValue == '草稿' && ButtonInfo['编辑']!='0'" content="编辑" placement="top-start" >
              <i class="iconfontyyy" @click="appValue=scope.row.appValue;showInfoDialog(scope.row);dialogFlag.infoDetail=true;dialogFlag.dialogTitle='编辑报损报溢单详情'">&#xe6e5;</i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="同意" placement="top-start"   v-if="ButtonInfo['同意']!='0'">
              <i class="iconfontyyy" v-if="scope.row.appValue == '草稿'"  @click="updStatus(scope.row,'','02')">&#xe67e;</i>
              <i class="iconfontyyy" v-if="scope.row.appValue == '待审核'"  @click="updStatus(scope.row,'','04')">&#xe67e;</i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-if="scope.row.appValue == '待审核' && ButtonInfo['不同意']!='0'" content="不同意" placement="top-start" >
              <i class="iconfontyyy" @click="updStatus(scope.row,'','03')">&#xe665;</i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-if="scope.row.appValue == '草稿' && ButtonInfo['删除']!='0'" content="删除" placement="top-start" >
              <i class="iconfontyyy" @click="deleteItem(scope.row,'')">&#xe6f7;</i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" prop="adjNo" label="报损报溢单编号"  width="180px"></el-table-column>
        <el-table-column sortable align="center" prop="whName" label="执行仓库" ></el-table-column>
        <el-table-column sortable align="center" prop="refValue" label="类型" ></el-table-column>
        <el-table-column sortable align="center" prop="addUser" label="操作人" ></el-table-column>
        <el-table-column sortable align="center" prop="addTime" label="创建时间" width="180px" :formatter="tool.formatDate"></el-table-column>
        <el-table-column sortable align="center" prop="appValue" label="状态" ></el-table-column>
        <el-table-column sortable align="center" prop="appUser" label="审核人"></el-table-column>
        <el-table-column sortable align="center" prop="appTime" label="审核时间" width="180px" :formatter="tool.formatDate"></el-table-column>
      </el-table>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!--    新增报损报溢单详情 --------------------------------------------------->
    <el-dialog :title="pageFilter.adjustmentType == '0'? '新增报损单':'新增报溢单'" :close-on-click-modal="false" :visible.sync="dialogFlag.addDia" @close="clearDialog('addReportedFrom')">
      <el-form :model="addReportedFrom" ref="addReportedFrom"  style="margin-left: 10px;" class="formData">
        <div class="boldBigFont">基本信息</div>
        <el-form-item  label="报损仓库 " prop="whId"  :label-width="labelWidth1" :rules="{required:true,message:'请选择仓库', trigger: 'change' }">
          <el-select v-model="addReportedFrom.whId" filterable clearable placeholder="请选择仓库"  style="width:100%">
            <el-option v-for="item in warehouseList" :label="item.whName" :key="item.whId" :value="item.whId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：" prop="dosc" :label-width="labelWidth1" :rules="{required:true,message:'请输入备注', trigger: 'change' }">
          <el-input  type="textarea" v-model="addReportedFrom.dosc" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <div class="boldBigFont">明细信息</div>
        <div class="mb-20" style="text-align: right;"><span @click="dialogFlag.openAddPro = true" class="align-right">添加物品</span></div>
        <report-table :table-data="addReportedFrom.list" :title="pageFilter.adjustmentType == '0' ? '报损数量':'报溢数量'"  :btn-column="true" :is-disable="false"></report-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.addDia= false">取 消</el-button>
        <el-button type="primary" @click="submitAddPro('addReportedFrom');" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <!------------------查看 / 编辑弹出框--------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail" :close-on-click-modal="false" @open="activeTab=dialogFlag.dialogTitle == '查看报损报溢单详情'?'0':'1'" >
      <el-tabs v-model="activeTab">
        <el-tab-pane label="供应商" name='0'>
          <el-form :model="reportedForm" ref="reportedForm"  class="demo-ruleForm">
            <el-form-item label="报损/报溢单号：" :label-width="labelWidth">{{reportedForm.dataNo}}</el-form-item>
            <el-form-item label="执行仓库：" :label-width="labelWidth">{{reportedForm.whName}}</el-form-item>
            <el-form-item label="SKU数量：" :label-width="labelWidth">{{reportedForm.skuCount}}</el-form-item>
            <el-form-item label="备注：" :label-width="labelWidth">{{reportedForm.dataDesc}}
            </el-form-item>
            <el-form-item label="创建人：" :label-width="labelWidth">{{reportedForm.addUser}}</el-form-item>
            <el-form-item label="创建时间：" :label-width="labelWidth">{{tool.formatDate('','',reportedForm.addTime)}}</el-form-item>
            <el-form-item label="修改时间：" :label-width="labelWidth">{{tool.formatDate('','',reportedForm.updTime)}}</el-form-item>
            <div v-if="appValue == '已审核(不通过)'|| appValue == '已审核(通过)'">
              <el-form-item label="审核人：" :label-width="labelWidth">{{reportedForm.appUser}}</el-form-item>
              <el-form-item label="审核结果：" :label-width="labelWidth">{{reportedForm.appResult}}</el-form-item>
              <el-form-item label="审核时间：" :label-width="labelWidth">{{tool.formatDate('','',reportedForm.appTime)}}</el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="产品" name='1'>
          <div class="mb-20" style="text-align: right;" v-if="dialogFlag.dialogTitle == '编辑报损报溢单详情'"><span @click="dialogFlag.openAddPro = true" class="align-right">添加物品</span></div>
          <report-table :table-data="reportedForm.list" :title="pageFilter.adjustmentType == '0' ? '报损数量':'报溢数量'" :btn-column="dialogFlag.dialogTitle == '查看报损报溢单详情'? false:true" :is-disable="dialogFlag.dialogTitle == '查看报损报溢单详情'? true:false"></report-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.infoDetail = false;">{{dialogFlag.dialogTitle == '查看报损报溢单详情'? '关闭' :'取消'}}</el-button>
        <el-button type="primary" v-if="dialogFlag.dialogTitle == '编辑报损报溢单详情' && activeTab=='1'" :loading="$store.state.loading"  @click="updateReported">保 存</el-button>
      </div>
    </el-dialog>
    <!--添加商品弹出框---------------------------------->
    <el-dialog title="添加货品" :visible.sync="dialogFlag.openAddPro" :close-on-click-modal="false" @close="reFlash" size="small" id="add_product_wrap" class="add_product_wrap">
      <add-pro :defalt-key="defaltKey" ref="proData"></add-pro>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.openAddPro = false">取消</el-button>
        <el-button type="primary" @click="addPro" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import reportTable from '../../components/singleTableData/reportLossTable.vue'
  import addPro from '../../components/singleTableData/categoryProduct.vue'
  export default {
    components: {reportTable, addPro},
    data() {
      return {
        defaltKey:[],
        statusOptions:[{value:'01',label:'草稿'},{value:'02',label:'待审核'},{value:'03',label:'已审核（不通过）'},{value:'04',label:'已审核（通过）'}],
        reportedForm: {},
        addReportedFrom:{
          whId:'',
          dosc:'',
          adjustmentType:'',
          list:[],
        },
        activeTab: '0',
        activeNames: ['1'],
        reportListData: [],
        pageFilter: {
          currentPage: 1,
          pageSize: 10,
          status: '01',
          adjustmentType: '0',
          whId:'',
        },
        page: {          // 分页参数
          currentPage: 1,
          pageSize: 10,
          totalCount: 10,
          totalPage: 10
        },
        dialogFlag: {
          openAddPro: false,
          infoDetail: false,
          addDia: false,
          dialogTitle: "",
        },
        warehouseList: [],   //  仓库下拉
        labelWidth1: '80px',
        labelWidth: '140px',
        appValue: '',   // 当前行的状态
        sels: [],
        adjustmentId:'',
        ButtonInfo:{},//按钮权限列表20171227

      }
    },
    mounted () {
      this.getauthorityList();
      this.getReportList();
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
      reFlash:function(){
        this.$refs.proData.resetData();
        this.$refs.proData.clearSels();
      },
      addPro: function () {
        var vm = this,data = [];
        data = this.dialogFlag.addDia == true ? this.addReportedFrom.list : this.reportedForm.list;
        console.log(this.$refs.proData.returnData());
        var selectData = JSON.parse(JSON.stringify(this.$refs.proData.returnData()));
        var idList = data.map(item =>item.productId);
        var flag = selectData.every(function(item){
          vm.$set(item,'newInventoryQty','');
          vm.$set(item,'newDefectiveQty','');
          return idList.indexOf(item.productId) == -1;
        })
        if(flag){
          selectData.forEach(item =>{
            data.unshift(item);
          })
          this.dialogFlag.openAddPro = false;
        }else{
            this.$message('不能选择已经添加的商品！');
        }
      },
      submitAddPro:function(formName){
        var vm = this;
        this.addReportedFrom.adjustmentType = this.pageFilter.adjustmentType;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var flag=this.addReportedFrom.list.every(function(item){
              var result = vm.pageFilter.adjustmentType == '0'? (item.newInventoryQty < 0 && item.newInventoryQty != '') : (item.newInventoryQty > 0 && item.newInventoryQty != '')
              return result;
            })
            if(this.addReportedFrom.list.length<1) {
                this.$message('商品不能为空！');
              }else if(flag == true){
                var whIdList = this.addReportedFrom.list.map(item =>item.whId);
                var whIdFlag = whIdList.every(function(item){
                    return item == vm.addReportedFrom.whId;
              })
              if(whIdFlag == true){
                this.httpPost('warehouseadjustment/addAdjData',this.addReportedFrom).then(res =>{
                  this.$message(res.data.message);
                  if(res.data.result == true) {
                    this.dialogFlag.addDia= false;
                    this.clearDialog('addReportedFrom');
                    this.getReportList();
                  }
                })
              }else{
                var msgg = this.pageFilter.adjustmentType == '0' ? '所选商品的仓库与报损仓库不相同！':'所选商品的仓库与报溢仓库不相同！';
                this.$message(msgg);
              }
            }else{
                var msg = this.pageFilter.adjustmentType == '0' ? '报损数量不能为空且需小于零！':'报溢数量不能为空且需大于零！';
                this.$message(msg);
            }
          }
        })
      },
      updateReported:function(){
        var vm = this;
        var flag=this.reportedForm.list.every(function(item){
          var result = vm.pageFilter.adjustmentType == '0'? (item.newInventoryQty < 0 && item.newInventoryQty != ''&& item.newInventoryQty != null) : (item.newInventoryQty > 0 && item.newInventoryQty != ''&& item.newInventoryQty != null)
          return result;
        })
        if(flag){
          var whIdList = this.reportedForm.list.map(item =>item.whName);
          var whIdFlag = whIdList.every(function(item){
            return item == vm.reportedForm.whName;
          })
          if(whIdFlag == true){
            this.httpPost('warehouseadjustment/updateAdjustmentInfo',{list:this.reportedForm.list,adjustmentId:this.adjustmentId}).then(res =>{
              this.$message(res.data.message);
              if(res.data.result == true){
                this.dialogFlag.infoDetail = false;
                this.getReportList();
              }
            })
          }else{
            var msgg = this.pageFilter.adjustmentType == '0' ? '所选商品的仓库与报损仓库不相同！':'所选商品的仓库与报溢仓库不相同！';
            this.$message(msgg);
          }
        }else{
          var msg = this.pageFilter.adjustmentType == '0' ? '报损数量不能为空且需小于零！':'报溢数量不能为空且需大于零！';
          this.$message(msg);
        }
      },
      getWarehouseList: function () {
        this.httpPost('warehouseadjustment/selectWh').then(res => {
          if (res.data.result == true) {
            this.warehouseList = res.data.params.list;
          }
        })
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      getReportList: function () {
        this.httpPost('warehouseadjustment/adjselect', this.pageFilter).then(res => {
          if (res.data.result == true) {
            const pageData = res.data.params.list;
            this.page = pageData;
            this.reportListData = pageData.listData;
          } else {
            this.reportListData = [];
          }
        })
      },
      showInfoDialog: function (row) {
        this.adjustmentId = row.adjId;
        this.httpPost('warehouseadjustment/selectAdjData', {adjustmentId: row.adjId}).then(res => {
          if (res.data.result == true) {
            this.reportedForm = res.data.params.list;
          } else {
            this.$message(res.data.message)
          }
        })
      },
      deleteItem: function (row,sels) {
        var vm = this,selsData = [],data =[];
        if(this.sels.length > 0){
          this.sels.forEach(item =>{
            selsData.unshift({adjustmentId:item.adjId});
          })
        }else{
          selsData = [];
        }
        data = sels != '' ? selsData : [{adjustmentId:row.adjId}];
        data.length < 1 ? vm.tips() : vm.doItem('您确定删除此报损报溢表？', 'warehouseadjustment/deleteAdjData',data, vm.getReportList);
      },
      updStatus: function (row,sels,status) {
        var batchData = [], singleData = [], vm = this, msg = '';
        msg = status == '02' ? '您确定提交此报损报溢表？' : status == '04' ? '您确定同意此报损报溢表？' : '您确定不同意此报损报溢表？';
        if (sels != '') {
            if(this.sels.length > 0){
              this.sels.forEach(function (item) {
                batchData.unshift({adjustmentId: item.adjId, status: status});
              })
            }else{
                batchData = [];
            }
        } else {
          singleData = [{adjustmentId: row.adjId, status: status}];
        }
        var data = sels != '' ? batchData : singleData;
        data.length < 1 ? vm.tips() : vm.doItem(msg, 'warehouseadjustment/updateStatus', data, vm.getReportList);
      },
      changePageSize: function (val) {
        this.pageFilter.pageSize = val;
        this.pageFilter.currentPage = '1';
        this.getReportList();
      },
      changeCurrentPage: function (val) {
        this.pageFilter.currentPage = val;
        this.getReportList();
      },
      clearDialog:function(formName){
          this.tool.clearObjValue(this.addReportedFrom);
          this.$refs[formName].resetFields();
      },
    },
  };

</script>
<style scoped>
.align-right{
  text-align: right;
  color: #297dfa;
  cursor:pointer;
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
.mb-20{
  margin-bottom:20px;
}
  .mb-20{
    margin-bottom:20px;
  }
.mb-10{
    margin-bottom:10px;
  }
</style>
