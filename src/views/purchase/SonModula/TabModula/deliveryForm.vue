<template>
<div>
  <h4>基本信息</h4>
  <el-form :model="delivery" :rules="infoDelivery" ref="delivery"  class="demo-ruleForm">
    <el-row :span="18" >
      <el-form-item label="采购仓库"  prop="whId" :label-width="financeFormLabelWidth"  >
        <OwnWarehouseList :isDisabled="inputDisabled" :selectValue="delivery.whId" @child-change-val="getChildren" select-type="whId"></OwnWarehouseList>
      </el-form-item>
      <el-form-item label="采购人员"  prop="poUserId" :label-width="financeFormLabelWidth"  >
        <Merchandiser @assignment="getChildren" :Selected="delivery.poUserId" :disState="inputDisabled"  select-type="userName"></Merchandiser>
      </el-form-item>
      <el-form-item label="供应商"  prop="vendorId" :label-width="financeFormLabelWidth" required >
        <Vendorlist :selectValue="delivery.vendorId" :isDisabled="true" @child-change-val="getChildren" select-type="vendorId"  ></Vendorlist>
      </el-form-item>
    </el-row>
    <h4>贷款信息</h4>
    <el-form-item label="币种"  prop="currencyId" :label-width="financeFormLabelWidth" >
      <el-col :span="8">
        <CurrencyList :isDisabled="inputDisabled" :selectValue="delivery.currencyId" @child-change-Val="getChildren" select-type="currencyId"></CurrencyList>
      </el-col>
    </el-form-item>
    <el-form-item label="货款小计(不含税价)"  prop="totalAmount" :label-width="financeFormLabelWidth"  >
        {{delivery.totalAmount}}
      <!--<el-col :span="8">
        <el-input type="number"  v-model="delivery.totalAmount" :disabled="inputDisabled"></el-input>
      </el-col>-->
    </el-form-item>
    <el-form-item label="税"  prop="memo" :label-width="financeFormLabelWidth" >
      <template>
        <el-col :span="24">
          <el-radio-group v-model="delivery.voucherType"  :disabled="inputDisabled"  @change="changeType">
            <el-radio :label="1">不开票</el-radio>
            <el-radio :label="2">普通发票</el-radio>
            <el-radio :label="3">增值发票</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="8" v-if="delivery.voucherType == '2' || delivery.voucherType == '3'"><el-input type="number" v-model="delivery.taxRate"  max="1"  min="0" :disabled="inputDisabled"></el-input>
        </el-col>
      </template>
    </el-form-item>
    <el-form-item label="货款小计(含税价)"  prop="" :label-width="financeFormLabelWidth" >
       {{Taxprice}}
    </el-form-item>
    <el-form-item label="运费"  prop="freightCost" :label-width="financeFormLabelWidth" >
      <el-col :span="8"> <el-input type="number"  v-model="delivery.freightCost" :disabled="inputDisabled"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="人工费"  prop="artificialCost" :label-width="financeFormLabelWidth" >
     <el-col :span="8"><el-input type="number"  v-model="delivery.artificialCost"  :disabled="inputDisabled"></el-input>
     </el-col>
    </el-form-item>
    <el-form-item label="抵扣费"  prop="deductionCost" :label-width="financeFormLabelWidth" >
      <el-col :span="8"> <el-input type="number"  v-model="delivery.deductionCost "  :disabled="inputDisabled"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="总计"  prop="" :label-width="financeFormLabelWidth" >
       {{allAmountnum}}
    </el-form-item>
    <el-form-item label="已付款"  prop="hasPayAmount" :label-width="financeFormLabelWidth" >
    {{delivery.hasPayAmount}}
    </el-form-item>
    <h4>交付信息</h4>
    <el-form-item label="交货方式"  prop="deliveryType" :label-width="financeFormLabelWidth"  :rules="{ required: true,min: 1, max: 20, message: '请选择交货方式！', trigger: 'blur' }">
      <el-select v-model="delivery.deliveryType" placeholder="请选择"   :disabled="inputDisabled" >
        <el-option
          v-for="item in deliveryoptions"
          :key="item.refId"
          :label="item.refValue"
          :value="item.refId">
        </el-option>
      </el-select>
      <!--<el-col :span="8"> <el-input  :disabled="inputDisabled" v-model="delivery.deliveryType"></el-input>
      </el-col>-->
    </el-form-item>
    <el-form-item label="交货地址"  prop="deliveryAddress" :label-width="financeFormLabelWidth"  >
      <el-col :span="8"> <el-input type="textarea"  :disabled="inputDisabled" v-model="delivery.deliveryAddress"></el-input></el-col>
    </el-form-item>
  </el-form>
</div>
</template>
<script>
  import OwnWarehouseList from 'components/listData/getOwnWarehouseList.vue'
  import { Merchandiser } from 'views/product/import_modular';
  import Vendorlist from 'components/listData/getVendorList.vue'
  import CurrencyList from 'components/listData/getCurrencyList.vue'
  import ElButton from "../../../../../node_modules/element-ui/packages/button/src/button";
  export default{
    	name:'deliveForm',
      components: {
        ElButton,
        OwnWarehouseList,Merchandiser,Vendorlist,CurrencyList},
      data(){
            return {
              deliveryoptions:[],
              delivery:{
              	rulesTest:/^[0-1].{1}[0-9]{0,4}$/,
                whId:'',
                poUserId:'',
                vendorId:'',
                currencyId:'',
                totalAmount:'0',
                voucherType:'',
                taxRate:'0',
                freightCost:'0',
                artificialCost:'0',
                deductionCost:'0',
                allAmount:'',
                hasPayAmount:'0',
                deliveryType:'',
                deliveryAddress:'',
              },
              dataValue:false,
              listId:this.getpoId,
              inputDisabled:this.dis,
              financeFormLabelWidth: '140px',
              infoDelivery:{
                whId:[
                  { required: true, message: '请选择仓库！', trigger: 'change' },
                  { min: 1, max: 500, message: '不能超过 500 个字符', trigger: 'change' }
                ],
                poUserId:[
                  { required: true, message: '请选择采购人员！', trigger: 'change' },
                  { min: 1, max: 500, message: '不能超过 500 个字符', trigger: 'change' }
                ],
                currencyId:[
                  { required: true, message: '请选择币种！', trigger: 'blur' },
                ],
                deliveryType:[
                  { required: true, message: '请选择交货方式！', trigger: 'change' },
                ],
                deliveryAddress:[
                  { required: true, message: '请填写交货地址！', trigger: 'blur' },
                  { min: 1, max: 500, message: '不能超过 500 个字符', trigger: 'blur' }
                ],

              }
            }
        },
      props:['getpoId','dis','tabtype','isopen'],
      computed:{
        allAmountnum(){
          return  parseFloat(Number(this.delivery.totalAmount * (Number(this.delivery.taxRate) + Number(1))) + Number(this.delivery.artificialCost) + Number(this.delivery.freightCost)   - Number(this.delivery.deductionCost)).toFixed(4) ;
        },
        Taxprice(){
        	return  parseFloat(Number(this.delivery.totalAmount * (Number(this.delivery.taxRate) + Number(1)))).toFixed(4);
        }
    },
        methods: {

      	  getdeliveryoptions(){
      	  	this.httpPost('productPurchase/deliveryMode').then(res=>{
                this.deliveryoptions = res.data;
            })
          },
          changeType(val){val == 1 ? this.delivery.taxRate = 0:'';},
          getChildren(val){
          	//alert(val.value)
          	val.type === 'whId' ? this.delivery.whId = val.value : val.type==='userName' ? this.delivery.poUserId = val.value : val.type === 'vendorId' ? this.delivery.vendorId = val.value : this.delivery.currencyId = val.value;
          },
          getList(){
            this.httpPost('/productPurchase/query?poId='+this.getpoId).then(res=>{
            	  if(res.data.delivery != null && res.data.delivery != '' ){
                  this.delivery = res.data.delivery;
                }
            })
          },
          submitForm(){
          	var obj={};
          	obj.poId = this.getpoId;
          	obj.delivery = this.delivery;
            this.$refs['delivery'].validate((valid) => {
                if (valid) {
                	if(this.delivery.voucherType!='1' && !/^[0]+(\.\d{1,8})?$/.test(this.delivery.taxRate)){
                    this.$message('请输入正确的税率格式！')
                  /*  if(!/^[0]+(\.\d{1,8})?$/.test(this.delivery.taxRate)){
                      this.$message('请输入正确的税率格式！')
                      //  this.dataValue = true;
                      // this.$emit('child-list',this.dataValue);
                    }else{
                    	alert(44)
                    }*/
                  }
                  else if(this.delivery.currencyId=='' || this.delivery.currencyId==null){
                    this.$message('请选择币种！')
                  } else {
                    this.httpPost('/productPurchase/edit',obj).then(res=>{
                      if(res.data.result == true){
                        this.$message(res.data.message);
                        this.dataValue = true;
                        this.$emit('child-list',this.dataValue);
                      }else{
                        this.$message(res.data.message);
                        this.dataValue = false;
                        this.$emit('child-list',this.dataValue);
                      }
                    })
                  }
                }else{


                }
            })
         /*   console.log('obj % 0==',obj)
            var arr=[];
          	var i=0;
          	for(var index in this.delivery){
          		i++;
          		if(this.delivery[index] == ''){
                arr.push(this.delivery[index])
              }
            }*/

          },
          resetForm(){
            this.$refs['delivery'].resetFields();
            this.delivery.whId='';
            this.delivery.poUserId='';
            this.delivery.vendorId='';
            this.delivery.currencyId='';
            this.delivery.totalAmount='';
            this.delivery.voucherType='1';
            this.delivery.taxCost='';
            this.delivery.freightCost='';
            this.delivery.artificialCost='';
            this.delivery.deductionCost='';
            this.delivery.allAmount='';
            this.delivery.hasPayAmount='0';
            this.delivery.deliveryType='';
            this.delivery.deliveryAddress='';
            },
        },
      mounted () {
        this.getList();
        this.getdeliveryoptions();

      },
      watch: {
        'isopen':{
          handler(val){
            if(val==true){
              this.getList();
            }else{
            	this.resetForm();
            }
          },
        },

        'getpoId':{
          handler(val){
            this.listId = val;
            this.getList();
          },
        },
        'dis':{
          handler(val){
          	//alert('222'+val)
            this.inputDisabled = val;
          },
        },
        'delivery': {
          handler: function (val) {
            console.log('val % 0==',val)
            this.$emit('child-list',{
              Model: val,
              type:this.tabtype,
              data:this.data
            });
          },
          deep: true,
        },
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
