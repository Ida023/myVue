<template>
  <div>
    <!------------------德邮邮票账号页面的 消费弹窗--------------------------->
    <el-dialog title="消费" :visible.sync="open" :close-on-click-modal="false" @close="payFormData.picIDs = [];picList=[];resetForm('payFormData')">
      <el-form :model="payFormData"  ref="payFormData" :label-width="labelWidth">
        <el-form-item label="邮票账号："  prop="postageAccountId" >{{formData.accountNo}}</el-form-item>
        <el-form-item label="账号币种："  prop="currencyId" >{{formData.currencyId}}</el-form-item>
        <el-form-item label="账户余额："  prop="amount" >{{formData.balance}}</el-form-item>
        <el-form-item label="备注："  prop="currencyId" >{{formData.memo}}</el-form-item>
        <el-form-item label="物流方式："  prop="logisticsType" :rules="{ required: true,message: '不能为空', trigger: 'change' }">
          <el-select v-model="payFormData.logisticsType" filterable clearable style="width: 100%;">
            <el-option v-for="item in logicData" :label="item.cnName" :key="item.methodId" :value="item.methodId" >{{item.cnName}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款金额："  prop="amount" :rules="{ required: true,message: '不能为空', trigger: 'change' }">
          <el-input type="number" min="0" v-model="payFormData.amount" ></el-input>
        </el-form-item>
        <el-form-item label="类型："  prop="consumeType" :rules="{ required: true,message: '不能为空', trigger: 'change' }">
          <el-select v-model="payFormData.consumeType" filterable clearable style="width: 100%;">
            <el-option v-for="item in options" :key="item.refId" :label="item.refValue" :value="item.refId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传邮票："  prop="picIDs" :rules="{ required: true,type:'array',message: '不能为空', trigger: 'change' }">
          <el-upload :http-request="uploadFilePic" action="11" list-type="picture-card" drag :file-list="picList" :id-list="payFormData.picIDs" :on-remove="handleRemove" accept=".jpg,.jpeg,.png">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="" @click="open = false">取消</el-button>
        <el-button type="primary" @click="submit('payFormData');" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
    export default{
        data(){
            return {
              labelWidth:'140px',
              mailId:this.mailIds,   // 邮票账号id
              open:this.isOpen,     // 是否打开dialog
              options1:['3*3+1','4*8','3*7','4*8（新）','3*7（新）','API购买（大）','API购买（小）','手工购买（切割3*7）','手工购买（切割3*8）','旧邮票转切割类型（小）','旧邮票转切割类型（大）','手工购买（切割4*7）',],
              options:[],
              reflash:this.callBack,  // 父组件的回调
              payFormData: {             //消费
                logisticsType: '',
                consumeType: '',
                currencyId: '',
                amount: '',
                picIDs:[],
              },
              picList:[],
              logicData:[],
              formData:{},
            }
        },
        props:['mailIds','isOpen','callBack'],
        mounted () {

        },
        methods: {
          getLogicData:function(){
            this.httpGet('logisticsMethod/queryTypeLogistics',{isUse:1}).then(res => {
              if(res.data.result == true){
                this.logicData = res.data.params.list;
              }
            }).catch(function(err){
              console.log(err);
            })
          },
          getType:function(){
            this.httpPost('refPostageStyle/selectList',{refId:''}).then(res => {
              if(res.data){
                this.options = res.data;
              }
            }).catch(function(err){
              console.log(err);
            })
          },
          showInfoDialog:function(){
            this.httpGet('financialAccountPostage/select',{accountId:this.mailId}).then(res =>{
              let data = res.data;
              this.formData = data;
            })
          },
          uploadFilePic(options){
            console.log(options);
            let data = new FormData();
            data.append(options.filename, options.file);
            this.httpPost('imageManage/saveAttach',data).then(res => {
              console.log(res);
              if(res.data.result == true){
                this.picList.push(res.data.params.attach);
                this.payFormData.picIDs = this.picList.map(item =>item.attachId);
              }
            })
          },
          handleRemove(file,fileList) {
            this.httpPost('removeVendorAttachData?attachId='+file.attachId).then(res =>{
              if(res.data.result == true){
                for(var i=0;i<this.payFormData.picIDs.length;i++){
                  if(this.payFormData.picIDs[i] == file.attachId){
                    this.payFormData.picIDs.splice(i,1);
                  }
                }
                for(var i=0;i< this.picList.length;i++){
                  if( this.picList[i].attachId == file.attachId){
                    this.picList.splice(i,1);
                  }
                }
              }else{
                this.$message(res.data.message);
              }
            })
          },
          submit:function(formName){
            this.$refs[formName].validate((valid) => {
              if (valid) {
                if(this.payFormData.picIDs.length>0){
                  this.payFormData.currencyId = this.formData.currencyId;
                  this.payFormData.payType = 2;
                  this.payFormData.postageAccountId = this.mailId;
                  if(this.payFormData.amount > 0 ){
                    var params = {
                      strList:this.payFormData.picIDs,
                      financialPaymentPostage:this.payFormData
                    }
                    //delete this.payFormData.picIDs;
                    this.httpPost('financialPaymentPostage/save',params,'Sms').then(res =>{
                      this.$message(res.data.message);
                      if(res.data.result == true){
                        this.open = false;
                        this.reflash();
                      }
                    })
                  }else{
                    this.$message('充值金额不能小于零！')
                  }
                }else{
                  this.$message('还未上传邮票！');
                }
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
          resetForm(formName) {
            this.$refs[formName].resetFields();
          },
        },
        watch:{
            'mailIds':{
                handler(val){
                    this.mailId = val;
                }
            },
          'isOpen':{
                handler(val){
                  this.open = true;
                  this.showInfoDialog();
                  this.getLogicData();
                  this.getType();
                }
            },
          'callBack':{
                handler(val){
                    this.reflash = val;
                }
            },
        }
    }
</script>

<style scoped>
</style>
