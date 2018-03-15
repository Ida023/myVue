<template>
  <div id="outermost_wrap">
    <div id="sub_wrap">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap">
      <el-row :gutter="10" v-if="pageFilter.status != ''" class="filterOption" id="filterOption">
        <el-col :span="6" class="optionValue">
          <el-input v-model="pageFilter.borrowNo" size="small" placeholder="请输入借调编号"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="getLoanList">搜索</el-button>
        </el-col>
      </el-row>
      <el-row  id="filer" class="">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <el-row class=" marginBottom">
              <span>仓库 &nbsp; </span>
              <el-radio-group v-model="pageFilter.warehouse" size="small" @change="getLoanList" v-for="item in warehouseList" :key="item">
                <el-radio-button style="margin: 3px 0;" :label="item.value">{{item.label}}</el-radio-button>
              </el-radio-group>
            </el-row>
            <el-row>
              <span>状态 &nbsp; </span>
              <el-radio-group v-model="pageFilter.status" size="small" @change="getLoanList">
                <el-radio-button label="">可借调列表</el-radio-button>
                <el-radio-button label="1">待审借调单</el-radio-button>
                <el-radio-button label="2">借调审核通过</el-radio-button>
                <el-radio-button label="3">借调审核不通过</el-radio-button>
              </el-radio-group>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn" >
        <el-button size="small"  @click="dialogFlag.isOpen = true"  type="primary">筛选</el-button>
      </el-row>
      <el-row class="supplier_btn last_btn" v-if="pageFilter.status == '' || pageFilter.status == '1'">
        <el-button size="small" v-if="pageFilter.status == ''"  type="primary" @click="openSubmitDialog('',sels);">批量提交</el-button>
        <el-button size="small"  v-if="pageFilter.status == '1'"  type="primary" @click="openLoaningDialog('','2',borrowIds);">批量同意</el-button>
        <el-button size="small" v-if="pageFilter.status == '1'"   type="primary" @click="openLoaningDialog('','3',borrowIds);">批量撤回</el-button>
      </el-row>
      <div class="table_padding">
        <el-table  :data="loanList"  ref="multipleTable" v-if="pageFilter.status == ''" border tooltip-effect="dark"   @selection-change="selsChange"  style="width:100%;">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column  id="space" label="操作"  align="center" style="word-wrap:break-word;word-break:break-all;">
            <template scope="scope">
              <el-tooltip content="提交申请"  effect="dark" placement="bottom">
                <i  class="iconfontyyy" @click="openSubmitDialog(scope.row,'');" content="Bottom center">&#xe67e;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="备货计划"    prop="stockNo" align="center"  sortable  ></el-table-column>
          <el-table-column label="SKU"  prop="skuNo" align="center"  sortable ></el-table-column>
          <el-table-column label="图片" prop="imageUrl" align="center" sortable >
            <template scope="scope">
              <img v-if="scope.row.imageUrl!=null" :src="scope.row.imageUrl" :data-src="scope.row.imageUrl">
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="cnName"  sortable align="center"></el-table-column>
          <el-table-column label="备货部门"  align="center"  prop="stockDeptName" sortable ></el-table-column>
          <el-table-column label="备货用户"  align="center"  prop="stockuserName" sortable ></el-table-column>
          <el-table-column label="备货目的仓" align="center"  prop="warehouse"  sortable ></el-table-column>
          <el-table-column label="可销售数量" align="center"   prop="skuNo"  sortable ></el-table-column>
          <el-table-column label="申请数量" align="center" prop="borrowQty"  sortable >
            <template scope="scope">
              <el-input type="number" v-model="scope.row.borrowQty" ></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table_padding">
        <el-table  :data="loaningList" v-if="pageFilter.status != ''"  border  tooltip-effect="dark"  @selection-change="selsChangeLoaning"  style="width:100%">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column  id="space" label="操作"  align="center">
            <template scope="scope">
              <el-tooltip content="提交同意"  class="item" effect="dark" placement="top-start" v-if="pageFilter.status == '1'">
                <i  class="iconfontyyy" @click="openLoaningDialog(scope.row,'2','');">&#xe67e;</i>
              </el-tooltip>
              <el-tooltip content="提交退回" class="item" effect="dark"  placement="top-start" v-if="pageFilter.status == '1'">
                <i  class="iconfontyyy" @click="openLoaningDialog(scope.row,'3','');">&#xe665;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
                <i  class="iconfontyyy" @click="selectRemark(scope.row)" >&#xe600;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="借调单" prop="borrowNo" align="center"  sortable ></el-table-column>
          <el-table-column label="SKU"  prop="skuNo" align="center"  sortable></el-table-column>
          <el-table-column label="图片" prop="imageUrl" align="center" sortable>
            <template scope="scope">
              <img v-if="scope.row.imageUrl!=null" :src="scope.row.imageUrl" :data-src="scope.row.imageUrl">
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="cnName"  sortable align="center"></el-table-column>
          <el-table-column label="可销售"  align="center"  prop="cnName" sortable ></el-table-column>
          <el-table-column label="申请数"  align="center"  prop="borrowQty" sortable ></el-table-column>
          <el-table-column label="出借方" align="center"  prop="lendDeptName"  sortable ></el-table-column>
          <el-table-column label="出借方所有人" align="center" prop="lendUserName"  sortable ></el-table-column>
          <el-table-column label="仓库" align="center"   prop="whName"  sortable ></el-table-column>
          <el-table-column label="申请方" align="center"   prop="borrowDeptName"  sortable ></el-table-column>
          <el-table-column label="申请人" align="center"   prop="borrowUserName"  sortable ></el-table-column>
          <el-table-column label="借调申请时间" align="center"  prop="borrowTime"  :formatter="tool.formatDate"  sortable ></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!--筛选-->
    <div class="smallDia">
      <el-dialog title="筛选" :visible.sync="dialogFlag.isOpen" size="small" :close-on-click-modal="false" @open="closeDialog">
        <div class="data_body">
          <title-header></title-header>
          <el-row class="row">
            <el-col class="col" :span="4">SKU</el-col><el-col class="col" :span="4">是</el-col>
            <el-col class="col_input" :span="16"><el-input type="text" v-model="pageFilter.skuNo" placeholder="请输入SKU"></el-input></el-col>
          </el-row>
          <el-row class="row" v-if="pageFilter.status == ''">
            <el-col class="col" :span="4">备货计划</el-col><el-col class="col" :span="4">是</el-col>
            <el-col class="col_input" :span="16"><el-input type="text" v-model="pageFilter.stockNo" placeholder="请输入备货计划"></el-input></el-col>
          </el-row>
          <el-row class="row" v-if="pageFilter.status == ''">
            <el-col class="col" :span="4">备货部门</el-col><el-col class="col" :span="4">是</el-col>
            <el-col class="col_input" :span="16"><dept-select :select-value="lendDept" select-type="lendDept"  place-value="请选择备货部门" @child-change-Val="getDep"></dept-select></el-col>
          </el-row>
          <el-row class="row" v-if="pageFilter.status == ''">
            <el-col class="col" :span="4">备货目的仓</el-col><el-col class="col" :span="4">是</el-col>
            <el-col class="col_input" :span="16"><warehouse-select :select-value="warehouse" place-value="请选择仓库" @child-change-Val="childChangeVal"></warehouse-select></el-col>
          </el-row>
          <el-row class="row" v-if="pageFilter.status != ''">
            <el-col class="col" :span="4">借调单编号</el-col><el-col class="col" :span="4">是</el-col>
            <el-col class="col_input" :span="16"><el-input type="text" v-model="pageFilter.borrowNo" placeholder="请输入借调单编号"></el-input></el-col>
          </el-row>
          <time-data condition-name="借调单创建日期" :start-time="pageFilter.startDate" :end-time="pageFilter.endDate" @child-value-Stime="getTime" @child-value-Etime="getTime"  v-if="pageFilter.status != ''"></time-data>
          <el-row class="row"  v-if="pageFilter.status != ''">
            <el-col class="col" :span="4">出借方(部门)</el-col><el-col class="col" :span="4">是</el-col>
            <el-col class="col_input" :span="16"><dept-select :select-value="lendDept" select-type="lendDept"  place-value="请选择出借方"  @child-change-Val="getDep"></dept-select></el-col>
          </el-row>
          <el-row class="row"  v-if="pageFilter.status != ''">
            <el-col class="col" :span="4">申请方(部门)</el-col><el-col class="col" :span="4">是</el-col>
            <el-col class="col_input" :span="16"><dept-select :select-value="borrowDept" select-type="borrowDept" place-value="请选择申请方"  @child-change-Val="getDep"></dept-select></el-col>
          </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog();">清除条件</el-button>
          <el-button @click="filterData()">筛 选</el-button>
          <el-button @click="dialogFlag.isOpen = false;">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <!--提交申请/同意/退回    借调申请备注-->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail" size="small" :close-on-click-modal="false" @close="dialogFlag.infoDetail = false;borrowMemo = '';" >
      <el-input type="textarea" v-model="borrowMemo" v-if="dialogFlag.dialogTitle != '借调申请备注'"></el-input>
      <el-form :model="remarkForm" :label-width="financeFormLabelWidth" v-if="dialogFlag.dialogTitle == '借调申请备注'">
        <el-form-item label="申请方" ><el-input type="textarea" v-model="remarkForm.borrowMemo" disabled></el-input></el-form-item>
        <el-form-item label="出借方"><el-input type="textarea" v-model="remarkForm.lendMemo" disabled></el-input></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitApply();" v-if="pageFilter.status == ''">确 定</el-button>
          <el-button type="primary" @click="submitStatus();" v-if="dialogFlag.dialogTitle != '借调申请备注' && pageFilter.status == '1'" >确 定</el-button>
          <el-button @click="dialogFlag.infoDetail = false" v-if="dialogFlag.dialogTitle != '借调申请备注'">取 消</el-button>
          <el-button @click="dialogFlag.infoDetail = false" v-if="dialogFlag.dialogTitle == '借调申请备注'">关 闭</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
  import timeData from "../../components/ScreenModular/timeDate.vue"
  import titleHeader from "../../components/ScreenModular/title.vue"
  import warehouseSelect from '../../components/listData/getWarehouseList.vue'
  import deptSelect from '../../components/listData/getDeptList.vue'
  export default{
    components: {titleHeader,timeData,warehouseSelect,deptSelect},
    data(){
      return {
        financeFormLabelWidth: '90px',
        dialogFlag:{
          isOpen:false,
          infoDetail:false,
          dialogTitle:'',
        },
        loanList:[],
        loaningList:[],
        activeNames:['1'],
        page: {
          currentPage: 1, //当前页数
          pageSize: 10, //每页条数
          totalCount: 0, //总共条数
          totalPage: 0, //总共页数
        },
        pageFilter: {
          currentPage: 1,
          pageSize: 10,
          skuNo:'',
          status:'',
          warehouse:'',
          stockNo:'',
          startDate:'',
          borrowNo:'',
          endDate:'',
          lendDept:'',
          borrowDept:'',
        },
        applyList:{
          borrowMemo:'',
          stockBorrows:[]
        },
        applyStatus:{
          borrowIds:[],
          lendMemo:'',
          auditNo:'',
        },
        warehouseList:[],
        depList:[],
        sels:[],
        warehouse:'',
        borrowMemo:'',
        borrowIds:[],
        borrowDept:[],
        lendDept:[],
      }
    },
    mounted: function () {
      this.getLoanList();
      this.getWarehouseList();
    },
    methods: {
      selsChange: function (sels) {
        this.sels = [];
        sels.forEach(item =>{this.sels.push({stockItemId:item.stockItemId,borrowQty:item.borrowQty})});
      },
      selsChangeLoaning: function (sels) {
        this.borrowIds = sels.map(item =>item.borrowId);
      },
      getWarehouseList:function(){
        this.httpPost('/product/loadFilterConditionWarehouse').then(res =>{
          this.warehouseList = this.tool.replaceObjKey(res.data,'warehouseId','warehouseName');
        })
      },
      getLoanList:function(){
        this.httpPost('/deptBorrow/list',this.pageFilter).then(res =>{
          this.page = res.data;
          this.pageFilter.status == '' ? this.loanList = res.data.listData : this.pageFilter.status != '' ? this.loaningList = res.data.listData : '';
          this.dialogFlag.isOpen = false;
        })
      },
      openSubmitDialog:function(row,sels){
        var singleList = row != '' ? [{stockItemId:row.stockItemId,borrowQty:row.borrowQty}] : '',vm = this;
        this.applyList.stockBorrows = sels != '' ?  sels : singleList;
        this.openDialog(vm.applyList.stockBorrows);
      },
      openLoaningDialog:function(row,status,borrowIds){
        this.applyStatus.borrowIds = borrowIds != '' ? borrowIds : [row.borrowId];
        this.applyStatus.auditNo = status;
        this.openDialog(this.applyStatus.borrowIds);
      },
      submitStatus:function(){
        this.applyStatus.lendMemo = this.borrowMemo;
        this.dialogFlag.inputDisabled = false
        this.httpApply('/deptBorrow/audit',this.applyStatus);
      },
      submitApply:function(){
        this.applyList.borrowMemo = this.borrowMemo;
        this.httpApply('/deptBorrow/edit',this.applyList);
      },
      openDialog:function(arr){
        if(arr == '' || arr == []){
          this.tips();
        }else{
          this.dialogFlag.infoDetail = true;
          this.dialogFlag.dialogTitle = '添加备注';
        }
      },
      selectRemark:function(row){
        this.httpPost('/deptBorrow/query?borrowId='+row.borrowId).then(res =>{
          this.dialogFlag.infoDetail = true;
          this.dialogFlag.dialogTitle = '借调申请备注';
          this.remarkForm = res.data;
        })
      },
      httpApply:function(url,params){
        this.httpPost(url,params).then(res =>{
          if(res.data.result == true){
            this.$message(res.data.message);
            this.dialogFlag.infoDetail = false;
            this.getLoanList();
          }else{
            this.$message(res.data.message);
          }
        });
      },
      changePageSize:function(val){
        this.pageFilter.pageSize=val;
        this.pageFilter.currentPage = 1;
        this.getLoanList();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getLoanList();
      },
      filterData:function(){
        this.pageFilter.warehouse = this.warehouse;
        this.getLoanList();
      },
      childChangeVal:function(val){
        this.warehouse = val.value;
      },
      getTime:function(val){
        val.type == 'start' ? this.pageFilter.startDate = val.value : this.pageFilter.endDate = val.value;
      },
      getDep:function(val){
        val.type == 'borrowDept' ? this.pageFilter.borrowDept = val.value : this.pageFilter.lendDept = val.value;
      },
      closeDialog:function(){
        this.warehouse = '';
        this.pageFilter.skuNo = '';
        this.pageFilter.warehouse = '';
        this.pageFilter.stockNo = '';
        this.pageFilter.startDate = '';
        this.pageFilter.borrowNo = '';
        this.pageFilter.endDate = '';
        this.pageFilter.borrowDept = '';
        this.borrowDept = [];
        this.pageFilter.lendDept = '';
        this.lendDept = [];
      }
    }
  }
</script>
<style scoped></style>
