<template>
  <div id="outermost_wrap">
    <div id="sub_wrap">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap">
      <el-row class="marginBottom"  :gutter="10">
        <el-col :span="3">
          <el-select size="small" v-model="selectParams.optionTitle" filterable  @clear="clearValue('0')" @change="selectParams.optionValue = ''">
            <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6" class="optionValue">
          <el-input v-model="selectParams.optionValue" :placeholder="getPlaceholder" size="small"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="small" @click="selectFilter('0')">搜索</el-button>
        </el-col>
      </el-row>
      <el-row  id="filer" class="marginBottom">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <span class="span_label">销售状态</span>
            <el-radio-group v-model="pagefilters.salesStatus" size="small"   @change="requestemStart($event,status)" >
              <el-radio-button label="1"   v-if="ButtonInfo['正常销售']!='0'" >正常销售</el-radio-button>
              <el-radio-button label="2"   v-if="ButtonInfo['清货销售']!='0'" >清货销售</el-radio-button>
              <el-radio-button label="3"   v-if="ButtonInfo['暂停销售']!='0'" >暂停销售</el-radio-button>
              <el-radio-button label="4"   v-if="ButtonInfo['卖完不再销售']!='0'" >卖完不再销售</el-radio-button>
              <el-radio-button label="5"   v-if="ButtonInfo['侵权不再销售']!='0'" >侵权不再销售</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
       <el-row class="marginBottom"  v-if="ButtonInfo['筛选']!='0'"  >
         <el-button size="small"  type="primary" @click="screen.screenisOpen = true;screenData();" >筛选</el-button>
       </el-row>
      <el-table  id="item_list" class="publicCell"  border v-model="listData" tooltip-effect="dark" :data="listData" @selection-change="handleSelectionChange"   style="word-wrap:break-word;word-break:break-all;">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column  id="space" label="操作"  align="center" style="word-wrap:break-word;word-break:break-all;">
          <template scope="scope">
            <el-tooltip content="编辑"  effect="dark" placement="bottom"  v-if="ButtonInfo['编辑']!='0'" >
              <i  class="iconfontyyy" @click="dialogFlag.prlblemask=true; dialogFlag.addDialog  = false;getCreateIssues(scope.row,dialogFlag.inputDisabled = false);" content="Bottom center">&#xe6e5;</i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="SKU"    prop="skuNo" align="center"  sortable  ></el-table-column>
        <el-table-column label="图片" prop="imageUrl" align="center" sortable >
          <template scope="scope">
            <img  v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="scope.row.imageUrl" :data-src="scope.row.imageUrl">
          </template>
        </el-table-column>
        <el-table-column label="名称"  prop="cnName" align="center"  sortable ></el-table-column>
        <el-table-column label="EAN" prop="eanCode"  sortable align="center"></el-table-column>
        <el-table-column label="分类"  sortable align="center">
          <template scope="scope" >
            <span style="text-align: center" v-if="scope.row.oneCategoryName != null">{{scope.row.oneCategoryName}}<br></span>
            <span style="text-align: center" v-if="scope.row.twoCategoryName != null">{{scope.row.twoCategoryName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品开发"  align="center"  prop="developUser" sortable >
        </el-table-column>
        <el-table-column label="采购跟单"  align="center"  prop="purchaseUser" sortable ></el-table-column>
        <el-table-column label="状态" align="center"  prop="salesStatus"  sortable ></el-table-column>
        <el-table-column label="仓库与销售" align="center"   sortable >
          <template scope="scope">
            <span class="link-type" v-if="scope.row.warehouseName != null" >{{scope.row.warehouseName}}<br></span>
            <el-tooltip  content="更多"  effect="dark" placement="bottom">
              <i @click="houseAssigned(scope.row,'0');dialogFlag.houseisOpen = true;skuAssigned.inputDisabled = true;" class="el-icon-more"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.isOpen" :close-on-click-modal="false" @close="ResetFrom">
      <el-tabs v-model="dialogFlag.activeTab"  @tab-click="">
        <el-tab-pane label="基本信息"   name="0">
          <msg-dialog  ref="msgDialog"    :parentinfo-detail="dialogFlag.activeTab" :product-id="pagefilters.productId" :input-disabled="dialogFlag.inputDisabled" :docment-null="dialogFlag.docmentNull" v-on:parentmsgg = "parentMsg" ></msg-dialog>
        </el-tab-pane>
        <el-tab-pane label="采购信息"   name="2">
          <purchase-dialog ref="purchaseDialog"    :purchaseparentinfo-detail="dialogFlag.activeTab" :product-id="pagefilters.productId"   :input-disabled="dialogFlag.inputDisabled" v-on:parentmsggll="purparentmsgg"  :docment-null="dialogFlag.docmentNull"></purchase-dialog>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-col :span="9" style="color:red">切换并填写的时候，记得点击保存→→</el-col>
        <el-button @click="dialogFlag.isOpen = false;dialogFlag.activeTab='0';">关 闭</el-button>
        <el-button type="primary" @click="submitDialogForm" v-if="dialogFlag.inputDisabled == false" :loading="$store.state.loading">保 存</el-button>
      </div>
    </el-dialog>
    <!--SKU分配仓库及销售弹窗-->
    <el-dialog title="SKU分配仓库及销售" :visible.sync="dialogFlag.houseisOpen" size="tiny" @close="closeForm">
      <el-form v-if="skuAssigned.storehouse == true" v-model="skuAssigned" :label-width="financeFormLabelWidth" >
        <el-row v-for="(item,index) in skuAssigned.warehouseInfo" :key="item.refValue">
          <el-form-item :label="item.refValue" >
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="skuAssignedForm.warehouseIds" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="name in item.whList" :key="name.whId"  :label="name.whId" value="name.whId" :disabled="skuAssigned.inputDisabled">{{name.whName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-row>
      </el-form >
      <el-row v-if="skuAssigned.storehouse == false"  v-for="(item,index) in skuAssigned.listMap">
        <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.checkAll" @change="handleCheckAllChange(item)" :disabled="skuAssigned.inputDisabled" >{{item.deptName}}</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group   style="margin-left: 20px;" v-model="item.checkedUsers" @change="handlecheckedperNameChange(item)">
          <el-checkbox v-for="list in item.salesUserList" :label="list.userId" :disabled="skuAssigned.inputDisabled">{{list.userName}})</el-checkbox>
        </el-checkbox-group>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.houseisOpen = false">关 闭</el-button>
        <el-button type="primary" @click="skuAssigned.storehouse = true" v-if="skuAssigned.storehouse == false " >上一步</el-button>
        <el-button type="primary" @click="submitskuAssigned();skuAssigned.storehouse = true;"   v-if="skuAssigned.storehouse == false && skuAssigned.inputDisabled == false" >保  存</el-button>
        <el-button type="primary" @click="skuAssigned.storehouse = false" v-if="skuAssigned.storehouse == true">下一步</el-button>
      </div>
    </el-dialog>
    <!--筛选-->
    <screen-dialog :screendialog-flag="screen"  :recovery="false"  v-on:parent-screen="screenChange"></screen-dialog>
    <div id="page" class="block page">
      <el-pagination
        @size-change="handleSizeChange('0',$event)"
        @current-change="handleCurrentChange('0',$event)"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 30, 50,100]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalCount">
      </el-pagination>
    </div>
 </div>
</template>
<script>
  import { msgDialog,purchaseDialog,screenDialog} from 'views/product/import_modular';

	export default{
    components: {
      msgDialog,//基本信息
      purchaseDialog,//采购信息
      screenDialog//筛选
    },
		data(){
			return {

        screen:{
          screenisOpen:false,
          salesStatus:'1'
        },
        financeFormLabelWidth: '90px',
        //批量
        batchList:[],
        //仓库分配与销售弹窗
        skuAssigned:{
          warehouseInfo:[],
          listMap:[],
          inputDisabled:false,
          label:'',
          storehouse:true,//仓库与销售切换
          isIndeterminate: true,
          checkList:[],//仓库列表
        },
        skuAssignedForm:{
          productIds:[],
          warehouseIds:[],
          salesUserIds:[]
        },
        listData:[],
        //查看+编辑+添加
        dialogFlag: {
          isOpen: false,
          problemisOpen:false,
          assistisOpen:false,
          houseisOpen:false,
          classifyisOpen:false,
          screenisOpen:false,
          salesisOpen:false,
          infoDetail: false,
          docmentNull:false,//文档名
          prlblemLabel:'',
          prlblemask:false,
          dialogTitle: "",
          problemTitle:'',
          salesTitle:'',
          houseTitle:'',
          inputDisabled: false,  //区分编辑和查看
          addDialog: true,//区分产品和组合产品
          activeTab:'0'
        },
        activeNames: ['1'],    //  筛选 功能的折又又叠面板
        //搜索下拉值
        selectOptions: [{
          value: 'SKU',
          label: 'SKU'
        }, {
          value: '产品名称',
          label: '产品名称'
        }],
        optionVal:'',    // 下拉选项值
        selectParams:{    //  下拉过滤
          optionValue:'',
          optionTitle:'SKU',
        },
        //分页得到的数据集合
        page: {
          currentPage: 1, //当前页数
          pageSize: 10, //每页条数
          totalCount: 0, //总共条数
          totalPage: 0, //总共页数
          listData: []
        },
        //过滤返回数据
        pagefilters: {
          productId:'',
          currentPage: 1,
          pageSize: 10,
          skuNo: '',
          cnName:'',
          categoryId:'',
          developUserId:'',
          purchaseUserId:'',
          photographyUserId:'',
          imageDesignUserId:'',
          salesStatus:'1',
          warehouseId:'',
          salesUserId:'',
          logisticsState:'',
        },
        msgparentForm:{},
        purchaseparentForm:{},
        status:true,
        ButtonInfo:{},//按钮权限列表20171227
      }
		},
    computed:{
      getPlaceholder:function(){
        return this.selectParams.optionTitle == 'SKU' ? '请输入SKU' : this.selectParams.optionTitle == '产品名称' ? '请输入产品名称' :'' ;
      }
    },
    mounted: function () {
      this.getauthorityList();
      this.requestem();
    },
		methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      screenData(){
      	this.screen.salesStatus = this.pagefilters.salesStatus;

      },
      clearValue(val){
        val == '0' ? this.selectParams.optionTitle = 'SKU' : this.assistlist.selectParams.optionTitle = 'SKU'
      },
      //筛选
      screenChange(data){
      	console.log('data % 0====',data)
        this.screen.screenisOpen = data.dialog;
      	if(data.dialog == false){
          this.listData = data.list.listData;
          this.page = data.list;
          this.pagefilters.salesStatus = data.status.salesStatus;
          this.pagefilters.salesUserId = data.status.salesUserId;
          this.pagefilters.developUserId = data.status.developUserId;
          this.pagefilters.imageDesignUserId = data.status.imageDesignUserId;
          //this.pagefilters.logisticsState = data.status.logisticsState;
          this.pagefilters.photographyUserId = data.status.photographyUserId;
          this.pagefilters.purchaseUserId = data.status.purchaseUserId;
          this.pagefilters.skuNo = data.status.skuNo;
          this.pagefilters.cnName = data.status.cnName;
          this.pagefilters.categoryId = data.status.categoryId;
          this.pagefilters.cnName = data.status.cnName;
          this.pagefilters.warehouseId = data.status.warehouseId;
          this.status = true;
        }
      },
      ResetFrom(){
        this.$refs.msgDialog.ResetFrom();
        this.$refs.purchaseDialog.ResetFrom();
        this.dialogFlag.activeTab = '0';
      },
      parentMsg(data){
        this.msgparentForm = data.vendorInfoModel;
        console.log('第一个基本儿子给的 % O',data)
      },
      purparentmsgg(data){
        console.log('第三个 % 0',data)
        this.purchaseparentForm = data;
        //alert('data.success===='+data.success)
      },
      //编辑保存提交
      submitDialogForm(){
        if (this.dialogFlag.activeTab == 0) {
          var add = this.$refs.msgDialog.submitForm();
          var _this=this;
          if(add == true){
            _this.msgparentForm.productId = _this.pagefilters.productId;
            let msgparentForm = JSON.parse(JSON.stringify(_this.msgparentForm));
            delete msgparentForm.classifybuteTree;
            delete msgparentForm.attributeTree;
            console.log('msgparentForm % 0===',msgparentForm)
            this.httpPost('product/editBasicMessage',msgparentForm).then(res => {
              if(res.data.result == true){
                _this.dialogFlag.isOpen = false;
                _this.$message(res.data.message)
                _this.requestem();
              }else{
                _this.$message(res.data.message)
              }
            })
          }
        } else if (this.dialogFlag.activeTab == 2) {
          var add = this.$refs.purchaseDialog.submitForm();
          if(add == true){
            // this.requiredsubmit = true;
            //console.log('this.purchaseparentForm % 0',this.purchaseparentForm)
            //this.purchaseparentForm.productId = this.pagefilters.productId;
            this.httpPost('product/editPurchaseMessage',this.purchaseparentForm).then(res => {
              if(res.data.result == true){
                this.dialogFlag.isOpen = false;
                this.$message(res.data.message)
                this. requestem();
              }else{
                this.$message(res.data.message)
              }
            })
          }
        }
      },
      //批量
      handleSelectionChange(val){
        this.batchList = val;
      },
      handleCheckedCitiesChange(val){
        this.skuAssignedForm.warehouseIds = val;
      },
      //入口
      requestem(){
        this.httpPost('product/listProduct',this.pagefilters).then(res => {
          this.listData = res.data.listData;
          this.page = res.data;
          this.status=true;
        })
      },
      //查看与编辑
      getCreateIssues(row,val){
        this.dialogFlag.docmentNull = true;
        this.dialogFlag.dialogTitle = val ? '查看' : '编辑';
        this.dialogFlag.isOpen=true;
        this.pagefilters.productId = row.productId;
        setTimeout(()=>{
          this.$refs.msgDialog.requestem();
          this.$refs.purchaseDialog.requestem();
        },20)
        this.dialogFlag.activeTab = '0';
      },
      //用户列表状态切换
      requestemStart(value,status){
      	if(status === true){
          this.pagefilters.currentPage = 1;
          this.pagefilters.skuNo='';
          this.selectParams.optionValue='';
          this.pagefilters.cnName='';
          this.selectParams.optionValue='';
          this.pagefilters.developUserId ='' ;
          this.pagefilters.imageDesignUserId = '';
          this.pagefilters.photographyUserId = '';
          this.pagefilters.purchaseUserId = '';
          this.pagefilters.categoryId = '';
          this.pagefilters.warehouseId = '';
          this.pagefilters.salesUserId = '';
          this.requestem();
        }
      },
      //搜索确认
      selectFilter:function(val){
      	var _this=this;
        if(val == '0'){
        	this.status=false;
          if(_this.selectParams.optionValue === '' ){
            this.pagefilters.skuNo = '';
            this.pagefilters.cnName='';
            this.pagefilters.developUserId ='' ;
            this.pagefilters.imageDesignUserId = '';
            //this.pagefilters.logisticsState = '';
            this.pagefilters.photographyUserId = '';
            this.pagefilters.purchaseUserId = '';
            this.pagefilters.categoryId = '';
            this.pagefilters.warehouseId = '';
          }else {

            var value = _this.selectParams.optionValue;
            var title = _this.selectParams.optionTitle;
            if(value === '' || title === '' ){

            }else{
              if(title == 'SKU'){
                _this.pagefilters.skuNo=value;
                _this.pagefilters.cnName='';
                this.pagefilters.developUserId ='' ;
                this.pagefilters.imageDesignUserId = '';
                //this.pagefilters.logisticsState = '';
                this.pagefilters.photographyUserId = '';
                this.pagefilters.salesUserId = '';
                this.pagefilters.purchaseUserId = '';
                this.pagefilters.categoryId = '';
                this.pagefilters.warehouseId = '';
              }else if(title == '产品名称'){
                _this.pagefilters.cnName=value;
                _this.pagefilters.skuNo='';
                this.pagefilters.developUserId ='' ;
                this.pagefilters.salesUserId = '';
                this.pagefilters.imageDesignUserId = '';
                //this.pagefilters.logisticsState = '';
                this.pagefilters.photographyUserId = '';
                this.pagefilters.purchaseUserId = '';
                this.pagefilters.categoryId = '';
                this.pagefilters.warehouseId = '';
              }
              _this.pagefilters.salesStatus='';
              _this.requestem();
            }
          }
        }
      },
      //分配仓库与销售
      closeForm(){
        this.skuAssigned.storehouse = true;
        this.skuAssignedForm.productIds=[];
        this.skuAssignedForm.warehouseIds=[];
        this.skuAssignedForm.salesUserIds=[];
      },
      houseAssigned(row,val){
        var _this=this;
        var ids = _this.batchList.map(item => item.productId),productId=[];
        val == '1' ? productId = ids : productId.push(row.productId);
        _this.skuAssignedForm.productIds = productId;
        if(productId.length == 0){
          _this.$message('请至少选择一项！')
        }else{
          _this.dialogFlag.houseisOpen = true;
          if(val == '0'){
            let productId = row.productId
            //const getquerySales=_this.httpPost('product/querySales?productId='+productId);//勾选人员
            const getproductquerySignWarehouse=_this.httpPost('product/querySignWarehouse?productId='+productId);//勾选仓库
            _this.$http.all([getquerySales,getproductquerySignWarehouse]).then(this.$http.spread(function(salesInfo,SignWarehouse){
              for(let i=0;i<SignWarehouse.data.length;i++){
                _this.skuAssignedForm.warehouseIds.push(SignWarehouse.data[i].warehouseId)
              }
            }))
          }else{
            _this.skuAssignedForm.warehouseIds=[];
          }
          const getqueryDeptAndUser = this.httpPost('product/queryDeptAndUser');
          const getqueryWarehouseType = this.httpPost('product/queryWarehouseType');
          const getquerySales=_this.httpPost('product/querySales?productId='+productId);//勾选人员
          _this.$http.all([getqueryDeptAndUser,getqueryWarehouseType,getquerySales]).then(this.$http.spread(function(andUserfo,warehouseInfo,querySales){
              _this.skuAssigned.warehouseInfo = warehouseInfo.data;
              _this.skuAssigned.listMap = andUserfo.data;
              for(let i=0;i<_this.skuAssigned.listMap.length;i++){
                let item=_this.skuAssigned.listMap[i];
                _this.$set(item,"checkedUsers",[]);
                _this.getCurCheckedUsers(querySales.data,item);
                _this.$set(item,"checkAll",(_this.skuAssigned.listMap[i].checkedUsers.length>=_this.skuAssigned.listMap[i].salesUserList.length?true:false));
                _this.$set(item,"isIndeterminate",(_this.skuAssigned.listMap[i].checkedUsers.length>0&&_this.skuAssigned.listMap[i].checkedUsers.length<_this.skuAssigned.listMap[i].salesUserList.length?true:false));
              }
              for(let i=0;i<_this.skuAssigned.listMap.length;i++){
                _this.skuAssignedForm.salesUserIds=_this.skuAssigned.listMap[i].checkedUsers
              }
            })
          )
        }
      },
      getCurCheckedUsers(allCheckedUsers,item){
        var userIdList = item.salesUserList.map(a =>a.userId);
        var allList = allCheckedUsers.map(a =>a.salesUserId);
        for(let i=0;i<allList.length;i++){
          console.log('userIdList % 0==',userIdList)
          if(userIdList.indexOf(allList[i])!=-1){
            //alert(5555)
            item.checkedUsers.push(allList[i]);
          }
        }
        return item.checkedUsers;
      },
      senduserList(item,value,num){
        var _this=this;
        _this.skuAssignedForm.salesUserIds = [];
        let users=[];
        if(num == '0'){
          for(let i=0;i<item.salesUserList.length;i++){
            users[i]=item.salesUserList[i].userId;
          }
          item.checkedUsers=[];
          if(item.checkAll){
            item.checkedUsers=users;
          }
        }else if(num == '1'){
          for(let i=0;i<item.checkedUsers.length;i++){
            users[i]=item.checkedUsers[i];
          }
          if(item.checkedUsers.length==item.salesUserList.length){
            item.checkAll = true;
          }else{
            item.checkAll = false;
          }
        }
        let checkedUserList=[];
        for(let i=0;i<_this.skuAssigned.listMap.length;i++){
          if(_this.skuAssigned.listMap[i].checkedUsers!=""){
            checkedUserList.push(_this.skuAssigned.listMap[i].checkedUsers);
          }
        }
        _this.skuAssignedForm.salesUserIds = checkedUserList.join(',').split(',')
      },
      handleCheckAllChange(item,value) {
        this.senduserList(item,value,'0');
      },
      handlecheckedperNameChange(item,value) {
        this.senduserList(item,value,'1');
      },
      submitskuAssigned(){
        this.httpPost('/product/updateWarehouseSales',this.skuAssignedForm).then(res=>{
          if(res.data.result == true){
            this.dialogFlag.houseisOpen = false;
            this.$message(res.data.message)
          }else{
            this.$message(res.data.message)
          }
        })
      },
      //分页
      handleSizeChange(arr,val) {
        arr == '0' ? this.pagefilters.pageSize = val : this.assistlist.pagefilters.pageSize = val;
        if(arr == '0'){
          this.requestem();
        }else{
          this.getassdialog();
        }

      },
      handleCurrentChange(arr,val) {
        arr == '0' ? this.pagefilters.currentPage = val : this.assistlist.pagefilters.currentPage = val;
        if(arr == '0'){
          this.requestem();
        }else{
          this.getassdialog();
        }
      },
    }
	}

</script>

<style scoped>


</style>
