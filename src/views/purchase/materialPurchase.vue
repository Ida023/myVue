<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="8" class="optionValue">
          <el-input type="text" v-model="pageFilter.poNo" size="small" placeholder="请输入物料采购编号"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="small" @click="getMaterialPList();">搜索</el-button>
        </el-col>
      </el-row>
      <el-row id="filer" class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <div>
              <div class="updType">
                <span class="span_label">审核状态</span>
                <el-radio-group v-model="pageFilter.poState" @change="filterStateData" size="small">
                  <el-radio-button v-for="item in poStateOptions" :key="item.value" :label="item.value"  v-if="ButtonInfo[item.label]!='0'">{{item.label}}</el-radio-button>
                </el-radio-group>
              </div>
              <div class="updSea">
                <span class="span_label">付款状态</span>
                <el-radio-group v-model="pageFilter.paymentState" @change="filterStateData" size="small">
                  <el-radio-button v-for="item in paymentStateOptions" :key="item.value" :label="item.value" v-if="ButtonInfo[item.label]!='0'">{{item.label}}</el-radio-button>
                </el-radio-group>
              </div>
              <div class="updSea">
                <span class="span_label">到货状态</span>
                <el-radio-group v-model="pageFilter.whState" @change="filterStateData" size="small">
                  <el-radio-button v-for="item in whStateOptions" :key="item.value" :label="item.value" v-if="ButtonInfo[item.label]!='0'">{{item.label}}</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn">
        <el-button type="primary" size="small"  v-if="ButtonInfo['筛选']!='0'"  @click="isGroup=false;whState=pageFilter.whState;poState=pageFilter.poState;paymentState=pageFilter.paymentState;dialogFlag.isOpen=true;">筛选</el-button>
      </el-row>
      <el-row class="supplier_btn last_btn" v-if="pageFilter.poState == '01' || pageFilter.poState == '02' || pageFilter.poState == '04' || pageFilter.paymentState == '01'">
        <el-button type="primary" size="small"  @click="updMaterialStatus('','tijiao',sels)" v-if="pageFilter.poState == '01'">批量提交</el-button>
        <el-button type="primary" size="small"  @click="updMaterialStatus('','tongguo',sels)" v-if="pageFilter.poState == '02'">批量同意</el-button>
        <el-button type="primary" size="small"  @click="updMaterialStatus('','butongguo',sels)" v-if="pageFilter.poState == '02'">批量不同意</el-button>
        <el-button type="primary" size="small"  @click="updMaterialStatus('','fukuan',sels)" v-if="pageFilter.poState == '04' || pageFilter.paymentState == '01'">批量申请付款</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="materialPListData" border tooltip-effect="dark" style="width: 100%"   @selection-change="selsChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="操作" align="center" >
            <template scope="scope" width="100px">
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start" v-if="scope.row.poState != '01'">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row,dialogFlag.inputDisabled=true);dialogFlag.dialogTitle='查看物料采购';" >&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start" v-if="scope.row.poState == '01'">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row,dialogFlag.inputDisabled=false);dialogFlag.dialogTitle='编辑物料采购';" >&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="审核通过" placement="top-start" v-if="scope.row.poState == '02' || scope.row.poState == '01'">
                <i class="iconfontyyy" @click="updMaterialStatus(scope.row,'tongguo','')">&#xe67e;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="审核不通过" placement="top-start" v-if="scope.row.poState == '02'">
                <i class="iconfontyyy" @click="updMaterialStatus(scope.row,'butongguo','')">&#xe665;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="付款" placement="top-start" v-if="scope.row.paymentState == '01'">
                <i class="iconfontyyy" @click="updMaterialStatus(scope.row,'fukuan','')">&#xe757;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="poNo" label="物料采购单编号" align="center"></el-table-column>
          <el-table-column sortable prop="use" label="用途" align="center"></el-table-column>
          <el-table-column sortable prop="qty" label="种数"  align="center"></el-table-column>
          <el-table-column sortable prop="totalQty" label="数量" align="center"></el-table-column>
          <el-table-column sortable prop="wareHouse" label="申请仓库"  align="center"></el-table-column>
          <el-table-column sortable prop="totalAmount" label="费用"   align="center"></el-table-column>
          <el-table-column sortable prop="poUser" label="申请人"   align="center"></el-table-column>
          <el-table-column sortable prop="poTime" label="申请时间" :formatter="tool.formatDate" width="180px" align="center"></el-table-column>
          <el-table-column sortable prop="notes" label="备注" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!------------------查看/ 编辑 物料采购 弹出框--------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail" :close-on-click-modal="false" @close="totalItem = [];">
      <section class="infoData">
        <div class="info_tit" style="margin-bottom: 20px;">
          <span class="title">申请信息</span>
        </div>
        <el-form :model="materialPurchase" ref="materialPurchase"  class="formData applicationData" >
          <el-form-item  label="申请仓库：" prop="whId" :label-width="financeFormLabelWidth" required>{{materialPurchase.whName}}</el-form-item>
          <el-form-item  label="申请人：" prop="poUser" :label-width="financeFormLabelWidth" required>{{materialPurchase.poUser}}</el-form-item>
          <el-form-item  label="申请时间：" prop="poTime" :label-width="financeFormLabelWidth" required>{{materialPurchase.poTime}}</el-form-item>
        </el-form>
      </section>
      <section class="infoData" id="infoData">
        <el-form :model="materialPurchase" ref="materialPurchase" class="formData" >
          <el-form-item  label="申请用途：" prop="use"  required :rules="{required:true,message:'不能为空',trigger:'blur'}">
            <el-input type="textarea" placeholder="请输入申请用途" disabled v-model="materialPurchase.use"></el-input>
          </el-form-item>
          <el-form-item  label="申请备注：" prop="notes" required :rules="{required:true,message:'不能为空',trigger:'blur'}">
            <el-input type="textarea" placeholder="请输入申请备注" disabled  v-model="materialPurchase.notes"></el-input>
          </el-form-item>
          <el-form-item  label="产品信息：" required :rules="{required:true,message:'不能为空',trigger:'blur'}">
            <div class="table_padding">
              <el-table :data="materialPurchase.proMaterials" border tooltip-effect="dark" style="width: 100%">
                <el-table-column sortable label="物品名称" prop="materialName" align="center" class="textarea" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column sortable  label="物品个数" prop="qty" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column sortable label="单位"  prop="unit" align="center"></el-table-column>
                <el-table-column sortable label="采购连接" align="center" prop="itemUrl" class="textarea" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column sortable label="备注" align="center" prop="memo" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column sortable label="单价" align="center" :show-overflow-tooltip="true">
                  <template scope="scope">
                    <div v-if="dialogFlag.inputDisabled == false">
                      <el-input type="number" v-model="scope.row.price" @change="getItemTotal(scope.row,scope.$index)"></el-input>
                    </div>
                    <span v-if="dialogFlag.inputDisabled == true">{{scope.row.price}}</span>
                  </template>
                </el-table-column>
                <el-table-column sortable label="小计" align="center" :show-overflow-tooltip="true">
                  <template scope="scope">
                    <div v-if="dialogFlag.inputDisabled == false">
                      <el-input type="number" v-model="totalItem[scope.$index]"></el-input>
                    </div>
                    <span v-if="dialogFlag.inputDisabled == true">{{totalItem[scope.$index]}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div style="text-align: right;margin-bottom: -20px;" v-if="dialogFlag.inputDisabled == true">产品总价：<span>{{materialPurchase.totalAmount}}</span></div>
          </el-form-item>
          <el-form-item  label="产品总价：" prop="totalAmount"  required v-if="dialogFlag.inputDisabled == false">{{'¥'+materialPurchase.totalAmount}}</el-form-item>
          <el-form-item  label="付款状态：" prop="state"  required :rules="{required:true,message:'不能为空',trigger:'change'}" v-if="dialogFlag.inputDisabled == true">{{materialPurchase.state}}</el-form-item>
          <el-form-item  label="交货仓库：" prop="whId"  required :rules="{required:true,message:'不能为空',trigger:'change'}">
            <warehouse-select :select-value="materialPurchase.whId" select-type="editWarehouse" place-value="请选择仓库"  :is-disabled="dialogFlag.inputDisabled" @child-change-Val="getState"></warehouse-select>
          </el-form-item>
        </el-form>
      </section>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.infoDetail = false;">取消</el-button>
        <el-button type="primary" @click="updMaterialItem('materialPurchase','03');" v-if="dialogFlag.inputDisabled == false">保 存</el-button>
        <el-button type="primary" @click="updMaterialItem('materialPurchase','04');" v-if="dialogFlag.inputDisabled == false">提交审核</el-button>
      </div>
    </el-dialog>
    <!--筛选弹出框-&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
    <div class="smallDia">
      <el-dialog title="筛选" :visible.sync="dialogFlag.isOpen" size="small" :close-on-click-modal="false" @open="closeFilterDialog" @click="isGroup=true;">
        <div class="data_body">
          <el-row class="row_title row" :getter="20">
            <el-col class="col" :span="4">条件</el-col>
            <el-col class="col" :span="4">比较方式</el-col>
            <el-col class="col" :span="16">输入</el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">申请仓库</el-col>
            <el-col class="col" :span="4">是</el-col>
            <el-col class="col_input" :span="16"><warehouse-select :select-value="whId" place-value="请选择仓库"  select-type="FilterWarehouse" @child-change-Val="getState"></warehouse-select></el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">申请人</el-col>
            <el-col class="col" :span="4">是</el-col>
            <el-col class="col_input" :span="16"><selector-options :select-value="pageFilter.poUser" select-type="user" :options-data="userOptions"  @child-change-Val="getState"></selector-options>
            </el-col>
          </el-row>
          <time-data condition-name="申请日期" :start-time="pageFilter.poTime1" :end-time="pageFilter.poTime2" @child-value-Stime="getTime" @child-value-Etime="getTime"></time-data>
          <el-row class="row">
            <el-col class="col" :span="4">审核状态</el-col>
            <el-col class="col" :span="4">是</el-col>
            <el-col class="col_input" :span="16"><selector-options :select-value="poState" :options-data="poStateOptions" place-value="请选择" select-type="poState" @child-change-Val="getState"></selector-options></el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">付款状态</el-col>
            <el-col class="col" :span="4">是</el-col>
            <el-col class="col_input" :span="16"><selector-options :select-value="paymentState" :options-data="paymentStateOptions" place-value="请选择" select-type="paymentState" @child-change-Val="getState"></selector-options></el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">到货状态</el-col>
            <el-col class="col" :span="4">是</el-col>
            <el-col class="col_input" :span="16"><selector-options :select-value="whState" :options-data="whStateOptions" place-value="请选择" select-type="whState" @child-change-Val="getState"></selector-options></el-col>
          </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="whState='';poState='';paymentState='';closeFilterDialog();">清除条件</el-button>
          <el-button @click="pageFilter.whState=whState;pageFilter.poState=poState;pageFilter.paymentState=paymentState;getMaterialPList()">筛 选</el-button>
          <el-button @click="dialogFlag.isOpen = false;">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import timeData from '../../components/ScreenModular/timeDate.vue'
  import warehouseSelect from '../../components/listData/getWarehouseList.vue'
  export default{
    components:{timeData,warehouseSelect},
    data(){
      return {
        poStateOptions: [{value: '', label: '全部'},{value: '01', label: '待采购'},{value: '02', label: '待审核'},{value: '03', label: '审核不通过'},{value: '04', label: '审核通过'}],
        paymentStateOptions: [{value: '', label: '全部'},{value: '01', label: '待申请付款'},{value: '02', label: '已申请待审批'},{value: '03', label: '审批不通过'},{value: '04', label: '审批通过未登记'},{value: '05', label: '已完成'},],
        whStateOptions: [{value: '', label: '全部'},{value: '05', label: '未到货'},{value: '06', label: '已签收'}],
        userOptions:[],
        activeNames:['1'],
        materialPurchase:{
          whId:'',
          whName:'',
          notes:'',
          use:'',
          state:'',
          poId:'',
          poTime:'',
          poUser:'',
          totalAmount:'',
          proMaterials:[{
            itemId:'',
            materialName:'',
            qty:'',
            unit:'',
            itemUrl:'',
            memo:'',
          }]
        },
        poState:'',
        paymentState:'',
        whState:'',
        options:[],
        materialPListData:[],
        pageFilter:{
          currentPage:1,
          pageSize:10,
          poState:'',
          paymentState:'',
          whState:'',
          whId:[],
          poNo:'',
          poUser:'',
          poTime1:'',
          poTime2:'',
        },
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalCount:10,
          totalPage:10
        },
        dialogFlag:{
          isOpen:false,     // 批量及单个删除框
          infoDetail:false,    //  添加 编辑  查看框
          dialogTitle:"",     // 弹出框 的title
          inputDisabled:false,   //checkbox是否处理可点击状态
        },
        financeFormLabelWidth:'100px',
        sels:[],
        poState:'',
        paymentState:'',
        whState:'',
        whId:'',
        isGroup:true,
        totalItem:[],
        ButtonInfo:{},//按钮权限列表20171227
      }
    },
    mounted () {
      this.getauthorityList();
        this.getMaterialPList();
        this.getUserList();
    },
    methods: {

      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      selsChange: function (sels) {
        this.sels = sels.map(item =>item.poId);
      },
      getUserList:function(){
          this.httpGet('productUserGroup/getCompUserInfo').then(res =>{
              this.userOptions = this.tool.replaceObjKey(res.data,'userId','userName');
          })
      },
      getMaterialPList:function(){
        this.httpPost('purchaseMaterialInfo/getAllMarterialInfo',this.pageFilter).then(res => {
            const pageData = res.data;
            this.page = pageData;
            this.materialPListData = pageData.listData;
            this.dialogFlag.isOpen = false;
        })
      },
      filterStateData:function(val,type){
          if(this.isGroup == true){
              this.getMaterialPList();
          }
      },
      showInfoDialog(row,val){
        var vm = this;
        this.httpGet('productMaterial/getMaterial?poId='+row.poId).then(res =>{
          this.materialPurchase = res.data;
          this.materialPurchase.poTime = this.tool.dateFormatter('','',res.data.poTime);
          this.materialPurchase.proMaterials.forEach(function(item,index){
              vm.getItemTotal(item,index);
          });
          this.dialogFlag.infoDetail=true;
        })
      },
      updMaterialStatus:function(row,val,sels){
          var poId = [],vm = this, state = '' ,msg='',id=[row.poId];
          poId = sels != '' ? sels : id;
          state = val == 'tijiao' ? '01' : val == 'tongguo' ? '02' : val == 'fukuan' ? '04': val == 'butongguo' ? '03':'';
          msg = val == 'tongguo' ? '您确定同意此采购计划？' : val == 'fukuan' ? '您确定提交财务申请付款？': '您确定不同意此物料申请？';
          if(val == 'tongguo' && row.poState == '01'){
            msg = '您确定提交此样品采购计划给主管审核?';
            state = '01';
          }
        poId == '' ? vm.tips() : vm.doItem(msg,'purchaseMaterialInfo/pacthMaterialInfoState',{poId:poId,state:state},vm.getMaterialPList);
      },
      getItemTotal:function(row,index){
          if(row.qty != '' && row.price != ''){
            this.totalItem.splice(index,1,row.qty * row.price);
            this.materialPurchase.totalAmount = eval(this.totalItem.join("+"));
          }else{
            this.totalItem.splice(index,1,'');
            this.materialPurchase.totalAmount = '';
          }
      },
      updMaterialItem:function(formName,val){
        this.materialPurchase.state = val;var vm=this,flag=false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let pro = this.materialPurchase.proMaterials;
            for(var i=0;i<pro.length;i++){
              if(pro[i].materialName == '' || pro[i].qty == '' || pro[i].unit == '' ||  pro[i].itemUrl == '' ||  pro[i].price == ''){
                vm.$message('名称，数量，单价，单位及采购链接为必填项！')
                flag = false;
              }else if(pro[i].qty <=0 || pro[i].price <=0){
                vm.$message('数量及单价不能小于0！');
                flag = false;
              }else{
                  flag = true;
              }
            }
            if(flag == true){
              this.httpPost('productMaterial/patchMaterial',this.materialPurchase).then(res =>{
                if(res.data.result == true){
                  this.$message(res.data.message);
                  this.getMaterialPList();
                  this.dialogFlag.infoDetail = false;
                }else{
                  this.$message(res.data.message);
                }
              })
            }
          } else {
            return false;
          }
        });
      },
      changePageSize:function(val){
        this.pageFilter.pageSize=val;
        this.pageFilter.currentPage = '1';
        this.getMaterialPList();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getMaterialPList();
      },
      getState(val){
       this.pageFilter.whId = [];
       val.type == 'user' ? this.pageFilter.poUser = val.value : val.type == 'FilterWarehouse' ? this.whId = val.value: val.type == 'whState' ?
         this.whState = val.value :val.type == 'paymentState'?  this.paymentState = val.value :val.type == 'poState'?  this.poState = val.value : this.materialPurchase.whId = val.value;
       val.type == 'FilterWarehouse' ? this.pageFilter.whId.push(this.whId) : this.pageFilter.whId = [];
      },
      getTime:function(val){
        val.type == 'start' ? this.pageFilter.poTime1 = val.value : this.pageFilter.poTime2 = val.value;
      },
      closeFilterDialog:function(){
        this.pageFilter.poTime2 = '';
        this.pageFilter.poTime1 = '';
        this.pageFilter.poUser = '';
        this.pageFilter.poNo = '';
        this.pageFilter.whId = [];
        this.whId = '';
      },
    },
  }
</script>

<style scoped>
  .info_tit .title{
    font-size:16px;
    font-weight:bold;
  }
  .formData{
    margin:10px 0;
  }
  .infoData{
    padding:10px 0 10px;
  }
  .applicationData .el-form-item {
    margin: 0;
  }
  #infoData{
    padding-bottom:0;
    margin-top:-30px;
  }
  .updSea{
     margin-top:10px;
   }
</style>
