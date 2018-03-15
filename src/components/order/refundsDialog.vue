<template>
  <div>
    <!--  退款 弹出框--------------------------->
    <el-dialog title="退款" :visible.sync="refundsDialog" :close-on-click-modal="false" size="small"  @close="resetForm">
      <el-form label-width="180px" :model="formData"  ref="formData">
        <el-form-item label="退款类型：" prop="refundType" required :rules="[{required:true,type:'number',message:'不能为空',trigger:'change'}]">
          <el-radio-group v-model="formData.refundType">
            <el-radio :label="0">退款申请</el-radio>
            <el-radio :label="1" v-if="formData.channelId=='02'">直接退款</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="退款原因：" prop="rmaId" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
<!--
          <el-input v-model="formData.title"></el-input>
-->
          <el-select v-model="formData.rmaId" placeholder="请选择"  >
            <el-option v-for="item in rmaIdoptions" :key="item.rmaId" :label="item.rmaDesc" :value="item.rmaId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="全部/部分退款：" prop="refundOption" v-if="formData.refundType!=1" required :rules="formData.refundType==1 ? [{required:true,type:'number',message:'不能为空',trigger:'change'}]:[]">
          <el-radio-group v-model="formData.refundOption">
            <el-radio :label="0">全部退款</el-radio>
            <el-radio :label="1">部分退款</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="退款金额：" prop="refundAmount" required :rules="formData.refundOption == 1 && formData.refundType == 0?[{required:true,message:'不能为空',trigger:'change'}]:[]">
          <el-col v-if="formData.refundOption == 1 && formData.refundType == 0" >
            <el-col :span="8"><el-input v-model="formData.refundAmount" ></el-input> </el-col>
           <el-col :span="5"><span>&nbsp;{{formData.currencyId}}</span></el-col>
          </el-col>
          <span  v-if="formData.refundOption == 0 || formData.refundType == 1">该订单的金额：{{formData.refundAmount}}{{formData.currencyId}}</span>
        </el-form-item>
        <el-form-item label="是否已发货："  prop="isShipped" required :rules="[{required:true,type:'number',message:'不能为空',trigger:'change'}]">
          <el-radio-group v-model="formData.isShipped" disabled>
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否需退件：" v-if="formData.isShipped==1" prop="returnOption" required :rules="formData.isShipped==0 ? [{required:true,type:'number',message:'不能为空',trigger:'change'}]:[]">
          <el-radio-group v-model="formData.returnOption" @change="getResendData">
            <el-radio :label="0">不需要</el-radio>
            <el-radio :label="1">需要部分退回</el-radio>
            <el-radio :label="2">需要全部退回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否已完成退款："  v-if="formData.refundType==0"  prop="isRefunded" required :rules="formData.refundType==1 ? [{required:true,type:'number',message:'不能为空',trigger:'change'}] : []">
          <el-radio-group v-model="formData.isRefunded" disabled>
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="退款方式：" v-if="formData.refundType!=1 "  prop="refundMethod" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <el-select v-model="formData.refundMethod" placeholder="请选择" >
            <el-option v-for="item in modelData" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退款方式：" v-if="formData.refundType==1 " prop="refundMethod" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
         {{formData.refundMethod}}
        </el-form-item>
        <el-form-item v-if="formData.refundType==1 || formData.refundMethod=='1'" label="Paypal账号" prop="content">{{formData.tradingAccount}}</el-form-item>
        <el-form-item v-if="formData.refundType==1 || formData.refundMethod=='1'" label="PayPal交易号" prop="content">{{formData.tradingNo}}</el-form-item>
        <el-form-item label="图片：" v-if="formData.refundType==0" prop="list" class="picture"  :rules="formData.refundType==1 ? [{required:true,type:'array',message:'不能为空',trigger:'change'}]:[]">
          <el-upload :http-request="uploadFilePic" :on-remove="handleRemove" :action="uploadPic" list-type="picture-card" drag multiple :file-list="attachList" :list-data="formData.attachIds"  accept=".jpg,.jpeg,.png">
            <el-button size="small" type="primary" >点击上传</el-button>
          </el-upload>
          <!--   <el-upload :http-request="uploadFilePic" :action="uploadPic" list-type="picture-card" drag multiple :file-list="attachList" :list-data="formData.attachIds"  accept=".jpg,.jpeg,.png">
               <el-button size="small" type="primary" >点击上传</el-button>
             </el-upload>-->
        </el-form-item>
        <el-form-item label="退款备注：" prop="memo" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <el-input type="textarea" v-model="formData.memo" :autosize="{ minRows: 6, maxRows: 10}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refundsDialog = false;">取消</el-button>
        <el-button type="primary" @click="submitResendData()" :loading="$store.state.loading">确定</el-button>
      </div>
    </el-dialog>
<!--    <el-dialog title="重寄需退件物品选择" :visible.sync="resendDialog" :close-on-click-modal="false" size="small">
      <el-form :model="resendForm" ref="resendForm" labelWidth="20px" >
        <el-form-item label=" " prop="list" required :rules="[{required:true,message:'不能为空',type:'array',trigger:'change'}]"  class="table_padding">
          <el-row style="margin-bottom: 10px;" type="flex" justify="space-between">
            <el-col :span="6">订单产品信息:</el-col>
            <el-col  class="skuDialog" :span="16">
              <el-col  v-show="skuDialog == true">
                <el-col :span="10" class="marginR"> <el-input type="text" v-model="skuData.sku" placeholder="请输入SKU" size="small"></el-input></el-col>
                <el-col :span="5" ><el-input type="number"min="0"  v-model="skuData.number"  placeholder="请输入数量" size="small"></el-input></el-col>
                <el-button size="small" @click="skuDialog = false;">取 消</el-button>
                <el-button size="small" type="primary" @click="addProduct" :loading="$store.state.loading">确 定</el-button>
              </el-col>
              <el-button size="small" type="primary" @click="skuDialog = true"  v-if="skuDialog == false" >添加</el-button>
            </el-col>
          </el-row>
          <el-table :data="resendForm.list" style="width: 100%"  border tooltip-effect="dark" >
            <el-table-column   label="操作"  align="center">
              <template scope="scope">
                <el-tooltip content="删除" effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="deleteData(scope.row,scope.$index,resendForm.list)">&#xe6f7;</i>
                </el-tooltip>
                <el-tooltip content="打印"  effect="dark" placement="bottom" >
                  <i  class="iconfontyyy" content="Bottom center" @click="">&#xe638;</i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="图片" prop="parcelNo" align="center"  sortable  >
              <template scope="scope">
                <img v-if="scope.row.Image_Url!=null" style="width: 70px; height: 70px;" :src="RmsUrl+scope.row.Image_Url"/>
              </template>
            </el-table-column>
            <el-table-column label="商品名称" prop="name" align="center" sortable></el-table-column>
            <el-table-column label="SKU" prop="name" align="center"  sortable >
              <template scope="scope">
                <el-tooltip content="商品库存"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="tool.goToPage('commodityStock?Id='+scope.row.name)">&#xe6f6;</i>
                </el-tooltip>
                <el-tooltip content="历史销量"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="tool.goToPage('HistoricalSales?Id='+scope.row.name);">&#xe61b;</i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="尺寸" prop="name" align="center"  sortable  ></el-table-column>
            <el-table-column label="数量"  prop="number" align="center"  sortable  >
              <template scope="scope">
                <el-input type="number" v-model="scope.row.number" min="0"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label=" " prop="name" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <span>退回仓库</span><br/>
          <el-select v-model="resendForm.name" placeholder="请选择" >
            <el-option v-for="item in modelData" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" " prop="name" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <span>退回配送方式</span><br/>
          <el-select v-model="resendForm.name" placeholder="请选择" >
            <el-option v-for="item in modelData" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" " prop="name" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <span>重寄需退件物品备注</span><br/>
          <el-input type="textarea" v-model="resendForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="resendDialog = false;">取消</el-button>
        <el-button type="primary" @click="submitResendData('resendForm')">确定</el-button>
      </div>
    </el-dialog>-->
    <!------------------重寄需退件物品选择 弹出框--------------------------->
    <pre-withdrawal :id-value="resendForm.id" :is-open="resendForm.isOpen" :add-btn="true" dialog-title="重寄需退件物品选择"></pre-withdrawal>
  </div>
</template>
<script>
  import resendDialog from './pre-withdrawal.vue'
  export default{
    components:{resendDialog},
    data(){
      return {
        attachList:[],
        deptList:[],   //
        statusOption:[],   //
        modelData:[{value:'1',label:'Paypal'},{value:'2',label:'银行转账'},{value:'3',label:'现金'}],   //
        formData:{
          channelId:'',
          requestId:'',
          orderId:'',
          refundType:0,
          rmaId:'',
          refundOption:0,
          refundAmount:'',
          isRefunded:1,
          currencyId:'',
          returnOption:0,
          refundMethod:'',
          tradingAccount:'',
          tradingNo:'',
          attachIds:[],
          isShipped:1,
        },
        resendForm:{  // 发起预退件 子组件传参
          id:'',
          isOpen:false,
        },
        skuData:{
            sku:'',
            number:'',
        },
        id:this.idValue,
        refundsDialog:false,
        skuDialog:false,
        rmaIdoptions:[],
        requestId:this.requestIdValue
      }
    },
    props:['idValue','isOpen','requestIdValue'],
    mounted () {
      //this.getData();
      this.getformData();
      this.getrmaIdoptions();
    },
    methods: {
      uploadFilePic(options){
        console.log(options);
        let data = new FormData();
        data.append(options.filename, options.file);
        this.httpPost('imageManage/saveAttach',data).then(res => {
          console.log(res);
          if(res.data.result == true){
            this.attachList.push(res.data.params.attach);
            this.formData.attachIds = this.attachList.map(item =>item.attachId);
          }
        })
      },
      handleRemove(file,fileList) {
        console.log(fileList);
        this.httpPost('removeVendorAttachData?attachId='+file.attachId).then(res =>{
          if(res.data.result == true){
            for(var i=0;i< this.formData.attachIds.length;i++){
              if( this.formData.attachIds[i] == file.attachId){
                this.formData.attachIds.splice(i,1);
              }
            }
            for(var i=0;i< this.attachList.length;i++){
              if( this.attachList[i].attachId == file.attachId){
                this.attachList.splice(i,1);
              }
            }
          }else{
            this.$message(res.data.message);
          }
        })
      },
      resetForm(){ this.$refs['formData'].resetFields();this.formData.attachIds=[]; this.attachList=[]},
      /*获取退件信息*/
    	getformData(){
  	  this.httpGet('orderRefund/selectPrepareData?orderId='+this.idValue,'','sms').then(res=>{
  	  	if(res.data!=''){
          this.formData.refundAmount=res.data.payedAmount;
          this.formData.isShipped=res.data.isShipped==false?0:1;
          this.formData.isRefunded=res.data.isRefunded==false?0:1;
          this.formData.tradingNo=res.data.tradingNo;
          this.formData.tradingAccount=res.data.payedAmount;
          this.formData.currencyId=res.data.currencyId;
          this.formData.channelId=res.data.channelId;

          //console.log('lll% 0',this.formData)
        }
      })
      },
      /*重寄原因*/
      getrmaIdoptions(){
        this.httpGet('/orderRmaCfg/selectList','','').then(res=>{
          if(res.data!=[]){
            this.rmaIdoptions=res.data;
          }
        })
      },
      submitResendData:function(){
      	this.formData.orderId=this.idValue;
        this.formData.requestId=this.requestIdValue;
         this.$refs['formData'].validate((valid) =>{
           if(valid){
              this.httpPost('orderRefund/save',this.formData).then(res =>{
              	this.$message(res.data.message)
              if(res.data.result == true){
                this.$emit('getData');
                this.refundsDialog = false;
               }
              })
           } else {
             console.log('error submit!!');
             return false;
           }
         })
      },
      getResendData:function(val){
        if(val ==1 || val == 2){
            this.resendForm.isOpen = !this.resendForm.isOpen;
            this.resendForm.id = this.idValue;
        }
      },
      /* addProduct:function(){
       if(this.skuData.sku == '' || this.skuData.number =='' || this.skuData.number < 0){
       this.$message('sku和数量为必填项，且数量不能小于零！')
       }else{
       this.resendForm.list.push({name:this.skuData.sku,number:this.skuData.number});
       this.skuDialog = false;
       this.tool.clearObjValue(this.skuData);
       }
       },*/
      /*   submit:function(){
       this.$refs['formData'].validate((valid) =>{
       if(valid){
       alert('success');
       this.refundsDialog = false;
       /!* this.httpPost('addresser/selectCountry',this.formData).then(res =>{
       if(res.data.result == true){
       this.$emit('submitEmail');
       }
       })*!/
       } else {
       console.log('error submit!!');
       return false;
       }
       })
       },*/
      /*   deleteData:function(row,index,data){
       data.splice(index,1)
       },*/
      /*    getData(){
       this.httpPost('addresser/selectCountry').then(res =>{
       if(res.data.result == true){
       this.options = res.data.params.list;
       }
       })
       },*/
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
            this.refundsDialog = true;
            this.getformData();
          },
      },
      'requestIdValue':{
        handler(val){
          this.requestId = val;

        },
      }
    }
  }
</script>
<style scoped>
  .skuDialog{
  float: right;
  text-align: right;
  line-height: 38px;
}
.marginR{
  margin-right: 2px;
}

</style>
