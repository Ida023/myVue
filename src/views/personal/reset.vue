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
            <img src="../../assets/g-2.png" width='100%' alt="邮箱验证"/>
            <p>密码重置</p>
          </div></el-col>
          <el-col :span="8"><div class="col-Success grid-content bg-purple pro-information">
            <img src="../../assets/g-3.png" width='100%' alt="邮箱激活"/>
            <p>重置成功</p>
          </div></el-col>
        </el-row>
      </div>
      <div class="reset">
        <!--密码找回开始-->
        <div class='res-form reset-email'>
          <el-form :model="ruleForm" ref="ruleForm" :rules="rules2" label-width="100px" class="demo-dynamic">
            <el-form-item class="res-email"
              prop="User_No"
              label="邮箱"
              :rules="[
             { required: true, message: '请输入邮箱地址', trigger: 'blur' },
             { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
           ]"
            >
              <el-input v-model="ruleForm.User_No"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
              <el-col :span="12" style="padding-right:2px;">
                <el-input v-model="ruleForm.code"></el-input>
              </el-col>
              <el-col :span="12"><img :src="img" height='36' width='100%' alt="验证码" @click="clickimg()"/>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button class="res-button" type="primary" @click="submitForm('ruleForm')">提  交</el-button>
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
      let graphCode2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'));
        }else {
          this.$http.post(this.RmsUrl+'validationCode',this.qs.stringify(this.ruleForm)).then(res=>{
            this.strCode = res.data.result;
            let result = res.data.result;
            console.log(res)
            if (result === false) {
              callback(new Error('验证码错误请重新输入'));
            }else {
              callback();
            }
          });
        }
      };
      return {
        ruleForm: {
          User_No : '',
          code: ''
        },
        strCode:'',
        img:'',
        messg:'',
        canSubmit:true,
        rules2: {
          code:[
            {validator: graphCode2, trigger: 'blur', required: true,}
          ]
        }
      };
    },
    mounted: function () {
      this.clickimg()
    },
    methods: {
      submitForm(formName) {
        if(this.canSubmit == true){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.canSubmit = false;
              this.$http.post(this.RmsUrl+'/revserUserPwdone',this.qs.stringify(this.ruleForm)).then(res => {
                if(res.data.result==true){
                  this.canSubmit = true;
                  this.$router.push({path:'/resbox'});
                }else {
                  this.$message(res.data.message);
                  this.canSubmit = true;
                  this.clickimg();
                }
              })
            } else {
              return false;
            }
          });
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      clickimg(){
        this.img = this.RmsUrl+'sendCode?t='+ this.genTimestamp()
      },
      genTimestamp() {
        let time = new Date();
        return time.getTime();
      },
    }
  }

</script>
<style scoped>
  .el-row {
    width: 80%;
    margin: 0 auto;
  }

  .el-col {
    border-radius: 4px;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    text-align: center;
  }

  .grid-content img {
    width: 100%;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .res-form {
    width: 27%;
    margin: 0 auto;
    margin-top: 60px;
  }
  button.res-button{
    font-size: 16px;
  }
  button.res-button:hover{
    background: #e4781b!important;
  }
  .res-form button {
    width: 100%;
    background: #f6821f!important;
    border: none;
    height: 36px;
  }


  @media screen and (max-width: 1024px) {
    .res-form {
      width: 50%;
    }
  }

  @media screen and (max-width: 1024px) {
    .res-form {
      width: 50%;
    }
  }
</style>
