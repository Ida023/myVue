<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="6" class="optionValue">
          <el-input v-model="pageFilters.skuNo" placeholder="请输入sku编号" size="small"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="pageFilters.warehouse='';getAlloctingData();">搜索</el-button>
        </el-col>
      </el-row>
      <el-row id="filer" class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <span class="span_label" style="margin-bottom:10px;">仓库</span>
            <el-radio-group v-model="pageFilters.warehouse" size="small" @change="filterData($event,'whId');">
              <el-radio-button style="margin-bottom:5px;" v-for="item in warehouseList" :key="item.warehouseId" :label="item.warehouseId">{{item.warehouseName}}</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn ">
        <el-button size="small" type="primary"   @click="dialogFlag.isOpen=true;getDepList()">筛选</el-button>
      </el-row>
      <el-row class="supplier_btn last_btn"  v-if="ButtonInfo['批量创建部门借调']!='0'" >
        <el-button type="primary" size="small"  @click="handlerItems" >批量创建部门借调</el-button>
      </el-row>
      <div class="table_padding">
        <el-table :data="alloctListData" ref="tableData" border tooltip-effect="dark" style="width: 100%"  @selection-change="selsChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column  label="操作" align="center">
            <template scope="scope" width="100px">
              <el-tooltip class="item" effect="dark" content="创建部门借调" placement="top-start"  v-if="ButtonInfo['创建部门借调']!='0'" >
                <i class="iconfontyyy" @click="getStockInfo(scope.row,'');" >&#xe63d;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="图片" prop="imageUrl" align="center" width="115px" sortable>
            <template scope="scope">
                <img  v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="scope.row.imageUrl" :data-src="scope.row.imageUrl">
            </template>
          </el-table-column>
          <el-table-column sortable prop="skuNo" label="SKU" align="center" ></el-table-column>
          <el-table-column sortable prop="cnName" label="商品名称"  align="center"></el-table-column>
          <el-table-column sortable prop="stockNo" label="所属备货计划"  align="center"></el-table-column>
          <el-table-column sortable prop="itemNo" label="备货子计划编号" align="center"></el-table-column>
          <el-table-column sortable prop="requestQty" label="备货子计划数量"   align="center"></el-table-column>
          <el-table-column sortable prop="availableQty" label="可销售数量"   align="center"></el-table-column>
          <el-table-column sortable prop="stockDeptName" label="备货部门"  width="180px"  align="center"></el-table-column>
          <el-table-column sortable prop="warehouse" label="备货仓库"  align="center"></el-table-column>
          <el-table-column sortable prop="stockuserName" label="备货计划创建人"   align="center"></el-table-column>
          <el-table-column sortable prop="reqTime" label="备货计划创建时间"  :formatter="tool.formatDate" width="180px" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!------------------筛选 弹出框--------------------------->
    <el-dialog title="筛选" :visible.sync="dialogFlag.isOpen" :close-on-click-modal="false" size="small" @close="clearSeccren();">
      <div class="data_body">
        <title-header></title-header>
        <text-input :select-value="skuNoo" condition-name="SKU" text-type="SKU" place-value="请输入SKU" @child-change-val="getTextInput"></text-input>
        <text-input :select-value="pageFilters.stockNo" condition-name="备货计划" text-type="备货计划" place-value="请输入备货计划" @child-change-val="getTextInput"></text-input>
        <select-input :select-value="pageFilters.lendDept" condition-name="备货部门" place-value="请输入备货部门" :options-data="deptList" @child-change-val="getDept"></select-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearSeccren();">清空筛选</el-button>
        <el-button @click="seccrenList();">筛选</el-button>
        <el-button @click="dialogFlag.isOpen = false;">取消</el-button>
      </div>
    </el-dialog>
    <!--创建创建部门借调-========================================-->
    <el-dialog title="创建部门借调" :visible.sync="dialogFlag.info" size="small" :close-on-click-modal="false" @open="getuserdeptList" @close="resetForm">
      <el-form :model="allocForm" ref="allocForm" style="margin-left: 10px;" class="formData">
        <div class="boldBigFont">借调部门</div>
        <el-select v-model="selectVal" filterable clearable placeholder="请选择借调部门"   >
          <el-option v-for="item in usedeptList" :label="item.deptName" :key="item.deptId" :value="item.deptId"></el-option>
        </el-select>
        <div class="boldBigFont">借调数量</div>
        <el-form-item labelWidth="0" >
          <div class="table_padding">
            <el-table :data="allocForm.stockQtyList"  border tooltip-effect="dark" style="width: 100%">
              <el-table-column sortable prop="skuNo" label="SKU" align="center" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column sortable prop="stockNo" label="所属备货计划"  align="center"></el-table-column>
              <el-table-column sortable prop="availableQty" label="可销售数量"  align="center"></el-table-column>
              <el-table-column sortable prop="borrowQty" label="借调数量" align="center">
                <template scope="scope">
                  <el-input type="number" v-model="scope.row.borrowQty" @change="getTotalQty($event,scope.row.availQty,allocForm.stockQtyList,scope.$index)" ></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <div class="align-right">数量总计：{{totalQty}}</div>
        <div class="boldBigFont">备注内容</div>
        <el-form-item><el-input type="textarea" v-model="allocForm.borrowMemo"></el-input></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.info = false;">取消</el-button>
        <el-button type="primary" @click="submitData()" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import titleHeader from "../../components/ScreenModular/title.vue"
  import textInput from '../../components/ScreenModular/textInput.vue'
  import selectInput from '../../components/ScreenModular/selectInput.vue'
  import transType from '../../components/listData/getTransportationList.vue'
  import logisticsType from '../../components/listData/getLogisticsAllList.vue'
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";
  export default{
    components: {
      ElFormItem,
      titleHeader, textInput,selectInput,transType,logisticsType},
    data(){
      return {
        selectVal:'',//借调部门
        skuNoo:'',
        usedeptList:[],
        deptList:[],
        flag:true,
        activeTab:'0',     //
        pageFilters:{
          warehouse:'',
          skuNo:'',
          stockNo:'',
          lendDept:'',
          currentPage:1,
          pageSize:10,
          //deptId:'',
          //stockId:'',
          //whId:'',
        },
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalCount:10,
          totalPage:10
        },
        activeNames: ['1'],
        alloctListData:[],
        warehouseList:[],
        allWareList:[],
        dialogFlag:{
          info:false  ,
          isOpen:false,
          infoDetail:false,
          dialogTitle:"",
          inputDisabled:false,
        },
        allocForm: {
          whId: '',
          stockQtyList:[],
          borrowMemo:'',
        },
        sels:[],
        selsWh:[],
        type:'updateList/select',
        deptId:[],
        totalQty:'',
        labelWidth:'100px',
        financeFormLabelWidth:'130px',
        isUse:'',
        batchList:[],
        ButtonInfo:{},//按钮权限列表20171227
      }

    },
    mounted () {
      this.getauthorityList();
      this.getAlloctingData();
      this.getWarehouseList();
      //this.getuserdeptList();
    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      resetForm() {
        this.allocForm.stockQtyList=[];
        this.selectVal='';
        this.allocForm.borrowMemo='';
        this.totalQty='';
        console.log('  this.allocForm.stockQtyList % 0==',  this.allocForm.stockQtyList)
      },
    	clearSeccren(){
        this.pageFilters.skuNo='';this.skuNoo='';this.pageFilters.stockNo='';this.pageFilters.lendDept='';
      },
      seccrenList(){
      	this.pageFilters.skuNo=this.skuNoo;
        this.pageFilters.warehouse='';
      	this.getAlloctingData();
      },
      filterData:function(val,vall){
        if(val != '' && vall == 'whId'){
          this.pageFilters.skuNo='';
          this.getAlloctingData();
        }
      },
      getWarehouseList:function(){
        this.httpPost('product/loadFilterConditionWarehouse').then(res =>{
            this.warehouseList = res.data;
        })
      },
      getDepList:function(){
        this.httpPost('stockinventory/selectReqDeptList').then(res =>{
          this.deptList = this.tool.replaceObjKey(res.data.params.list,'deptId','deptName');
        })
      },
      getAlloctingData:function(){
        this.httpPost('/deptBorrow/sourceList',this.pageFilters).then(res => {
            this.dialogFlag.isOpen = false;
            this.page= res.data;
            this.alloctListData =res.data.listData;
        })
      },
      selsChange: function (sels) {
      	this.batchList=sels;
        this.sels = sels.map(item =>item.itemId);
        this.selsWh = sels.map(item =>item.stockDepart);
        console.log('selsWh % 0=',this.selsWh )
      },
      //用户所属部门
      getuserdeptList(){
      	this.httpPost('deptBorrow/deptList').then(res=>{
          this.usedeptList=res.data;
        })
      },
      getTotalQty:function($event,oldVal,data,index){
        var qtyList = this.allocForm.stockQtyList.map(item =>item.borrowQty);
        var flag = qtyList.every(function(item){return item>=0;})
        this.totalQty = flag == true ? eval(qtyList.join('+')) : '';
      },
      handlerItems:function(){
        var ids = this.sels.length;
        var flag = this.selsWh.every(function(item,index,arr){return item == arr[0];})
        if(ids > 0){
          if(ids>1 && flag == false){
            this.$message('你所选择的数据包含多个部门或自己部门，创建部门借调失败！')
          }else{
            this.getStockInfo(this.batchList,'batch');
          }
        }else{
          this.tips();
        }
      },
      getStockInfo:function(val,data){
         this.dialogFlag.info=true;
         if(data !=''){
         	val.map(item=>this.allocForm.stockQtyList.push({skuNo:item.skuNo,borrowQty:0,availableQty:item.availableQty,stockNo:item.stockNo,stockItemId:item.stockItemId}))
         }else{
         	this.allocForm.stockQtyList.push({skuNo:val.skuNo,borrowQty:0,availableQty:val.availableQty,stockNo:val.stockNo,stockItemId:val.stockItemId});
         }
      },
      submitData:function(row){
        var flag = false;
        for(var i=0;i<this.allocForm.stockQtyList.length;i++){
        	if(this.selectVal.indexOf(this.allocForm.stockQtyList[i])!=-1){
            this.$message(`提示取消你所选择的数据包含多个部门/包含自己部门，创建部门借调失败！`);
            flag = false;
          }else{
        		flag=true;
          }
        }
        if(flag==true){
          for(var i=0;i<this.allocForm.stockQtyList.length;i++){
           // alert(this.allocForm.stockQtyList[i].borrowQty)
            if(this.allocForm.stockQtyList[i].borrowQty < 0 || this.allocForm.stockQtyList[i].borrowQty == ''){
              this.$message('借调数量为必填项且需大于0！');
              flag = false;
            }else if(this.allocForm.stockQtyList[i].borrowQty > this.allocForm.stockQtyList[i].availableQty ){
              this.$message('借调数量不能大于可销售数量！');
              flag = false;
            }else if(this.selectVal == ''){
              this.$message('请选择借调部门！');
              flag = false;
            }
            else{
              flag = true;
            }
          }
          if(flag == true){
          	var obj={};
            obj.stockBorrows=[];
              obj.deptId=this.selectVal;
              obj.borrowMemo=this.allocForm.borrowMemo;
              this.allocForm.stockQtyList.map(item=>{obj.stockBorrows.push({stockItemId:item.stockItemId,borrowQty:item.borrowQty})});
            this.httpPost('deptBorrow/edit',obj).then(res =>{
              if(res.data.result == true){
                this.$message('创建成功！');
                this.dialogFlag.info = false;
                this.getAlloctingData();
              }else{
                this.$message(res.data.message);
              }
            })
          }
        }
      },
      changePageSize:function(val){
        this.pageFilters.pageSize=val;
        this.pageFilters.currentPage = 1;
        this.getAlloctingData();
      },
      changeCurrentPage:function(val){
        this.pageFilters.currentPage=val;
        this.getAlloctingData();
      },
      getTextInput:function(val){
        val.type == 'SKU'? this.skuNoo = val.value :  val.type == '备货计划'  ? this.pageFilters.stockNo = val.value:'';
      },
      getDept:function(val){
        this.pageFilters.lendDept = val.value;
      } ,
      getTrans:function(val){
        this.allocForm.transportType = val.value;
      },
      getLogis:function(val){
        this.allocForm.logisticsNo = val.value;
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
  .align-right{
    text-align: right;
  }
</style>
