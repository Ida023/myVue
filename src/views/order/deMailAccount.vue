<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="8" class="optionValue">
          <el-input type="text"  v-model="pageFilter.accountId" placeholder="请输入邮票账号" size="small"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="small" @click="getData()">搜索</el-button>
        </el-col>
      </el-row>
      <el-row id="filer" class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <div style="width: 100%;">
                <span class="span_label">类型</span>
                <el-radio-group v-model="pageFilter.isUse" @change="page.currentPage=1;getData()" size="small">
                  <el-radio-button  label="">全部</el-radio-button>
                  <el-radio-button  label="1">已启用</el-radio-button>
                  <el-radio-button  label="0">已暂停</el-radio-button>
                </el-radio-group><br/>
                <div class="span_label mailInfo" >未使用邮票汇总</div>
                <div class="modalInfo">
                  <div style="cursor:pointer" :class="{Astyel:item.methodId == pageFilter.logisticsType}" v-for="item in logicData" @click="pageFilter.logisticsType=item.methodId;getData()">{{item.cnName}} <span v-if="item.postageQty != ''">[{{item.postageQty}}]</span></div>
                </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn">
        <el-button type="primary" size="small" class="el-icon-plus" @click="dialogFlag.infoDetail = true;dialogFlag.inputDisabled = false;dialogFlag.dialogTitle='新增邮票账号'">新增邮票账号</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="tableData" border tooltip-effect="dark" style="width: 100%">
          <el-table-column  label="操作" align="center" width="160px">
            <template scope="scope" >
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start" >
                <i class="iconfontyyy" @click="showInfoDialog(scope.row,'非充值');dialogFlag.dialogTitle='查看邮票账号';dialogFlag.inputDisabled = true;" >&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start"
                <i class="iconfontyyy" @click="showInfoDialog(scope.row,'非充值');dialogFlag.dialogTitle='编辑邮票账号';dialogFlag.inputDisabled = false;">&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="停用" placement="top-start" v-if="scope.row.isUse == 1">
                <i class="iconfontyyy" @click="updateStatus(scope.row,'',0)" >&#xe615;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="启用" placement="top-start" v-if="scope.row.isUse == 0">
                <i class="iconfontyyy" @click="updateStatus(scope.row,'',1)">&#xe618;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="充值" placement="top-start">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row,'充值');dialogFlag.putMoneyFlag=true;">&#xe61e;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="消费" placement="top-start">
                <i class="iconfontyyy" @click="accountId=scope.row.accountId;isOpen=!isOpen">&#xe61d;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="邮票清单" placement="top-start">
                <i class="iconfontyyy" @click="tool.goToPage('mailList?accountId='+scope.row.accountId)">&#xe601;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="费用清单" placement="top-start">
                <i class="iconfontyyy" @click="tool.goToPage('payList?accountId='+scope.row.accountId)">&#xe6e8;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="accountNo" label="邮票账号" align="center"></el-table-column>
          <el-table-column sortable prop="password" label="密码"  align="center"></el-table-column>
          <el-table-column sortable prop="currencyId" label="币种"   align="center"></el-table-column>
          <el-table-column sortable prop="balance" label="余额" align="center"></el-table-column>
          <el-table-column sortable prop="paymentTime" label="最近充值时间"  width="180px" align="center"><!--
            <template scope="scope">
              <span>{{getTime(scope.row.paymentTime)}}</span>
            </template>-->
          </el-table-column>
          <el-table-column sortable prop="consumeTime" label="最近消费时间" width="180px" align="center"></el-table-column>
          <el-table-column sortable prop="addUser" label="添加人"  align="center"></el-table-column>
          <el-table-column sortable prop="isUse" label="状态"  :formatter="reserveisUse" align="center"></el-table-column>
          <el-table-column sortable prop="addTime" label="添加时间" :formatter="tool.dateFormatter" width="180px" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!------------------查看 / 编辑 / 添加 发票模板 弹出框--------------------------->
      <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail" :close-on-click-modal="false" @open="clearData" @close="resetForm('formData')">
        <el-form :model="formData"  ref="formData" :label-width="labelWidth">
          <el-form-item label="邮票账号："  prop="accountNo"  :rules="[{ required: true,message: '不能为空', trigger: 'change' },{ min: 1, max: 50, message: '不能超过 50 个字符', trigger: 'change' }]" >
            <el-input v-model="formData.accountNo" :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item label="账号密码："  prop="password"  :rules="[{ required: true,message: '不能为空', trigger: 'change' },{ min: 1, max: 50, message: '不能超过 50 个字符', trigger: 'change' }]" >
            <el-input v-model="formData.password" :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item label="默认币种："  prop="currencyId"  :rules="[{ required: true,message: '不能为空', trigger: 'change' }]">
            <currency-select :select-value="formData.currencyId" place-value="请选择币种" :is-disabled="dialogFlag.inputDisabled" @child-change-Val="getCurrencyId"></currency-select>
          </el-form-item>
          <el-form-item label="账户余额："  prop="balance"  :rules="[{ required: true,message: '不能为空', trigger: 'change' }]">
            <el-input type="number" v-model="formData.balance" :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item label="备注："  prop="memo">
            <el-input type="textarea" v-model="formData.memo" :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item v-show="dialogFlag.inputDisabled == true" label="最近充值时间："  prop="paymentTime" >
            <el-input v-model="formData.paymentTime" :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item v-show="dialogFlag.inputDisabled == true" label="最近修改时间："  prop="consumeTime" >
            <el-input v-model="formData.consumeTime" :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item v-show="dialogFlag.inputDisabled == true" label="状态："  prop="addUser" >
            <el-input v-model="formData.isUse" :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item v-show="dialogFlag.inputDisabled == true" label="添加人："  prop="addUser" >
            <el-input v-model="formData.addUser" :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item v-show="dialogFlag.inputDisabled == true" label="添加时间："  prop="addTime" >
            <el-input v-model="formData.addTime" :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="" @click="dialogFlag.infoDetail = false">{{dialogFlag.inputDisabled == false?'取消':'关闭'}}</el-button>
          <el-button type="primary" @click="updataFormData('formData');"   v-show="this.dialogFlag.inputDisabled == false" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
    <!------------------充值--------------------------->
    <el-dialog title="充值" :visible.sync="dialogFlag.putMoneyFlag" :close-on-click-modal="false" @close="resetForm('payFormData')">
      <el-form :model="payFormData"  ref="payFormData" :label-width="labelWidth">
        <el-form-item label="邮票账号："  prop="postageAccountId" >{{formData.accountNo}}</el-form-item>
        <el-form-item label="账号币种："  prop="currencyId" >{{formData.currencyId}}</el-form-item>
        <el-form-item label="账户余额："  prop="amount" >{{formData.balance}}</el-form-item>
        <el-form-item label="备注："  prop="currencyId" >{{formData.memo}}</el-form-item>
        <el-form-item label="付款账号："  prop="paypalAccountId" :rules="[{ required: true,message: '不能为空', trigger: 'change' },{ min: 1, max: 50, message: '不能超过 50 个字符', trigger: 'change' }]">
          <el-select v-model="payFormData.paypalAccountId" filterable  placeholder="请选择" size="small" style="width: 100%;">
            <el-option v-for="item in accountData" :label="item.accountName" :key="item.accountId" :value="item.accountId" >{{item.accountName}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款金额："  prop="amount"  :rules="[{ required: true,message: '不能为空', trigger: 'change' },{ min: 1, max: 50, message: '不能超过 50 个字符', trigger: 'change' }]">
          <el-input type="number" min="0" v-model="payFormData.amount" ></el-input>
        </el-form-item>
        <el-form-item label="付款时间："  prop="payTime"  :rules="[{ required: true,message: '不能为空',type:'date', trigger: 'change' }]" >
          <el-date-picker v-model="payFormData.payTime" size="small" style="width: 100%;" editable type="datetime" placeholder="选择交易时间" formatter="yyyy-MM-dd mm:ss" ></el-date-picker>
        </el-form-item>
        <el-form-item label="交易流水ID："  prop="payerAccId"  :rules="[{ required: true,message: '不能为空', trigger: 'change' },{ min: 1, max: 50, message: '不能超过 50 个字符', trigger: 'change' }]">
          <el-input type="type" v-model="payFormData.payerAccId" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="" @click="dialogFlag.putMoneyFlag = false">取消</el-button>
        <el-button type="primary" @click="savePayForm('payFormData')" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <!--消费弹出框------------->
    <pay-dialog :mail-ids='accountId' :is-open="isOpen" :call-back="getData"></pay-dialog>
  </div>
</template>
<script>
  import { mapState,mapMutations,mapGetters,mapActions } from 'vuex'
  import payDialog from "../../components/singleDialogData/deMailPayDialog.vue"
  import currencySelect from '../../components/listData/getCurrencyList.vue'
  export default{
    components: {payDialog,currencySelect},
    data(){
      return {
        isOpen:false,   // 触发 子组件 消费弹窗是否打开的标识
        activeNames: ['1'],
        formData: {             //
          accountNo: '',
          password: '',
          currencyId: '',
          balance: '',
          memo: '',
        },
        payFormData: {             //充值
          paypalAccountId: '',
          payerAccId: '',
          currencyId: '',
          amount: '',
          payTime: '',
        },
        pageFilter:{
          currentPage:1,
          pageSize:10,
          isUse:'',
          accountId:'',
          logisticsType:'',
        },
        accountId:'',
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalPage:10,
          totalCount:10,
        },
        tableData:[],   // table数据
        accountData:[],   // paypal账号
        logicData:[],   // paypal账号
        dialogFlag:{
          isOpen:false,     // 批量及单个删除框
          filterDialog:false,  //  筛选弹出框
          putMoneyFlag:false,     // 充值
          infoDetail:false,    //  添加 编辑  查看框
          inputDisabled:false,   //checkbox是否处理可点击状态
        },
        labelWidth: '140px',
      }
    },
    computed:{
    },
    mounted () {
      this.getData();
      this.getPayAccoount();
      this.getLogicData();
    },
    methods: {
      getLogicData:function(){
        this.httpGet('logisticsMethod/queryTypeLogistics',{isUse:1}).then(res => {
          if(res.data.result == true){
            this.logicData = res.data.params.list;
            this.logicData.unshift({cnName:'全部',methodId:'',postageQty:''});
          }
        }).catch(function(err){
          console.log(err);
        })
      },
      getTime:function(val){
        var date = new Date(val);
        return  date = date.toUTCString().toLocaleString();
      },
      getPayAccoount:function(){
        this.httpPost('financialAccountPaypal/selectList',{isUse:1}).then(res => {
          this.accountData = res.data;
        }).catch(function(err){
          console.log(err);
        })
      },
      getData:function(){
        this.httpGet('financialAccountPostage/selectAll',this.pageFilter).then(res => {
            const pageData = res.data;
            this.page = pageData;
            this.tableData = pageData.listData;
        }).catch(function(err){
          console.log(err);
        })
      },
      showInfoDialog:function(row,type){
        this.accountId = row.accountId;
        this.httpGet('financialAccountPostage/select',{accountId:row.accountId}).then(res =>{
          let data = res.data;
          this.formData = data;
          this.formData.addTime = this.tool.dateFormatter('','',this.formData.addTime)
          this.formData.isUse = this.formData.isUse == 1 ?  '启用中' : '停用中';
          type == '非充值' ? this.dialogFlag.infoDetail = true :type == '充值' ? this.dialogFlag.putMoneyFlag = true : '';
          var date = new Date();
          this.payFormData.payTime = date;
        })
      },
      updataFormData:function(formName){
        var url = this.dialogFlag.dialogTitle == '新增邮票账号' ? 'financialAccountPostage/save':'financialAccountPostage/update';
        this.$refs[formName].validate((valid) =>{
          if(valid){
            delete this.formData.addTime;
            delete this.formData.addUser;
            delete this.formData.consumeTime;
            delete this.formData.isUse;
            delete this.formData.payId;
            delete this.formData.paymentTime;
            if(this.formData.balance > 0 ){
              if(this.dialogFlag.dialogTitle == '新增邮票账号'){
                if(this.formData.hasOwnProperty('accountId')){
                  delete this.formData.accountId;
                }
              }else{
                this.formData.accountId = this.accountId;
              }
              this.httpPost(url,this.formData,'Sms').then(res =>{
                this.$message(res.data.message);
                if(res.data.result == true){
                  this.dialogFlag.infoDetail = false;
                  this.getData();
                }
              })
            }else{
                this.$message('付款金额不能小于零！')
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      savePayForm:function(formName){
        this.$refs[formName].validate((valid) =>{
          if(valid){
            this.payFormData.currencyId = this.formData.currencyId;
            this.payFormData.payType = 1;
            this.payFormData.postageAccountId = this.accountId;
            if(this.payFormData.amount > 0 ){
              var params = {
                strList:[],
                financialPaymentPostage:this.payFormData
              }
              this.httpPost('financialPaymentPostage/save',params,'Sms').then(res =>{
                this.$message(res.data.message);
                if(res.data.result == true){
                  this.dialogFlag.putMoneyFlag = false;
                  this.getData();
                }
              })
            }else{
              this.$message('充值金额不能小于零！')
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      updateStatus:function(row,sels,val){
        var msg = val == 0 ? '您确定要停用邮票账号？' : '您确定要启用邮票账号？';
        var params = {
          accountId:row.accountId,
          isUse:val
        };
       this.doItem(msg,'financialAccountPostage/updateStatus',params,this.getData);
      },
      changePageSize:function(val){
        this.pageFilter.pageSize=val;
        this.pageFilter.currentPage = 1;
        this.getData();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getData();
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      clearData:function(){
        if(this.dialogFlag.dialogTitle == '新增邮票账号'){
          this.formData.accountNo =  '';
          this.formData.password =  '';
          this.formData.currencyId =  '';
          this.formData.balance = '';
          this.formData.memo = '';
        }
      },
      reserveisUse:function(val){
        return val.isUse == true ?  '启用中' : '停用中';
      },
      getCurrencyId:function(val){
        this.formData.currencyId = val.value;
      },
    }
  }
</script>
<style>
.mailInfo{
  border-top:1px solid #dfe6ec;
  margin-top:10px;
  padding-top:10px;
}
  .modalInfo{
    max-height: 150px;
    overflow: auto;
  }
</style>
