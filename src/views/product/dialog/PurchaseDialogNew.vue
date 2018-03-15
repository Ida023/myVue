<template>
<div>
  <el-form :label-width="financeFormLabelWidth"  :model="PurchaseparentForm"  :rules="PurInfo"  ref="PurchaseparentForm">
  <h4>采购价格</h4>
    <el-form-item  label="最新不含税价"  prop="lastestPrice"  >
      {{PurchaseparentForm.lastestPrice}}CNY
      <span class="routerLinkright Astyel"  @click="tool.goToPage('supplierList')"  style="margin-left: 5px;">供应商管理</span>
    </el-form-item>
    <el-form-item  label="税率"  prop="taxRate"  required>
      {{PurchaseparentForm.taxRate}}%
    </el-form-item>
    <el-form-item  label="含税价"  prop=""  required>
      {{含税价}}CNY
    </el-form-item>
    <h4>供应商</h4>
    <el-form-item     prop="lastestPrice" label-width="20px">
      <el-table  id="item_list" class="publicCell"   border  tooltip-effect="dark" :data="listData" label-width=""   style="word-wrap:break-word;word-break:break-all;">
        <el-table-column label="首选/备选"    prop="skuNo" align="center"  sortable  ></el-table-column>
        <el-table-column label="供应商名称"    prop="skuNo" align="center"  sortable  width="200px" >
          <template scope="scope">
            <el-select size="small"
                       v-model="scope.row.aa"
                       placeholder="请选择"
                       @change="getProv($event)" :disabled="inputDisabled" clearable>
              <el-option
                v-for="item in provs"
                :label="item.vendorName"
                :value="item.vendorId"
                :key="item.vendorId">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="最小采购量" v-if="title=='编辑产品采购信息'"    prop="skuNo" align="center" colspan="2" sortable >
            <el-table-column   label="数量"  prop="skuNo" align="center" colspan="2" sortable >
              <template scope="scope">
                <el-input type="number"></el-input>
              </template>
            </el-table-column>
            <el-table-column   label="单位"   prop="skuNo" align="center" colspan="2" sortable >
              <template scope="scope">
                <el-input type="number"></el-input>
              </template>
            </el-table-column>
        </el-table-column>
        <el-table-column label="最小采购量" v-if="title!='编辑产品采购信息'"    prop="skuNo" align="center" colspan="2" sortable >
        </el-table-column>
        <el-table-column label="首次询价-不含税价" v-if="title=='编辑产品采购信息'"    prop="skuNo" align="center"  sortable >
          <el-table-column   label="价格"  prop="skuNo" align="center" colspan="2" sortable >
            <template scope="scope">
              <el-input type="number"></el-input>
            </template>
          </el-table-column>
          <el-table-column   label="币种"   prop="skuNo" align="center" colspan="2" sortable >
            <template scope="scope">
              <el-input type="number"></el-input>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="首次询价-不含税价" v-if="title=='查看非组合商品完整资料（含供应商）'"    prop="skuNo" align="center"  sortable >
        </el-table-column>
        <el-table-column label="税率"  v-if="title!='查看组合商品完整资料（含供应商）'"    prop="skuNo" align="center" sortable >
        </el-table-column>
        <el-table-column label="含税价格"  v-if="title!='查看组合商品完整资料（含供应商）'"  prop="skuNo" align="center"  sortable >
      </el-table-column>
        <el-table-column label="最新询价"  v-if="title=='查看组合商品完整资料（含供应商）'"   prop="skuNo" align="center"  sortable >
        </el-table-column>
        <el-table-column label="最新采购价"  v-if="title=='查看组合商品完整资料（含供应商）'"   prop="skuNo" align="center"  sortable >
        </el-table-column>
        <el-table-column label="询价历史"  v-if="title=='查看组合商品完整资料（含供应商）'"  prop="skuNo" align="center"  sortable >
        </el-table-column>
      </el-table>
    </el-form-item>
    <h4>{{title=='编辑产品采购信息'?'寻购':title=='查看非组合商品完整资料（含供应商）'?'人员信息':''}}</h4>
    <el-form-item  v-if="title=='编辑产品采购信息'"  label=""  prop=""  required label-width="20px">
      <el-select size="small"
                 placeholder="请选择"
                 @change="getProv($event)" :disabled="inputDisabled" clearable>
        <el-option
          v-for="item in provs"
          :label="item.vendorName"
          :value="item.vendorId"
          :key="item.vendorId">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item  v-if="title=='查看非组合商品完整资料（含供应商）'"  label=""  prop=""  required label-width="20px">
      <el-table  id="item_list" class="publicCell"   border  tooltip-effect="dark" :data="listData" label-width=""   style="word-wrap:break-word;word-break:break-all;">
        <el-table-column label="开发"    prop="skuNo" align="center" colspan="2" sortable >
        </el-table-column>
        <el-table-column label="跟单"    prop="skuNo" align="center"  sortable >

        </el-table-column>
        <el-table-column label="文案"    prop="skuNo" align="center"  sortable >

        </el-table-column>
        <el-table-column label="摄影"    prop="skuNo" align="center"  sortable >

        </el-table-column>
        <el-table-column label="美工"    prop="skuNo" align="center"  sortable >

        </el-table-column>
        <el-table-column label="销售"    prop="skuNo" align="center" sortable >

        </el-table-column>


      </el-table>
    </el-form-item>

  </el-form>
</div>
</template>
<script>
    export default{
      name:'purchaseDialog',
      components: {
     },
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
              listData:[{aa:11}],
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
      props:['inputDisabled','purchaseparentinfoDetail','productId','docmentNull','title'],
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
