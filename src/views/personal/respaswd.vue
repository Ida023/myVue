<template>
  <section id="flex-warp">
  <Headd></Headd>
    <div id="center-warp">
      <div class="progress" >
        <el-row class="reg-row">
          <el-col :span="8"><div class="col-msg grid-content bg-purple pro-information ">
            <img src="../../assets/b-1.png"  width='100%' alt="基础信息"/>
            <p>邮箱验证</p>
          </div></el-col>
          <el-col :span="8"><div class="col-email grid-content bg-purple-light pro-information">
            <img src="../../assets/b-2.png" width='100%' alt="邮箱验证"/>
            <p>密码重置</p>
          </div></el-col>
          <el-col :span="8"><div class="col-Success grid-content bg-purple pro-information">
            <img src="../../assets/g-3.png" width='100%' alt="邮箱激活"/>
            <p>重置成功</p>
          </div></el-col>
        </el-row>
      </div>
      <div class="reset" >
        <!--密码找回开始-->
        <div class='res-form'>
          <el-form :model="ruleForm" :rules="rules2" ref="ruleForm" label-width="100px" class="demo-dynamic">
            <el-form-item  prop="User_No"   label="邮箱"   :rules="[
             { required: true, message: '请输入邮箱地址', trigger: 'blur' },
             { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
           ]" >
              <el-input v-model="ruleForm.User_No" ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="Pwd1" >
              <el-input type="password" v-model="ruleForm.Pwd1"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="Pwd2">
              <el-input type="password"  v-model="ruleForm.Pwd2"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="sub-but" type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <Footerr></Footerr>
  </section>
</template>
<script>
  import Headd from './head.vue'
  import Progresss from './progress.vue'
  import Footerr from './footer.vue'
  export default {
    components: {
      Headd,
      Footerr,
      Progresss
    },
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }else if(!/^(?=[`~!@#\$%\^&*\(\)\-_=\+\\\|\[\]\{\}:;\"\',.<>\/\?\d]*[a-zA-Z]+)(?=[a-zA-Z`~!@#\$%\^&*\(\)\-_=\+\\\|\[\]\{\}:;\"\',.<>\/\?]*\d+)[`~!@#\$%\^&*\(\)\-_=\+\\\|\[\]\{\}:;\"\',.<>\/\?\w]{6,16}$/.test(value)){
          callback(new Error('密码格式为6-16位数字+字母组成'));
        }  else {
          if (this.ruleForm.Pwd2 !== '') {
            this.$refs.ruleForm.validateField('Pwd2');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.Pwd1) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          User_No:'',
          Pwd1:'',
          Pwd2:'',
          User_Id:''
        },
        url1:{
          sourceStr:''
        },
        messg:'',

        rules2: {
          Pwd1: [
            {validator: validatePass, trigger: 'blur', required: true,}
          ],
          Pwd2: [
            {validator: validatePass2, trigger: 'blur', required: true,}
          ],
        }
      };
    },
    mounted: function () {
      this.verification('url');
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let qs = require('qs');
            this.$http.post(this.RmsUrl+'/revserUserPwdtwo',this.qs.stringify(this.ruleForm)).then(res=>{
              this.messg=res.data.message;
              let ress = res.data.result;
              if(ress===true){
//            alert(res.data.message)
                this.$router.push({path:'/ressuccess'})
              }else {
                this.open()
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      verification(){
        this.url1.sourceStr=location.href;
        this.$http.post(this.RmsUrl+'/receiveUserCode',this.qs.stringify(this.url1)).then(res=>{
          console.log(res.data);
          this.ruleForm.User_Id=res.data.params.userInfo.user_Id;
          this.ruleForm.User_No=res.data.params.userInfo.user_No;
        })
      },
      requestem(){
        let qs = require('qs');
        this.$http.post(this.RmsUrl+'/revserUserPwdtwo',this.qs.stringify(this.ruleForm)).then(res=>{
          this.messg=res.data.message;
          let ress = res.data.result;
          if(ress===true){
//            alert(res.data.message)
            this.$router.push({path:'/ressuccess'})
          }else {
            this.open()
          }
        })
      },
      open() {
        this.$alert(this.messg, '消息', {
          confirmButtonText: '确定',
        });
      }
    }
  }

</script>
<style scoped>
  .el-row {
   width:80%;
   margin:0 auto;
  }
  .el-col {
    border-radius: 4px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    text-align:center;
  }
  .grid-content img{
    width:100%;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
.res-form{
width:27%;
margin:0 auto;
margin-top:60px;
}
.res-form button{
width:100%;
background:#f6821f;
border:none;
}
  button.sub-but:hover{
    background: #e4781b!important;
  }
@media screen and (max-width: 1024px) {
 .res-form{
    width:50%;
 }
}
@media screen and (max-width: 1024px) {
 .res-form{
    width:50%;
 }
}
  </style>
