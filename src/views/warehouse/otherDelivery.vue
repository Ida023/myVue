<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="8" class="optionValue">
          <selector-item :select-value="pageFilter.vendorName" :option-data="options" place-value="请选择仓库" @on-child-change-Val="onChildChangeVal"></selector-item>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="small" @click="getData();">搜索</el-button>
        </el-col>
      </el-row>
      <el-row id="filer" class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <span class="span_label">状态</span>
            <el-radio-group v-model="pageFilter.status" size="small" @change="getSupplierProList">
              <el-radio-button  label="1">待审核</el-radio-button>
              <el-radio-button  label="2">审核通过</el-radio-button>
              <el-radio-button  label="3">审核不通过</el-radio-button>
              <el-radio-button  label="4">已出库</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn">
        <el-button type="primary" class="el-icon-plus" size="small"  @click="dialogFlag.infoDetail=true;dialogFlag.inputDisabled=false;dialogFlag.dialogTitle='新建其他出库';">新建其他出库</el-button>
      </el-row>
      <el-row class="supplier_btn last_btn" v-if="pageFilter.status == '1'">
        <el-button type="primary" size="small"  @click="batchSubmit()" >批量同意</el-button>
        <el-button type="primary" size="small"  @click="batchSubmit()" >批量不同意</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="supplierProListData" border tooltip-effect="dark" style="width: 100%"   @selection-change="selsChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template scope="scope" width="100px">
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start" v-if="pageFilter.status !== '0'">
                <i class="iconfontyyy" @click="dialogFlag.infoDetail=true;dialogFlag.inputDisabled=true;dialogFlag.dialogTitle='查看样品采购单'; " >&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="出库" placement="top-start" v-if="pageFilter.status == '0'">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row);">&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="审核通过" placement="top-start" v-if="pageFilter.status == '1'">
                <i class="iconfontyyy" @click="updProductNameStatus(scope.row,'butongguo')">&#xe63d;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="审核不通过" placement="top-start" v-if="pageFilter.status == '1'">
                <i class="iconfontyyy" @click="updProductNameStatus(scope.row,'butongguo')">&#xe619;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="productName" label="出库记录编号" align="center"></el-table-column>
          <el-table-column sortable prop="productDesc" label="发货仓库" align="center"></el-table-column>
          <el-table-column sortable prop="purchasePrice" label="出库原因"  align="center"></el-table-column>
          <el-table-column sortable prop="purchaseMinQty" label="申请人"  align="center"></el-table-column>
          <el-table-column sortable prop="addTime" label="申请时间"  :formatter="tool.formatDate" align="center"></el-table-column>
          <el-table-column sortable prop="vendorName" label="状态"   align="center"></el-table-column>
          <el-table-column sortable prop="status" label="入库时间" :formatter="formatStatus" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <add-owarehouse-item :title="dialogFlag.dialogTitle" :open="dialogFlag.infoDetail" :disabled="dialogFlag.inputDisabled" @material-dialog="materialDialog"></add-owarehouse-item>
    <!------------------查看  / 添加其他入库 弹出框--------------------------->
<!--    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail" :close-on-click-modal="false" @close="closeDialog">
      <section class="infoData">
        <div class="info_tit">
          <span class="title">基本信息</span>
        </div>
        <el-form :model="poSamplesChargesModel" ref="poSamplesChargesModel" class="formData" >
          <el-form-item  label="收货仓库：" prop="chargesCount" :label-width="financeFormLabelWidth" required>
            <selector-item :select-value="poSamplesChargesModel.currencyId" :option-data="options" :is-disabled="dialogFlag.inputDisabled" place-value="请选择仓库" @on-child-change-Val="onChildChangeValCurrency"></selector-item>
          </el-form-item>
          <el-form-item label="运费/报关/其他费用：" prop="allQty" :label-width="financeFormLabelWidth">
            <el-col :span="5" style="padding-right:5px;"><el-input type="number" v-model="poSamplesChargesModel.chargesCount"></el-input></el-col>
            <el-col :span="5" style="padding: 0 5px;"><el-input type="number" v-model="poSamplesChargesModel.chargesCount"></el-input></el-col>
            <el-col :span="5" style="padding: 0 5px;"><el-input type="number" v-model="poSamplesChargesModel.chargesCount"></el-input></el-col>
            <el-col :span="3" style="padding: 0 0 5px 0;text-align: center">币种：</el-col>
            <el-col :span="6" style="padding-left:5px;"><selector-item :select-value="poSamplesChargesModel.currencyId" :option-data="options" :is-disabled="dialogFlag.inputDisabled" place-value="请选择币种" @on-child-change-Val="onChildChangeValCurrency"></selector-item></el-col>
          </el-form-item>
          <el-form-item label="计费类型：" class="yufei_item" prop="freight" :label-width="financeFormLabelWidth">
            <el-radio-group v-model="poSamplesChargesModel.freight">
              <el-radio  :label="true" name="bankTransfer" :disabled="dialogFlag.inputDisabled">千克（KG)</el-radio>
              <el-radio  :label="false" name="alipay" :disabled="dialogFlag.inputDisabled">立方米（CBM）</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="入库原因："  :label-width="financeFormLabelWidth">
            <el-col :span="5"><selector-item :select-value="poSamplesChargesModel.currencyId" :option-data="options" :is-disabled="dialogFlag.inputDisabled" place-value="请选择供应商" @on-child-change-Val="onChildChangeValCurrency"></selector-item></el-col>
            <el-col :span="2" style="text-align: center;">
              <el-tooltip class="item" effect="dark" content="添加其他原因" placement="top-start">
                <i class="iconfontyyy" @click="dialogFlag.isOpen=true;" style="padding:0 5px;">&#xe623;</i>
              </el-tooltip>
            </el-col>
            <el-col :span="17" v-if="dialogFlag.isOpen==true"><el-input v-model="poSamplesChargesModel.chargesCount" placeholder="输入其他原因"></el-input></el-col>
          </el-form-item>
          <el-form-item label="备注：" prop="allCharges" :label-width="financeFormLabelWidth">
            <el-input  type="textarea" v-model="poSamplesChargesModel.chargesCount"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="infoData">
        <div class="info_tit" style="margin-bottom: 20px;">
          <span class="title">明细信息</span><br/>
        </div>
        <el-row style="margin:10px">
          <el-col :span="12" v-if="dialogFlag.inputDisabled == false">
            <el-button type="primary" size="small"  @click="batchSubmit()" >添加物品</el-button>
            <el-button type="primary" size="small"  @click="batchSubmit()" >批量输入SKU</el-button>
            <el-button type="primary" size="small"  @click="batchSubmit()" >Excel导入</el-button>
          </el-col>
          <el-col :span="12" style="text-align: right;float: right;"><span>总重量（KG）</span><span>0.00</span><span> 总体积（CBM）</span><span>0.00</span></el-col>
        </el-row>
        <div class="table_padding">
          <el-table :data="poSamplesItemList" border tooltip-effect="dark" style="width: 100%" >
            <el-table-column sortable label="图片" align="center" class="textarea">
              <template scope="scope">
                <img src="../../assets/imgTest.jpg" alt="凤早翔太" :data-src="scope.row.url">
              </template>
            </el-table-column>
            <el-table-column sortable prop="status" label="SKU" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column sortable prop="status" label="货品名称"  align="center"></el-table-column>
            <el-table-column sortable prop="status" label="采购单价"  align="center"></el-table-column>
            <el-table-column sortable prop="status" label="数量" align="center">
              <template scope="scope">
                <div v-if="dialogFlag.inputDisabled == false">
                  <el-input type="number" v-model="scope.row.memo"></el-input>
                </div>
                <span v-if="dialogFlag.inputDisabled == true">{{scope.row.memo}}</span>
              </template>
            </el-table-column>
            <el-table-column sortable label="货位号" align="center" :show-overflow-tooltip="true">
              <template scope="scope">
                <div v-if="dialogFlag.inputDisabled == false">
                  <el-input v-model="scope.row.memo"></el-input>
                </div>
                <span v-if="dialogFlag.inputDisabled == true">{{scope.row.memo}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center">
              <template scope="scope">
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start" v-if="dialogFlag.inputDisabled == false">
                  <i class="iconfontyyy"  @click="deleteRow(scope.row,scope.$index,poSamplesItemList)">&#xe6f7;</i>
                </el-tooltip>
                <i class="iconfontyyy" v-if="dialogFlag.inputDisabled == true">&#xe6f7;</i>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.infoDetail = false;">取消</el-button>
        <el-button type="primary" @click="addSampleProduct('0');" v-if="dialogFlag.inputDisabled == false">保 存</el-button>
      </div>
    </el-dialog>
    <add-product-item></add-product-item>-->
  </div>
</template>
<script>
  import selectorOptions from '../../components/selector_item_with_key.vue';
  import addProductItem from '../../components/add_product_item.vue';
  import addOwarehouseItem from '../../components/add_oWarehouse_item.vue';
  export default{
    components: {selectorOptions,addProductItem,addOwarehouseItem},
    data(){
      return {
        activeNames:['1'],
        poSamplesItemList:[{memo:'fdfsd',status:3343}],
        poSamplesChargesModel:{
          chargesCount:'',
          allQty:'',
          freight:'',
          allCharges:'',
          addTime:'',
          addUser:'',
          compId:'',
          poId:'',
          updTime:'',
          updUser:'',
        },
        options:['1','2'],
        supplierProListData:[],
        pageFilter:{
          currentPage:1,
          pageSize:10,
          vendorName:'',
          status:'1',
        },
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalCount:10,
          totalPage:10
        },
        dialogFlag:{
          isOpen:false,
          infoDetail:false,
          dialogTitle:"",
          inputDisabled:false,
        },
        formLabelAlign:{
          productDesc:'1',
          purchaseMinQty:'1',
          purchasePrice:'1',
          productName:'1',
          addTime:'1',
          vendorName:'1',
          attachList:[]
        },
        financeFormLabelWidth:'150px',
        skuForm:{
          skuNo:'',
          addUser:'',
          addTime:'',
        },
        updStatusParams:{
            productId:'',
            status:'',
        },
        sels:[],
        productId:'',
      }
    },
    mounted () {
        this.getSupplierNameList();
        this.getSupplierProList();
    },
    methods: {
      getData(){
          this.pageFilter.status = '';
          this.getSupplierProList();
      }  ,
      selsChange: function (sels) {
        this.sels = sels;
      },
      getSupplierNameList(){
        this.httpPost('vendorProduct/selectVendorName').then(res => {
            if(res.data.result == true){
                this.options = res.data.params.vendorName;
                console.log('option'+this.options);
            }
        })
      },
      getSupplierProList:function(){
        console.log('翻页传参 % O',this.pageFilter);
        this.httpPost('vendorProduct/select',this.pageFilter).then(res => {
          if(res.data.result == true){
            console.log(res);
            const pageData = res.data.params.docsDataList;
            this.page.currentPage = pageData.currentPage;
            this.page.totalCount = pageData.totalCount;
            this.page.totalPage = pageData.totalPage;
            this.page.pageSize = pageData.pageSize;
            this.supplierProListData = pageData.listData;
            console.log('  ---userListData % O',this.supplierProListData);
          }else{
            this.supplierProListData = [];
            console.log('请求无数据');
          }
        }).catch(function(err){
          console.log(err);
        })
      },
      showInfoDialog(row,val){
        var vm = this;
        vm.updStatusParams.productId = row.productId;
        if(val == '提示'){
          vm.submitSingle(row.productId,'2');
        }else if(val == '供应商新品详情'){
            vm.dialogFlag.isOpen = true;
            vm.httpPost('vendorProduct/selectVendorProductData',{productId:row.productId}).then(res =>{
                if(res.data.result == true){
                    vm.formLabelAlign = res.data.params.vendorProduct;
                    let time = vm.tool.formatDate(vm.formLabelAlign.addTime);
                    vm.formLabelAlign.addTime = time;
                    vm.formLabelAlign.attachList = [];
                    vm.formLabelAlign.attachList.push({url: vm.formLabelAlign.url});
                    console.log(vm.formLabelAlign);
                    vm.updStatusParams.status = '1';
                    vm.dialogFlag.isOpen = true;
                    vm.httpPost('vendorProduct/updateVendorProductStatus', vm.updStatusParams).then(res =>{
                      if(res.data.result == true){}
                  })
                }
            })
        }else if(val == 'SKU'){
            vm.dialogFlag.infoDetail = true;
            vm.httpPost('vendorProduct/selectSkuInfo?productId='+row.productId).then(res =>{
            if(res.data.result == true){
              if(res.data.params.productDevInfoModel){
                vm.skuForm = res.data.params.productDevInfoModel;
                vm.tool.formatDate(vm.skuForm.addTime);
                let at = vm.tool.formatDate(vm.skuForm.addTime);
                vm.skuForm.addTime = at;
              }
            }
          })
        }
      },
      submitSingle(id,status){
        var vm = this;
        vm.updStatusParams.productId = id;
        vm.updStatusParams.status = status;
        if(vm.updStatusParams.productId == '' ){
          vm.tips();
        }else{
          console.log('被提交的商品的 % O',vm.updStatusParams);
          vm.doItem('确定将产品提交至开发？','vendorProduct/updateVendorProductStatus',vm.updStatusParams,vm.getSupplierProList);
        }
      },
      batchSubmit:function(){
        var productId = this.sels.map(item => item.productId);
        let asd= productId.join();
        this.submitSingle(asd,'2');
      },
      submit:function(){
        this.updStatusParams.status = '2';
        console.log(this.updStatusParams);
        this.httpPost('vendorProduct/updateVendorProductStatus',this.updStatusParams).then(res =>{
            if(res.data.result == true){
                this.$message(res.data.message);
                this.dialogFlag.isOpen = false;
                this.getSupplierProList();
            }
        })
      },
      changePageSize:function(val){
        this.pageFilter.pageSize=val;
        this.pageFilter.currentPage = '1';
        this.getSupplierProList();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getSupplierProList();
      },
      onChildChangeVal(val){
          this.pageFilter.vendorName = val.value;
      },
      materialDialog:function(val){
          this.dialogFlag.infoDetail = val.open;
          var status = val.status;
      },
      formatStatus:function(row){
        return row.status == 0 ? '未查看' : row.status == 1 ? '已查看未提交' : row.status == 2 ? '已查看已提交' : '';
      },
      refreshData(){
        if(this.pageFilter.status == 0){
            this.getSupplierProList();
        }
        this.dialogFlag.isOpen = false;
      },
    }
  }
</script>

<style scoped>
  [v-cloak] {
    display: none;
  }
  .optionValue{
       margin-right:10px;
     }
  .span_label{
    font-weight:bold;
    margin-right:10px;
  }
  .supplier_btn{
    padding:10px 0;
  }
  .last_btn{
    border-top:1px solid #d1dbe5 ;
  }
  .info_tit{
    display:flex;
    justify-content:space-between;
  }
  .info_tit .title{
    font-size:16px;
    font-weight:bold;
  }
  .formData .el-form-item {
    margin:10px 10px 0 20px;
  }
  .formData{
    margin:10px 0;
  }
  .infoData{
    margin-left:10px;
  }

</style>
