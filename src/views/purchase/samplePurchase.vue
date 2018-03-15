<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row id="filer" class="supplierFiler" style="margin-top: -10px;">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <span class="span_label">类型</span>
            <el-radio-group v-model="pageFilter.status" @change="filterStateData" size="small">
              <el-radio-button v-for="item in statusOptions" :key="item.value" :label="item.value"   v-if="ButtonInfo[item.label]!='0'">{{item.label}}</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn">
        <el-button type="primary" size="small"    v-if="ButtonInfo['新建样品采购单']!='0'" class="el-icon-plus" @click="pushOne();dialogFlag.infoDetail = true;dialogFlag.inputDisabled = false;dialogFlag.dialogTitle='新建样品采购单'">新建样品采购单</el-button>
        <el-button type="primary" size="small"   v-if="ButtonInfo['筛选']!='0'"  @click="isGroup=false;status=pageFilter.status;dialogFlag.isOpen=true;">筛选</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="samplePurchaseData" border tooltip-effect="dark" style="width: 100%">
          <el-table-column  label="操作" align="center" width="120px">
            <template scope="scope" >
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start" v-if="scope.row.status !== '0' && ButtonInfo['查看']!='0'">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row,dialogFlag.dialogTitle='查看样品采购单');dialogFlag.inputDisabled = true;" >&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start" v-if="pageFilter.status == '0' && ButtonInfo['编辑']!='0'">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row,dialogFlag.dialogTitle='编辑样品采购单');dialogFlag.inputDisabled = false;">&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="pageFilter.status == 0 ? '提交草稿' : '审核通过'" placement="top-start" v-if="scope.row.status == '0' || scope.row.status == '1' && ButtonInfo[pageFilter.status == 0 ? '提交草稿' : '审核通过']!='0'">
                <i class="iconfontyyy" @click="updProductNameStatus(scope.row,'tongguo')">&#xe67e;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="审核不通过" placement="top-start" v-if="scope.row.status == '1' && ButtonInfo['审核不通过']!='0'">
                <i class="iconfontyyy" @click="updProductNameStatus(scope.row,'butongguo')">&#xe611;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="作废" placement="top-start" v-if="scope.row.status == '2' && ButtonInfo['作废']!='0'">
                <i class="iconfontyyy"  @click="updProductNameStatus(scope.row,'shanchu')">&#xe6f7;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="poNo" label="样品采购单编号" width="180px" align="center"></el-table-column>
          <el-table-column sortable prop="addTime" label="生成时间" :formatter="tool.formatDate" width="180px" align="center"></el-table-column>
          <el-table-column sortable prop="addUser" label="开发人"  align="center"></el-table-column>
          <el-table-column sortable prop="poUse" label="用途"   align="center"></el-table-column>
          <el-table-column sortable prop="totalamount" label="费用" align="center"></el-table-column>
          <el-table-column sortable prop="currencyId" label="币种"  align="center"></el-table-column>
          <el-table-column sortable prop="vendorName" label="收款单位"  align="center"></el-table-column>
          <el-table-column sortable prop="memo" label="备注"  align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>

    <!------------------查看 / 编辑 / 添加 供应商样品采购单 弹出框--------------------------->
      <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail" :close-on-click-modal="false" @close="closeDialog">
        <el-tabs v-model="activeTab"  disabled>
          <el-tab-pane label="供应商" name='0' :disabled="!dialogFlag.inputDisabled">
            <el-form :model="poSamplesModel" :rules="infoRules" ref="poSamplesModel"  class="demo-ruleForm">
              <el-form-item label="用途"  prop="poUse" :label-width="financeFormLabelWidth" required >
                <el-input v-model="poSamplesModel.poUse" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-form-item>
              <el-form-item label="供应商"  prop="vendorName" :label-width="financeFormLabelWidth" required >
                <el-input v-model="poSamplesModel.vendorName" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-form-item>
              <el-form-item label="收款人/单位"  prop="proceedsUnit" :label-width="financeFormLabelWidth" :rules="{ min: 1, max: 50, message: '固话长度不能超过 50 个字符', trigger: 'blur' }">
                <el-input v-model="poSamplesModel.proceedsUnit" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-form-item>
              <el-form-item label="收款账号"  prop="vendorBankNo" :label-width="financeFormLabelWidth">
                <el-input v-model="poSamplesModel.vendorBankNo" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-form-item>
              <el-form-item label="采购链接"  prop="poUrl" :label-width="financeFormLabelWidth" >
                <el-input v-model="poSamplesModel.poUrl" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-form-item>
              <el-form-item label="备注"  prop="memo" :label-width="financeFormLabelWidth" :rules="{ min: 1, max: 50, message: '不能超过 50 个字符', trigger: 'blur' }">
                <el-input v-model="poSamplesModel.memo" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="产品" name='1' :disabled="!dialogFlag.inputDisabled">
            <section class="productInfo">
              <div class="product_tit">
                <span class="title">产品信息</span>
                <span class="addProduct" @click="addProduct" v-if="dialogFlag.inputDisabled == false">添加商品</span>
              </div>
              <div class="table_padding">
                <el-table :data="poSamplesItemList" border tooltip-effect="dark" style="width: 100%" >
                  <el-table-column sortable label="物品名称" align="center" class="textarea" :show-overflow-tooltip="true">
                      <template scope="scope">
                          <div v-if="dialogFlag.inputDisabled == false">
                            <el-input type="textarea" v-model="scope.row.productName"></el-input>
                          </div>
                        <span v-if="dialogFlag.inputDisabled == true">
                            {{scope.row.productName}}
                        </span>
                      </template>
                  </el-table-column>
                  <el-table-column sortable  label="物品单价" align="center" :show-overflow-tooltip="true">
                    <template scope="scope">
                      <div v-if="dialogFlag.inputDisabled == false">
                        <el-input type="number" v-model="scope.row.price"></el-input>
                      </div>
                      <span v-if="dialogFlag.inputDisabled == true">
                        {{scope.row.price}}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column sortable label="数量"  align="center">
                    <template scope="scope">
                      <div v-if="dialogFlag.inputDisabled == false">
                        <el-input type="number" v-model="scope.row.qty"></el-input>
                      </div>
                      <span v-if="dialogFlag.inputDisabled == true">
                        {{scope.row.qty}}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column sortable label="备注" align="center" :show-overflow-tooltip="true">
                    <template scope="scope">
                      <div v-if="dialogFlag.inputDisabled == false">
                        <el-input type="textarea" v-model="scope.row.memo"></el-input>
                      </div>
                      <span v-if="dialogFlag.inputDisabled == true">
                        {{scope.row.memo}}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120" align="center" v-if="dialogFlag.inputDisabled == false">
                    <template scope="scope">
                      <el-tooltip class="item" effect="dark" content="删除" placement="top-start" >
                        <i class="iconfontyyy"  @click="deleteRow(scope.row,scope.$index,poSamplesItemList)">&#xe6f7;</i>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </section>
            <section class="priceInfo">
              <div class="price_tit">
                <span class="title">费用信息</span>
                <span class="calc" @click="calculatePrice" v-if="dialogFlag.inputDisabled == false">计算费用</span><span v-if="dialogFlag.inputDisabled == false" class="remark">(修改产品信息后请先计算费用再填写运费)</span>
              </div>
              <el-form :model="poSamplesChargesModel" ref="poSamplesChargesModel" class="priceData" >
                <el-form-item  label="产品个数：" prop="chargesCount">
                  {{poSamplesChargesModel.chargesCount}}<span v-if="poSamplesChargesModel.chargesCount != ''">个</span>
                </el-form-item>
                <el-form-item label="产品数量总计：" prop="allQty">
                  {{poSamplesChargesModel.allQty}}<span v-if="poSamplesChargesModel.allQty != ''">PCS</span>
                </el-form-item>
                <el-form-item label="运费：" class="yufei_item" prop="freight">
                  <el-col :span="4">
                    <el-input type="number" min="0" v-model="poSamplesChargesModel.freight" @change="toGetFC" :disabled="dialogFlag.inputDisabled"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="币种："  >
                  <el-col :span="5">
                    <selector-item :select-value="poSamplesChargesModel.currencyId" :option-data="options" :is-disabled="dialogFlag.inputDisabled" place-value="请选择币种" @on-child-change-Val="childChangeValCurrency"></selector-item>
                  </el-col>
                </el-form-item>
                <el-form-item label="费用总额：" prop="allCharges">
                  {{poSamplesChargesModel.allCharges}}
                </el-form-item>
              </el-form>
            </section>
          </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.infoDetail = false;">{{dialogFlag.inputDisabled == false? '取消':'关闭'}}</el-button>
          <el-button type="" @click="goPrev()" v-if="activeTab != 0 && dialogFlag.inputDisabled == false">上一步</el-button>
          <el-button type="" @click="goNext()" v-if="activeTab != 1 && dialogFlag.inputDisabled == false">下一步</el-button>
          <el-button type="primary" @click="addSampleProduct('0');" v-if="this.activeTab == 1" v-show="this.dialogFlag.inputDisabled == false" :loading="$store.state.loading">保 存</el-button>
          <el-button type="primary" @click="addSampleProduct('1');" v-if="this.activeTab == 1" v-show="this.dialogFlag.inputDisabled == false" :loading="$store.state.loading">提交申请</el-button>
        </div>
      </el-dialog>
    <div class="smallDia">
      <el-dialog title="筛选" :visible.sync="dialogFlag.isOpen" size="small" :close-on-click-modal="false" @close="isGroup=true;">
        <div class="data_body">
          <el-row class="row_title row" :getter="20">
            <el-col class="col" :span="4">条件</el-col>
            <el-col class="col" :span="4">比较方式</el-col>
            <el-col class="col" :span="16">输入</el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">编号</el-col>
            <el-col class="col" :span="4">是</el-col>
            <el-col class="col_input" :span="16"><el-input v-model="pageFilter.poNo"></el-input></el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">申请人</el-col>
            <el-col class="col" :span="4">是</el-col>
            <el-col class="col_input" :span="16">
              <selector-options :select-value="pageFilter.addUser" :options-data="userOptions" type="申请人" @child-change-Val="childChangeVal"></selector-options>
            </el-col>
          </el-row>
          <time-data condition-name="申请日期" :start-time="pageFilter.initialTime" :end-time="pageFilter.overTime" @child-value-Stime="getTime" @child-value-Etime="getTime"></time-data>
          <el-row class="row">
            <el-col class="col" :span="4">状态</el-col>
            <el-col class="col" :span="4">是</el-col>
            <el-col class="col_input" :span="16">
              <selector-options :select-value="status" :options-data="statusOptions"type="状态" place-value="请选择" @child-change-Val="childChangeVal"></selector-options>
            </el-col>
          </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="status='';closeFilterDialog()">清除条件</el-button>
          <el-button @click="pageFilter.status=status;getSampleData()">筛 选</el-button>
          <el-button @click="dialogFlag.isOpen = false;">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import selectorOptions from '../../components/selector_item_with_key.vue';
  import timeData from "../../components/ScreenModular/timeDate.vue"
  export default{
    components: {selectorOptions,timeData},
    data(){
      String.prototype.trim=function() {
        return this.replace(/(^\s*)|(\s*$)/g,'');
      };
      const regPoUse = (rule, value, callback) => {
        if (value.trim() === '') {
          callback(new Error('请输入用途'));
        } else{
          callback();
        }
      };
      const regVendorName = (rule, value, callback) => {
        if (value.trim() === '') {
          callback(new Error('请输入供应商'));
        } else{
          callback();
        }
      };
      const regPoUrl = (rule, value, callback) => {
        if (/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(value)) {
          callback(new Error('链接不能输入中文'));
        } else{
          callback();
        }
      };
      const regvendorBankNo = (rule, value, callback) => {
        if(value != '' && value != undefined && value != null){
          if (!/^\d+$/.test(value)) {
            callback(new Error('只能填写整数'));
          }else{
            callback();
          }
        } else{
            callback();
          }
        };
      return {
        statusOptions:[{value:'', label:'全部'},{value:'0', label:'草稿'},{value:'1', label:'待审核'},{value:'2', label:'审核通过'},{value:'3', label:'审核不通过'},{value:'4', label:'作废'},],
        options:['人民币','美元'],
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
        currency:'人民币',
        poSamplesItemList: [],
        poSamplesModel: {             // 基本信息
          poUse: '',
          memo:'',
          poUrl: '',
          proceedsUnit:'',
          vendorName:'',
          status:'',
          vendorBankNo:'',
          updUser:'',
          updTime:'',
          poNo:'',
          poId:'',
          freight:'',
          compId:'',
          addUser:'',
          addTime:'',
        },
        samplesItemIdList:[],
        pageFilter:{
          currentPage:1,
          pageSize:10,
          status:'0',
          overTime:'',
          initialTime:'',
          addUser:'',
          poNo:''
        },
        status:'',
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalPage:10,
          totalCount:10,
        },
        activeNames: ['1'],    //  筛选 功能的折又又叠面板
        activeTab:'0',     //
        tabArr:['0','1'],     // tab 标签页数组
        samplePurchaseData:[],   // 供应商列表
        dialogFlag:{
          isOpen:false,     // 批量及单个删除框
          infoDetail:false,    //  添加 编辑  查看框
          inputDisabled:false,   //checkbox是否处理可点击状态
        },
        isGroup:true,
        financeFormLabelWidth: '120px',
        totalCharge:'',
        sampleId:'',
        userOptions:[],
        reg: /^\d+$/,
        regDot:/^(([1-9][0-9]*\.[0-9][0-9]*)|([0]\.[0-9][0-9]*)|([1-9][0-9]*)|([0]{1}))$/,
        infoRules: {
          poUse:[
            {validator: regPoUse, trigger: 'blur'},
            {required:true,message:'用途不能为空',trigger:'blur'},
            { min: 1, max: 50, message: '长度不能超过 50 个字符', trigger: 'blur' }
          ],
          vendorName:[
            {validator: regVendorName, trigger: 'blur'},
            {required:true,message:'供应商不能为空',trigger:'blur'},
            { min: 1, max: 50, message: '长度不能超过 50 个字符', trigger: 'blur' }
          ],
          vendorBankNo:[
            {validator: regvendorBankNo, trigger: 'blur'},
            { min: 1, max: 20, message: '长度不能超过 20 个字符', trigger: 'blur' }
          ],
          poUrl:[
            {validator: regPoUrl, trigger: 'blur'},
            { min: 1, max: 50, message: '长度不能超过 50 个字符', trigger: 'blur' }
          ],
        },
        ButtonInfo:{},//按钮权限列表20171227
      }
    },
    computed:{
    },
    mounted () {
      this.getauthorityList();
      this.getSampleData();
      this.getUserName();
      this.getCurrentType();
    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      getCurrentType:function(){
          this.httpPost('samplesProcurement/selectCurrencyList').then(res =>{
              console.log(res)
            if(res.data.result == true){
                  this.options = res.data.params.dictCurrencyInfo.map(item =>item.currencyName);
            }
          })
      },
      getUserName:function(){
          this.httpPost('samplesProcurement/selectAddUser').then(res =>{
              if(res.data.result == true){
                  this.userOptions = this.tool.replaceObjKey(res.data.params.samplesModel,'userId','userName');
              }
          })
      },
      filterStateData:function(val,type){
        if(this.isGroup == true){
          this.getSampleData();
        }
      },
      getSampleData:function(){
        this.isGroup = true;
        this.httpPost('samplesProcurement/select',this.pageFilter).then(res => {
          if(res.data.result == true){
            this.dialogFlag.isOpen = false;
            const pageData = res.data.params.samplesList;
            this.page = pageData;
            this.samplePurchaseData = pageData.listData;
          }else{
            this.samplePurchaseData = [];
          }
        }).catch(function(err){
          console.log(err);
        })
      },
      updProductNameStatus:function(row,type){
        var status,msg='',vm = this,url = 'samplesProcurement/updateStatus';
        this.pageFilter.status == '0' ? status = 1 : this.pageFilter.status == '1' ? status = '2' :'';
        if(type == 'butongguo'){
            status = '3';
            msg = '您确定不同意此样品采购计划？';
        }else if(type == 'tongguo'){
            msg = '您确定同意此样品采购计划？';
        }else{
          status = '4';
          msg = '您确定作废此样品采购计划？';
          url = 'samplesProcurement/updateStatus';
        }
        vm.doItem(msg,url,{poId:row.poId,status:status},vm.getSampleData);
      },
      goNext:function(){
        var vm = this;
        vm.$refs['poSamplesModel'].validate((valid) => {
          if (valid) {
            vm.activeTab = vm.tabArr[vm.tabArr.indexOf(vm.activeTab)+1];
          }else{
            return false;
          }
        });
      },
      goPrev:function(){
        this.activeTab = this.tabArr[this.tabArr.indexOf(this.activeTab)-1];
      },
      deleteRow(row,index, data) {
        if(this.poSamplesItemList.length ==1){
          this.$message('至少保留一个商品');
        }else{
          this.samplesItemIdList.push({itemId:row.itemId});
          data.splice(index, 1);
        }
      },
      addProduct:function(){
        let length = this.poSamplesItemList.length;
        if(length >= 10){
          this.$message('最多只能添加10个商品')
        }else{
          this.pushOne();
        }
      },
      showInfoDialog:function(row,val){
        this.sampleId = row.poId;
        console.log('被查看/编辑的ID：'+row.poId);
        this.httpPost('samplesProcurement/selectSingleData',{poId:row.poId}).then(res =>{
            if(res.data.result == true){
                let data = res.data.params.samplesProcurement;
                this.poSamplesModel = data.poSamplesModel;
                this.poSamplesItemList = data.poSamplesItemList;
                this.poSamplesChargesModel = data.poSamplesChargesModel;
                this.dialogFlag.infoDetail = true;
            }
        })
      },
      toGetFC:function(val){
        let all = parseFloat(this.totalCharge);
        if(this.regDot.test(val)){
              var v = parseFloat(val);
            if(this.poSamplesChargesModel.allQty != ''){
               this.poSamplesChargesModel.allCharges = all + v;
            }
          }else{
            this.$message('运费只能填写整数或小数');
            this.poSamplesChargesModel.allCharges = '';
        }
      },
      calculatePrice:function(){
        var totalArr=[],ps=this.poSamplesItemList,vm = this;
        let qtyArr = ps.map(item =>item.qty);
        let productNum = ps.length;
        var clearData = function(){
          vm.poSamplesChargesModel.allQty ='';vm.poSamplesChargesModel.allCharges ='';vm.poSamplesChargesModel.chargesCount ='';
        }
        for(var i=0;i<productNum;i++){
          if(ps[i].qty == '' || ps[i].price == ''|| ps[i].productName == ''){
            this.$message('产品的名称，单价及数量为必填项');
            clearData();
            break;
          }else if(!this.regDot.test(ps[i].price)){
            this.$message('产品的单价只能填写整数或小数');
            clearData();
            break;
          }else if(!this.reg.test(ps[i].qty)){
            this.$message('产品的数量只能填写整数');
            clearData();
            break;
          }else{
            totalArr.push(ps[i].qty * ps[i].price);
          }
        }
        console.log(totalArr);
        if(totalArr.length > 0){
          this.poSamplesChargesModel.allQty = eval(qtyArr.join("+"));
          this.poSamplesChargesModel.allCharges = eval(totalArr.join("+"));
          if(this.poSamplesChargesModel.freight != '' && this.reg.test(this.poSamplesChargesModel.freight)){
            this.poSamplesChargesModel.allCharges = parseFloat(this.poSamplesChargesModel.allCharges) + parseFloat(this.poSamplesChargesModel.freight);
          }
          this.totalCharge = eval(totalArr.join("+"));
          this.poSamplesChargesModel.chargesCount = productNum;
        }
      },
      changePageSize:function(val){
        this.pageFilter.pageSize=val;
        this.pageFilter.currentPage = 1;
        this.getSampleData();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getSampleData();
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      pushOne:function(){
        this.samplesItemIdList.push({itemId:''});
        this.poSamplesItemList.push({
          productName: '',
          price: '',
          qty: '',
          memo:'',
          addTime: '',
          addUser: '',
          compId: '',
          itemId: '',
          updTime: '',
          updUser: '',
        });
      },
      addSampleProduct:function(val){
        var url = '';
        this.dialogFlag.dialogTitle == '新建样品采购单'? url = 'samplesProcurement/add': url = 'samplesProcurement/update';
        this.poSamplesModel.status = val;
        var paramsData = {
          poSamplesChargesModel:this.poSamplesChargesModel,
          poSamplesItemList:this.poSamplesItemList,
          poSamplesModel:this.poSamplesModel,
          samplesItemIdList:this.samplesItemIdList,
        };
        delete paramsData.poSamplesModel.start;
        var ps = this.poSamplesChargesModel;
        if(ps.chargesCount == '' || ps.allQty == '' || ps.allCharges == ''){
          this.$message('还未计算费用信息');
        }else if(ps.freight == ''){
            this.$message('运费不能为空')
        }else{
          this.calculatePrice();
          this.httpPost(url,paramsData).then(res =>{
            if(res.data.result == true){
              this.getSampleData();
              this.$message(res.data.message);
              this.dialogFlag.infoDetail = false;
            }else{
              this.$message(res.data.message);
            }
          })
        }
      },
      childChangeVal(val){
        val.type == '申请人' ? this.pageFilter.addUser = val.value : this.status = val.value;
      },
      childChangeValCurrency(val){
        this.poSamplesChargesModel.currencyId = val.value;
      },
      getTime:function(val){
        val.type == 'start' ? this.pageFilter.initialTime = val.value : this.pageFilter.overTime = val.value;
      },
      closeDialog(){
        this.activeTab = '0';
        this.poSamplesItemList = [];
        this.tool.clearObjValue(this.poSamplesModel);// 基本信息
        this.tool.clearObjValue(this.poSamplesChargesModel);
        this.samplesItemIdList = [];
      },
      closeFilterDialog:function(){
          this.pageFilter.overTime = '';
          this.pageFilter.initialTime = '';
          this.pageFilter.addUser = '';
          this.pageFilter.poNo = '';
      },
    }
  }
</script>
<style scoped>
  .product_tit{
    display:flex;
    justify-content:space-between;
    margin-bottom:20px;
  }
  .product_tit .title, .price_tit .title{
    font-size:16px;
    font-weight:bold;
  }
  .product_tit .addProduct,.price_tit .calc{
    font-size:15px;
    cursor: pointer;
    color:rgb(32,160,255)
  }
  .price_tit .calc{
    padding-left:30px;
  }
  .price_tit{
    margin-top:20px;
  }
  .priceData{
    margin:30px 0 0 30px;
  }
  .priceData .el-form-item {
    margin-bottom: 0;
  }
  .priceData .yufei_item{
  margin-bottom:10px!important;
}
  .remark{
    color:red;
    padding:0 10px;
  }
</style>
