<template>
  <div class="register">
    <Headd></Headd>
    <Progresss></Progresss>
    <!--注册表单开始-->
    <div class="reg">
      <div class="reg-form">
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
          <el-form-item prop="email" label="邮箱" :rules="[ { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }]">
            <el-input v-model="ruleForm2.email" type="email"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="userPwd">
            <el-input type="password" v-model="ruleForm2.userPwd" ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmUserPwd">
            <el-input type="password" v-model="ruleForm2.confirmUserPwd" ></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="userName" :rules="{required: true, message: '姓名不能为空', trigger: 'blur'}">
            <el-input v-model="ruleForm2.userName"></el-input>
          </el-form-item>
          <el-form-item label="公司名称" prop="compName">
            <el-input v-model="ruleForm2.compName"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone" :rules="{ required: true, message: '手机号码不能为空', trigger: 'blur'}">
            <el-input v-model="ruleForm2.phone"></el-input>
          </el-form-item>
          <el-form-item :span="24" label="电话号码" prop="telephone" :gutter="20"
                        :rules="{message: '电话号码不能为空', trigger: 'blur' }">
            <el-col :span="5">
              <el-input placeholder="0755" v-model="ruleForm2.telephone1" class="grid-content bg-purple"></el-input>
            </el-col>
            <el-col :span="14" class="itemCenter">
              <el-input placeholder="59635553"v-model="ruleForm2.telephone2" class="grid-content bg-purple"></el-input>
            </el-col>
            <el-col :span="5">
              <el-input placeholder="分机 (04)" v-model="ruleForm2.telephone3" class="grid-content bg-purple"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="验证码" prop="graphCode" :rules="{required: true, message: '验证码不能为空', trigger: 'blur'}">
            <el-col :span="12" style="padding-right:10px">
              <el-input v-model="ruleForm2.graphCode" class="grid-content bg-purple"></el-input>
            </el-col>
            <el-col :span="12" class="phoCode"><a href="javascript:void(0)" class="input-group grid-content bg-purple"
                                                  v-on:click="" title="换一张">
              <img :src="img" height='36' width='100%' alt="验证码" @click="clickimg()"/></a>
            </el-col>
          </el-form-item>
          <div class="checkbox">
            <label>
              <input type="checkbox" name="acceptPro" id="acceptPro" checked="true">同意<a
              href="javascript:showProtocol()" checked="checked" >软件服务及许可协议</a>
              <span style="color:red;visibility:hidden">您必须同意软件服务及许可协议后才能提交注册</span>
            </label>
          </div>
          <el-form-item>
            <el-button class="reg-button" type="primary" @click="submitForm('ruleForm2')" >注  册</el-button>
            <div class="login"><span>找回密码？</span><a>立即登录</a></div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <Footerr></Footerr>
  </div>
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
        } else {
          if (this.ruleForm2.confirmUserPwd !== '') {
            this.$refs.ruleForm2.validateField('confirmUserPwd');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm2.userPwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm2: {
          email: '',
          userPwd: '',
          confirmUserPwd: '',
          userName: '',
          compName: '',
          phone:'',
          telNo:'',
          telephone1:'',
          telephone2:'',
          telephone3:'',
          graphCode:'',

        },
        arr:[1,2,3,4],
        vimg:'',
        img:'',
        rules2: {
          userPwd: [
            {validator: validatePass, trigger: 'blur', required: true,}
          ],
          confirmUserPwd: [
            {validator: validatePass2, trigger: 'blur', required: true,}
          ],
        }
      };
    },
    mounted: function () {
      this.clickimg();
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.telephone();
            console.log(this.ruleForm2);
            let qs = require('qs');
            this.$http.post('http://192.168.2.223:8080/erp_rms/userLogin',qs.stringify(this.ruleForm2),{
              xhrFields: {
                withCredentials: true
              },
            }).then(res=>{
              console.log(res.data);
              let ress = res.data.result;
              if(ress===true){
                this.$router.push({path:'/mailbox'})
              }else {
                alert(res.data.message)
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      telephone(){
        this.ruleForm2.telNo= this.ruleForm2.telephone1+'-'+this.ruleForm2.telephone2+'-'+this.ruleForm2.telephone3;
        console.log(this.ruleForm2.telNo)
      },
      clickimg(){
        this.img = 'http://192.168.2.223:8080/erp_rms/getGraphCode?t='+ this.genTimestamp()
      },
//      verification(){
//           let qs = require('qs');
//          this.$http.post('http://192.168.2.223:8080/erp_rms/getGraphCode').then(res=>{
//              console.log(res.data.params.base64Code);
//              this.vimg = res.data.params.base64Code
//          })
//      },
      genTimestamp() {
        let time = new Date();
        return time.getTime();

      },

    }
  }

</script>
<style scoped>
  .reg {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .el-row {
    width: 90%;
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

  .reg-button {
    font-size: 20px;
    color: #fff;
  }

  .login {
    text-align: center;
  }

  .grid-content img {
    width: 100%;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .reg-form {
    width: 33%;
    margin-top: 60px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }

  .itemCenter {
    padding: 0 9px;
  }

  .phoCode {
    height: 36px;
  }

  .phone > div {
    margin: 0 5px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }

  .grid-content {
    margin-right: 9px;
  }

  a.input-group {
    display: inline-block;
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }

  .reg-button {
    width: 100%;
    height: 52px;
    background: #ff9966;
    border: none;
  }

  .checkbox {
    padding-left: 96px;
  }

  @media screen and (max-width: 1200px) {
    .reg-form {
      width: 50%;
    }
  }
</style>
