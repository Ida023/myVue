<template>
  <div id="outermost_wrap" class="role" style="">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="8" class="optionValue">
          <el-select v-model="pageFilter.whId" filterable clearable placeholder="请选择仓库" size="small" style="width:100%">
            <el-option v-for="(item,index) in warehouseList" :label="item.whName" :key="item.whId" :value="item.whId"></el-option>
          </el-select>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="getStockTalkList()">搜索</el-button>
        </el-col>
      </el-row>
      <el-row id="filer" class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <span class="span_label">状态</span>
            <el-radio-group v-model="pageFilter.stoStatus" size="small" @change="filterData">
              <el-radio-button  :label="item.value" v-for="(item,index) in statusOptions" :key="item.value"     v-if="ButtonInfo[item.label]!='0'">{{item.label}}</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn">
        <el-button  size="small"  v-if="ButtonInfo['按产品分类建立盘点单']!='0'" @click="dialogFlag.addDia = true;dialogFlag.dialogTitle = '按产品分类建立盘点单';type='01'">按产品分类建立盘点单</el-button>
        <el-button  size="small"  v-if="ButtonInfo['按货位号建立盘点单']!='0'"  @click="dialogFlag.addDia = true;dialogFlag.dialogTitle = '按货位号建立盘点单';type='02'">按货位号建立盘点单</el-button>
        <el-button  size="small"  v-if="ButtonInfo['按SKU号建立盘点单']!='0'"  @click="dialogFlag.addDia = true;dialogFlag.dialogTitle = '按SKU号建立盘点单';type='03'">按SKU号建立盘点单</el-button>
        <el-button  size="small"  v-if="ButtonInfo['按Excel建立盘点单']!='0'"  @click="dialogFlag.isOpenLead = true;type='04'">按Excel建立盘点单</el-button>
        <el-button  size="small"  v-if="ButtonInfo['盘点单筛选']!='0'"  @click="statusSelect=false;getUserList();dialogFlag.isOpen = true;">盘点单筛选</el-button>
      </el-row>
      <el-row class="supplier_btn last_btn">
        <el-button size="small" type="primary" @click="updStatus('','sels','02')" v-if="pageFilter.stoStatus == '01' && ButtonInfo['批量提交']!='0'">批量提交</el-button>
        <el-button size="small" type="primary" @click="updStatus('','sels','04')" v-if="pageFilter.stoStatus == '02' && ButtonInfo['批量同意']!='0'">批量同意</el-button>
        <el-button size="small" type="primary" @click="updStatus('','sels','03')" v-if="pageFilter.stoStatus == '02' && ButtonInfo['批量不同意']!='0'">批量不同意</el-button>
        <el-button size="small" type="primary" @click="updStatus('','sels','05')" v-if="pageFilter.stoStatus == '04' && ButtonInfo['批量开始']!='0'">批量开始</el-button>
        <el-button size="small" type="primary" @click="updStatus('','sels','06')" v-if="pageFilter.stoStatus == '05' && ButtonInfo['结束盘点']!='0'">结束盘点</el-button>
      </el-row>
      <el-table :data="stockTalkData" id="item_list" border tooltip-effect="dark" style="width: 100%" @selection-change="selsChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="label" label="操作" width="130px" align="center" >
          <template scope="scope" >
            <el-tooltip class="item" effect="dark" content="查看" placement="top-start"  v-if="ButtonInfo['查看']!='0'">
              <i class="iconfontyyy" @click="showInfoDialog(scope.row);dialogFlag.infoDetail=true;dialogFlag.dialogTitle='查看盘点单详情'">&#xe600;</i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-if="scope.row.stoStatus == '草稿' && ButtonInfo['编辑']!='0'" content="编辑" placement="top-start" >
              <i class="iconfontyyy" @click="showInfoDialog(scope.row);dialogFlag.infoDetail=true;dialogFlag.dialogTitle='编辑盘点单'">&#xe6e5;</i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="导出" placement="top-start"  v-if="ButtonInfo['导出']!='0' && ButtonInfo['导出']!='0'">
              <i class="iconfontyyy" @click="exportData(scope.row);">&#xe60a;</i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark"content="同意" placement="top-start"  v-if="ButtonInfo['同意']!='0'">
              <i class="iconfontyyy" v-if="scope.row.stoStatus == '草稿'"  @click="updStatus(scope.row,'','02')">&#xe67e;</i>
              <i class="iconfontyyy" v-if="scope.row.stoStatus == '待审核'"  @click="updStatus(scope.row,'','04')">&#xe67e;</i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-if="scope.row.stoStatus == '待审核' && ButtonInfo['不同意']!='0'" content="不同意" placement="top-start" >
              <i class="iconfontyyy" @click="updStatus(scope.row,'','03')">&#xe665;</i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-if="scope.row.stoStatus == '未开始' && ButtonInfo['开始盘点']!='0'" content="开始盘点" placement="top-start" >
              <i class="iconfontyyy" @click="updStatus(scope.row,'','05')">&#xe618;</i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-if="scope.row.stoStatus == '正在盘点' && ButtonInfo['结束盘点']!='0'" content="结束盘点" placement="top-start" >
              <i class="iconfontyyy" @click="updStatus(scope.row,'','06')">&#xe615;</i>
            <!--  <i class="iconfontyyy" @click="finshStock(scope.row,'06')">&#xe615;</i>-->
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-if="scope.row.stoStatus == '草稿' && ButtonInfo['删除']!='0'" content="删除" placement="top-start" >
              <i class="iconfontyyy" @click="deleteItem(scope.row);">&#xe6f7;</i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-if="scope.row.stoStatus == '已完成' && ButtonInfo['盘盈盘亏表']!='0'" content="盘盈盘亏表" placement="top-start" >
              <i class="iconfontyyy" @click="showInfoDialog(scope.row);dialogFlag.dialogTitle='盘盈盘亏表';dialogFlag.openStock = true">&#xe60b;</i>
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
        <el-table-column sortable align="center" prop="stoStartTime" label="盘点开始时间" width="180px" :formatter="tool.formatDate"></el-table-column>
        <el-table-column sortable align="center" prop="stoEndTime" label="盘点结束时间" width="180px" :formatter="tool.formatDate"></el-table-column>
        <el-table-column sortable align="center" prop="stoStatus" label="盘点单状态"></el-table-column>
      </el-table>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!--    建立盘点单等 多个弹窗--------------------------------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.addDia"  size="tiny" :close-on-click-modal="false" @close="categoryId=[];tool.clearObjValue(addForm);">
      <el-form :model="addForm">
        <el-form-item :labelWidth="labelWidth" label="盘点仓库" required>
          <el-select v-model="addForm.whId" filterable clearable placeholder="请选择仓库" style="width:100%">
            <el-option v-for="(item,index) in warehouseList" :label="item.whName" :key="item.whId" :value="item.whId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :labelWidth="labelWidth" label="选择产品目录" required v-if="type == '01'" >
          <category-list :disState="false" :Selected="categoryId" :skuno="false" @assignment="getCategoryId"></category-list>
        </el-form-item>
        <el-form-item :labelWidth="labelWidth" label="货位号" required v-if="type == '02'"><el-input placeholder="可以输多个库位号，请用逗号分开" type="text" v-model="addForm.whNumber" ></el-input></el-form-item>
        <el-form-item :labelWidth="labelWidth" label="SKU" required v-if="type == '03'"><el-input placeholder="可以输多个SKU，请用逗号分开" type="text" v-model="addForm.skuNo" ></el-input></el-form-item>
        <el-form-item :labelWidth="labelWidth" label="盘点描述" required><el-input type="textarea" v-model="addForm.stoDesc" ></el-input></el-form-item>.
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.addDia= false">取 消</el-button>
        <el-button type="primary" @click="nextStep();">下一步</el-button>
      </div>
    </el-dialog>
    <!---------------批量导入弹出框-------------------------->
    <el-dialog title="按Excel表录入盘点单" :visible.sync="dialogFlag.isOpenLead" size="tiny" :before-close="beforeCloseChange" :close-on-click-modal="false" >
      <el-upload class="upload-demo" :http-request="uploadFile" ref="upload" :auto-upload="false" :on-change="handExcChange":file-list="excFile" accept='.xls,.xlsx,.xlsm'>
        <span>选择需要导入的文件</span>
        <el-button size="small" type="primary">选择文件</el-button>
      </el-upload><br/>
      <span class="remark">请先下载Excel模板，录入相关数据之后再导入。</span><br/>
      <span class="modelDown" @click="downDownModel()">excel模板下载</span>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.isOpenLead = false;excFile=[]">取 消</el-button>
        <el-button type="primary" :loading="$store.state.loading" @click="submitUpload();">导 入</el-button>
      </div>
    </el-dialog>
    <!------------------查看 / 编辑弹出框--------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail" :close-on-click-modal="false" @open="activeTab='0'" @close="statusSelect=true;stockTakForm.list=[];">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="供应商" name='0'>
          <el-form :model="stockInfo" ref="stockInfo"  class="demo-ruleForm">
            <el-form-item label="盘点单号：" :label-width="labelWidth">{{stockInfo.stoNo}}</el-form-item>
            <el-form-item label="盘点仓库：" :label-width="labelWidth">{{stockInfo.whName}}</el-form-item>
            <el-form-item label="创建类型：" :label-width="labelWidth">{{stockInfo.stoValue}}</el-form-item>
            <el-form-item label="盘点SKU数量：" :label-width="labelWidth">{{stockInfo.proCount}}</el-form-item>
            <el-form-item label="盘点描述：" :label-width="labelWidth">
              <span v-if="dialogFlag.dialogTitle == '查看盘点单详情'">{{stockInfo.stoDesc}}</span>
              <el-input v-if="dialogFlag.dialogTitle == '编辑盘点单'" type="textarea" v-model="stockInfo.stoDesc"></el-input>
            </el-form-item>
            <el-form-item label="创建人：" :label-width="labelWidth">{{stockInfo.addName}}</el-form-item>
            <el-form-item label="创建时间：" :label-width="labelWidth">{{tool.formatDate('','',stockInfo.addTime)}}</el-form-item>
            <el-form-item label="修改时间：" :label-width="labelWidth">{{tool.formatDate('','',stockInfo.updTime)}}</el-form-item>
            <div v-if="stoStatus != '草稿' &&  stoStatus != '待审核'" v-show="dialogFlag.dialogTitle == '查看盘点单详情'">
              <el-form-item label="审核人：" :label-width="labelWidth">{{stockInfo.appUser}}</el-form-item>
              <el-form-item label="审核结果：" :label-width="labelWidth">{{stockInfo.appResult}}</el-form-item>
              <el-form-item label="审核时间：" :label-width="labelWidth">{{tool.formatDate('','',stockInfo.appTime)}}</el-form-item>
            </div>
            <div v-if="stoStatus == '已完成'">
              <el-form-item label="盘点人：" :label-width="labelWidth">{{stockInfo.stoName}}</el-form-item>
              <el-form-item label="盘点开始时间：" :label-width="labelWidth">{{tool.formatDate('','',stockInfo.stoStartTime)}}</el-form-item>
              <el-form-item label="盘点结束时间：" :label-width="labelWidth">{{tool.formatDate('','',stockInfo.stoEndTime)}}</el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="产品" name='1'>
          <div class="align-right mb-20" v-if="dialogFlag.dialogTitle == '编辑盘点单'" @click="dialogFlag.openAddPro = true">添加物品</div>
          <stock-table :table-data="stockTakForm.list" :btn-column="dialogFlag.dialogTitle == '查看盘点单详情'? false:true" :is-disable="true"></stock-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.infoDetail = false;">{{dialogFlag.dialogTitle == '查看盘点单详情'? '关闭' :'取消'}}</el-button>
        <el-button :loading="$store.state.loading" type="primary" v-if="dialogFlag.dialogTitle == '编辑盘点单'"  @click="updateInfo();">保 存</el-button>
      </div>
    </el-dialog>
    <!--筛选------------------------------------------------------------------------------>
    <div class="smallDia">
      <el-dialog title="筛选" :visible.sync="dialogFlag.isOpen" size="small" :close-on-click-modal="false" @open="stoStatus = pageFilter.stoStatus;" >
        <div class="data_body">
          <title-header></title-header>
          <text-input :select-value="pageFilter.stoId" condition-name="盘点单号" text-type="盘点单号" place-value="请输入盘点单号" @child-change-val="getTextInput"></text-input>
          <time-data :start-time="pageFilter.addStartTime" condition-name="创建日期" :end-time="pageFilter.addEndTime" @child-value-Stime="getTime" @child-value-Etime="getTime"></time-data>
          <time-data :start-time="pageFilter.stoStaStartTime" condition-name="盘点开始日期" :end-time="pageFilter.stoStaEndTime" @child-value-Stime="getTime" @child-value-Etime="getTime"></time-data>
          <time-data :start-time="pageFilter.stoEndStartTime" condition-name="盘点结束日期"  :end-time="pageFilter.stoEmdEndTime" @child-value-Stime="getTime" @child-value-Etime="getTime"></time-data>
          <text-input :select-value="pageFilter.cnName"  condition-name="货品" text-type="货品" place-value="请输入货品" @child-change-val="getTextInput"></text-input>
          <select-input :select-value="stoStatus" condition-name="盘点状态" :options-data="statusOptions" @child-change-val="getSelectInput"></select-input>
          <select-input :select-value="pageFilter.userId" condition-name="盘点人" :options-data="userOptions" @child-change-val="getSelectInput"></select-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">清除条件</el-button>
          <el-button @click="pageFilter.stoStatus = stoStatus;getStockTalkList();">筛 选</el-button>
          <el-button @click="dialogFlag.isOpen = false;">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <!--查看 盘盈盘亏表 及 操作盘点明细,完成盘点等操作------------------------------------------------------------------------------>
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.openStock" size="small"  :close-on-click-modal="false" @close="stockTakForm={list:[]}">
      <el-row style="margin-bottom: 20px;" v-if="dialogFlag.dialogTitle == '盘点明细'">
        <el-col :span="12"  style="text-align: left;">盘点产品明细</el-col>
        <el-col :span="12"  style="text-align: right;color: #297dfa;cursor:pointer;" ><span @click="dialogFlag.openAddPro = true">添加物品</span></el-col>
      </el-row>
      <stock-table :table-data="stockTakForm.list" :btn-column="(dialogFlag.dialogTitle == '编辑盘点单' || dialogFlag.dialogTitle == '盘点明细')? true:false" :is-disable="dialogFlag.dialogTitle == '完成盘点'?false:true"></stock-table>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="dialogFlag.openStock = false;dialogFlag.addDia= false">{{dialogFlag.dialogTitle != '盘盈盘亏表'? '取消':'关闭'}}</el-button>
        <el-button type="primary" @click="submitPro();" v-if="dialogFlag.dialogTitle == '盘点明细'" :loading="$store.state.loading">确 定</el-button>
        <el-button type="primary" @click="updateInventory();" v-if="dialogFlag.dialogTitle == '完成盘点'" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <!--添加商品弹出框---------------------------------->
    <el-dialog title="添加货品" :visible.sync="dialogFlag.openAddPro" :close-on-click-modal="false" @close="reFlash();" size="small" id="add_product_wrap" class="add_product_wrap">
      <add-pro :defalt-key="[]" ref="proData"></add-pro>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.openAddPro = false">取消</el-button>
        <el-button type="primary" @click="addPro();" :loading="$store.state.loading">确 定</el-button>
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
        statusOptions:[{value:'01',label:'草稿'},{value:'02',label:'待审核'},{value:'03',label:'已审核（不通过）'},{value:'04',label:'未开始'},{value:'05',label:'正在盘点'},{value:'06',label:'已完成'}],
        stockTakForm:{list:[]},  // 查看编辑list
        stockInfo:{},  // 查看编辑form
        activeTab:'0',
        activeNames: ['1'],
        stockTalkData: [],
        addForm:{
          whId:'',
          categoryId:'',
          whNumber:'',
          skuNo:'',
          stoDesc:'',
          addForm:'',
        },
        pageFilter: {
          currentPage: 1,
          pageSize: 10,
          stoStatus:'01',
          whId:'',
          stoId:'',
          addStartTime:'',
          addEndTime:'',
          stoStaStartTime:'',
          stoStaEndTime:'',
          stoEndStartTime:'',
          stoEmdEndTime:'',
          cnName:'',
          userId:'',
        },
        page: {          // 分页参数
          currentPage: 1,
          pageSize: 10,
          totalCount: 10,
          totalPage: 10
        },
        dialogFlag: {
          openAddPro: false,
          isOpen: false,
          openStock: false,
          infoDetail: false,
          remarkOpen: false,
          addDia: false,
          isOpenLead: false,
          dialogTitle: "",
          inputDisabled: false,
        },
        labelWidth:'120px',
        excList:'',  //  已选择导入的文件
        excFile:[],
        warehouseList:[],
        userOptions:[],
        sels:[],
        stoId:'', // 单行id
        stoStatus:'',   // 单行状态
        whId:'',   // 单行whid
        categoryId:'',   // categoryId
        type:'',   // 区分盘盈盘亏：0 和库存盘点 ：1
        statusSelect:true,
        stoStatus:'',   // 筛选中的盘点状态
        ButtonInfo:{},//按钮权限列表20171227
      }
    },
    mounted () {
      this.getauthorityList();
      this.getStockTalkList();
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
      filterData:function(val){
        if(val != '' && this.statusSelect == true){
          this.getStockTalkList();
        }
      },
      reFlash:function(){
        this.$refs.proData.resetData();
        this.$refs.proData.clearSels();
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      addPro: function () {
        var vm = this;
        console.log(this.$refs.proData.returnData());
        var selectData = JSON.parse(JSON.stringify(this.$refs.proData.returnData()));
        var idList = this.stockTakForm.list.map(item =>item.productId);
        var flag = selectData.every(function(item){
          return idList.indexOf(item.productId) == -1;
        })
        if(flag){
          selectData.forEach(item =>{
            vm.stockTakForm.list.unshift(item);
          })
          this.dialogFlag.openAddPro = false;
        }else{
          this.$message('不能选择已经添加的商品！');
        }
      },
      getWarehouseList:function(){
        this.httpPost('warehouseadjustment/selectWh').then(res =>{
          if(res.data.result == true){
            this.warehouseList = res.data.params.list;
          }
        })
      },
      getUserList:function(){
        this.httpPost('warehousestocktaking/selectStoUser').then(res =>{
          if(res.data.result == true){
            this.userOptions = this.tool.replaceObjKey(res.data.params.list,'userId','user');
          }
        })
      },
      getStockTalkList:function(){
        this.dialogFlag.isOpen = false;
        this.httpPost('warehousestocktaking/selectStoList', this.pageFilter).then(res => {
          if (res.data.result == true) {
            const pageData = res.data.params.list;
            this.page = pageData;
            this.stockTalkData = pageData.listData;
          } else {
            this.stockTalkData = [];
          }
        })
      },
      nextStep:function(){
        if(this.addForm.stoDesc == '' || this.addForm.whId == ''){
          this.$message("盘点仓库和盘点备注不能为空！");
        }else{
          if(this.type == '01' && (this.addForm.categoryId == '' || this.addForm.categoryId == undefined)){
            this.$message("产品分类不能为空！");
          }else if(this.type == '02' && this.addForm.whNumber == ''){
            this.$message("库位号不能为空！");
          }else if(this.type == '03' && this.addForm.skuNo == ''){
            this.$message("sku不能为空! ");
          }else{
            this.addForm.type = this.type;
            this.httpPost('warehousestocktaking/selectAddStoPurList',this.addForm).then(res =>{
              if(res.data.result == true){
                this.dialogFlag.openStock=true;
                this.stockTakForm.list = res.data.params.list;
                this.dialogFlag.dialogTitle='盘点明细';
              }else{
                this.$message(res.data.message);
              }
            })
          }
        }
      },
      submitPro:function(){
        if(this.stockTakForm.list.length<1){
          this.$message('请添加产品！');
        }else{
          var params = {
              desc:this.addForm.stoDesc,
              whId:this.addForm.whId,
              type:this.type,
              list:this.stockTakForm.list,
          }
          var whIdList = params.list.map(item =>item.whId);
          var whIdFlag = whIdList.every(function(item){
            return item == params.whId;
          })
          if(whIdFlag == true){
            this.httpPost('warehousestocktaking/addStoInfo',params).then(res =>{
              if(res.data.result == true){
                this.$message(res.data.message);
                this.dialogFlag.openStock = false;
                this.dialogFlag.addDia = false;
                this.getStockTalkList();
              }else{
                this.$message(res.data.message);
              }
            })
          }else{
            this.$message('所选商品的仓库与当前盘点仓库不相同！');
          }
        }
      },
      showInfoDialog:function(row){
        this.stoId = row.stoId;
        this.stoStatus = row.stoStatus;
        this.whId = row.whId;
        this.httpPost('warehousestocktaking/selectStoData',{stoId:row.stoId}).then(res =>{
          if(res.data.result == true){
            this.stockTakForm = res.data.params;
            this.stockInfo = res.data.params.data;
          }else{
            this.$message(res.data.message)
          }
        })
      },
      updStatus: function (row,sels,status) {
        var batchData = []; //  批量 开始/结束 除结束盘点单传参
        var singleData = []; //  单个 开始/结束 除结束盘点单传参
        var vm = this;
        var msg = '';
        var batchInvData = []; // 批量 结束盘点后查询盘盈数据
        var singleInvData = [];// 单个 结束盘点后查询盘盈数据
        msg = status == '02' ? '您确定提交此盘点单？' : status == '04' ? '您确定同意此盘点单？' : status == '03' ?'您确定不同意此盘点单？': status == '05' ?'您确定开始此盘点单？':'您确定结束此盘点单？';
        if (sels != '') {
          if(this.sels.length > 0){
            this.sels.forEach(function (item) {
              batchData.unshift({stoId: item.stoId, status: status,type:'1'});
              batchInvData.push({stoId:item.stoId});
            })
          }else{
            batchData = [];
            batchInvData = [];
          }
        } else {
          singleData = [{stoId: row.stoId, status: status,type:'1'}];
          singleInvData = [{stoId: row.stoId}];
        }
        var data = sels != '' ? batchData : singleData;
        var invData = sels != '' ? batchInvData : singleInvData;
        if(status == '06'){
          this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            if(data.length < 1) {
              vm.tips();
            }else{
              vm.httpPost('warehousestocktaking/updateStatus',data).then(res =>{
                if(res.data.result == true){
                  var paramsList = [{stoId:row.stoId}];
                  this.httpPost('warehousestocktaking/selectStocktakingItemData',invData).then(res =>{
                    if(res.data.result == true){
                      this.stockTakForm = res.data.params;
                      vm.dialogFlag.dialogTitle='完成盘点';
                      vm.dialogFlag.openStock = true;
                    }else{
                      this.$message(res.data.message)
                    }
                  })

                }else{
                  vm.$message(res.data.message);
                }
              })
            }
          }).catch(() => {});
        }else{
          data.length < 1 ? vm.tips() : vm.doItem(msg, 'warehousestocktaking/updateStatus', data, vm.getStockTalkList);
        }
      },
      updateInventory:function(){  // 结束盘点单后进行盘盈亏
        var flag=this.stockTakForm.list.every(function(item){
          return item.newInvQty !='';
        })
        if(flag){
          this.httpPost('warehousestocktaking/updateStoData',this.stockTakForm.list).then(res =>{
            this.$message(res.data.message);
            if(res.data.result == true){
              this.dialogFlag.openStock = false;
              this.getStockTalkList();
            }
          })
        }else{
          this.$message('盘点库存不能为空！');
        }
      },
      updateInfo:function(){
        if(this.stockInfo.stoDesc == '') {
          this.$message('盘点描述不能为空！');
        }else if(this.stockTakForm.list.length<1) {
          this.$message('至少保留一件产品！');
        }else{
          var params = {
              stoId:this.stoId,
              desc:this.stockInfo.stoDesc,
              whId:this.whId,
              list:this.stockTakForm.list,
          }
          var whIdList = params.list.map(item =>item.whId);
          var whIdFlag = whIdList.every(function(item){
            return item == params.whId;
          })
          if(whIdFlag == true){
            this.httpPost('warehousestocktaking/updateStoDescData',params).then(res =>{
              this.$message(res.data.message);
              if(res.data.result == true){
                this.dialogFlag.infoDetail = false;
                this.getStockTalkList();
              }
            })
          }else{
            this.$message('所选商品的仓库与当前盘点仓库不相同！');
          }
        }
      },
      deleteItem: function (row) {
        var params = [{stoId:row.stoId}];
        this.doItem('您确定删除此盘点单？','warehousestocktaking/deleteStoData',params,this.getStockTalkList);
      },
      exportData:function(row){
        var url = this.RmsUrl+'warehousestocktaking/excelExport?Authorization='+sessionStorage.getItem('userSession')+'&stoId='+row.stoId+'&type=1';  //  导出地址
        window.open(url);
      },
      downDownModel:function(){
        var url = this.RmsUrl+'warehousestocktaking/excelExportModel?Authorization='+sessionStorage.getItem('userSession');  //  导入模板地址
        window.open(url);
      },
      changePageSize: function (val) {
        this.pageFilter.pageSize = val;
        this.pageFilter.currentPage = '1';
        this.getStockTalkList();
      },
      changeCurrentPage: function (val) {
        this.pageFilter.currentPage = val;
        this.getStockTalkList();
      },
      getTextInput:function(val){
        val.type === '盘点单号'? this.pageFilter.stoId = val.value : this.pageFilter.cnName = val.value;
      },
      getSelectInput:function(val){
        val.type === '盘点人'? this.pageFilter.userId = val.value : this.stoStatus = val.value;
      },
      getTime:function(val){
        if(val.titleName == '创建日期'){
          val.type == 'start' ? this.pageFilter.addStartTime = val.value :  this.pageFilter.addEndTime = val.value
        }else if(val.titleName == '盘点开始日期'){
          val.type == 'start' ? this.pageFilter.stoStaStartTime = val.value :  this.pageFilter.stoStaEndTime = val.value
        }else if(val.titleName == '盘点结束日期'){
          val.type == 'start' ? this.pageFilter.stoEndStartTime = val.value :  this.pageFilter.stoEmdEndTime = val.value
        }
      },
      getCategoryId:function(val){
        this.addForm.categoryId = val.lastValue;
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
        var url = 'warehousestocktaking/excelLeadinginSto';
        this.httpPost(url,data,'',99999999999).then(res => {
          this.$message(res.data.message);
          if(res.data.result == true){
            this.dialogFlag.isOpenLead = false;
            this.excFile=[];
            this.excList=[];
            this.getInventoryList();
          }else{
            this.excFile=[];
            this.excList=[];
          }
        })
      },
      closeDialog:function(){
        this.pageFilter.addStartTime = '';
        this.pageFilter.addEndTime = '';
        this.pageFilter.stoEndStartTime = '';
        this.pageFilter.stoEmdEndTime = '';
        this.pageFilter.stoStaStartTime = '';
        this.pageFilter.stoStaEndTime = '';
        this.pageFilter.stoStatus = '';
        this.pageFilter.userId = '';
        this.pageFilter.stoId = '';
        this.pageFilter.cnName = '';
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
