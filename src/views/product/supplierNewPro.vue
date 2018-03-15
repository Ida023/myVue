<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="8" class="optionValue">
          <selector-item :select-value="pageFilter.vendorName" :option-data="options" place-value="请选择供应商" @on-child-change-Val="onChildChangeVal" size="small"></selector-item>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="small" @click="pageFilter.status = '';getSupplierProList();">搜索</el-button>
        </el-col>
      </el-row>
      <el-row id="filer" class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <span class="span_label">状态</span>
            <el-radio-group v-model="pageFilter.status" size="small" @change="page.currentPage=1;getSupplierProList()">
              <el-radio-button  label="" v-if="ButtonInfo['全部']!='0'">全部</el-radio-button>
              <el-radio-button  label="0" v-if="ButtonInfo['未查看']!='0'">未查看</el-radio-button>
              <el-radio-button  label="1" v-if="ButtonInfo['已查看未提交']!='0'">已查看未提交</el-radio-button>
              <el-radio-button  label="2" v-if="ButtonInfo['已查看已提交']!='0'">已查看已提交</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn">
        <el-button type="primary" size="small"  @click="batchSubmit()" v-show="pageFilter.status == '1'">批量提交</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="supplierProListData" border tooltip-effect="dark" style="width: 100%"   @selection-change="selsChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="150px">
            <template scope="scope">
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start"  v-if="ButtonInfo['查看']!='0'">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row,dialogFlag.title='供应商新品详情')" >&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="提交" placement="top-start" v-if="pageFilter.status == 1 && ButtonInfo['提交']!='0'">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row,dialogFlag.title='提示');" >&#xe63e;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="SKU" placement="top-start" v-if="pageFilter.status == 2 && ButtonInfo['SKU']!='0'">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row,dialogFlag.title='SKU')" >&#xe70b;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="图片" align="center">
            <template scope="scope">
              <img src="../../assets/imgTest.jpg" alt="凤早翔太" :data-src="scope.row.url">
            </template>
          </el-table-column>
          <el-table-column sortable prop="productName" label="名称" align="center"></el-table-column>
          <el-table-column sortable prop="productDesc" label="描述" align="center"></el-table-column>
          <el-table-column sortable prop="purchasePrice" label="单价"  align="center"></el-table-column>
          <el-table-column sortable prop="purchaseMinQty" label="最小采购量"  align="center"></el-table-column>
          <el-table-column sortable prop="addTime" label="发布时间"  :formatter="tool.formatDate" width="180px" align="center"></el-table-column>
          <el-table-column sortable prop="vendorName" label="供应商"   align="center"></el-table-column>
          <el-table-column sortable prop="status" label="状态" :formatter="formatStatus" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>

    <div id="div" class="picHover">
      <el-dialog :title="dialogFlag.title" :visible.sync="dialogFlag.isOpen" size="tiny">
      <el-form :model="formLabelAlign"  >
        <el-form-item prop="vendorName" label="供应商：" >
          {{formLabelAlign.vendorName}}
        </el-form-item>
        <el-form-item label="发布时间："  prop="addTime" >
          {{formLabelAlign.addTime}}
        </el-form-item>
        <el-form-item label="名称：" prop="productName" >
          {{formLabelAlign.productName}}
        </el-form-item>
        <el-form-item label="单价："  prop="purchasePrice">
          {{formLabelAlign.purchasePrice}}
        </el-form-item>
        <el-form-item label="最小采购量："  prop="purchaseMinQty" >
          {{formLabelAlign.purchaseMinQty}}
        </el-form-item>
        <el-form-item label="图片：" prop="platformEmail">
          <el-upload action="#" list-type="picture-card" :file-list="formLabelAlign.attachList">
          </el-upload>
        </el-form-item>
        <el-form-item label="描述：" prop="productDesc">
          {{formLabelAlign.productDesc}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refreshData();">关 闭</el-button>
        <el-button type="primary" @click="submit()" v-show="pageFilter.status != 2">提交至开发</el-button>
      </div>
    </el-dialog>
    </div>
    <el-dialog :title="dialogFlag.title" :visible.sync="dialogFlag.infoDetail" size="tiny">
      <el-form :model="skuForm"  >
        <el-form-item prop="address" label="SKU：" >
          {{skuForm.skuNo}}
        </el-form-item>
        <el-form-item label="开发人员："  prop="userName" >
          {{skuForm.addUser}}
        </el-form-item>
        <el-form-item label="审核通过时间：" prop="isPassTime" >
         <span v-text="tool.formatDate('','',skuForm.addTime)"></span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.infoDetail = false;">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        options:['1','2'],
        supplierProListData:[],
        activeNames: ['1'],    //  筛选 功能的折又又叠面板
        pageFilter:{
          currentPage:1,
          pageSize:10,
          vendorName:'',
          status:'',
        },
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalCount:10,
          totalPage:10
        },
        dialogFlag:{
          isOpen:false,     // 批量及单个删除框
          isOpenLead:false,     // 批量导入框
          isOpenLeadError:false,     // 批量导入异常框
          infoDetail:false,    //  添加 编辑  查看框
          dialogTitle:"",     // 弹出框 的title
          isOpenMsg:'',      // 弹出框 的msg
          inputDisabled:false,   //是否可编辑
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
        ButtonInfo:{},//按钮权限列表20171226
      }
    },
    mounted () {
    	  this.getauthorityList();
        this.getSupplierNameList();
        this.getSupplierProList();
    },
    methods: {
      /*********************页面按钮权限 20171226*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171226*****************************/
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
        this.httpPost('vendorProduct/select',this.pageFilter).then(res => {
          if(res.data.result == true){
            const pageData = res.data.params.docsDataList;
            this.page = pageData;
            this.supplierProListData = pageData.listData;
          }else{
            this.supplierProListData = [];
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
                    let time = vm.tool.formatDate('','',vm.formLabelAlign.addTime);
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
</style>
