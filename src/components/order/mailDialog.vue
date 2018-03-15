<template>
  <div>
    <!--  邮件dal--------------------------->
    <el-dialog :title="mailTitle" :visible.sync="mailDialog" :close-on-click-modal="false" size="small" @close="resetForm('formData')">
      <el-form label-width="100px" :model="formData"  ref="formData">
        <el-form-item label="模板选择" prop="modelType">
          <el-select v-model="modelType" placeholder="请选择" @change="getModalInfo">
            <el-option v-for="item in modelData" :key="item.tmplId" :label="item.tmplName" :value="item.tmplId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <el-input type="text" v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <el-input type="textarea" v-model="formData.content" :autosize="{ minRows: 6, maxRows: 10}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="mailDialog = false;">取消</el-button>
        <el-button type="primary" @click="submit('formData')" :loading="$store.state.loading">确 定</el-button>
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
        modelType:'',
        modelData:[{value:'1',label:'测试数据1'},{value:'2',label:'测试数据2'},{value:'3',label:'测试数据3'},{value:'4',label:'测试数据4'}],   //
        formData:{
            content:'',
            title:'',
        },
        ids:this.idList,
        mailTitle:this.dialogTitle,
        mailDialog:false,
        cId:this.channelId,
      }
    },
    props:['idList','isOpen','dialogTitle','channelId'],
    mounted () {
    },
    methods: {
      getData(){
        var url = this.dialogTitle == '发邮件'  ? 'tmplShopEmail/selectList' : 'tmplShopMsg/selectList';
        var params = this.dialogTitle == '发邮件' ? {tmplShopEmail:this.channelId} : {tmplShopMsg:this.channelId};
        console.log(params)
        this.httpPost(url,params,'Sms').then(res =>{
            if(res.data){
              this.modelData = res.data;
            }
        })
      },
      submit:function(formName){
        this.$refs[formName].validate((valid) =>{
          if(valid){
            var url = this.dialogTitle == '发邮件'  ? 'orderSendEmail/sendMulti' : 'orderSendMsg/sendMulti';
            // 发消息 用httpGet方法
            this.formData.orderIds = this.ids;
            this.httpPost(url,this.formData,'Sms').then(res =>{
              this.$message(res.data.message);
              if(res.data.result == true){
                this.mailDialog = false;
                this.$emit('getData');
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      getModalInfo:function(val){
          var vm = this;
          this.modelData.forEach(function(item){
              if(item.tmplId == val){
                  vm.formData.title = item.title;
                  vm.formData.content = item.content;
              }
          })
      },
      resetForm:function(formName) {
        this.modelType = '';
        this.$refs[formName].resetFields();
      },
    },
    watch:{
      'idList':{
          handler(val){
            this.ids = val;
          },
          deep:true
      },
      'channelId':{
          handler(val){
            this.cId = val;
          },
      },
      'isOpen':{
          handler(val){
            this.mailDialog = true;
            this.getData();
          },
          deep:true
      },
      'dialogTitle':{
          handler(val){
            this.mailTitle = val;
          },
          deep:true
      },
    }
  }
</script>
<style scoped>
</style>
