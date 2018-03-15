<template>
  <div>
      <el-form :model="transferForm"  ref="transferForm"  class="demo-ruleForm payForm" :label-width="financeFormLabelWidth"  >
       <!-- <el-form-item label="跟踪单号" prop="trackingNo">{{payForm.trackingNo}}</el-form-item>
        <el-form-item label="物流方式" prop="transportType">{{payForm.transportType}}</el-form-item>
        <el-form-item label="币种" prop="" v-if="inputDisabled==true">{{CNY}}</el-form-item>-->
        <el-form-item label="付款月份" prop="" v-if="inputDisabled==false" required>
          <el-col :span="6" class="block"  style="margin-right:10px ">
            <el-date-picker
              v-model="transferForm.payYear"
              type="year"
              placeholder="选择年" format="yyyy">
            </el-date-picker>
          </el-col>
          <el-col :span="6" class="block">
            <el-date-picker
              v-model="transferForm.payMonth"
              type="month"
              placeholder="选择月" format="MM">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="运费" prop="freight" :rules=" {type: 'number', required:true,message:'请输入该字段',trigger:'change'}">
          <span v-if="inputDisabled==true">{{transferForm.freight}}</span>
          <el-row type="flex" v-if='inputDisabled==false'>
            <el-input type="number" style="width: 300px;margin-right:10px;"  v-model.number="transferForm.freight"></el-input>
            <el-select v-model="transferForm.freightCurrency" placeholder="请选择" >
              <el-option
                v-for="item in currencyOptions "
                :key="item.currencyId"
                :label="item.cnName"
                :value="item.currencyId"
              >
              </el-option>
            </el-select>
          </el-row>
        </el-form-item>
        <el-form-item label="Duty" prop="duty"  :rules=" {type: 'number', required:true,message:'请输入该字段',trigger:'change'}">
          <span v-if='inputDisabled==true'>{{transferForm.duty}}</span>
          <el-row type="flex" v-if='inputDisabled==false'>
            <el-input type="number"  style="width: 300px;margin-right:10px;" v-model.number="transferForm.duty"></el-input>
            <el-select v-model="transferForm.dutyCurrency" placeholder="请选择"  >
              <el-option
                v-for="item in currencyOptions "
                :key="item.currencyId"
                :label="item.cnName"
                :value="item.currencyId"
              >
              </el-option>
            </el-select>
          </el-row>
        </el-form-item>
        <el-form-item label="VAT" prop="vat" :rules=" {type: 'number', required:true,message:'请输入该字段',trigger:'change'}">
          <span v-if='inputDisabled==true'>{{transferForm.vat}}</span>
          <el-row type="flex" v-if='inputDisabled==false'>
            <el-input type="number" style="width: 300px;margin-right:10px;" v-model.number="transferForm.vat"></el-input>
            <el-select v-model="transferForm.vatCurrency" placeholder="请选择"  >
              <el-option
                v-for="item in currencyOptions "
                :key="item.currencyId"
                :label="item.cnName"
                :value="item.currencyId"
              >
              </el-option>
            </el-select>
          </el-row>
        </el-form-item>
        <el-form-item label="Disbursement" prop="disbursement"  :rules=" {type: 'number', required:true,message:'请输入该字段',trigger:'change'}">
          <span v-if='inputDisabled==true'>{{transferForm.disbursement}}</span>
          <el-row type="flex" v-if='inputDisabled==false'>
            <el-input type="number" style="width: 300px;margin-right:10px;" v-model.number="transferForm.disbursement"></el-input>
            <el-select v-model="transferForm.disbursementCurrency" placeholder="请选择"  >
              <el-option
                v-for="item in currencyOptions "
                :key="item.currencyId"
                :label="item.cnName"
                :value="item.currencyId"
              >
              </el-option>
            </el-select>
          </el-row>
        </el-form-item>
        <el-form-item label="服务费" prop="serviceFee" :rules=" {type: 'number', required:true,message:'请输入该字段',trigger:'change'}">
          <span v-if='inputDisabled==true'>{{transferForm.serviceFee}}</span>
          <el-row type="flex" v-if='inputDisabled==false'>
            <el-input type="number" style="width: 300px;margin-right:10px;" v-model.number="transferForm.serviceFee"></el-input>
            <el-select v-model="transferForm.serviceCurrency" placeholder="请选择"    >
              <el-option
                v-for="item in currencyOptions "
                :key="item.currencyId"
                :label="item.cnName"
                :value="item.currencyId"
              >
              </el-option>
            </el-select>
          </el-row>
        </el-form-item>
        <el-form-item label="其他" prop="other" :rules=" {type: 'number', required:true, message:'请输入该字段',trigger:'change'}">
          <span v-if='inputDisabled==true'>{{transferForm.other}}</span>
          <el-row type="flex" v-if='inputDisabled==false'>
            <el-input type="number" style="width: 300px;margin-right:10px;" v-model.number="transferForm.other"></el-input>
            <el-select v-model="transferForm.otherCurrency" placeholder="请选择"  v-if='inputDisabled==false'  >
              <el-option
                v-for="item in currencyOptions "
                :key="item.currencyId"
                :label="item.cnName"
                :value="item.currencyId"
              >
              </el-option>
            </el-select>
          </el-row>
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <span v-if='inputDisabled==true'>{{transferForm.memo}}</span>
          <el-input  v-if='inputDisabled==false'  type="textarea" v-model="transferForm.memo"></el-input>
        </el-form-item>
      </el-form>
  </div>
</template>
<script>
  export default{
    name:'payForm',
    components: {
    },
    data(){
      let character = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入该字段'));
        } else if(!/^[\u4E00-\u9FA5A-Za-z0-9]{2,10}$/.test(value)){
          callback(new Error('请输入正确格式'));
        } else {
          callback();
        }
      };
      return {
        currencyOptions :[],
        value4:'',
        Title:this.dialogTitle,
        Addressoptions:[
          {value:true,label:'是'},
          {value:false,label:'否'}
        ],
        countryOptions:[],//仓库对应国家
        selectOptions:[],//所有联系人
        //新增编辑model
        transferForm:{
          payYear:'',
          payMonth:'',
          freight:'',
          freightCurrency:'CNY',
          duty:'',
          dutyCurrency:'CNY',
          vat:'',
          vatCurrency:'CNY',
          disbursement:'',
          disbursementCurrency:'CNY',
          serviceFee:'',
          serviceCurrency:'CNY',
          other:'',
          otherCurrency:'CNY',
          memo:'',
          phaseId:'1',
        },
        //addressForm:this.modelForm,
        dataValue:false,
        listId:this.getpoId,
        inputDisabled:this.Disabled,
        financeFormLabelWidth: '120px',
        logisticsIdd:this.logisticsId,
        type:this.typeName,
        /* transferForm:{
          street:[
            { validator: character, trigger: 'blur', required: true },
          ],
          streetCode:[
            {required:true,message:'请输入该字段',trigger:'blur'}
          ],
          postCode:[
            {required:true,message:'请输入该字段',trigger:'blur'},
            {  min: 1, max: 50, message: '长度不能超过 50 个字符',trigger:'blur' },
          ],
          city:[
            {required:true,message:'请输入该字段',trigger:'blur'}
          ],
          email:[
            {required:true,message:'请输入该字段',trigger:'blur'},
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ],
          nation:[
            {message:'请输入该字段',trigger:'blur'}
          ],
          firstAddresser:[
            {required:true, message:'请输入该字段', trigger:'blur'}
          ]
        }*/
      }
    },
    props:['Disabled','getpoId','activeName','houseId','logisticsId','typeName','dialogTitle','childData','activeName','gettrackingNo'],
    computed:{

    },
    mounted: function () {
      this.getCurrencyInfo();
    },
    methods: {
      changee(val){
        //alert('年'+this.transferForm.payYear)
      },
      changeee(){
       // alert('月'+this.transferForm.payMonth)

      },
      //币种
      getCurrencyInfo(){
        this.httpPost('financialPaymentTransfer/queryCurrencyInfo').then(res=>{
          this.currencyOptions=res.data.params.list;
        })
      },
      //查看
      getForm2(){
        this.httpGet('financialPaymentTransfer/selectFinPaymentTransferData?transferId='+this.getpoId).then(res=>{
            if(res.data.params.list.length!==0 ){
              this.transferForm.phaseId = res.data.params.list[1].phaseId;
              this.transferForm.freight = res.data.params.list[1].freight;
              this.transferForm.payYear = res.data.params.list[1].payYear;
              this.transferForm.payMonth = res.data.params.list[1].payMonth;
              this.transferForm.freightCurrency=res.data.params.list[1].freightCurrency;
              this.transferForm.dutyCurrency=res.data.params.list[1].dutyCurrency;
              this.transferForm.vatCurrency=res.data.params.list[1].vatCurrency;
              this.transferForm.disbursementCurrency=res.data.params.list[1].disbursementCurrency;
              this.transferForm.serviceCurrency=res.data.params.list[1].serviceCurrency;
              this.transferForm.otherCurrency=res.data.params.list[1].otherCurrency;
              this.transferForm.duty = res.data.params.list[1].dutyCny;
              this.transferForm.vat = res.data.params.list[1].vatCny;
              this.transferForm.disbursement = res.data.params.list[1].disbursementCny;
              this.transferForm.serviceFee = res.data.params.list[1].serviceFeeCny;
              this.transferForm.other = res.data.params.list[1].otherCny;
              this.transferForm.memo = res.data.params.list[1].memo;
            }
        })
      },
      getForm(){
        this.httpGet('financialPaymentTransfer/selectFinPaymentTransferData?transferId='+this.getpoId).then(res=>{
           if(res.data.params.list.length!==0 ){
             this.transferForm.phaseId = res.data.params.list[0].phaseId;
             this.transferForm.freight = res.data.params.list[0].freight;
             this.transferForm.payYear = res.data.params.list[0].payYear;
             this.transferForm.payMonth = res.data.params.list[0].payMonth;
             this.transferForm.freightCurrency=res.data.params.list[0].freightCurrency;
             this.transferForm.dutyCurrency=res.data.params.list[0].dutyCurrency;
             this.transferForm.vatCurrency=res.data.params.list[0].vatCurrency;
             this.transferForm.disbursementCurrency=res.data.params.list[0].disbursementCurrency;
             this.transferForm.serviceCurrency=res.data.params.list[0].serviceCurrency;
             this.transferForm.otherCurrency=res.data.params.list[0].otherCurrency;
             this.transferForm.duty = res.data.params.list[0].dutyCny;
             this.transferForm.vat = res.data.params.list[0].vatCny;
             this.transferForm.disbursement = res.data.params.list[0].disbursementCny;
             this.transferForm.serviceFee = res.data.params.list[0].serviceFeeCny;
             this.transferForm.other = res.data.params.list[0].otherCny;
             this.transferForm.memo = res.data.params.list[0].memo;
         /*    if(this.activeName=='1'){
               this.transferForm.phaseId = res.data.params.list[0].phaseId;
               this.transferForm.freight = res.data.params.list[0].freight;
               this.transferForm.payYear = res.data.params.list[0].payYear;
               this.transferForm.payMonth = res.data.params.list[0].payMonth;
               this.transferForm.freightCurrency=res.data.params.list[0].freightCurrency;
               this.transferForm.dutyCurrency=res.data.params.list[0].dutyCurrency;
               this.transferForm.vatCurrency=res.data.params.list[0].vatCurrency;
               this.transferForm.disbursementCurrency=res.data.params.list[0].disbursementCurrency;
               this.transferForm.serviceCurrency=res.data.params.list[0].serviceCurrency;
               this.transferForm.otherCurrency=res.data.params.list[0].otherCurrency;
               this.transferForm.duty = res.data.params.list[0].dutyCny;
               this.transferForm.vat = res.data.params.list[0].vatCny;
               this.transferForm.disbursement = res.data.params.list[0].disbursementCny;
               this.transferForm.serviceFee = res.data.params.list[0].serviceFeeCny;
               this.transferForm.other = res.data.params.list[0].otherCny;
               this.transferForm.memo = res.data.params.list[0].memo;
             }/!*else if(this.activeName=='2'){
               this.transferForm.phaseId = res.data.params.list[1].phaseId;
               this.transferForm.freight = res.data.params.list[1].freight;
               this.transferForm.payYear = res.data.params.list[1].payYear;
               this.transferForm.payMonth = res.data.params.list[1].payMonth;
               this.transferForm.freightCurrency=res.data.params.list[1].freightCurrency;
               this.transferForm.dutyCurrency=res.data.params.list[1].dutyCurrency;
               this.transferForm.vatCurrency=res.data.params.list[1].vatCurrency;
               this.transferForm.disbursementCurrency=res.data.params.list[1].disbursementCurrency;
               this.transferForm.serviceCurrency=res.data.params.list[1].serviceCurrency;
               this.transferForm.otherCurrency=res.data.params.list[1].otherCurrency;
               this.transferForm.duty = res.data.params.list[1].dutyCny;
               this.transferForm.vat = res.data.params.list[1].vatCny;
               this.transferForm.disbursement = res.data.params.list[1].disbursementCny;
               this.transferForm.serviceFee = res.data.params.list[1].serviceFeeCny;
               this.transferForm.other = res.data.params.list[1].otherCny;
               this.transferForm.memo = res.data.params.list[1].memo;
             }*!/*/
        /*   	 if(res.data.params.list.length==1){
           /!*	 	alert(8888)
              // this.transferForm.phaseId = res.data.params.list[0].phaseId;
               this.transferForm.freight = res.data.params.list[0].freightCn;
               this.transferForm.payYear = res.data.params.list[0].payYear;
               this.transferForm.payMonth = res.data.params.list[0].payMonth;
               this.transferForm.freightCurrency='CNY';
               this.transferForm.dutyCurrency='CNY';
               this.transferForm.vatCurrency='CNY';
               this.transferForm.disbursementCurrency='CNY';
               this.transferForm.serviceCurrency='CNY';
               this.transferForm.otherCurrency='CNY';
               this.transferForm.duty = res.data.params.list[0].dutyCn;
               this.transferForm.vat = res.data.params.list[0].vatCn;
               this.transferForm.disbursement = res.data.params.list[0].disbursementCn;
               this.transferForm.serviceFee = res.data.params.list[0].serviceFeeCn;
               this.transferForm.other = res.data.params.list[0].otherCn;
               this.transferForm.memo = res.data.params.list[0].memo;*!/
             }else{
           	 	if(this.activeName==1){
           	 		alert97777
                this.transferForm.phaseId = res.data.params.list[0].phaseId;
                this.transferForm.freight = res.data.params.list[0].freightCn;
                this.transferForm.payYear = res.data.params.list[0].payYear;
                this.transferForm.payMonth = res.data.params.list[0].payMonth;
                this.transferForm.freightCurrency='CNY';
                this.transferForm.dutyCurrency='CNY';
                this.transferForm.vatCurrency='CNY';
                this.transferForm.disbursementCurrency='CNY';
                this.transferForm.serviceCurrency='CNY';
                this.transferForm.otherCurrency='CNY';
                this.transferForm.duty = res.data.params.list[0].dutyCn;
                this.transferForm.vat = res.data.params.list[0].vatCn;
                this.transferForm.disbursement = res.data.params.list[0].disbursementCn;
                this.transferForm.serviceFee = res.data.params.list[0].serviceFeeCn;
                this.transferForm.other = res.data.params.list[0].otherCn;
                this.transferForm.memo = res.data.params.list[0].memo;
                this.transferForm.freight = res.data.params.list[0];
              }else if(this.activeName==2){
           	 		alert(666)
                this.transferForm.phaseId = res.data.params.list[1].phaseId;
                this.transferForm.freight = res.data.params.list[1].freightCn;
                this.transferForm.payYear = res.data.params.list[1].payYear;
                this.transferForm.payMonth = res.data.params.list[1].payMonth;
                this.transferForm.freightCurrency='CNY';
                this.transferForm.dutyCurrency='CNY';
                this.transferForm.vatCurrency='CNY';
                this.transferForm.disbursementCurrency='CNY';
                this.transferForm.serviceCurrency='CNY';
                this.transferForm.otherCurrency='CNY';
                this.transferForm.duty = res.data.params.list[1].dutyCn;
                this.transferForm.vat = res.data.params.list[1].vatCn;
                this.transferForm.disbursement = res.data.params.list[1].disbursementCn;
                this.transferForm.serviceFee = res.data.params.list[1].serviceFeeCn;
                this.transferForm.other = res.data.params.list[1].otherCn;
                this.transferForm.memo = res.data.params.list[1].memo;
                this.transferForm.freight = res.data.params.list[1];
                this.transferForm.freight = res.data.params.list[1];
              }
             }*/
           }
        })
      },
      //新增
      addform(){
      		this.transferForm.phaseId='2';
      },
      //校验提交
      submitRequired(){
      	var a=false;
        this.$refs['transferForm'].validate((valid) => {
        	if(valid){
              if(this.transferForm.payMonth=='' || this.transferForm.payYear==''){
                this.$message('请选择年份月份！')
              	a=false;
              }else{
              	a=true;
              }
          }else{
            a=false;
          }
        })
        return a;
      },
     //编辑提交
 /*     geteditForm(){
      	this.transferForm.transferId=this.getpoId;
      	this.transferForm.phaseId=this.activeName=='1'?'1':'2';
      	this.httpPost('financialPaymentTransfer/update',this.transferForm).then(res=>{

        })
      },*/
      //新增提交
    /*  getsubMitForm(){
        this.transferForm.transferId=this.getpoId;
        this.transferForm.trackingNo=this.gettrackingNo;
        this.transferForm.phaseId=this.activeName=='1'?'1':'2';
          this.httpPost('financialPaymentTransfer/save',this.transferForm).then(res=>{
              console.log('this.transferForm % 0==',this.transferForm)
          })
      },*/
      getCountry(){

      },
      changeCountry(val){

      },
      getFormList(){

      },
      gettypeService(){

      },
      getFuLL(){

      },
      submitForm(){

      },
      getaddCountry(){

      },
      resetForm(){
        this.$refs['transferForm'].resetFields();
        this.transferForm.payMonth='';
        this.transferForm.payYear='';

      },
    },
  /*  mounted () {
      this.getFormList();
      //this.gettypeService();
      this. getFuLL();
      //this.getCountry();
    },*/
    watch: {
    	'activeName':{
        handler(val){
         // this.transferForm.phaseId= val=='1'? '1':'2';
        }
      },
      'typeName':{
        handler(val){
        	//alert('val % 0=='+val)
          this.type=val;
          this.getFormList();
        },
      },
     'dialogTitle':{
       handler(val){
         this.Title=val;
        // this.getFormList();
       },
     },
      'childData':{
        handler(val){
          this.payForm.trackingNo = val.trackingNo;
          this.payForm.transportType = val.transportType;
        },
      },
      'getpoId':{
        handler(val){
          this.listId = val;
         // this.getForm();
        },
      },
      'Disabled':{
        handler(val){
          this.inputDisabled = val;
        },
      },
      'transferForm':{
        handler(val){
          this.$emit('getchild',{
            value:val,
          })
        },
        deep:true
      },
     /* 'modelForm':{
        handler(val){
        	//alert(7777)
          this.addressForm=JSON.parse(JSON.stringify(val));
        },
        deep:true
      },*/
    },
  }
  /* Vue.filter('currency', {
   read: function (value) {
   return '$' + value.toFixed(2)
   }
   }*/
</script>

<style scoped>
.payForm .el-form-item{
  margin-bottom: 10px;
}
.payForm  .el-form-item__content{
  margin-bottom: 10px!important;
}
</style>
