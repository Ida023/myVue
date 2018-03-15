<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="8" class="optionValue">
          <!--<selector-options :select-value="pageFilter.vendorName" :options-data="options" place-value="请选择供应商"  size="small" @child-change-Val="childChangeVal"></selector-options>-->
          <el-select v-model="pageFilter.vendorName" filterable  :filter-method="filterMethod" clearable :placeholder="placeholder" :multiple="isMultiple" :disabled="disabled" :no-data-text="noData" :type="type" :size="ssize">
            <el-option v-for="item in options" :label="item.label" :key="item.value" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="small" @click="getData">搜索</el-button>
        </el-col>
      </el-row>
      <el-row class="supplier_btn">
        <el-button type="primary" size="small"  @click="exportSupplierData"  v-if="ButtonInfo['导出供应商关系']!='0'">导出供应商关系</el-button>
        <el-button type="primary" size="small"   v-if="ButtonInfo['筛选']!='0'"  @click="dialogFlag.openFF = true;">筛选</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="supplierRelationshipData" border tooltip-effect="dark" style="width: 100%">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="100px">
            <template scope="scope" >
              <el-tooltip class="item" effect="dark" content="查看SKU列表" placement="top-start">
                <i class="iconfontyyy" @click="tool.goToPage('skuList?vendorId='+scope.row.vendorId+'&vendorName='+scope.row.vendorName+'&productCount='+scope.row.productCount)" >&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="查看采购订单列表" placement="top-start">
                <i class="iconfontyyy" @click="tool.goToPage('purchaseList?vendorId='+scope.row.vendorId+'&vendorName='+scope.row.vendorName+'&poInfoCount='+scope.row.poInfoCount)" >&#xe600;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="vendorName" label="供应商名称" align="center"></el-table-column>
          <el-table-column sortable prop="productCount" label="SKU(个)" align="center"></el-table-column>
          <el-table-column sortable prop="poInfoCount" label="采购次数"  align="center"></el-table-column>
          <el-table-column sortable prop="totalAmount" label="采购订单金额总计(元)"  align="center"></el-table-column>
          <el-table-column sortable prop="hasPayAmount" label="已付款订单金额总计(元)"  align="center"></el-table-column>
          <el-table-column sortable prop="awaitHasPayAmount" label="待付款金额总计(元)"  align="center"></el-table-column>
          <el-table-column sortable prop="invoiceAmount" label="开票金额总计(元)"  align="center"></el-table-column>
          <el-table-column sortable prop="receiveQty" label="已入库金额总计(元)"  align="center"></el-table-column>
          <el-table-column sortable prop="newPoNo" label="最新采购订单" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!--筛选------------------------------------------------------------------------------>
    <div class="smallDia">
      <el-dialog title="筛选" :visible.sync="dialogFlag.openFF" size="small" :close-on-click-modal="false" >
        <div class="data_body">
          <title-header></title-header>
          <text-input :select-value="pageFilter.vendorName" condition-name="供应商" text-type="供应商" place-value="请输入供应商" @child-change-val="getTextInput"></text-input>
          <time-data :start-time="pageFilter.initialTime" condition-name="创建日期" :end-time="pageFilter.overTime" @child-value-Stime="getTime" @child-value-Etime="getTime"></time-data>
          <select-input :select-value="pageFilter.addUser" condition-name="盘点人" :options-data="modalData" @child-change-val="getSelectInput"></select-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">清除条件</el-button>
          <el-button @click="getData">筛 选</el-button>
          <el-button @click="dialogFlag.openFF = false;">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import selectorOptions from '../../components/selector_item_with_key.vue';
  import titleHeader from "../../components/ScreenModular/title.vue"
  import textInput from '../../components/ScreenModular/textInput.vue'
  import selectInput from '../../components/ScreenModular/selectInput.vue'
  import timeData from '../../components/ScreenModular/timeDate.vue'
  export default{
    components: {titleHeader, textInput,selectInput,timeData,selectorOptions},
    data(){
      return {
        options:[],
        supplierRelationshipData:[],
        activeNames: ['1'],    //  筛选 功能的折又又叠面板
        pageFilter:{
          currentPage:1,
          pageSize:10,
          vendorName:'',
          initialTime:'',
          overTime:'',
          overTime:'',
          addUser:'',
        },
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalCount:10,
          totalPage:10
        },
        dialogFlag:{
          isOpen:false,     //
          openFF:false,    //
          dialogTitle:"",     // 弹出框 的title
          isOpenMsg:'',      // 弹出框 的msg
          inputDisabled:false,   //checkbox是否处理可点击状态
          arr:{
              id:'43112210',
              name:'gongjian'
          },
        },
        ButtonInfo:{},//按钮权限列表20171227
      }
    },
    mounted () {
      this.getauthorityList();
      this.getData();
      this.getSupplierNameList();
    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      getSupplierNameList(){
        this.httpPost('vendorRelation/selectVendorName').then(res => {
            if(res.data.result == true){
                this.options = this.tool.replaceObjKey(res.data.params.vendorNameList,'vendorId','vendorName');
            }
        })
      },
      getData:function(){  // 加载数据
        this.httpPost('vendorRelation/selectVendorRelation',this.pageFilter).then(res => {
          this.dialogFlag.openFF = false;
          if(res.data){
            const pageData = res.data;
            this.page = pageData;
            this.supplierRelationshipData = pageData.listData;
          }else{
            this.supplierRelationshipData = [];
          }
        }).catch(function(err){
        })
      },
      exportSupplierData:function(){  // 导出
        var url = this.RmsUrl+'vendorRelation/excelVendorRelation?Authorization='+sessionStorage.getItem("userSession")+'&vendorName='+this.pageFilter.vendorName
          +'&initialTime='+this.pageFilter.initialTime+'&overTime='+this.pageFilter.overTime+'&addUser='+this.pageFilter.addUser;
        window.open(url);
      },
      closeDialog:function(){
          this.pageFilter.initialTime = '';
          this.pageFilter.overTime = '';
          this.pageFilter.vendorName = '';
          this.pageFilter.addUser = '';
      },
      changePageSize:function(val){
        this.pageFilter.pageSize=val;
        this.pageFilter.currentPage = '1';
        this.getData();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getData();
      },
      getTextInput:function(val){
        this.pageFilter.vendorName = val.value;
      },
      childChangeVal:function(val){
        this.pageFilter.vendorName = val.value;
      },
      getTime:function(val){
        val.type == 'start' ? this.pageFilter.initialTime = val.value : this.pageFilter.overTime = val.value;
      },
      filterMethod:function(val){
        var list = [{label:'自定义',value:11}];
        this.options = list;
        /*this.options = list.filter(item => {
          return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
        });*/
      }
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
</style>
