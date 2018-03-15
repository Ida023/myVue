<template>
  <div>
    <!--  查看银行转账--------------------------->
    <el-dialog title="查看银行转账" :visible.sync="bankDialog" :close-on-click-modal="false" size="small">
      <el-form label-width="180px" :model="formData"  ref="formData">
        <el-form-item label="交易银行：" prop="title">{{formData.bankType}}</el-form-item>
        <el-form-item label="付款日期：" prop="title">{{formData.payTime}}</el-form-item>
        <el-form-item label="计息日（value date）：" prop="title">{{formData.interestDate}}</el-form-item>
        <el-form-item label="交易类型：" prop="title">{{formData.tradingType}}</el-form-item>
        <el-form-item label="付款金额：" prop="title">{{formData.amount}}</el-form-item>
        <el-form-item label="币种：" prop="title">{{formData.currencyName}}</el-form-item>
        <el-form-item label="转账备注：" prop="title">{{formData.payMemo}}</el-form-item>
        <el-form-item label="Account of Initiator：" prop="title">{{formData.accountNo}}</el-form-item>
        <el-form-item label="Bank Code：" prop="title">{{formData.bankCode}}</el-form-item>
        <el-form-item label="IBAN：" prop="title">{{formData.iban}}</el-form-item>
        <el-form-item label="关联订单：" prop="title">{{formData.orderNo}}</el-form-item>
        <el-form-item label="关联操作人：" prop="title">{{formData.boundedUser}}</el-form-item>
        <el-form-item label="关联时间：" prop="title">{{formData.boundedUserName}}</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bankDialog = false;">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        deptList:[],   //
        statusOption:[],   //
        modelData:[{value:'1',label:'测试数据1'},{value:'2',label:'测试数据2'},{value:'3',label:'测试数据3'},{value:'4',label:'测试数据4'}],   //
        formData:{
            content:'',
            title:'11',
            modelType:'',
        },
        id:this.idValue,
        bankDialog:false,
      }
    },
    props:['idValue','isOpen',],
    mounted () {
    },
    methods: {
      getData(){
        this.httpGet('finiancialFlowOrders/select',{flowId:this.idValue}).then(res =>{
          this.formData = res.data
        })
      },
      resetForm:function(formName) {
        this.$refs[formName].resetFields();
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
            this.bankDialog = true;
            this.getData();
          },
      },
    }
  }
</script>
<style scoped>
</style>
