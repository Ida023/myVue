<template>
  <div id="outermost_wrap" class="role" style="">
    <div id="sub_wrap" class="top-nav">
      当前位置：<span>备货采购</span> > <span>供应商管理</span> > <span>信息维护</span>
    </div>
    <div id="content_wrap">
      <el-col :span="12" :offset="5" style="margin-top: 60px;">
        <el-form :model="formLabelAlign" :label-position="labelPosition" label-width="110px" ref="formLabelAlign"  >
          <el-form-item prop="address" label="公司地址" :rules="{ min: 1, max: 50, message: '不能超过50个字符', trigger:  'blur,change' }">
            <el-input v-model="formLabelAlign.address" ></el-input>
          </el-form-item>
          <el-form-item label="公司电话"  prop="telNo" :rules="{ min: 1, max: 13, message: '不能超过13个字符', trigger:  'blur,change' }">
            <el-input v-model="formLabelAlign.telNo"></el-input>
          </el-form-item>
          <el-form-item label="仓库地址" prop="whAddress"   :rules="{ min: 1, max: 50, message: '不能超过50个字符', trigger:  'blur,change'}">
            <el-input v-model="formLabelAlign.whAddress"></el-input>
          </el-form-item>
          <el-form-item label="仓库联系人"  prop="whUserName"  :rules="{ min: 1, max: 10, message: '不能超过10个字符', trigger:  'blur,change' }">
            <el-input v-model="formLabelAlign.whUserName"></el-input>
          </el-form-item>
          <el-form-item label="仓库联系电话"  prop="whTelNo" :rules="{ min: 1, max: 13, message: '不能超过13个字符', trigger:  'blur,change' }">
            <el-input v-model="formLabelAlign.whTelNo"></el-input>
          </el-form-item>
          <el-form-item label="技术支持邮箱" prop="platformEmail" :rules="{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }">
            <el-input v-model="formLabelAlign.platformEmail"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button  size="large" style="width: 100%" type="primary" @click="submitForm();" :loading="$store.state.loading">保 存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </div>
  </div>
</template>

<script>

  export default {
    components: {},
    data() {
   /*   let telephone1V = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else if(!/^\d+(\.\d{0,4})?$/.test(value)){
          callback(new Error('只允许数字！'));
        } else {
          callback();
        }
      };*/
      return {
        labelPosition: 'right',
        listData:[],
        formLabelAlign:{
          platformId:'',
          address: '',
          telNo: '',
          whAddress: '',
          whUserName:'',
          whTelNo:'',
          platformEmail:''
        },
     /*   rules: {
      name: [
      { required: true, message: '请输入活动名称', trigger: 'blur' },
      { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
      ],
          telNo:[
            {validator: telephone1V, trigger: 'blur', required: true,},
          ]
        }*/
      }
    },
    mounted: function(){
      this.requestem();
    },
    methods: {
      //列表渲染
      requestem(){
        this.httpPost('itMaintain').then(res => {
          console.log(res.data)
          this.formLabelAlign.platformId = res.data.platformId;
          this.formLabelAlign.address = res.data.address;
          this.formLabelAlign.telNo = res.data.telNo;
          this.formLabelAlign.whAddress = res.data.whAddress;
          this.formLabelAlign.whUserName = res.data.whUserName;
          this.formLabelAlign.whTelNo = res.data.whTelNo;
          this.formLabelAlign.platformEmail = res.data.platformEmail;
          console.log(this.formLabelAlign)
        })
      },
      submitForm() {
        this.$refs['formLabelAlign'].validate((valid) => {
          if (valid) {
            this.httpPost('editITMaintain', this.qs.stringify(this.formLabelAlign)).then(res => {
              if (res.data.result == true) {
                this.$message(res.data.message)
                this.requestem();
              } else if (res.data.result == false) {
                this.$message.error(res.data.message)
              }
            })
          }else{

          }


        })

      },
    }
  }

</script>

<style scoped>

</style>
