<template>
  <div>
    <!--  手工同步订单--------------------------->
    <el-dialog title="手工同步订单"  :visible.sync="manualDialog" :close-on-click-modal="false" size="small" @close="resetForm('formData')">
      <el-form :model="formData" ref="formData" label-width="100px" >
        <el-form-item label="平台" prop="channelId" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <platForm-list :select-value="formData.channelId" :is-disabled="false" @getPla="getPla"></platForm-list>
        </el-form-item>
        <el-form-item label="账号" prop="accountNo" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <account-list :select-value="formData.accountNo" :channel-id="formData.channelId" :is-disabled="false" @getData="getAccountNo"></account-list>
        </el-form-item>
        <el-form-item label="市场/站点" prop="countryNo" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <countryNo-list :select-value="formData.countryNo" :account-id="formData.accountNo" :is-disabled="false" @getData="getCountryNo"></countryNo-list>
        </el-form-item>
<!--        <el-form-item label="平台订单号" prop="name" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>-->
        <el-form-item label="开始时间" prop="startDate" required :rules="[{required:true,type:'date',message:'不能为空',trigger:'change'}]" >
          <el-date-picker v-model="formData.startDate" size="small" editable type="datetime" placeholder="开始时间" formatter="yyyy-MM-dd mm:ss" class="show_time" style="width:100%"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endDate" required :rules="[{required:true,type:'date',message:'不能为空',trigger:'change'}]" class="show_time">
          <el-date-picker v-model="formData.endDate" size="small" editable type="datetime" placeholder="结束时间" formatter="yyyy-MM-dd mm:ss" class="show_time" style="width:100%"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="manualDialog = false;">取消</el-button>
        <el-button type="primary" @click="submit('formData')"  :loading="$store.state.loading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import platFormList from "../../components/listData/getPlatformList.vue"
  import accountList from "../../components/listData/getStoreAccount.vue"
  import countryNoList from "../../components/listData/getCountryNo.vue"
  export default{
    components: {platFormList,accountList,countryNoList},
    data(){
      return {
        statusOption:[],   //
        modelData:[{value:'1',label:'测试数据1'},{value:'2',label:'测试数据2'},{value:'3',label:'测试数据3'},{value:'4',label:'测试数据4'}],   //
        formData:{
/*          name:'',   // 平台订单号？*/
          channelId:'',
          accountNo:'',
          countryNo:'',
          startDate:'',
          endDate:'',
        },
        id:this.idValue,
        manualDialog:false,
      }
    },
    props:['idValue','isOpen'],
    mounted () {
    },
    methods: {
      submit:function(formName){
        this.$refs[formName].validate((valid) =>{
          if(valid){
              this.httpPost('/orderInfo/syncOrder',this.formData,'Sms').then(res =>{
              this.$message(res.data.message);
              if(res.data.result == true){
                this.manualDialog = false;
                this.$emit('getData');
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      resetForm:function(formName) {
        this.$refs[formName].resetFields();
      },
      getPla:function(val){
        this.formData.channelId = val.value;
      },
      getAccountNo:function(val){
        this.formData.accountNo = val.value;
      },
      getCountryNo:function(val){
        this.formData.countryNo = val.value;
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
            this.manualDialog = true;
          },
          deep:true
      },
    }
  }
</script>
<style scoped>
</style>
