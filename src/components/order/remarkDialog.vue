<template>
  <div>
    <!--  添加备注--------------------------->
    <el-dialog title="添加备注" :visible.sync="remarkDialog" :close-on-click-modal="false" size="small" @close="resetForm('formData')">
      <el-form label-width="" :model="formData"  ref="formData">
        <el-form-item label="" prop="noteContent" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <el-input type="textarea" v-model="formData.noteContent" :autosize="{ minRows: 6, maxRows: 10}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="remarkDialog = false;">取消</el-button>
        <el-button type="primary" @click="submit('formData')" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default{
    data(){   return {
        formData:{
            noteContent:'',
            isToWh:0,
            orderId:this.idValue,
        },
        id:this.idValue,
        remarkTitle:this.dialogTitle,
        remarkDialog:false,
      }
    },
    props:['idValue','isOpen'],
    mounted () {

    },
    methods: {
      submit:function(formName){
        this.$refs[formName].validate((valid) =>{
          if(valid){
            this.formData.orderId = this.idValue
            this.httpPost('orderNote/save',this.formData).then(res =>{
              this.$message(res.data.message);
              if(res.data.result == true){
                this.remarkDialog = false;
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
            this.remarkDialog = true;
          },
          deep:true
      },
    }
  }
</script>
<style scoped>
</style>
