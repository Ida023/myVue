<template>
  <div>
    <!--  新增/复制手工订单--------------------------->
    <el-dialog :title="orderTitle"  :visible.sync="orderDialog" :close-on-click-modal="false" size="small" @close="clearForm">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础信息" :disabled="true" name="0">
          <el-form :model="formData1" ref="formData1" label-width="150px" >
            <el-form-item label="平台" prop="channelId" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
              <platForm-list :select-value="formData1.channelId" :is-disabled="false" @getPla="getPla"></platForm-list>
            </el-form-item>
            <el-form-item label="账号信息" prop="accountId" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
              <account-list :select-value="formData1.accountId" :channel-id="formData1.channelId" :is-disabled="false" :is-use="orderDialog" @getData="getAccountNo"></account-list>
            </el-form-item>
            <el-form-item label="市场/站点" prop="countryNo" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
              <countryNo-list :select-value="formData1.countryNo" select-type="市场/站点" :account-id="formData1.accountId" :is-use="orderDialog" :is-disabled="false" @getData="getCountryNo"></countryNo-list>
            </el-form-item>
            <el-form-item label="发货仓库" prop="whId" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
              <warehouse-list :select-value="formData1.whId"  :is-disabled="false" @getData="getWarehouse"></warehouse-list>
            </el-form-item>
            <el-form-item label="物流方式" prop="logisticsMethod" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
              <logic-list :select-value="formData1.logisticsMethod" :wh-id="formData1.whId" :is-use="orderDialog" :is-disabled="false" @getData="getLogic"></logic-list>
            </el-form-item>
            <el-form-item label="订单币种" prop="currencyId" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
              <currency-list :select-value="formData1.currencyId" select-type="info" :is-disabled="false" @child-change-Val="getCurrency"></currency-list>
            </el-form-item>
            <el-form-item label="运费" prop="freightCost" required :rules="[{required:true,type:'number',message:'不能为空且需要大于等于零',trigger:'change'}]">
              <el-input v-model.number="formData1.freightCost" type="number" min="0" auto-complete="off" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="备注信息" prop="memo">
              <el-input type="textarea" v-model="formData1.memo"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品信息" :disabled="true" name="1" >
          <el-row style="margin-bottom: 15px">
            <el-col :span="4">
              <el-button type="primary" size="small" @click="skuDialog = true" class="el-icon-plus">添加SKU</el-button>
            </el-col>
            <div style="text-align: right;">
              <span style="margin-right: 20px;">物品总计：{{totalAmount}}</span>
              <span>订单总计：{{totalOrderAmount}}</span>
            </div>
          </el-row>
          <el-table :data="productData" id="table_padding" border tooltip-effect="dark" style="width: 100%" >
            <el-table-column label="操作"  prop="label" align="center" >
              <template scope="scope">
                <el-tooltip content="删除"  effect="dark" placement="bottom">
                  <i class="iconfontyyy"  @click="deleteData(scope.row,scope.$index,productData)">&#xe6f7;</i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column sortable label="图片" align="center" width="106px" prop="stockNo" >
              <template scope="scope">
                <img v-if="scope.row.imageUrl!=null" :src="scope.row.imageUrl"/>
              </template>
            </el-table-column>
            <el-table-column label="SKU"  prop="skuNo" align="center" ></el-table-column>
            <el-table-column label="商品名称"  prop="productName" align="center" ></el-table-column>
            <el-table-column label="SKU均价"  prop="avgPrice" align="center" ></el-table-column>
            <el-table-column label="本次售价"  prop="salesPrice" align="center" width="120px">
              <template scope="scope">
                <el-input type="number" min="0" v-model.number="scope.row.salesPrice" @change="getTotalAccount"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="数量"  prop="number" align="center" width="120px">
              <template scope="scope">
                <el-input type="number" min="0" v-model.number="scope.row.salesQty" @change="getTotalAccount"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="客户信息" :disabled="true" name="2">
          <el-form :model="formData3" ref="formData3" label-width="150px">
            <el-form-item label="客户ID" prop="customerId" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
              <el-input v-model="formData3.customerId"></el-input>
            </el-form-item>
            <el-form-item label="买家名" prop="customerName" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
              <el-input v-model="formData3.customerName" ></el-input>
            </el-form-item>
            <el-form-item label="买家邮箱" prop="customerEmail" required :rules="[{required:true,type:'email',message:'请输入正确的邮箱格式',trigger:'change'}]">
              <el-input v-model="formData3.customerEmail"></el-input>
            </el-form-item>
            <el-form-item label="收件人" prop="recipient" :rules="[{required:true,message:'不能为空',trigger:'change'}]">
              <el-input v-model="formData3.recipient"></el-input>
            </el-form-item>
            <el-form-item label="收件人地址1" prop="address1" :rules="[{required:true,message:'不能为空',trigger:'change'}]">
              <el-input v-model="formData3.address1"></el-input>
            </el-form-item>
            <el-form-item label="收件人地址2" prop="address2" >
              <el-input v-model="formData3.address2"></el-input>
            </el-form-item>
            <el-form-item label="收件人地址3" prop="address3" >
              <el-input v-model="formData3.address3"></el-input>
            </el-form-item>
            <el-form-item label="city" prop="city"  :rules="[{required:true,message:'不能为空',trigger:'change'}]">
              <el-input v-model="formData3.city"></el-input>
            </el-form-item>
            <el-form-item label="District" prop="district" :rules="[{required:true,message:'不能为空',trigger:'change'}]">
              <el-input v-model="formData3.district"></el-input>
            </el-form-item>
            <el-form-item label="State" prop="state"  :rules="[{required:true,message:'不能为空',trigger:'change'}]">
              <el-input v-model="formData3.state"></el-input>
            </el-form-item>
            <el-form-item label="Post Code" prop="postCode" :rules="[{required:true,message:'不能为空',trigger:'change'}]">
              <el-input v-model="formData3.postCode" type="number" min="0"></el-input>
            </el-form-item>
            <el-form-item label="Phone" prop="phone" :rules="[{required:true,message:'不能为空',trigger:'change'}]">
              <el-input v-model="formData3.phone" type="number" min="0"></el-input>
            </el-form-item>
            <el-form-item label="国家" prop="countryNo" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
              <countryNo-list :select-value="formData3.countryNo" select-type="国家" :account-id="formData1.accountId" :is-disabled="false" @getData="getCountryNo"></countryNo-list>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="付款信息" :disabled="true" name="3">
          <el-form :model="formData4"  ref="formData4" label-width="150px" >
            <el-form-item label="付款方式2" prop="payType" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
              <el-radio-group v-model="formData4.payType" >
                <el-radio label="1">PayPal</el-radio>
                <el-radio label="2">银行转账</el-radio>
                <el-radio label="3">现金</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="PayPal账号" v-if="formData4.payType == 1" prop="paypalAccountId" required :rules="formData4.payType == 1 ? [{required:true,message:'不能为空',trigger:'change'}] : []">
              <el-input size="small" v-model="formData4.paypalAccountId"></el-input>
            </el-form-item>
            <el-form-item label="PayPal交易号 "  v-if="formData4.payType == 1" prop="tradingNo" required :rules="formData4.payType == 1 ? [{required:true,message:'不能为空',trigger:'change'}] : []">
              <paypal-list :select-value="formData4.tradingNo"  :is-disabled="false" @getData="getPaypal"></paypal-list>
            </el-form-item>
            <el-form-item label="银行转账交易ID " prop="flowId"  v-if="formData4.payType == 2" required :rules="formData4.payType == 2 ? [{required:true,message:'不能为空',trigger:'change'}] : []">
              <el-select v-model="formData4.flowId" filterable clearable size="small" >
                <el-option :label="item" :key="item" :value="item" v-for="(item,index) in bankIdList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="交易ID详情"  label-width="150px"  v-if="formData4.payType == 2" prop="modelType" class="bigMargin"><br/>
              <el-row style="margin-left: -150px;">
                <span> 扩大范围</span>
                <el-input size="small" v-model.number="offsetPercent" style="width:40px;"></el-input>
                <el-button type="primary" size="small" @click="selectBankInfo" :loading="$store.state.loading">确定</el-button>
              </el-row>
              <div style="margin-top: -70px;overflow-x: auto;">
                <el-row type="flex" justify="start"  style="border: 1px solid #bfcbd9; margin-top: 10px;height:120px;min-width: 550px;"  v-for="(item,index) in list" :key="index">
                  <div style="border-right: 1px solid #bfcbd9;min-height: 120px;line-height:120px;text-align:center;width: 30px; " class="">
                    <el-radio class="radio none_label" :label="item.flowId" :key="item.flowId":value="item.flowId" v-model="formData4.flowId"></el-radio>
                  </div>
                  <div style="text-align: center;">
                      <span>{{item.tradingNo}}</span><br/>
                      <el-tooltip content="查看银行转账"  effect="dark" placement="bottom">
                        <i class="iconfontyyy" content="Bottom center" @click="getBankInfo(item.flowId)">&#xe600;</i>
                      </el-tooltip>
                  </div>
                  <div :span="16" style="border-left: 1px solid #bfcbd9;flex:1">
                    <el-row style="border-bottom: 1px solid #bfcbd9;padding: 0px;height:80px">
                      <span style="margin-left: 10px;">备注：</span>
                      <span class="">{{item.payMemo}}</span>
                    </el-row>
                    <el-row style="padding: 0px;height:40px">
                     <!-- <span >付款人</span>-->
                      <span style="margin-left: 10px;"class="">{{'付款人：'+item.payUserName}}</span>
                    </el-row>
                  </div>
                </el-row>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orderDialog = false;">取消</el-button>
        <el-button type="" @click="goPrev()" v-if="activeName!=0">上一步</el-button>
        <el-button type="" @click="goNext(activeName)" v-if="activeName!=3">下一步</el-button>
        <el-button type="primary" @click="saveOrderData('formData4')" v-if="activeName==3" :loading="$store.state.loading">保 存</el-button>
      </div>
    </el-dialog>
    <!--  查看银行转账--------------------------->
    <bank-transfer-dialog :id-value="bankData.id" :is-open="bankData.isOpen"></bank-transfer-dialog>
    <!--添加产品sku-->
    <el-dialog title="添加SKU" :visible.sync="skuDialog" :close-on-click-modal="false" size="small" @close="reFlash" class="add_product_wrap" id="add_product_wrap">
      <add-product :default-key="[]" ref="proData"></add-product>
      <div slot="footer" class="dialog-footer">
        <el-button @click="skuDialog = false;">取消</el-button>
        <el-button type="primary" @click="addSku()" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import bankTransferDialog from './bankTransfer.vue'
  import platFormList from "../../components/listData/getPlatformList.vue"
  import accountList from "../../components/listData/getStoreAccount.vue"
  import countryNoList from "../../components/listData/getCountryNo.vue"
  import warehouseList from "../../components/listData/getWarehouseOrder.vue"
  import logicList from "../../components/listData/getLogicByWhId.vue"
  import currencyList from '../../components/listData/getCurrencyList.vue'
  import paypalList from '../../components/listData/getPaypalAccount.vue'
  import addProduct from '../../components/singleTableData/addProduct.vue'
  export default{
    components: {platFormList,accountList,countryNoList,bankTransferDialog,warehouseList,logicList,currencyList,paypalList,addProduct},
    data(){
      return {
        bankData:{
          id:'',
          isOpen:false
        },
        list:[{payMemo:'交易ID1',tradingNo:'交易ID1',flowId:'交易ID1',payUserName:'11111111111111111111111111111111111111111111111'},],   //
        productData:[],   //
        statusOption:[],   //
        modelData:[{value:'1',label:'测试数据1'},{value:'2',label:'测试数据2'},{value:'3',label:'测试数据3'},{value:'4',label:'测试数据4'}],   //
        formData1:{
          orderId:'',
          memo:'',
          accountId:'',
          channelId:'',
          currencyId:'',
          logisticsMethod:'',
          whId:'',
          countryNo:'',
          freightCost:'',
        },
        formData3:{
          customerId:'',
          customerName:'',
          customerEmail:'',
          recipient:'',
          address1:'',
          address2:'',
          address3:'',
          city:'',
          district:'',
          state:'',
          postCode:'',
          countryNo:'',
        },
        formData4:{
          payType:'',
          paypalAccountId:'',
          tradingNo:'',
          flowId:'',
        },
        id:this.idValue,
        orderTitle:this.dialogTitle,
        orderDialog:false,
        skuDialog:false,
        activeName:'0',
        tabArr:['0','1','2','3','4'],     // tab 标签页数组
        skuForm:{
          skuNo:'',
        },
        totalAmount:'',   // 总计
        offsetPercent:'',
        totalOrderAmount:'',
        bankIdList:[],   //
      }
    },
    props:['idValue','isOpen','dialogTitle'],
    mounted () {

    },
    methods: {
      getUnboundedList:function(){  // 查询银行转账未绑定的交易
        var params = {totalAmount:0,offsetPercent:0};
        this.httpGet('financialFlowOrders/selectUnboundedList',params,'Sms').then(res =>{
          if(res.data){
            this.bankIdList = res.data.map(item =>item.flowId);
            this.list = res.data;
          }else{
            this.list = [];
            this.bankIdList = [];
          }
        })
      },
      deleteData:function(row,index,data){
        data.splice(index,1);
        this.getTotalAccount();
      },
      validateForm:function(val){
        var vm = this;
        vm.$refs[val].validate((valid) => {
          if (valid) {
              vm.activeName = vm.tabArr[vm.tabArr.indexOf(vm.activeName)+1];
          }else{
            return false;
          }
        });
      },
      goNext:function(val){
        switch(val){
          case '0':
            this.validateForm('formData1');
            break;
          case '1':
              if(this.productData.length < 1){
                  this.$message('商品不能为空！');
              }else{
                  var flag = this.productData.every(function(item){
                      return item.salesPrice > 0 && item.salesQty > 0;
                  })
                if(flag == true){
                  this.activeName = this.tabArr[this.tabArr.indexOf(this.activeName)+1];
                  this.getTotalAccount();
                }else{
                  this.$message('商品数量和价格均不能为空且须大于零！');
                }
              }
            break;
          case '2':
            this.validateForm('formData3');
            break;
        }
      },
      goPrev:function() {
        this.activeName = this.tabArr[this.tabArr.indexOf(this.activeName) - 1];
      },
      saveOrderData:function(formName){
        this.$refs[formName].validate((valid) =>{
          if(valid){
            this.formData1.payType = this.formData4.payType;
            this.formData1.paypalAccountId = this.formData4.paypalAccountId;
            this.formData1.tradingNo = this.formData4.tradingNo;
            this.formData1.flowId = this.formData4.flowId;
            var params = {
              orderInfo:this.formData1,
              orderItemList:this.productData,
              orderCustomer:this.formData3,
            }
            // if(this.formData1.payType != '' && this.formData1.payType != null){
              this.httpPost('orderInfo/saveManualOrder',params,'Sms').then(res =>{
                this.$message(res.data.message);
                if(res.data.result == true){
                  this.$emit('getData');
                  this.orderDialog = false;
                }
              })
           /* }else{
                //this.$message('付款方式不能为空！');
            }*/
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      reFlash:function(){
        this.$refs.proData.resetData();
        this.$refs.proData.clearSels();
      },
      addSku:function(){
        var vm = this,data = [];
        var selectData = JSON.parse(JSON.stringify(this.$refs.proData.returnData()));
              var idList = vm.productData.map(item =>item.productId);   // 当前现有产品id
              var newIdList = selectData.map(item =>item.productId);   // 所要添加的产品id
              var flag = selectData.every(function(item){
                return idList.indexOf(item.productId) == -1;
              })
              if(flag){
                newIdList = newIdList.join(',');
                this.httpGet('productInfo/selectBySkuNo',{productIds:newIdList},'Scm').then(res =>{
                  if(res.data){
                    res.data.forEach(function(item){
                      vm.productData.push({
                        productId:item.productId,
                        imageUrl:item.imageUrl,
                        productName:item.productName,
                        skuNo:item.skuNo,
                        avgPrice:item.avgPrice,
                        salesPrice:'',
                        salesQty:'',
                      })
                    })
                  }
             this.getTotalAccount();
             this.skuDialog = false;
          })
        }else{
          this.$message('不能选择已经添加的商品！');
        }
      },
      selectBankInfo:function(){
        var params = {totalAmount:this.totalOrderAmount,offsetPercent:this.offsetPercent};
        if(this.offsetPercent == ''){
            this.$message('查询参数不能为空！')
        }else{
          this.httpGet('financialFlowOrders/selectUnboundedList',params,'Scm').then(res =>{
              if(res.data){
                this.list = res.data;
              }else{
                this.list = [];
              }
          })
        }
      },
      getOrderInfo:function(){
        if(this.dialogTitle == '复制创建手工订单') {
          this.httpGet('orderInfo/selectCopiedOrder',{orderId:this.idValue},'Sms').then(res =>{
            if(res.data){
                if(res.data.orderInfo != null){
                  this.formData1 = res.data.orderInfo;
                }
                this.productData = res.data.orderItemList;
                this.formData3 = res.data.orderCustomer;
            }
          })
        }
      },
      getTotalAccount:function(){
        var priceItemArr = this.productData.map(item =>item.salesPrice*item.salesQty);
        ///var priceTotalArr = priceItemArr.map(item =>item);
        this.totalAmount = eval(priceItemArr.join("+"));
        this.totalOrderAmount = eval(eval(priceItemArr.join("+")) + this.formData1.freightCost);
      },
      getPla:function(val){
        this.formData1.channelId = val.value;
      },
      getAccountNo:function(val){
        this.formData1.accountId = val.value;
      },
      getCountryNo:function(val){
        val.type == '国家' ? this.formData3.countryNo = val.value : this.formData1.countryNo = val.value;
      },
      getWarehouse:function(val){
        this.formData1.whId = val.value;
      },
      getLogic:function(val){
        this.formData1.logisticsMethod = val.value;
      },
      getPaypal:function(val){
        this.formData4.tradingNo = val.value;
      },
      getBankInfo:function(val){
        this.bankData.isOpen = !this.bankData.isOpen;
        this.bankData.id = val;
      },
      getCurrency:function(val,index,data){
          this.formData1.currencyId = val.value;
      },
      resetForm:function(formName) {
        this.$refs[formName].resetFields();
      },
      clearForm:function(){
        this.resetForm('formData1');
        this.resetForm('formData3');
        this.productData = [];
        this.resetForm('formData4');
      },
    },
    watch:{
      'idValue':{
          handler(val){
            this.id = val;
          },
          deep:true
      },
      'isOpen':{
          handler(val){
            this.orderDialog = true;
            this.getOrderInfo();
            this.getUnboundedList();
            this.activeName = '0';
          },
          deep:true
      },
      'dialogTitle':{
          handler(val){
            this.orderTitle = val;
          },
          deep:true
      },
    }
  }
</script>
<style scoped>
.bigMargin{
  margin-bottom:  40px;
}
</style>
