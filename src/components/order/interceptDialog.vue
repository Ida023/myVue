<template>
  <div>
    <!--  拦截订单弹出框--------------------------->
    <el-dialog title="拦截订单" :visible.sync="interceptDialog" :close-on-click-modal="false" size="small" @close="">
      <el-row type="flex" justify="center" align="middle">
        <el-col :span="4"><h3>拦截原因</h3></el-col>
        <el-col :span="10">
          <el-select v-model="reason" filterable size="small" style="width: 100%;">
            <el-option v-for="item in reasonData" :label="item.refValue" :key="item.refId" :value="item.refId"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row v-if="reason == '01'|| reason == '02'" style="margin: 5px 0 5px 30px">
        <h3  style="margin-right: 10px;">{{reason == '01' ? '客户信息':'尾款信息'}}
         <el-tooltip content="编辑"  effect="dark" placement="bottom" v-if="btnIcon == true">
          <i  class="iconfontyyy" content="Bottom center" @click="btnIcon=!btnIcon;isInputted=false;">&#xe6e5;</i>
        </el-tooltip>
        <el-tooltip content="保存"  effect="dark" placement="bottom" v-if="btnIcon == false">
          <i  class="iconfontyyy" content="Bottom center" @click="btnIcon=!btnIcon;isInputted=true;">&#xe613;</i>
        </el-tooltip>
        </h3>
      </el-row>
      <el-form label-width="120px" :model="formData"  ref="formData" v-if="reason == '01'">
        <el-form-item label="客户名称："prop="customerName" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <el-input type="text" v-model="formData.customerName" :disabled="isInputted"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="recipient" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <el-input type="text" v-model="formData.recipient" :disabled="isInputted"></el-input>
        </el-form-item>
        <el-form-item label="地址：" prop="address" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <el-input type="text" v-model="formData.address" :disabled="isInputted"></el-input>
        </el-form-item>
        <el-form-item label="城市：" prop="city" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <el-input type="text" v-model="formData.city" :disabled="isInputted"></el-input>
        </el-form-item>
        <el-form-item label="州：" prop="state" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <el-input type="text" v-model="formData.state" :disabled="isInputted"></el-input>
        </el-form-item>
        <el-form-item label="国家：" prop="countryNo" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <countryNo-list :select-value="formData.countryNo" select-type="市场/站点" :account-id="accountId"  :is-use="interceptDialog" :is-disabled="isInputted" @getData="getCountryNo"></countryNo-list>
        </el-form-item>
        <el-form-item label="邮编：" prop="postCode" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <el-input type="number" v-model="formData.postCode" :disabled="isInputted"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="phone" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <el-input type="text" v-model="formData.phone" :disabled="isInputted"></el-input>
        </el-form-item>
        <el-form-item label="客户邮箱：" prop="customerEmail" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <el-input type="text" v-model="formData.customerEmail" :disabled="isInputted"></el-input>
        </el-form-item>
      </el-form>
      <el-form label-width="120px" :model="formData2"  ref="formData2" v-if="reason == '02'">
        <el-form-item label="客户指定物流方式：" prop="logsticsPlatformCode" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <el-input type="text" v-model="formData2.logsticsPlatformCode" :disabled="isInputted"></el-input>
        </el-form-item>
        <el-form-item label="平台运费：" prop="freightCost" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <el-row >
            <el-col :span="20">
              <el-input type="number" v-model="formData2.freightCost" :disabled="isInputted"></el-input>
            </el-col>
            <el-col :span="4">
<!--              <el-select v-model="formData2.Currency_Id" filterable>
                <el-option v-for="item in currentcyData" :key="item.label" :label="item.label" :value="item.label"></el-option>
              </el-select>-->
              <currency-list :select-value="formData2.Currency_Id" select-type="info" :is-disabled="false" @child-change-Val="getCurrency"></currency-list>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="发货仓库：" prop="whId" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <warehouse-list :select-value="formData2.whId"  :is-disabled="isInputted" @getData="getWarehouse"></warehouse-list>
        </el-form-item>
        <el-form-item label="物流方式：" prop="logisticsMethod" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <logic-list :select-value="formData2.logisticsMethod" :wh-id="formData2.whId" :is-use="interceptDialog" :is-disabled="isInputted" @getData="getLogic"></logic-list>
        </el-form-item>
        <el-form-item label="重量：" prop="totalWeight" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <el-input type="number" v-model="formData2.totalWeight" min="0" :disabled="isInputted" @change="getLogisticsFee"></el-input>
        </el-form-item>
        <el-form-item label="估计运费：" prop="estimateTransportCost">
          <el-row >
            <el-col :span="20">
              <el-input type="number" v-model="formData2.estimateTransportCost" :disabled="isInputted"></el-input>
            </el-col>
            <el-col :span="4">
              <currency-list :select-value="formData2.Currency_Id" select-type="info" :is-disabled="false" @child-change-Val="getCurrency"></currency-list>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="跟踪单号：" prop="trackingNo" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <el-input type="text" v-model="formData2.trackingNo" :disabled="isInputted"></el-input>
        </el-form-item>
      </el-form>
      <el-row  v-if="reason == '04'" style="margin-top: 20px;">
        <el-input type="textarea" v-model="reasonContent" placeholder="请输入拦截原因" :autosize="{ minRows: 6, maxRows: 10}"></el-input>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="interceptDialog = false;">取消</el-button>
        <el-button type="primary" @click="submit()" :loading="$store.state.loading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import countryNoList from "../../components/listData/getCountryNo.vue"
  import warehouseList from "../../components/listData/getWarehouseOrder.vue"
  import logicList from "../../components/listData/getLogicByWhId.vue"
  import currencyList from '../../components/listData/getCurrencyList'
  export default{
    components: {warehouseList,logicList,countryNoList,currencyList},
    data(){
      return {
        currencyType:'',
        reason:'',
        reasonContent:'',
        btnIcon:true,
        deptList:[],   //
        statusOption:[],   //
        currentcyData:[{value:'1',label:'CYN'},{value:'2',label:'EUR'},{value:'3',label:'USD'}],   //
        modelData:[{value:'1',label:'测试数据1'},{value:'2',label:'测试数据2'},{value:'3',label:'测试数据3'},{value:'4',label:'测试数据4'}],   //
        reasonData:[],   //
        formData:{
          customerName:'',
          recipient:'',
          address:'',
          city:'',
          state:'',
          countryNo:'',
          postCode:'',
          phone:'',
          customerEmail:'',
        },
        formData2:{
          logsticsPlatformCode:'',
          freightCost:'',
          whId:'',
          logisticsMethod:'',
          totalWeight:'',
          estimateTransportCost:'',
          trackingNo:'',
          Currency_Id:'',
        },
        id:this.idValue,
        interceptDialog:false,
        isInputted:true,
        aId:this.accountId,
      }
    },
    props:['idValue','isOpen','accountId'],
    mounted () {
      //this.getData();
    },
    methods: {
      getData(){
        this.httpPost('addresser/selectCountry').then(res =>{
          if(res.data.result == true){
            this.options = res.data.params.list;
          }
        })
      },
      getInterceptReason(){  //拦截原因
        this.httpGet('refOrderInterceptReason/selectList','','Sms').then(res =>{
          if(res.data){
            this.reasonData = res.data;
            this.reason = this.reasonData[0].refId;
          }
        })
      },
      getCustomerInfo(){   // 客户信息
        this.httpGet('orderCustomer/select',{orderId:this.idValue},'Sms').then(res =>{
          if(res.data){
            this.formData = res.data;
          }
        })
      },
      getLogicInfo(){   // 尾程信息
        this.httpGet('orderLogisticsTracking/selectByOrder',{orderId:this.idValue},'Sms').then(res =>{
          if(res.data){
            this.formData2 = res.data;
          }
        })
      },
      getLogisticsFee(){   // 查询估计运费
        var params = {
          methodId:this.formData2.logisticsMethod,
          totalWeight:this.formData2.totalWeight,
        }
        if(params.methodId != '' &&　params.totalWeight != '' && params.methodId != null &&　params.totalWeight != null){
          this.httpGet('orderInfo/getLogisticsFee',params,'Sms').then(res =>{
            if(res.data){
              this.formData2.Currency_Id = res.data.currencyId;
              this.formData2.estimateTransportCost = res.data.estimateTransportCost;
            }
          })
        }
      },
      submit:function(){
        var formName = this.reason == 1 ? 'formData': 'formData2';
        if(this.reason == 1 || this.reason ==2){
          this.$refs[formName].validate((valid) =>{
            if(valid){
              this.commonHttp();
            } else {
              console.log('error submit!!');
              return false;
            }
          })
        }else{
          if(this.reason == 4 && this.reasonContent == ''){
              this.$message('拦截原因不能为空！');
          }else{
           this.commonHttp();
          }
        }
      },
      commonHttp:function(){
        var params = {};
        params.customerInfo = this.formData;
        params.orderId = this.idValue;
        params.interceptReasonId = this.reason;
        params.interceptReasonDesc = this.reasonContent;
        params.shippmentInfo = this.formData2;
        //this.httpPost('orderIntercept/getLogisticsFee',params,'Sms').then(res =>{
        this.httpPost('orderIntercept/interceptOrder',params,'Sms').then(res =>{
          this.$message(res.data.message);
          if(res.data.result == true){
            this.$emit('getData');
            this.interceptDialog = false;
          }
        })
      },
      resetForm:function(formName) {
        this.$refs[formName].resetFields();
      },
      getLogic:function(val){
        this.formData2.logisticsMethod = val.value;
        this.getLogisticsFee();
      },
      getCountryNo:function(val){
        this.formData.countryNo = val.value;
      },
      getWarehouse:function(val){
        this.formData2.whId = val.value;
      },
      getCurrency:function(val,index,data){
        this.formData2.Currency_Id = val.value;
      },
      clearForm:function(){
        this.resetForm('formData');
        this.resetForm('formData2');
      }
    },
    watch:{
      'accountId':{
          handler(val){
            this.aId = val;
          },
          deep:true
      },
      'idValue':{
          handler(val){
            this.id = val;
          },
          deep:true
      },
      'isOpen':{
          handler(val){
            this.interceptDialog = true;
            this.getInterceptReason();
            this.getCustomerInfo();
            //this.getLogicInfo();
          },
      },
    }
  }
</script>
<style scoped>
  .iconfontyyy{
    vertical-align: middle;
  }
</style>
