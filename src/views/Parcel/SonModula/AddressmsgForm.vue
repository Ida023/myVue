<template>
  <div>

      <el-form :model="addressForm" :rules="infoaddressForm" ref="addressForm"  class="demo-ruleForm" :label-width="financeFormLabelWidth"  >
        <el-col :span="24" >
            <el-form-item :label="type"  prop="addressId" >
                <el-select  v-model="addressForm.addressId" filterable clearable :disabled="inputDisabled" @change="changeName" >
                  <el-option v-for="item in selectOptions" :key="item.addressId" :label="item.firstAddresser" :value="item.addressId"></el-option>
                </el-select>
              <!--<el-col :span="6"><el-button type="primary"  class="el-icon-plus" style="margin-left: 5px;"> 新建联系人</el-button></el-col>-->
            </el-form-item>
          <el-row>
            <el-form-item label="地址类型"  prop="addressType"  v-if="logisticsIdd =='01'" >
              <el-radio-group v-model="addressForm.addressType" :disabled="inputDisabled">
                <el-radio class="radio"  label="Street">Street</el-radio>
                <el-radio class="radio"  label="Packstation">Packstation</el-radio>
                <el-radio class="radio"  label="Filiale">Filiale</el-radio>
              </el-radio-group>
              <el-checkbox v-model="addressForm.isOffenUse" :disabled="inputDisabled" >保存至常用联系人</el-checkbox>
            </el-form-item>
            <el-col  :span="10">
                <el-form-item label="姓名1"  prop="firstAddresser"  v-if="logisticsIdd =='01'">
                  <el-input type="text" :disabled="inputDisabled" v-model="addressForm.firstAddresser"></el-input>
                </el-form-item>
                <el-form-item label="姓名2"  prop="addresser2" v-if="logisticsIdd =='01'">
                  <el-input type="text" :disabled="inputDisabled" v-model="addressForm.addresser2"></el-input>
                </el-form-item>
                <el-form-item label="姓名3"  prop="addresser3"  v-if="logisticsIdd =='01'">
                  <el-input type="text" :disabled="inputDisabled" v-model="addressForm.addresser3"></el-input>
                </el-form-item>
                <el-form-item label="街道地址"  prop="street"  required v-if="logisticsIdd =='01'">
                  <el-col v-if="addressForm.addressType == 'Street'" ><el-input type="text" :disabled="inputDisabled" v-model="addressForm.street"></el-input></el-col>
                  <el-col v-if="addressForm.addressType != 'Street'" >
                    <el-col :span="5">{{addressForm.streetCode}}</el-col>
                    <el-col :span="19"><el-form-item label="PostNo." required><el-input  v-model="addressForm.postNo" type="text" :disabled="inputDisabled"></el-input></el-form-item></el-col>
                  </el-col>
                </el-form-item>
                <el-form-item label="姓名"  prop="firstAddresser"  required  v-if="logisticsIdd =='02'">
                  <el-input type="text" :disabled="inputDisabled" v-model="addressForm.firstAddresser"></el-input>
                </el-form-item>
                <el-form-item label="街道地址1"  prop="street"  required  v-if="logisticsIdd =='02'">
                  <el-col ><el-input type="text" :disabled="inputDisabled" v-model="addressForm.street"></el-input></el-col>
                </el-form-item>
                <el-form-item label="街道地址2"  prop="street2"    v-if="logisticsIdd =='02'">
                  <el-col><el-input type="text" :disabled="inputDisabled" v-model="addressForm.street2"></el-input></el-col>
                </el-form-item>
              <el-form-item label="街道号码"  prop="streetCode" v-if="logisticsIdd =='01'" required>
                <el-input type="text" :disabled="inputDisabled" v-model="addressForm.streetCode"></el-input>
              </el-form-item>
              <el-form-item label="地址信息"  prop="address" v-if="logisticsIdd =='01'" >
                <el-input type="text" :disabled="inputDisabled" v-model="addressForm.address"></el-input>
              </el-form-item>
              <el-form-item label="邮编"  prop="postCode"  required>
                <el-input type="number" :disabled="inputDisabled" v-model="addressForm.postCode"></el-input>
              </el-form-item>
              <el-form-item label="城市"  prop="city" required >
                <el-input type="text" :disabled="inputDisabled" v-model="addressForm.city"></el-input>
              </el-form-item>
              <el-form-item label="州"  prop="state" >
                <el-input type="text" :disabled="inputDisabled" v-model="addressForm.state"></el-input>
              </el-form-item>
              <el-form-item label="国家"  prop="nation"  :required="!Disable">
                <CountryList :selectValue="addressForm.nation" :isDisabled="Disable" @child-change-val="changeCountry"></CountryList>
              </el-form-item>
              <el-form-item label="国家编码"  prop="nationCode"   >
                <el-input type="text"  :disabled="Disable" v-model="addressForm.nationCode"></el-input>
              </el-form-item>
              <el-form-item label="邮箱"  prop="email"  required>
                <el-input type="text" :disabled="inputDisabled" v-model="addressForm.email"></el-input>
              </el-form-item>
              <el-form-item label="电话/手机"  prop="tel"  >
                <el-input type="text" :disabled="inputDisabled" v-model="addressForm.tel"></el-input>
              </el-form-item>
              <el-form-item label="RA"  prop="isReturnAddress"  v-if="logisticsIdd =='02'">
                <el-select   filterable clearable v-model="addressForm.isReturnAddress" @change="changeCountry"  :disabled="inputDisabled">
                  <el-option v-for="item in Addressoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-form>
  </div>
</template>
<script>
  import ElButton from "../../../../node_modules/element-ui/packages/button/src/button";
  import ElInput from "../../../../node_modules/element-ui/packages/input/src/input";
  import ElOption from "../../../../node_modules/element-ui/packages/select/src/option";
  import CountryList from '../../../components/listData/getCountryList.vue';

  export default{
    name:'addressForm',
    components: {
      ElOption,
      ElInput,
      ElButton,
      CountryList

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
        Title:this.dialogTitle,
        Addressoptions:[
          {value:true,label:'是'},
          {value:false,label:'否'}
        ],
        countryOptions:[],//仓库对应国家
        selectOptions:[],//所有联系人
        addressForm:{
          parcelId:'',
          isOffenUse:false,
          firstAddresser:'',
          addressType:'Street',
          addresser2:'',
          addresser3:'',
          street:'',
          postNo:'',
          streetCode:'',
          address:'',
          postCode:'',
          city:'',
          state:'',
          nation:'',
          nationCode:'',
          email:'',
          tel:'',
          isReturnAddress:true,
          addressId:'',
          country:''
        },
        //addressForm:this.modelForm,
        dataValue:false,
        listId:this.getpoId,
        inputDisabled:this.Disabled,
        financeFormLabelWidth: '80px',
        logisticsIdd:this.logisticsId,
        type:this.typeName,
        infoaddressForm:{
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
        }
      }
    },
    props:['Disabled','getpoId','houseId','logisticsId','typeName','dialogTitle','modelForm'],
    computed:{
      Disable(){
      	var a=false;
        if(this.type=='发件人' || this.Disabled==true){
        	a = true;
        }else{
        	a=false;
        }
        return a;
      }
    },
    methods: {
      aaa(val){
      	 //alert(val)
      },
      changeName(val){
      	if(this.addressForm.addressId!=''){
          this.httpPost('manualPackage/loadAddresserMsg?addressId='+val).then(res=>{
            this.addressForm=res.data;
            console.log(res.data)
          })
        }
      },
      getCountry(){
      	this.httpPost('manualPackage/loadCountry?whId='+this.getpoId).then(res=>{
      		//this.countryOptions=res.data;

        })
      },
      changeCountry(val){
      	this.addressForm.nation=val.value;
        /*if(val == '3'){
      		this.$emit('changecountry-value')
        }*/
      },
      getFormList(){
        //console.log('88888 % 0====',this.addressForm)
        var url='',vm=this;
        //alert(vm.typeName)
        if(vm.typeName !==''  ){
          if(vm.Title!=='新建手动包裹单' ){
          	alert('编辑')
          	if(vm.typeName !=='联系人' ){
          		alert(vm.typeName)
              url= vm.typeName=='发件人'?'manualPackage/querySender' : vm.typeName=='收件人' ? 'manualPackage/queryAddressee':'';
              vm.httpPost(url+'?parcelId='+vm.getpoId).then(res=>{
                console.log('res.data % 0===',res.data)
                if(res.data !==null && res.data !=='' ){
                  vm.addressForm = res.data;
                }
              })
            }
          }
        }
      },
      gettypeService(){
        /*this.httpPost('manualPackage/queryTypeService?parcelId='+this.getpoId).then(res=>{
          if(res.data.addresser !== null){
            this.addressForm = JSON.parse(JSON.stringify(res.data.addresser));
          }
        })*/
      },
      getFuLL(){
      	this.httpPost('manualPackage/loadAddresser').then(res=>{
            this.selectOptions=res.data;
        })
      },
      submitForm(){
        //alert(this.typeName)
      	var a=false;
        this.$refs['addressForm'].validate((valid) => {
            if(valid){
                a = true;
            }else{
             	  a = false
            }

        })
        return a;
      },
      resetForm(){
      	//alert(888)
        this.$refs['addressForm'].resetFields();
       /* this.addressForm.parcelId='';
        this.addressForm.isOffenUse=false;
        this.addressForm.firstAddresser='';
        this.addressForm.addressType='Street';
        this.addressForm.addresser2='';
        this.addressForm.addresser3='';
        this.addressForm.street='';
        this.addressForm.postNo='';
        this.addressForm.streetCode='';
        this.addressForm.address='';
        this.addressForm.postCode='';
        this.addressForm.city='';
        this.addressForm.state='';
        this.addressForm.nation='';
        this.addressForm.nationCode='';
        this.addressForm.email='';
        this.addressForm.tel='';
        this.addressForm.isReturnAddress=true;
        this.addressForm.addressId='';
        this.addressForm.country='';*/
      },
    },
    mounted () {
      this.getFormList();
      //this.gettypeService();
      this. getFuLL();
      //this.getCountry();
    },
    watch: {
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
      'logisticsId':{
        handler(val){
          this.logisticsIdd = val;

        },
      },
      'getpoId':{
        handler(val){
          this.listId = val;
         //this.gettypeService();
          this.getFormList();
        },
      },
      'Disabled':{
        handler(val){
          this.inputDisabled = val;
        },
      },
      'addressForm':{
        handler(val){
          this.$emit('child-change-Val',{
            value:val,
            type:this.typeName
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


</style>
