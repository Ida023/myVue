<template>
<div>
  <el-form :label-width="financeFormLabelWidth"  :model="PurchaseparentForm"  :rules="PurInfo"  ref="PurchaseparentForm">
  <h4>采购价格</h4>
    <el-form-item  label="最新不含税价"  prop="lastestPrice"  >
      <el-col :span="6">
        <el-input   v-model="PurchaseparentForm.lastestPrice" :disabled="inputDisabled" ><template slot="append">CNY</template></el-input>
      </el-col>
      <span class="routerLinkright Astyel"  @click="tool.goToPage('supplierList')"  style="margin-left: 5px;">供应商管理</span>
    </el-form-item>
    <el-form-item  label="税率"  prop="taxRate"  required>
      <el-col :span="6">
        <el-input   v-model="PurchaseparentForm.taxRate" :disabled="inputDisabled" ><template slot="append">CNY</template></el-input>
      </el-col>
    </el-form-item>
    <el-form-item  label="含税价"  prop=""  required>
      <!--{{ parseFloat(Number(PurchaseparentForm.lastestPrice * (Number(PurchaseparentForm.taxRate) + Number(1)))).toFixed(4) }}  CNY-->
      <el-col :span="6">
        <el-input   v-model="allPrice" disabled ><template slot="append">CNY</template></el-input>
      </el-col>
    </el-form-item>
    <h4>供应商</h4>
    <el-form-item label="首选供应商" prop="firstVendor"  required  >
      <el-row :gutter="8">
        <el-col :span="6">
          <el-select size="small"
                     v-model="PurchaseparentForm.firstVendor"
                     placeholder="请选择"
                     @change="getProv($event)" :disabled="inputDisabled" clearable>
            <el-option
              v-for="item in provs"
              :label="item.vendorName"
              :value="item.vendorId"
              :key="item.vendorId">
            </el-option>
          </el-select>
        </el-col>
        <template>
          <el-col :span="8">
            <el-input v-model="PurchaseparentForm.firstMinQty"  :disabled="inputDisabled"><template slot="prepend">最小采购量</template><template slot="append">PCS</template></el-input>
          </el-col>
          <el-col :span="8">
            <el-input v-model="PurchaseparentForm.firstPrice"   :disabled="inputDisabled"><template slot="prepend">不含税价</template><template slot="append">CNY</template></el-input>
          </el-col>
        </template>
      </el-row>
    </el-form-item>
    <el-form-item label="" prop=""  required >
      <el-row :gutter="8">
        <el-col :span="6" style="margin-right:4px;">
            &nbsp;
        </el-col>
        <template>
          <el-col :span="8">
            <el-input v-model="PurchaseparentForm.firstTaxRate"  :disabled="inputDisabled"><template slot="prepend">税率</template><template slot="append">PCS</template></el-input>
          </el-col>
          <el-col :span="8">
            <!--<span>含税价: {{PriceOne}} CNY</span>-->
            <el-input v-model="PriceOne" disabled><template slot="prepend">含税价</template><template slot="append">CNY</template></el-input>
          </el-col>
        </template>
      </el-row>
    </el-form-item>
    <el-form-item label="备选供应商1">
      <el-row :gutter="8">
        <el-col :span="6">
          <el-select size="small"
                     v-model="PurchaseparentForm.vendor1"
                     placeholder="请选择"
                     @change="getProv($event)" :disabled="inputDisabled" clearable >
            <el-option
              v-for="item in provs"
              :label="item.vendorName"
              :value="item.vendorId"
              :key="item.vendorId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-input v-model="PurchaseparentForm.vendor1MinQty" :disabled="inputDisabled"><template slot="prepend">最小采购量</template><template slot="append">PCS</template></el-input>
        </el-col>
        <el-col :span="8">
          <el-input v-model="PurchaseparentForm.vendor1Price" :disabled="inputDisabled"><template slot="prepend">不含税价</template><template slot="append">CNY</template></el-input>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="" prop=""  >
      <el-row :gutter="8">
        <el-col :span="6" style="margin-right:4px;">
          &nbsp;
        </el-col>
        <template>
          <el-col :span="8">
            <el-input v-model="PurchaseparentForm.vendor1TaxRate"  :disabled="inputDisabled"><template slot="prepend">税率</template><template slot="append">PCS</template></el-input>
          </el-col>
          <el-col :span="8">
            <!--<span>含税价: {{PriceTwo}} CNY</span>-->
            <el-input v-model="PriceTwo" disabled><template slot="prepend">含税价</template><template slot="append">CNY</template></el-input>
          </el-col>
        </template>
      </el-row>
    </el-form-item>
    <el-form-item label="备选供应商2">
      <el-row :gutter="8">
        <el-col :span="6">
          <el-select size="small"
                     v-model="PurchaseparentForm.vendor2"
                     placeholder="请选择"
                     @change="getProv($event)" :disabled="inputDisabled" clearable >
            <el-option
              v-for="item in provs"
              :label="item.vendorName"
              :value="item.vendorId"
              :key="item.vendorId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-input v-model="PurchaseparentForm.vendor2MinQty" max="9" min="1" :disabled="inputDisabled"><template slot="prepend">最小采购量</template><template slot="append">PCS</template></el-input>
        </el-col>
        <el-col :span="8">
          <el-input v-model="PurchaseparentForm.vendor2Price" max="9" min="1" :disabled="inputDisabled"><template slot="prepend">不含税价</template><template slot="append">CNY</template></el-input>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="" prop=""    >
      <el-row :gutter="8">
        <el-col :span="6" style="margin-right:4px;">
          &nbsp;
        </el-col>
        <template>
          <el-col :span="8">
            <el-input v-model="PurchaseparentForm.vendor2TaxRate"  :disabled="inputDisabled"><template slot="prepend">税率</template><template slot="append">PCS</template></el-input>
          </el-col>
          <el-col :span="8">
            <!--<span>含税价: {{PriceThree}} CNY</span>-->
            <el-input v-model="PriceThree" disabled><template slot="prepend">含税价</template><template slot="append">CNY</template></el-input>
          </el-col>
        </template>
      </el-row>
    </el-form-item>
    <el-form-item label="备选供应商3">
      <el-row :gutter="8">
        <el-col :span="6">
          <el-select size="small"
                     v-model="PurchaseparentForm.vendor3"
                     placeholder="请选择"
                     @change="getProv($event)" :disabled="inputDisabled"  clearable>
            <el-option
              v-for="item in provs"
              :label="item.vendorName"
              :value="item.vendorId"
              :key="item.vendorId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-input v-model="PurchaseparentForm.vendor3MinQty" max="9" min="1" :disabled="inputDisabled"><template slot="prepend">最小采购量</template><template slot="append">PCS</template></el-input>
        </el-col>
        <el-col :span="8">
          <el-input v-model="PurchaseparentForm.vendor3Price" max="9" min="1"  :disabled="inputDisabled"><template slot="prepend">不含税价</template><template slot="append">CNY</template></el-input>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="" prop=""   >
      <el-row :gutter="8">
        <el-col :span="6" style="margin-right:4px;">
          &nbsp;
        </el-col>
        <template>
          <el-col :span="8">
            <el-input v-model="PurchaseparentForm.vendor3TaxRate"  :disabled="inputDisabled"><template slot="prepend">税率</template><template slot="append">PCS</template></el-input>
          </el-col>
          <el-col :span="8">
            <!--<span>含税价: {{Pricefour}} CNY</span>-->
            <el-input v-model="Pricefour" disabled ><template slot="prepend">含税价</template><template slot="append">CNY</template></el-input>
          </el-col>
        </template>
      </el-row>
    </el-form-item>
  </el-form>
</div>
</template>
<script>
    export default{
      name:'purchaseDialog',
      data(){
        let importRate2 = (rule, value, callback) => {
          if (value === null) {
            callback(new Error('请输入该字段'));
          } else if(!/^\d+(\.\d{0,4})?$/.test(value)){
            callback(new Error('请输入正确格式'));
          } else {
            callback();
          }
        };
        let importRate3 = (rule, value, callback) => {
          if (value === null) {
            callback(new Error('请输入该字段!'));
          } else if(!/^[0]+(\.\d{1,8})?$/.test(value)){
            callback(new Error('请输入正确格式!'));
          } else {
            callback();
          }
        };
            return {
              PriceOnee:'',
              PriceTwoo:'',
              PriceThreee:'',
              PriceFourr:'',
              PriceAll:'',
              provs:[],
              props:{
                label:'vendorName',
                value:'vendorId'
              },
              financeFormLabelWidth: '120px',
              PurchaseparentForm:{
                productId:this.productId,
                lastestPrice:'',
                firstVendor:'',
                firstMinQty:'',
                firstPrice: '',
                taxRate:'',
                firstTaxRate:'',
                vendor1:'',
                vendor1TaxRate:'',
                vendor1MinQty:'',
                vendor1Price:'',
                vendor2:'',
                vendor2TaxRate:'',
                vendor2MinQty:'',
                vendor2Price:'',
                vendor3:'',
                vendor3TaxRate:'',
                vendor3MinQty:'',
                vendor3Price:''
              },
              docmentNulll:this.docmentNull,
              acTicve:this.purchaseparentinfoDetail,
              inputDisabledd:this.inputDisabled,//区分查看编辑
              PurInfo:{
                lastestPrice:[
                  {validator: importRate2, required: true, trigger: 'blur'}
                ],
                taxRate:[
                   { validator:importRate3, type: 'number', required: true,  trigger: 'blur'}
                ]
              }
            }
        },
      computed: {
        allPrice: {
          set: function (value) {
            this.PriceOnee = value;
          },
          get: function () {
            return parseFloat(Number(this.PurchaseparentForm.lastestPrice * (Number(this.PurchaseparentForm.taxRate) + Number(1)))).toFixed(4);
          }
        },
        PriceOne: {
          set: function (value) {
            this.PriceOnee = value;
          },
          get: function () {
            return parseFloat(Number(this.PurchaseparentForm.firstPrice * (Number(this.PurchaseparentForm.firstTaxRate) + Number(1)))).toFixed(4);
          }
        },
        PriceTwo: {
          set: function (value) {
            this.PriceTwoo = value;
          },
          get: function () {
            return parseFloat(Number(this.PurchaseparentForm.vendor1Price * (Number(this.PurchaseparentForm.vendor1TaxRate) + Number(1)))).toFixed(4);
          }
        },
        PriceThree: {
          set: function (value) {
            this.PriceThreee = value;
          },
          get: function () {
            return parseFloat(Number(this.PurchaseparentForm.vendor2Price * (Number(this.PurchaseparentForm.vendor2TaxRate) + Number(1)))).toFixed(4);
          }
        },
          Pricefour: {
            set: function (value) {
              this.PriceFourr = value;
            },
            get: function () {
              return parseFloat(Number(this.PurchaseparentForm.vendor3Price * (Number(this.PurchaseparentForm.vendor3TaxRate) + Number(1)))).toFixed(4);
            }
          }
      },
      props:['inputDisabled','purchaseparentinfoDetail','productId','docmentNull'],
      watch:{
        	'productId'(val){
        		this.PurchaseparentForm.productId=val;
          },
        'docmentNull'(val){
        		this.docmentNulll = val;
        },
        'inputDisabled'(val){
        	this.inputDisabledd = val;
        },
        'purchaseparentinfoDetail'(val){
        	this.acTicve = val;
          this.requestem();
        },
        'PurchaseparentForm':{
          handler: function() {
          	console.log('this.PurchaseparentForm222222 % 0',this.PurchaseparentForm)
            this.$emit('parentmsggll',this.PurchaseparentForm);
          },
          deep: true,
        }
      },
      mounted: function () {
        this.requestem();
      },
      methods: {
        ResetFrom(){
          this.$refs['PurchaseparentForm'].resetFields();
          this.PurchaseparentForm.firstTaxRate = '';
          this.PurchaseparentForm.vendor1TaxRate = '';
          this.PurchaseparentForm.vendor2TaxRate = '';
          this.PurchaseparentForm.vendor3TaxRate = '';
          this.PurchaseparentForm.lastestPrice='';
          this.PurchaseparentForm.firstVendor='';
          this.PurchaseparentForm.firstMinQty='';
          this.PurchaseparentForm.firstPrice='';
          this.PurchaseparentForm.vendor1='';
          this.PurchaseparentForm.vendor1MinQty='';
          this.PurchaseparentForm.vendor1Price='';
          this.PurchaseparentForm.vendor2='';
          this.PurchaseparentForm.vendor2MinQty='';
          this.PurchaseparentForm.vendor2Price='';
          this.PurchaseparentForm.vendor3='';
          this.PurchaseparentForm.vendor3MinQty='';
          this.PurchaseparentForm.vendor3Price='';
        },
        submitForm() {
          var endorArr=[];
          endorArr=[];
        	var _this = this;
        	var req=false;
          var reqs=true;
          var regs=/^[0]+(\.\d{1,8})?$/;
          endorArr.push(_this.PurchaseparentForm.firstVendor);
          endorArr.push(_this.PurchaseparentForm.vendor1);
          endorArr.push(_this.PurchaseparentForm.vendor2);
          endorArr.push(_this.PurchaseparentForm.vendor3);
          //alert(endorArr.length)
            var arr=[];
            var json={};
            for(var i=0;i<endorArr.length;i++) {
            	if(endorArr[i] != null && endorArr[i] != ''){
                if(!json[endorArr[i]]) {
                  arr.push(endorArr[i]);
                  json[endorArr[i]]=1;
                  reqs= true;
                }else{
                  reqs= false;
                  break;
                }
              }
            }
          this.$refs['PurchaseparentForm'].validate((valid) => {
            if (valid) {
            	if( _this.PurchaseparentForm.firstMinQty === null || _this.PurchaseparentForm.firstPrice === null || _this.PurchaseparentForm.firstMinQty === ''|| _this.PurchaseparentForm.firstPrice === '' || _this.PurchaseparentForm.taxRate === '' || _this.PurchaseparentForm.firstTaxRate==='') {
                _this.$message('必填项不能为空！')
              }else if(!regs.test(_this.PurchaseparentForm.firstTaxRate)){
                this.$message('请输入正确的税率格式！')
              }else if(reqs === false){
                this.$message('供应商不能重复选择！')
              }
              else{
                req=true;
              }
            }  else  {
              req=false;
            }
          });
    /*      this.$refs['PurchaseparentForm'].validate((valid) => {
            if (valid) {
              if( _this.PurchaseparentForm.firstMinQty === null || _this.PurchaseparentForm.firstPrice === null || _this.PurchaseparentForm.firstMinQty === ''|| _this.PurchaseparentForm.firstPrice === '' || _this.PurchaseparentForm.taxRate === '' || _this.PurchaseparentForm.firstTaxRate==='') {
                _this.$message('必填项不能为空！')
              }else if(!regs.test(_this.PurchaseparentForm.firstTaxRate)){
                this.$message('请输入正确的税率格式！')
              }
              else{
                req=true;
              }
            }  else  {
              req=false;
            }
          });*/
          return req;
        },
        requestem(){
        	var _this=this;
        	if(_this.acTicve == 2){
        		if(this.docmentNulll == false){

               //alert('xinzeng')
            }else {
//        			alert('chakan')
              _this.httpPost('product/queryPurchaseMessage?productId='+ _this.PurchaseparentForm.productId).then(res=>{
                console.log('res.data查看编辑===== % 0',res.data)
                _this.PurchaseparentForm.lastestPrice = res.data.lastestPrice;
                _this.PurchaseparentForm.taxRate=res.data.taxRate;
                _this.PurchaseparentForm.firstVendor = res.data.firstVendor;
                _this.PurchaseparentForm.firstMinQty = res.data.firstMinQty;
                _this.PurchaseparentForm.firstPrice = res.data.firstPrice;
                _this.PurchaseparentForm.firstTaxRate = res.data.firstTaxRate;
                _this.PurchaseparentForm.vendor1 = res.data.vendor1;
                _this.PurchaseparentForm.vendor1MinQty = res.data.vendor1MinQty;
                _this.PurchaseparentForm.vendor1Price = res.data.vendor1Price;
                _this.PurchaseparentForm.vendor1TaxRate = res.data.vendor1TaxRate;


                _this.PurchaseparentForm.vendor2 = res.data.vendor2;
                _this.PurchaseparentForm.vendor2MinQty = res.data.vendor2MinQty;
                _this.PurchaseparentForm.vendor2Price = res.data.vendor2Price;
                _this.PurchaseparentForm.vendor2TaxRate = res.data.vendor2TaxRate;

                _this.PurchaseparentForm.vendor3 = res.data.vendor3;
                _this.PurchaseparentForm.vendor3MinQty = res.data.vendor3MinQty;
                _this.PurchaseparentForm.vendor3Price = res.data.vendor3Price;
                _this.PurchaseparentForm.vendor3TaxRate = res.data.vendor3TaxRate;


              })
            }
            _this.httpPost('product/loadVender').then(res=>{
            	_this.provs =res.data;
              console.log('res.data所有===== % 0',res.data)
            })
          }


        },
        getProv(val){

        }


        }
    }

</script>

<style scoped>


  a.routerLinkright {
    color:#20a0ff;
    float: right;
  }

</style>
