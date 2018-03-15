<template>
  <div id="flex-warp" class="register ">
    <Headd ></Headd>
    <div class="center-warp">
      <div class="progress" style="margin-top:0;">
        <el-row class="reg-row">
          <el-col :span="8"><div class="col-msg grid-content bg-purple pro-information ">
            <img src="../../assets/b-1.png"  width='100%' alt="基础信息"/>
            <p>基础信息</p>
          </div></el-col>
          <el-col :span="8"><div class="col-email grid-content bg-purple-light pro-information">
            <img src="../../assets/g-2.png" width='100%' alt="邮箱验证"/>
            <p>邮箱验证</p>
          </div></el-col>
          <el-col :span="8"><div class="col-Success grid-content bg-purple pro-information">
            <img src="../../assets/g-3.png" width='100%' alt="邮箱激活"/>
            <p>邮箱激活</p>
          </div></el-col>
        </el-row>
      </div>
      <!--注册表单开始-->
      <div class="reg">
        <div class="reg-form">
          <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
            <el-form-item prop="email" label="邮箱" :rules="[ { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }]">
              <el-input v-model="ruleForm2.email" type="email" ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="userPwd">
              <el-input type="password" v-model="ruleForm2.userPwd"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmUserPwd">
              <el-input type="password" v-model="ruleForm2.confirmUserPwd"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="userName">
              <el-input v-model="ruleForm2.userName"></el-input>
            </el-form-item>
            <el-form-item label="公司名称" prop="compName" :rules="{min:0, max:30, message: '公司名称长度在0-30字以内，请重新输入', trigger: 'blur' } ">
              <el-input v-model="ruleForm2.compName"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="phone" >
              <el-input v-model="ruleForm2.phone" ></el-input>
            </el-form-item>
            <el-form-item :span="24" label="电话号码"  :gutter="20">
              <el-col :span="5">
                <el-form-item  prop="telephone1" >
                    <el-input placeholder="0755" v-model="ruleForm2.telephone1" class="grid-content bg-purple"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="14" class="itemCenter">
                <el-form-item  prop="telephone2" >
                  <el-input placeholder="59635553"v-model="ruleForm2.telephone2" class="grid-content bg-purple"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item  prop="telephone3" >
                 <el-input placeholder="分机 (04)" v-model="ruleForm2.telephone3" class="grid-content bg-purple"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="验证码" prop="graphCode">
              <el-col :span="12" style="padding-right:10px">
                <el-input v-model="ruleForm2.graphCode" class="grid-content bg-purple"></el-input>
              </el-col>
              <el-col :span="12" class="phoCode"><a href="javascript:void(0)" class="input-group grid-content bg-purple"
                                                     title="换一张">
                <img :src="img" height='36' width='100%' alt="验证码" @click="clickimg()" /></a>
              </el-col>
            </el-form-item>
            <div class="checkbox">
            </div>
            <div class="Agreement checkbox">
              <el-checkbox v-model="checked" :rules="{required: true, message: '验证码不能为空', trigger: 'blur'}">软件服务协议及许可协议</el-checkbox>
              <span style="color:red; font-size: 14px" v-if="!checked">您必须同意软件服务及许可协议后才能提交注册</span>
            </div>
            <el-form-item>
              <el-button class="reg-button" type="primary" @click="submitForm('ruleForm2')" >注  册</el-button>
              <div class="login">已有账号？<router-link to="/login" style="color: rgb(28, 79, 198);">立即登录</router-link></div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <Footerr></Footerr>
  </div>
</template>
<script>
  import Headd from './head.vue'
  import Footerr from './footer.vue'
  export default {
    components: {
      Headd,
      Footerr,

    },
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if(!/^(?=[`~!@#\$%\^&*\(\)\-_=\+\\\|\[\]\{\}:;\"\',.<>\/\?\d]*[a-zA-Z]+)(?=[a-zA-Z`~!@#\$%\^&*\(\)\-_=\+\\\|\[\]\{\}:;\"\',.<>\/\?]*\d+)[`~!@#\$%\^&*\(\)\-_=\+\\\|\[\]\{\}:;\"\',.<>\/\?\w]{6,16}$/.test(value)){
          callback(new Error('密码格式为6-16位数字+字母组成'));
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
        } else if(!/^(?=[`~!@#\$%\^&*\(\)\-_=\+\\\|\[\]\{\}:;\"\',.<>\/\?\d]*[a-zA-Z]+)(?=[a-zA-Z`~!@#\$%\^&*\(\)\-_=\+\\\|\[\]\{\}:;\"\',.<>\/\?]*\d+)[`~!@#\$%\^&*\(\)\-_=\+\\\|\[\]\{\}:;\"\',.<>\/\?\w]{6,16}$/.test(value)){
          callback(new Error('密码格式为6-16位数字+字母组成'));
        }  else if (value !== this.ruleForm2.userPwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      let phonetyp = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'));
        } else if(!/1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/.test(value)){
          callback(new Error('请输入正确手机号'));
        } else {
          callback();
        }
      };
      let userName2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入姓名'));
        } else if(!/(^[\u4e00-\u9fa5]{1}[\u4e00-\u9fa5\.·。]{0,8}[\u4e00-\u9fa5]{1}$)|(^[a-zA-Z]{1}[a-zA-Z\s]{0,8}[a-zA-Z]{1}$)/.test(value)){
          callback(new Error('请输入正确姓名'));
        } else {
          callback();
        }
      };
      let telephone1V = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else if(!/^\d{1,4}$/.test(value)){
          callback(new Error('请输入正确区号'));
        } else {
          callback();
        }
      };
      let telephone1V1 = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else if(!/^\d{1,8}$/.test(value)){
          callback(new Error('请输入正确号码'));
        } else {
          callback();
        }
      };
      let telephone1V2 = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else if(!/^\d{1,4}$/.test(value)){
          callback(new Error('请输入正确分机号'));
        } else {
          callback();
        }
      };
      let graphCode2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'));
        }else {
          this.$http.post(this.RmsUrl+'/RegisterUserVerifyCode',this.qs.stringify(this.ruleForm2)).then(res=>{
            this.ruleForm2.strCode = res.data.result;
            let result = res.data.result;
            if (result === false) {
              callback(new Error('验证码错误请重新输入'));
            }else {
              callback();
            }
          });
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
          strCode:'',
        },
        checked:true,
        canSubmit:true,
        tabimg:'../../assets/g-1.png',
        vimg:'',
        img:'',
        messg:'',
        rules2: {
          userPwd: [
            {validator: validatePass, trigger: 'blur', required: true,}
          ],
          confirmUserPwd: [
            {validator: validatePass2, trigger: 'blur', required: true,}
          ],
          phone:[
            {validator: phonetyp, trigger: 'blur', required: true,}
          ],
          userName:[
            {validator: userName2, trigger: 'blur', required: true,}
          ],
          graphCode:[
            {validator: graphCode2, trigger: 'blur', required: true,}
          ],
          telephone1:[
            {validator: telephone1V, trigger: 'blur', required: true,}
          ],
          telephone2:[
            {validator: telephone1V1, trigger: 'blur', required: true,}
          ],
          telephone3:[
            {validator: telephone1V2, trigger: 'blur', required: true,}
          ],
        }
      };
    },
    mounted: function () {
      this.clickimg();
    },
    methods: {
      submitForm(formName) {
          if(this.checked==true && this.canSubmit==true){
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.telephone();
                this.canSubmit = false;
                this.$http.post(this.RmsUrl+'/userLogin',this.qs.stringify(this.ruleForm2)).then(res=>{
                  if(res.data.result==true){
                    this.canSubmit = true;
                    this.$router.push({path:'/mailbox'})
                  }else {
                    this.canSubmit = true;
                    this.$message(res.data.message);
                    this.clickimg()
                  }
                })
              } else {
                return false;
              }
            });
          }else{

          }

      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      telephone(){
        this.ruleForm2.telNo= this.ruleForm2.telephone1+'-'+this.ruleForm2.telephone2+'-'+this.ruleForm2.telephone3;
        console.log(this.ruleForm2.telNo)
      },
      clickimg(){
         this.img = this.RmsUrl+'getGraphCode?t='+ this.genTimestamp()
      },
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
  .login {
    text-align: center;
  }
   .login a:hover{
     color: #f6821f;
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
    font-size: 16px;
    color: #fff;
    background:#f6821f;
    width: 100%;
    height:36px;
    border: none;
  }
  button.reg-button:hover{
    background: #e4781b!important;
  }

  .checkbox {
    padding-left: 100px;
  }
  .Agreement{
    margin-bottom: 15px;
  }


  @media screen and (max-width: 1200px) {
    .reg-form {
      width: 50%;
    }
  }
</style>
