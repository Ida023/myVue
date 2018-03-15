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
          <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="getInventoryList()">搜索</el-button>
        </el-col>
      </el-row>
      <el-row id="filer" class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <span class="span_label">状态</span>
            <el-radio-group v-model="pageFilter.status" size="small" @change="getInventoryList">
              <el-radio-button  :label="item.value" v-for="item in statusOptions" :key="item.value"   v-if="ButtonInfo[item.label]!='0'">{{item.label}}</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn last_btn">
        <el-button size="small" type="primary" @click="updStatus('','sels','02')" v-if="pageFilter.status == '01' && ButtonInfo['批量提交']!='0'">批量提交</el-button>
        <el-button size="small" type="primary" @click="updStatus('','sels','04')" v-if="pageFilter.status == '02' && ButtonInfo['批量同意']!='0'">批量同意</el-button>
        <el-button size="small" type="primary" @click="updStatus('','sels','03')" v-if="pageFilter.status == '02' && ButtonInfo['批量不同意']!='0'">批量不同意</el-button>
        <el-button size="small" type="primary" @click="deleteItem('','sels')" v-if="pageFilter.status == '01' && ButtonInfo['批量删除']!='0'">批量删除</el-button>
    </el-row>
      <el-table :data="inventoryData" id="item_list" border tooltip-effect="dark" style="width: 100%" @selection-change="selsChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="label" label="操作" width="130px" align="center" >
          <template scope="scope" >
            <el-tooltip class="item" effect="dark" content="查看" placement="top-start"      v-if="ButtonInfo['查看']!='0'">
              <i class="iconfontyyy" @click="showInfoDialog(scope.row);dialogFlag.infoDetail=true;dialogFlag.dialogTitle='查看盘点单详情'">&#xe600;</i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-if="scope.row.conStatus == '草稿' && ButtonInfo['编辑']!='0'" content="编辑" placement="top-start" >
              <i class="iconfontyyy" @click="showInfoDialog(scope.row);dialogFlag.infoDetail=true;dialogFlag.dialogTitle='编辑盘点单'">&#xe6e5;</i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="导出" placement="top-start"      v-if="ButtonInfo['导出']!='0'">
              <i class="iconfontyyy" @click="exportData(scope.row);">&#xe60a;</i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-if="(scope.row.conStatus == '草稿' || scope.row.conStatus == '待审核')  && ButtonInfo['同意']!='0'" content="同意" placement="top-start" >
              <i class="iconfontyyy" v-if="scope.row.conStatus == '草稿'"  @click="updStatus(scope.row,'','02')">&#xe67e;</i>
              <i class="iconfontyyy" v-if="scope.row.conStatus == '待审核'"  @click="updStatus(scope.row,'','04')">&#xe67e;</i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-if="scope.row.conStatus == '待审核'  && ButtonInfo['不同意']!='0'" content="不同意" placement="top-start" >
              <i class="iconfontyyy" @click="updStatus(scope.row,'','03')">&#xe665;</i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-if="scope.row.conStatus == '草稿'  && ButtonInfo['删除']!='0'" content="删除" placement="top-start" >
              <i class="iconfontyyy" @click="deleteItem(scope.row,'');">&#xe6f7;</i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-if="scope.row.conStatus == '草稿'  && ButtonInfo['导入']!='0'" content="导入" placement="top-start" >
              <i class="iconfontyyy" @click="dialogFlag.isOpenLead=true">&#xe63a;</i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" prop="stoNo" label="盘点单号" ></el-table-column>
        <el-table-column sortable align="center" prop="whName" label="盘点仓库" ></el-table-column>
        <el-table-column sortable align="center" prop="stoValue" label="创建类型" ></el-table-column>
        <el-table-column sortable align="center" prop="proCount" label="SKU数量" ></el-table-column>
        <el-table-column sortable align="center" prop="addName" label="创建人" ></el-table-column>
        <el-table-column sortable align="center" prop="addTime" label="创建时间" width="180px" :formatter="tool.formatDate"></el-table-column>
        <el-table-column sortable align="center" prop="stoUser" label="盘点人" ></el-table-column>
        <el-table-column sortable align="center" prop="conReqTime" label="盘盈盘亏表提交时间" width="180px" :formatter="tool.formatDate"></el-table-column>
        <el-table-column sortable align="center" prop="conTime" label="盘盈盘亏表审核时间" width="180px" :formatter="tool.formatDate"></el-table-column>
        <el-table-column sortable align="center" prop="conStatus" label="盘盈盘亏表状态"></el-table-column>
      </el-table>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!---------------批量导入弹出框-------------------------->
    <el-dialog title="按Excel表录入盘点单" :visible.sync="dialogFlag.isOpenLead" size="tiny" :before-close="beforeCloseChange" :close-on-click-modal="false" >
      <el-upload class="upload-demo" :http-request="uploadFile" action=""  ref="upload" :auto-upload="false" :on-change="handExcChange" :file-list="excFile" accept='.xls,.xlsx,.xlsm'>
        <span>选择需要导入的文件</span>
        <el-button size="small" type="primary">选择文件</el-button>
      </el-upload><br/>
      <span class="remark">请先导出模板数据，录入相关数据之后再导入。</span><br/>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.isOpenLead = false;excFile=[]">取 消</el-button>
          <el-button type="primary" @click="submitUpload();">导 入</el-button>
        </div>
    </el-dialog>
    <!------------------查看 / 编辑弹出框--------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail" :close-on-click-modal="false" @open="activeTab=dialogFlag.dialogTitle=='查看盘点单详情'?'0':'1'">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="供应商" name='0'>
          <el-form :model="inventoryInfo" ref="inventoryForm"  class="demo-ruleForm">
            <el-form-item label="盘点单号：" :label-width="labelWidth">{{inventoryInfo.stoNo}}</el-form-item>
            <el-form-item label="盘点仓库：" :label-width="labelWidth">{{inventoryInfo.whName}}</el-form-item>
            <el-form-item label="创建类型：" :label-width="labelWidth">{{inventoryInfo.stoValue}}</el-form-item>
            <el-form-item label="盘点SKU数量：" :label-width="labelWidth">{{inventoryInfo.proCount}}</el-form-item>
            <el-form-item label="盘点描述：" :label-width="labelWidth">{{inventoryInfo.stoDesc}}</el-form-item>
            <el-form-item label="创建人：" :label-width="labelWidth">{{inventoryInfo.addName}}</el-form-item>
            <el-form-item label="创建时间：" :label-width="labelWidth">{{tool.formatDate('','',inventoryInfo.addTime)}}</el-form-item>
            <el-form-item label="修改时间：" :label-width="labelWidth">{{tool.formatDate('','',inventoryInfo.updTime)}}</el-form-item>
            <el-form-item label="审核人：" :label-width="labelWidth">{{inventoryInfo.appUser}}</el-form-item>
            <el-form-item label="审核结果：" :label-width="labelWidth">{{inventoryInfo.appResult}}</el-form-item>
            <el-form-item label="审核时间：" :label-width="labelWidth">{{tool.formatDate('','',inventoryInfo.appTime)}}</el-form-item>
            <el-form-item label="盘点人：" :label-width="labelWidth">{{inventoryInfo.stoName}}</el-form-item>
            <el-form-item label="盘点开始时间：" :label-width="labelWidth">{{tool.formatDate('','',inventoryInfo.stoStartTime)}}</el-form-item>
            <el-form-item label="盘点结束时间：" :label-width="labelWidth">{{tool.formatDate('','',inventoryInfo.stoEndTime)}}</el-form-item>
            <el-form-item label="盘盈盘亏表状态：" :label-width="labelWidth">{{inventoryInfo.conStatus}}</el-form-item>
            <el-form-item label="提交审核时间：" :label-width="labelWidth">{{tool.formatDate('','',inventoryInfo.conTime)}}</el-form-item>
            <el-form-item label="盘盈盘亏审核时间：" :label-width="labelWidth">{{tool.formatDate('','',inventoryInfo.conReqTime)}}</el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="产品" name='1'>
          <stock-table :table-data="inventoryForm.list" :btn-column="false" :is-disable="dialogFlag.dialogTitle === '查看盘点单详情'? true:false"></stock-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="$store.state.loading" @click="dialogFlag.infoDetail = false;">{{dialogFlag.dialogTitle === '查看盘点单详情'? '关闭' :'取消'}}</el-button>
        <el-button :loading="$store.state.loading" type="primary" v-if="dialogFlag.dialogTitle == '编辑盘点单' && activeTab=='1'"  @click="updateInventory">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import titleHeader from "../../components/ScreenModular/title.vue"
  import textInput from '../../components/ScreenModular/textInput.vue'
  import selectInput from '../../components/ScreenModular/selectInput.vue'
  import timeData from '../../components/ScreenModular/timeDate.vue'
  import categoryList from '../../components/ChoiceModular/classify.vue'
  import stockTable from '../../components/singleTableData/stockTalkingTable.vue'
  import addPro from '../../components/singleTableData/categoryProduct.vue'
  export default {
    components: {titleHeader, textInput,selectInput,timeData,categoryList,stockTable,addPro},
    data() {
      return {
        excList:'',  //  已选择导入的文件
        statusOptions:[{value:'01',label:'草稿'},{value:'02',label:'待审核'},{value:'03',label:'已审核（不通过）'},{value:'04',label:'已审核（通过）'}],
        inventoryForm:{},  // 查看编辑list
        inventoryInfo:{},  // 查看编辑form
        activeTab:'0',
        activeNames: ['1'],
        inventoryData: [],
        pageFilter: {
          currentPage: 1,
          pageSize: 10,
          whId:'',
          status:'01',
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
          isOpenLead: false,
          dialogTitle: "",
          inputDisabled: false,
        },
        labelWidth:'140px',
        excFile:[],
        sels:[],
        stoId:'',
        ButtonInfo:{},//按钮权限列表20171227
      }
    },
    mounted () {
      this.getauthorityList();
      this.getInventoryList();
      this.getWarehouseList();
    },
    methods:{
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      selsChange: function (sels) {
        this.sels = sels;
      },
      getWarehouseList:function(){
        this.httpPost('warehouseadjustment/selectWh').then(res =>{
          if(res.data.result == true){
            this.warehouseList = res.data.params.list;
          }
        })
      },
      getInventoryList:function(){
        this.httpPost('warehousestocktaking/selectStoList', this.pageFilter).then(res => {
          if (res.data.result == true) {
            const pageData = res.data.params.list;
            this.page = pageData;
            this.inventoryData = pageData.listData;
          } else {
            this.inventoryData = [];
          }
        })
      },
      showInfoDialog:function(row){
        this.stoId = row.stoId;
        this.httpPost('warehousestocktaking/selectStoData',{stoId:row.stoId}).then(res =>{
          if(res.data.result == true){
            this.inventoryForm = res.data.params;
            this.inventoryInfo = res.data.params.data;
          }else{
            this.$message(res.data.message)
          }
        })
      },
      updStatus: function (row,sels,status) {
        var batchData = [], singleData = [], vm = this, msg = '';
        msg = status == '02' ? '您确定提交此盘盈盘亏表？' : status == '04' ? '您确定同意此盘盈盘亏表？' : '您确定不同意此盘盈盘亏表？';
        if (sels != '') {
          if(this.sels.length > 0){
            this.sels.forEach(function (item) {
              batchData.push({stoId: item.stoId, status: status,type:'0'});
            })
          }else{
            batchData = [];
          }
        } else {
          singleData = [{stoId: row.stoId, status: status,type:'0'}];
        }
        var data = sels != '' ? batchData : singleData;
        data.length < 1 ? vm.tips() : vm.doItem(msg, 'warehousestocktaking/updateStatus', data, vm.getInventoryList);
      },
      updateInventory:function(){
        var flag=this.inventoryForm.list.every(function(item){
          return item.newInvQty !='';
        })
        if(flag){
          this.httpPost('warehousestocktaking/updateStoData',this.inventoryForm.list).then(res =>{
            if(res.data.result == true){
              this.$message(res.data.message);
              this.dialogFlag.infoDetail = false;
              this.getInventoryList();
            }else{
              this.$message(res.data.message);
            }
          })
        }else{
          this.$message('盘点库存不能为空！');
        }
      },
      deleteItem: function (row,sels) {
        var vm = this,selsData = [];
        if(this.sels.length > 0){
          this.sels.forEach(item =>{
            selsData.push({stoId:item.stoId});
          })
        }else{
            selsData = [];
        }
        var data = sels != '' ? selsData : [{stoId:row.stoId}];
        data.length < 1 ? vm.tips() : vm.doItem('您确定删除此盘盈盘亏表？','warehousestocktaking/deleteStoData',data,vm.getInventoryList);
      },
      changePageSize: function (val) {
        this.pageFilter.pageSize = val;
        this.pageFilter.currentPage = '1';
        this.getInventoryList();
      },
      changeCurrentPage: function (val) {
        this.pageFilter.currentPage = val;
        this.getInventoryList();
      },
      downDown:function(url){
        window.open(url);
      },
      exportData:function(row){
        var url = this.RmsUrl+'warehousestocktaking/excelExport?Authorization='+sessionStorage.getItem('userSession')+'&stoId='+row.stoId+'&type=0';  //  导出地址
          window.open(url);
      },
      submitUpload:function() {
        if(this.excList.length<1){
          this.$message('还未选择导入文件！');
        }if(this.excList.length>=2){
          this.$message('只能导入一个文件，请把其它文件移除！')
        } else{
          this.$refs.upload.submit();
        }
      },
      handExcChange(file,fileList){
        this.excList = fileList;
      },
      beforeCloseChange(val){
        this.excFile = [];
        this.dialogFlag.isOpenLead = false;
      },
      //      自定义上传
      uploadFile(options){
        let data = new FormData();
        data.append(options.filename, options.file);
        var url = 'warehousestocktaking/excelLeadingin';
        this.httpPost(url,data,'',99999999999).then(res => {
          if(res.data.result == true){
            this.$message(res.data.message);
            this.dialogFlag.isOpenLead = false;
            this.excFile=[];
            this.excList=[];
            this.getInventoryList();
          }else{
            this.$message(res.data.message);
            this.excFile=[];
            this.excList=[];
          }
        })
      },
    },
  }

</script>
<style scoped>
.align-right{
  text-align: right;
  color: #297dfa;
  cursor:pointer;
}
  .mb-20{
    margin-bottom:20px;
  }
</style>
