<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="6" class="optionValue">
          <el-input v-model="pageFilter.skuNo" placeholder="请输入sku编号" size="small"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="pageFilter.deptId='';pageFilter.stockId='';pageFilter.whId='';getAlloctingData();">搜索</el-button>
        </el-col>
      </el-row>
      <el-row id="filer" class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <span class="span_label" style="margin-bottom:10px;">仓库</span>
            <el-radio-group v-model="pageFilter.whId" size="small" @change="filterData($event,'whId');">
              <el-radio-button style="margin-bottom:5px;" v-for="item in warehouseList" :key="item.whId" :label="item.whId">{{item.whName}}</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn ">
        <el-button type="" size="small"  @click="dialogFlag.isOpen=true;getDepList()">筛选</el-button>
      </el-row>
      <el-row class="supplier_btn last_btn"  v-if="ButtonInfo['批量创建分仓调拨']!='0'">
        <el-button type="primary" size="small"  @click="handlerItems" >批量创建分仓调拨</el-button>
      </el-row>
      <div class="table_padding">
        <el-table :data="alloctListData" ref="tableData" border tooltip-effect="dark" style="width: 100%"  @selection-change="selsChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column  label="操作" align="center">
            <template scope="scope" width="100px">
              <el-tooltip class="item" effect="dark" content="创建分仓调拨" placement="top-start" v-if="ButtonInfo['创建分仓调拨']!='0'">
                <i class="iconfontyyy" @click="getStockInfo([scope.row.itemId],[scope.row.whId]);" >&#xe63d;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="图片" prop="imageUrl" align="center" width="115px" sortable>
            <template scope="scope">
              <img  :src="scope.row.picture">
            </template>
          </el-table-column>
          <el-table-column sortable prop="skuNo" label="SKU" align="center" ></el-table-column>
          <el-table-column sortable prop="proName" label="商品名称"  align="center"></el-table-column>
          <el-table-column sortable prop="stockNo" label="所属备货计划"  align="center"></el-table-column>
          <el-table-column sortable prop="itemIdList" label="备货子计划编号" align="center" width="180px">
            <template scope="scope">
              <span v-for="(item,index) in scope.row.itemIdList" :key="index">{{item}}<br/></span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="itemCount" label="备货子计划数量"   align="center"></el-table-column>
          <el-table-column sortable prop="availQty" label="可销售数量"   align="center"></el-table-column>
          <el-table-column sortable prop="stockDept" label="备货部门"  width="180px"  align="center"></el-table-column>
          <el-table-column sortable prop="whName" label="备货仓库"  align="center"></el-table-column>
          <el-table-column sortable prop="stockUser" label="备货计划创建人"   align="center"></el-table-column>
          <el-table-column sortable prop="addTime" label="备货计划创建时间"  :formatter="tool.formatDate" width="180px" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!------------------筛选 弹出框--------------------------->
    <el-dialog title="筛选" :visible.sync="dialogFlag.isOpen" :close-on-click-modal="false" size="small" @open="pageFilter.deptId='';pageFilter.whId='';pageFilter.stockId='';">
      <div class="data_body">
        <title-header></title-header>
        <text-input :select-value="pageFilter.skuNo" condition-name="SKU" text-type="SKU" place-value="请输入SKU" @child-change-val="getTextInput"></text-input>
        <text-input :select-value="pageFilter.stockId" condition-name="备货计划" text-type="备货计划" place-value="请输入备货计划" @child-change-val="getTextInput"></text-input>
        <select-input :select-value="pageFilter.deptId" condition-name="备货部门" place-value="请输入备货部门" :options-data="deptList" @child-change-val="getDept"></select-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pageFilter.skuNo='';pageFilter.deptId='';pageFilter.stockId='';">清空筛选</el-button>
        <el-button @click="getAlloctingData()">筛选</el-button>
        <el-button @click="dialogFlag.isOpen = false;">取消</el-button>
      </div>
    </el-dialog>
    <!--创建分仓调拨-========================================-->
    <el-dialog title="创建分仓调拨" :visible.sync="dialogFlag.info" size="small" :close-on-click-modal="false" @open="allocForm.dosc='';allocForm.whId='';allocForm.transportType=''">
      <el-form :model="allocForm" ref="allocForm" style="margin-left: 10px;" class="formData">
        <div class="boldBigFont">借调数量</div>
        <div class="table_padding">
          <el-table :data="allocForm.stockQtyList" border tooltip-effect="dark" style="width: 100%">
            <el-table-column sortable prop="skuNo" label="SKU" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column sortable prop="stockNo" label="所属备货计划"  align="center"></el-table-column>
            <el-table-column sortable prop="availQty" label="可销售数量"  align="center"></el-table-column>
            <el-table-column sortable prop="qty" label="调拨数量" align="center">
              <template scope="scope">
                <el-input type="number" v-model.number="scope.row.qty" @change="getTotalQty($event,scope.row.availQty,allocForm.stockQtyList,scope.$index)"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="align-right">数量总计：{{totalQty}}</div>
        <div class="boldBigFont">申请备注</div>
        <el-form-item><el-input type="textarea" v-model="allocForm.dosc"></el-input></el-form-item>
        <div class="boldBigFont">调拨信息</div>
        <el-form-item  label="目的仓："  :label-width="financeFormLabelWidth" >
          <el-select v-model="allocForm.whId" filterable clearable placeholder="请选择目的仓" style="width: 50%;" @change="allocForm.logisticsNo = ''">
            <el-option v-for="item in allWareList" :label="item.whName" :key="item.whId" :value="item.whId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="运输方式：" :label-width="financeFormLabelWidth" >
          <trans-type :select-value="allocForm.transportType" :is-disabled="false" place-value="请选择运输方式" @getTrans="getTrans" style="width:50%;"></trans-type>
        </el-form-item>
        <el-form-item  label="物流类型：" :label-width="financeFormLabelWidth" >
          <logistics-type :select-value="allocForm.logisticsNo" :is-disabled="false" :whId="allocWhId" place-value="请物流类型方式" @getLogis="getLogis" style="width:50%;"></logistics-type>
        </el-form-item>
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
  export default{
    components: {titleHeader, textInput,selectInput,transType,logisticsType},
    data(){
      return {
        deptList:[],
        flag:true,
        activeTab:'0',     //
        pageFilter:{
          currentPage:1,
          pageSize:10,
          skuNo:'',
          deptId:'',
          stockId:'',
          whId:'',
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
          transportType:'',
          logisticsNo:'',
          dosc:'',
        },
        allocWhId:'',
        sels:[],
        selsWh:[],
        type:'updateList/select',
        deptId:[],
        totalQty:'',
        labelWidth:'100px',
        financeFormLabelWidth:'130px',
        ButtonInfo:{},//按钮权限列表20171227
      }
    },
    mounted () {
      this.getauthorityList();
      this.getAlloctingData();
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
      filterData:function(val,vall){
          if(val != '' && vall == 'whId'){
            this.pageFilter.deptId='';
            this.pageFilter.stockId='';
            this.pageFilter.skuNo='';
            this.getAlloctingData();
          }
      },
      getWarehouseList:function(){
        this.httpPost('stockinventory/selectWhInfoList').then(res =>{
            if(res.data.result == true){
              this.warehouseList = res.data.params.list;
            }
        })
      },
      getDepList:function(){
        this.httpPost('stockinventory/selectReqDeptList').then(res =>{
          this.deptList = this.tool.replaceObjKey(res.data.params.list,'deptId','deptName');
        })
      },
      getAlloctingData:function(){
        this.httpPost('stockinventory/selectWhItemInfo',this.pageFilter).then(res => {
          this.dialogFlag.isOpen = false;
          if(res.data.result == true){
            const pageData = res.data.params.list;
            this.page= pageData;
            this.alloctListData = pageData.listData;
          }else{
            this.alloctListData = [];
          }
        })
      },
      selsChange: function (sels) {
        this.sels = sels.map(item =>item.itemId);
        this.selsWh = sels.map(item =>item.whId);
      },
      handlerItems:function(){
        var ids = this.sels.length;
        var selsWh=this.selsWh.sort();
        var flag = selsWh.every(function(item,index,arr){
             return arr[index] === arr[index+1];
        })
        if(ids > 0){
          if(ids>1 && flag == false){
              this.$message('你所选择的数据包多个不同备货仓，创建分仓调拨失败！')
          }else{
            this.getStockInfo(this.sels,this.selsWh)
          }
        }else{
          this.tips();
        }
      },
      getStockInfo:function(val,whVal){
          this.httpPost('stockinventory/selectStockItemInfo',{stockItemId:val,whId:whVal}).then(res =>{
            if(res.data.result == true){
                var list = res.data.params.list, vm = this;
                list.forEach(function(item){vm.$set(item,'qty','');});
                this.allocForm.stockQtyList = list;
                this.allocWhId = list[0].whId;
                this.dialogFlag.info = true;
            }
          })
          this.httpPost('stockinventory/selectAllWhInfoList').then(res =>{
              if(res.data.result == true){
                  this.allWareList = res.data.params.list;
              }
          })
      },
      getTotalQty:function($event,oldVal,data,index){
          var qtyList = this.allocForm.stockQtyList.map(item =>item.qty);
          var flag = qtyList.every(function(item){return item>=0;})
          this.totalQty = flag == true ? eval(qtyList.join('+')) : '';
      },
      submitData:function(row){
        var flag = false;
        for(var i=0;i<this.allocForm.stockQtyList.length;i++){
          if(this.allocForm.stockQtyList[i].qty < 0 || this.allocForm.stockQtyList[i].qty == ''){
            this.$message('借调数量为必填项且需大于0！');
            flag = false;
            break;
          }else if(this.allocForm.stockQtyList[i].qty > this.allocForm.stockQtyList[i].availQty ){
            this.$message('借调数量不能大于可销售数量！');
            flag = false;
            break;
          }else{
            flag = true;
          }
        }
        if(flag == true){
          if(this.allocForm.whId == '' || this.allocForm.dosc == '' || this.allocForm.transportType == ''|| this.allocForm.logisticsNo == '') {
            this.$message('目的仓、运输方式、物流方式及备注为必填项！');
          }else{
            this.httpPost('stockinventory/addStockInveList',this.allocForm).then(res =>{
              this.$message(res.data.message);
              if(res.data.result == true){
                this.dialogFlag.info = false;
                this.getAlloctingData();
              }
            })
          }
        }
      },
      changePageSize:function(val){
        this.pageFilter.pageSize=val;
        this.pageFilter.currentPage = 1;
        this.getAlloctingData();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getAlloctingData();
      },
      getTextInput:function(val){
        val.type == 'SKU'? this.pageFilter.skuNo = val.value : this.pageFilter.stockId = val.value;
      },
      getDept:function(val){
        this.pageFilter.deptId = val.value;
      } ,
      getTrans:function(val){
        this.allocForm.transportType = val.value;
      },
      getLogis:function(val){
        this.allocForm.logisticsNo = val.value;
      },
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
